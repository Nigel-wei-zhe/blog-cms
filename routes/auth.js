const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connection/firebase-admin-connect');
const firebase = require('../connection/firebase-connect');
const fireAuth = firebase.auth();

router.get('/signup', function(req, res, next) {
    res.render('dashboard/signup');
});

router.post('/signup', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    fireAuth.createUserWithEmailAndPassword(email, password)
    .then(user => {
        
        res.redirect('/dashboard');
    })
    .catch(err => {
        res.redirect('/auth/signup');
    });
    res.send('註冊成功');
    res.end();
});

router.get('/signin', function(req, res, next) {
    res.render('dashboard/signin');
});

router.post('/signout', function(req, res, next) {
    res.send('已登出');
    res.end();
});



module.exports = router;