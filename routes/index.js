const express = require('express');
const router = express.Router();
const stringtags = require('striptags');
const moment = require('moment');
const convertPagenation = require('../modules/convertPagenation');
const firebaseAdminDb = require('../connection/firebase-admin-connect');

const categoriesRef = firebaseAdminDb.ref('/categories');
const articlesRef = firebaseAdminDb.ref('/articles');

router.get('/', function(req, res, next) {
  let currentPage = Number.parseInt(req.query.page) || 1;
  let categories = {};
  categoriesRef.once('value').then(snapshot => {
    categories = snapshot.val();
    return articlesRef.orderByChild('update_time').once('value');
  }).then(snapshot => {
    const articles = [];
    snapshot.forEach(snapshotChild => {
      if ('public' === snapshotChild.val().status ) {
        articles.push(snapshotChild.val());
      }
    });
    articles.reverse();
    const data = convertPagenation(articles, currentPage);
    res.render('index', {
      categories,
      articles: data.result,
      page: data.page,
      stringtags,
      moment
    });
  });
});

router.get('/post/:id', function(req, res, next) {
  const id = req.params.id;
  let categories = {};
  categoriesRef.once('value').then( snapshot => {
      categories = snapshot.val();
      return articlesRef.child(id).once('value');
  }).then(snapshot => {
      const article = snapshot.val();
      res.render('post', {
        categories,
        article,
        moment
      });
  })
});

module.exports = router;
