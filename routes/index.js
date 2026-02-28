const express = require('express');
const multer = require('multer');
const { dashboard, addData, insertData, deleteData, editPage, updatePage, multipleDelete } = require('../controller/data.controller');
const route = express.Router();

// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/images/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

route.get('/', dashboard);
route.get('/add', addData);
route.post('/add', upload.single('image'), insertData);
route.get('/delete', deleteData);
route.post('/multipleDelete', multipleDelete);
route.get('/editUser/:userId', editPage);
route.post('/updateData/:userId', upload.single('image'), updatePage);



module.exports = route;