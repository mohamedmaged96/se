var express = require('express');
var BodyParser = require('body-parser');
var path = require('path');
var mongojs= require('mongojs');
var db = mongojs('ay',['students']);
//ar upload = multer({ dest: 'uploads/' });
var app = express();
var expressValidator = require('express-validator');
var fs = require("fs");
var multer = require("multer");
var upload = multer({dest: "./uploads"});
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/images");
var conn = mongoose.connection;

var gfs;

var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: false}));




//global vars
app.use(function(req,res,next){
	res.locals.errors=null;
	next();
});

//Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
res.render('home'); 
});

app.get('/register',function(req,res){
res.render('register'); 
});

app.post('/register',function(req,res){
	req.checkBody('password', 'password is required').notEmpty();
	req.checkBody('username', 'username is required').notEmpty();
	req.checkBody('name', 'Name is required').notEmpty();



	var errors = req.validationErrors();

	if(errors){
	res.render ('register',{
			title: 'register' ,
			errors: errors
		})
	console.log(errors);
	}else {
		var newUser = {
			name: req.body.name,
			username: req.body.username,
			password: req.body.password,
			ss: null,
			works:null
		}
		db.finish.insert(newUser, function(err,res){
			if(err){
				console.log(err);
			}
			console.log('success');

		});
	}

			res.render ('home');


});

app.get('/login',function(req,res){
res.render('login'); 
});
app.post('/login',function(req,res){
	req.checkBody('password', 'password is required').notEmpty();
	req.checkBody('username', 'username is required').notEmpty();


	var errors = req.validationErrors();
	if(errors){
	res.render ('login',{
			title: 'login' ,
			errors: errors
		})
	console.log(errors);
	}else {

		console.log('success');
		res.redirect('/login/create')
		// res.render ('por');
	}

			//res.render ('home');


});
app.get('/login/create',function(req,res){
res.render('por'); 
});

app.get('/login/create/mid',function(req,res){
res.render('mid'); 
});
app.post('/login/create',function(req,res){
	req.checkBody('Name', 'Name is required').notEmpty();

	var errors = req.validationErrors();
	if(errors){
	res.render ('por',{
			title: 'login' ,
			errors: errors
		})
	console.log(errors);
	}else {

		console.log('success');
		res.redirect('/login/create/mid')
		// res.render ('por');
	}

			//res.render ('home');


});
app.get('/login/create/links',function(req,res){
res.render('links'); 
});

app.post('/login/create/links',function(req,res){
	req.checkBody('username', 'username is required').notEmpty();
	req.checkBody('links', 'please provide a links').notEmpty();

	var errors = req.validationErrors();
	if(errors){
	res.render ('links',{
			title: 'login' ,
			errors: errors
		})
	console.log(errors);
	}else {

		 db.finish.update({'username':req.body.username}, {$set:{works:req.body.links}},function(err) {
        if (err) console.warn(err.message);
        else console.log('successfully updated');
      });
		console.log('links success');
		res.redirect('/login/create/links')
		// res.render ('por');
	}

			//res.render ('home');


});



conn.once("open", function(){
  gfs = Grid(conn.db);
  app.get("/login/create/ss", function(req,res){
    //renders a multipart/form-data form
    	console.log('hanet....');
    res.render("create");
  });

  //second parameter is multer middleware.
  app.post("/login/create/ss", upload.single("avatar"), function(req, res, next){
    //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    	req.checkBody('username', 'username is required').notEmpty();
    		var errors = req.validationErrors();
    	if(errors){
	res.render ('create',{
			title: 'login' ,
			errors: errors
		})
	console.log(errors);
	}else {	
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });
     db.finish.update({'username':req.body.username}, {$set:{ss:req.file.originalname}},function(err) {
        if (err) console.warn(err.message);
        else console.log('successfully updated');
      });
    //
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(){fs.unlink("./uploads/"+ req.file.filename, function(err){res.send("success")})})
        .on("err", function(){res.send("Error uploading image")})
          .pipe(writestream);
  }
  });

  // sends the image we saved by filename.
  app.get("/:filename", function(req, res){
      var readstream = gfs.createReadStream({filename: req.params.filename});
      readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      readstream.pipe(res);
  });

  
});
app.post('/viewing',function(req,res){

var names = [];
	var username = 'kingy';
	var Password = 'king';

	function cb(callback){
			db.finish.find().forEach(function (err,doc) {

				if (err){

				}
				
		callback(doc);
		
		


	})

		}


cb(f);

		function f(username){
		if(username!=null){
		names.push(username);
		}else{
		res.render('viewing',{
			names:names
		});
	}
		}	

	})




app.listen(3000, function(){
	console.log('Connected to Server on port 3000 .....');
})