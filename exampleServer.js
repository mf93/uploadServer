var http = require('http'),
    director = require('director'),
	formidable= require('formidable'),
	fs= require('fs'),
	util=require('util');

var router = new director.http.Router();

var server = http.createServer(function (req, res) {
  

  router.dispatch(req, res, function (err) {
    if (err) {
      res.writeHead(404);
	  res.write("404 not found");
      res.end();
    }

    console.log('Served ' + req.url);
  });
});

router.get('/', {stream:true},function () {
	var resource=this;
	fs.readFile("formPage.html", "utf8", function(err,html)
	{
		 resource.res.writeHead(200, { 'Content-Type': 'text/html' })
		resource.res.write(html);
		resource.res.end();
	});
 
});

router.post('/saveFile', {stream:true}, function() 
	{

			var thisPage= this;
			var form = new formidable.IncomingForm();

			form.parse(thisPage.req, function(err, fields, files)
			{
                for(var uploadFileKey in files)
                    uploadFile(files[uploadFileKey]);

				thisPage.res.writeHead(200, {'content-type': 'text/plain'});
				thisPage.res.write('received upload:\n\n');
				thisPage.res.end(util.inspect({fields: fields, files: files}));
			});

            function uploadFile(upload)
            {

                console.log(upload.name);
                fs.rename(upload.path, "./"+upload.name, function (err)
                {
                    thisPage.res.writeHead(200, {'content-type': 'text/plain'});
                    thisPage.res.write('nope');thisPage.res.end()
                });
            }

		
	});


server.listen(8080);
console.log('http server with director running on 8080');