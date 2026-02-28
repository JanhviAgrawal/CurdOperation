const Data = require('../model/data.model');
const fs = require('fs');
const moment = require('moment');
const path = require('path');

module.exports.dashboard = async (req, res) => {
    try {
        let search = req.query.search || '';
        let page = parseInt(req.query.page) || 1;
        let limit = 5;
        let skip = (page - 1) * limit;

        let allRecords = await Data.find();

        let filteredData = allRecords.filter((item) => {
            let nameMatch = item.name.toLowerCase().includes(search.toLowerCase());
            let emailMatch = item.email.toLowerCase().includes(search.toLowerCase());
            let phoneMatch = item.phone.includes(search);
            
            return nameMatch || emailMatch || phoneMatch;
        });

        let totalPages = Math.ceil(filteredData.length / limit);
        let data = filteredData.slice(skip, skip + limit);

        return res.render('dashboard', {
            data,
            search,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

module.exports.addData = (req, res) => {
    try {
        return res.render('addData');
    } catch (error) {
        console.log("Something Went wrong..", error);
        return res.redirect('/');
    }
}

module.exports.editPage = async (req, res) => {
    try {
        const user = await Data.findById(req.params.userId);
        if (!user) return res.redirect('/');
        
        return res.render('editUser', { user });
    } catch (error) {
        console.log("Error fetching user:", error);
        return res.redirect('/');
    }
}

module.exports.insertData = async (req, res) => {
    try {
        req.body.created_date = moment().format('DD/MM/YYYY, h:mm:ss A');
        req.body.updated_date = moment().format('DD/MM/YYYY, h:mm:ss A');

        if (req.file) {
            req.body.image = '/uploads/images/' + req.file.filename;
        }

        await Data.create(req.body);
        return res.redirect('/');
    } catch (error) {
        console.log("Error in insertData:", error);
        return res.redirect('/');
    }
}

module.exports.updatePage = async (req, res) => {
    try {
        const oldData = await Data.findById(req.params.userId);

        if (req.file) {
            if (oldData && oldData.image) {
                const fullPath = path.join(process.cwd(), oldData.image);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
            req.body.image = '/uploads/images/' + req.file.filename;
        } else {
            req.body.image = oldData.image;
        }

        req.body.updated_date = moment().format('DD/MM/YYYY, h:mm:ss A');
        await Data.findByIdAndUpdate(req.params.userId, req.body);

        return res.redirect('/');
    } catch (error) {
        console.log("Update error:", error);
        return res.redirect('/');
    }
}

module.exports.deleteData = async (req, res) => {
    try {
        const deleteUser = await Data.findByIdAndDelete(req.query.id);

        if (deleteUser && deleteUser.image) {
            const fullPath = path.join(process.cwd(), deleteUser.image);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
        return res.redirect('/');
    } catch (error) {
        console.log("Delete error:", error);
        return res.redirect('/');
    }
}

module.exports.multipleDelete = async (req, res) => {
    try {
        let ids = req.body.ids;

        if (ids && ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                let user = await Data.findByIdAndDelete(ids[i]);
                
                if (user && user.image) {
                    let fullPath = path.join(process.cwd(), user.image);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                }
            }
        }
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}