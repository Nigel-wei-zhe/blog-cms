const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connection/firebase-admin-connect');
const firebase = require('../connection/firebase-connect');
const fireAuth = firebase.auth();

router.get('/', function(req, res, next) {
    const message = req.flash('error'); // object
    res.render('dashboard/signup', {
        mode: req.query.mode || 'signin',
        hasError: message.length > 0,
        message
    });
});

router.post('/signup', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password === confirmPassword) {
        fireAuth.createUserWithEmailAndPassword(email, password)
        .then(user => {        
            res.redirect('/dashboard');
        })
        .catch(err => {
            const errorMessage = err.message;
            req.flash('error', errorMessage);
            res.redirect('/auth?mode=signup');
        });
    } else {
        req.flash('error', ' 密碼 與 確認密碼 不一致');
        res.redirect('/auth?mode=signup');
    };
});

router.post('/signin', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    fireAuth.signInWithEmailAndPassword(email, password)
    .then(user => {        
        res.redirect('/dashboard');
    })
    .catch(err => {
        const errorMessage = err.message;
        req.flash('error', errorMessage);
        res.redirect('/auth?mode=signin');
    });
});

router.post('/signout', function(req, res, next) {
    res.send('已登出');
    res.end();
});



module.exports = router;