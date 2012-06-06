var http = require('http'),
    director = require('director'),
	formidable= require('formidable'),
	fs= require('fs'),
	util=require('util');
    _=require('underscore');


var uploadDir="./uploads/";
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
        resource.res.writeHead(200, { 'Content-Type': 'text/html' });
        resource.res.write(html);
        resource.res.end();
    });
});
    router.get('*\\.js', {stream:true},function(jsURL)
{
    var thisPage=this;
    directToPage(jsURL,".js",thisPage);
    console.log("ok");
});
router.get('*\\.css', {stream:true},function(jsURL)
{
    var thisPage=this;
    directToPage(jsURL,".css",thisPage);
    console.log("ok");
});
router.get('*\\.html/', {stream:true},function(jsURL)
{
    var thisPage=this;
    console.log(jsURL);
    directToPage(jsURL,".html",thisPage);
    console.log("ok");
});


router.post('/saveFile', {stream:true}, function() 
	{

			var thisPage= this;
			var form = new formidable.IncomingForm();

			form.parse(thisPage.req, function(err, fields, files)
			{
                 _.select(files, function(upload){uploadFile(upload)});
             //   for(var uploadFileKey in files)
              //      uploadFile(files[uploadFileKey]);

				thisPage.res.writeHead(200, {'content-type': 'text/plain'});
				thisPage.res.write('received upload:\n\n');
				thisPage.res.end(util.inspect({fields: fields, files: files}));
			});

            function uploadFile(upload)
            {

                console.log(upload.name);
                fs.rename(upload.path, uploadDir+upload.name, function (err)
                {
                    thisPage.res.writeHead(200, {'content-type': 'text/plain'});
                    thisPage.res.write('nope');thisPage.res.end()
                });
            }

		
	});

function directToPage(pageURL,extension,thisPage)
{
    fs.readFile(pageURL + extension,"utf8", function(err,html)
    {
        if(err)
        {
            thisPage.res.writeHead(404);
            thisPage.res.write("404 not found "+extension);
            thisPage.res.end();
        }
        else
        {
            thisPage.res.write(html);
            thisPage.res.end();
        }
    });
}

server.listen(8080);
console.log('http server with director running on 8080');