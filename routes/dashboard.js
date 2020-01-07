const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connection/firebase-admin-connect');

const categoriesRef = firebaseAdminDb.ref('/categories/');

router.get('/archives', function(req, res, next) {
  res.render('dashboard/archives', { title: 'Express' });
});

router.get('/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'Express' });
});

router.get('/categories', function(req, res, next) {
  categoriesRef.once('value').then(snapshot => {
    const categories = snapshot.val();
    res.render('dashboard/categories', { 
        categories
    });
  })
});

router.get('/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});

router.post('/categories/create', function(req, res, next) {
  const data = {...req.body};
  console.log(data);
  const categoryRef = categoriesRef.push();
  categoryRef.set(data).then(() => {
    res.redirect('/dashboard/catagories');
  });
});

module.exports = router;
