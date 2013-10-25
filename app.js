var express = require('express');
//var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;




var http = require('http');

var app = express(); 
var server = http.createServer(app);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//var articleProvider= new ArticleProvider();
var articleProvider = new ArticleProvider('localhost', 27017);


var fs = require('fs');


app.get('/', function(req, res){
    articleProvider.findAll( function(error,docs){
        res.render('index.jade',  {
            title: 'Blog',
            articles:docs
            }
        );
    })
	console.log("1111111111");

	//console.log('eq is=',req);
	//console.log('res is=',res);
});

app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade',  {
        title: 'New Post'
    }
    );
	console.log("tatathai");
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
       res.redirect('/')
    });
	console.log("susuai",req.params);
});

app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade',
        { locals: {
            title: article.title,
            article:article
        }
        });
    });
	console.log("222222222");
});

app.post('/blog/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
	   console.log("333333333333");
});



app.listen(3000);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);