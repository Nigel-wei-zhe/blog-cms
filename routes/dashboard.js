const express = require('express');
const router = express.Router();
const stringtags = require('striptags');
const moment = require('moment');
const convertPagenation = require('../modules/convertPagenation');
const firebaseAdminDb = require('../connection/firebase-admin-connect');

const categoriesRef = firebaseAdminDb.ref('/categories/');
const articlesRef = firebaseAdminDb.ref('/articles/');

router.get('/', function(req, res, next) {
  res.render('dashboard/welcome');
});

router.get('/archives', function(req, res, next) {
  let currentPage = Number.parseInt(req.query.page) || 1;
  const status = req.query.status || 'public';
  let categories = {};
  categoriesRef.once('value').then( snapshot => {
    categories = snapshot.val();
    return articlesRef.orderByChild('update_time').once('value');
  }).then( snapshot => {
    const articles = [];
    snapshot.forEach(snapshotChild => {
      if ( status === snapshotChild.val().status) {
        articles.push(snapshotChild.val());
      };
    })
    articles.reverse();
    const data = convertPagenation(articles, currentPage)
    res.render('dashboard/archives', {
      articles: data.result,
      page: data.page,
      categories,
      stringtags,
      moment,
      status,
    });
  });
});

router.post('/archives/delete/:id', function(req, res, next) {
  const id = req.params.id;
  articlesRef.child(id).remove();
  req.flash('info', '文章已刪除');
  res.send('文章已刪除');
  res.end();
});

router.get('/article/create', function(req, res, next) {
  categoriesRef.once('value').then( snapshot => {
      const categories = snapshot.val();
      res.render('dashboard/article', {
        categories,
        article: {
          status: 'draft'
        }
      });
  });
});

router.get('/article/:id', function(req, res, next) {
    const id = req.params.id;
    let categories = {};
    categoriesRef.once('value').then( snapshot => {
        categories = snapshot.val();
        return articlesRef.child(id).once('value');
    }).then(snapshot => {
        const article = snapshot.val();
        res.render('dashboard/article', {
          categories,
          article
        });
    })
});

router.get('/categories', function(req, res, next) {
  const messages = req.flash('info');
  categoriesRef.once('value').then(snapshot => {
    const categories = snapshot.val();
    res.render('dashboard/categories', {
        messages,
        hasInfo: messages.length > 0,
        categories
    });
  })
});

router.get('/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});


router.post('/article/create', function(req, res, next) {
    const data = {...req.body};
    const articleRef = articlesRef.push();
    const key = articleRef.key;
    const updateTime = Math.floor(Date.now() / 1000);
    data.id = key;
    data.update_time = updateTime;
    articleRef.set(data).then(() => {
        res.redirect(`/dashboard/article/${key}`);
    });
});

router.post('/article/update/:id', function(req, res, next) {
    const data = {...req.body};
    const id = req.params.id;
    articlesRef.child(id).update(data).then(() => {
        res.redirect(`/dashboard/article/${id}`);
    });
});


router.post('/categories/create', function(req, res, next) {
  const data = {...req.body};
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  data.id = key;
  
  categoriesRef.orderByChild('path').equalTo(data.path).once('value').then( snapshot => {
    if (snapshot.val() !== null) {
      req.flash('info', '已有相同路徑');
      res.redirect('/dashboard/categories');
    } else {
      categoryRef.set(data).then(() => {
        res.redirect('/dashboard/categories');
      });
    }
  });
});

router.post('/categories/delete/:id', function(req, res, next) {
    const id = req.params.id;
    categoriesRef.child(id).remove();
    req.flash('info', '欄位已刪除');
    res.redirect('/dashboard/categories');
});

router.get('/preview/:id', function(req, res, next) {
  const id = req.params.id;
  let categories = {};
  categoriesRef.once('value').then( snapshot => {
      categories = snapshot.val();
      return articlesRef.child(id).once('value');
  }).then(snapshot => {
      const article = snapshot.val();
      if (!article) {
        return res.render('error', {
          title: "找不到該文章"
        })
      }
      res.render('dashboard/preview', {
        categories,
        article,
        moment
      });
  })
});

module.exports = router;
