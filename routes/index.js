const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connection/firebase-admin-connect');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/post', function(req, res, next) {
  res.render('post', { title: 'Express' });
});

module.exports = router;
