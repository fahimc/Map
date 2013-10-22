module.exports = function(grunt) {
	grunt.file.defaultEncoding = 'utf8';
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		gitclone : {
			clone : {
				options : {
					repository : 'https://github.com/angular/angular-seed.git',
					branch : 'master'
				}
			}
		},
		concat : {
			options : {
				// define a string to put between each file in the concatenated output
				separator : ';'
			},
			dist : {
				src : ['app/js/component/map/SVGMapMarker.js', 'app/js/component/map/FancyMarker.js', 'app/js/component/map/SVGMap.js'],
				dest : 'build/SVGMap.min.js'
			}
		}
	});
	// grunt.loadNpmTasks('grunt-git');
	// A very basic default task.
	grunt.registerTask('default', [""], function() {

	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('compile', ["concat"]);
	grunt.registerTask('setup', 'setup complete', function() {
		grunt.file.mkdir("app");
		grunt.file.mkdir("app/lib");
		grunt.file.mkdir("app/js");
		grunt.file.mkdir("app/css");
		grunt.file.mkdir("app/img");
		//make html file
		grunt.file.write("app/index.html", '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"> <html xmlns="http://www.w3.org/1999/xhtml" lang="en"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <title>index</title> <meta name="author" content="" /> <link type="text/css" rel="stylesheet" href="css/style.css" /> <script type="text/javascript" src="js/main.js"></script> </head> <body></body> </html>');
		//make css file
		grunt.file.write("app/css/style.css", 'html,body { width:100%; height:100%; } *{ padding:0;margin:0;} ');
		//make js file
		grunt.file.write("app/js/main.js", '(function(window) { function Main() { if(window.addEventListener) { window.addEventListener("load", onLoad); } else { window.attachEvent("onload", onLoad); } } function onLoad() { } Main(); } )(window);');
		grunt.file.write("app/app.js", '(function() { var express = require("express"); var app = express(); app.use("/js", express.static("./app/js")); app.use("/css", express.static("./app/css")); app.use("/img", express.static("./app/img")); app.listen(3000); app.get("/", function(request, response) { response.sendfile("./app/index.html"); }); })(); ');

		grunt.log.write('Project Setup is Complete').ok();
	});
};
