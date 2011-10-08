var mongoose = require('mongoose')
    , express = require('express')
    , jade = require('jade');


// Mongodb schema
var Schema = mongoose.Schema;
  
var PostSchema = new Schema({
  seq       : Number,
  title     : String,
  body      : String,
  date      : Date
});

mongoose.connect('mongodb://localhost/blog');
mongoose.model('Post', PostSchema);
console.log("Server up")

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
  console.log('Serving - Create new');
});

// Edit a record
app.get('/posts/edit/:id', function(req, res){
  Post.findById(req.params.id, function(err, title, body){
    try {
      res.render('edit.jade', { locals: {
          post: title
        }
        });
    console.log("Editing " + post.id);
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
      res.render('post.jade', { locals: {
          post: post
        }
        });
      console.log("Serving " + post.id);
    } catch(e) {
      console.log(e)
    }
  });
});


app.get('/posts/order', function(req, res){
    try {
      post.sequence.findAndModify({
      query: {"_id": "customer"},
      update : {$inc : {"seq":1}},
      upsert:true,
      new:true
    });
    } catch (e) {
      console.log(e)
    }
});


app.post('/posts', function(req, res){
  var post = new Post(req.body);
  post.save();
  console.log('Saved ' + post.id);
  res.redirect('/posts');  
});

app.post('/posts/:id', function(req, res){
  Post.update({ 
    _id: req.params.id }, 
    req.body, 
    function(){ res.redirect('/posts') 
  });
});

app.get('/posts/remove/:id', function(req, res){
  Post.findById(req.params.id, function (err, post) {
    post.remove(post);
    console.log('Deleted ' + post.id)
    res.redirect('/posts');
    if (!err) {
    }
  });
});

app.listen(3000);