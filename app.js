var createError = require('http-errors');
var express = require('express');

var path = require('path');
var http = require('http');
var os = require('os');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use('/specification',express.static(path.join(__dirname, 'specification/')));


function checkDirectory(directory, callback) {  
	fs.stat(directory, function(err, stats) {
		//Check if error defined and the error code is "not exists"
		if (err) {
			//Create the directory, call the callback.
			// fs.mkdir(directory, callback);
			callback(err)
		} else {
			//just in case there was a different error:
			callback(null,stats)
		}
	});
}

app.get('/get_meta_data/:folderName/:fileName',function(req,res){
	var routeParams = req.params;

	var folderPath = `./specification/${routeParams.folderName}/`
	checkDirectory(folderPath, function(error,result) {  
		if(error) {
			console.log("oh no!!!", error);
			res.status(500).send(`Enter Proper folderName`)
		} else {
			//Carry on, all good, directory exists / created.
		 	console.log('folder Exist')
		    const path = folderPath+`${routeParams.fileName}`
			try {
				if (fs.existsSync(path)) {
					//file exists
					console.log(path);
					let rawdata = fs.readFileSync(`${path}`);
					let student = JSON.parse(rawdata);
					res.status(200).send(student);
				}else{
					res.status(500).send('Enter Proper fileName')
				}
			} catch(err) {
			   	res.status(500).send('Something Went Wrong');
			}
	  	}
	});	
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
