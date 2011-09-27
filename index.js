var mongoose = require('mongoose')
    , express = require('express')
    , jade = require('jade');


// Mongodb schema
var Schema = mongoose.Schema;
  
var PostSchema = new Schema({
  title     : String,
  body      : String,
  date      : Date
});

mongoose.connect('mongodb://localhost/blog');
mongoose.model('Post', PostSchema);

var Post = mongoose.model('Post');

var app = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

//ROUTES
// Show all
app.get('/posts', function(req, res){
  var posts = Post.find({}, function(err, docs){
    res.render('index.jade', { locals: {
        posts: docs
      }
      });
    console.log("Serving all");
  });
});

// Create a new post
app.get('/posts/new', function(req, res){
  res.render('new.jade');
  //res.redirect('/posts');
});

// Edit a record
app.get('/posts/edit/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    try {
      res.render('edit.jade', { locals: {
          post: post
        }
        });
    console.log("editing " + post._id);
    } catch(e) {
      console.log(e)
    }
  });
});

// show one
app.get('/posts/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    //res.send(JSON.stringify(post));
    try {
      res.render('post.jade', 
        { locals: {
          post: post
        }
        });
      console.log("Serving " + post._id);
    } catch(e) {
      console.log(e)
    }
  });
});

app.post('/posts', function(req, res){
  var post = new Post(req.body);
  post.save();
  res.redirect('/posts');
  //res.send(JSON.stringify(post));
});

app.post('/posts/:id', function(req, res){
  Post.update({ _id: req.params.id }, req.body, function(){ res.redirect('/posts') });
});

app.get('/posts/remove/:id', function(req, res){
  Post.findById(req.params.id, function (err, post) {
    post.remove(post);
    res.redirect('/posts');
    if (!err) {
    }
  });
});

app.listen(3000);