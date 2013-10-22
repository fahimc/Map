(function() {
	var express = require("express");
	var app = express();
	app.use("/js", express.static("./js"));
	app.use("/css", express.static("./css"));
	app.use("/img", express.static("./img"));
	app.listen(3000);
	app.get("/", function(request, response) {
		response.sendfile("./index.html");
	});
})(); 