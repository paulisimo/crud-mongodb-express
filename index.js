var mongoose = require('mongoose')
    , express = require('express')
    , jade = require('jade');

var Schema = mongoose.Schema;
  
var PostSchema = new Schema({
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

app.get('/posts', function(req, res){
  var posts = Post.find({}, function(err, docs){
    res.send(JSON.stringify(docs));    
  });
});

app.get('/posts/new', function(req, res){
  res.render('form.jade')
});

app.get('/posts/edit/:id', function(req, res){
  console.log('EDITTTT')
  Post.findById(req.params.id, function(err, post){
    try {
      res.render('edit.jade', {locals: {post: post}});
    } catch(e) {
      console.log(e)
    }
  });
});

app.get('/posts/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    res.send(JSON.stringify(post));    
  });
});

app.post('/posts', function(req, res){
  var post = new Post(req.body);
  post.save();
  res.send(JSON.stringify(post));
});

app.post('/posts/:id', function(req, res){
  var post = Post.findById(req.params.id)
  post.update(req.body);
  post.save();
  res.end();
});

app.del('/posts/:id', function(req, res){
  var post = Post.findById(params.id)
  post.destroy();
  res.end();
});

app.listen(3000);