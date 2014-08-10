var request = require('request');
var sections = [];

var cleverGetSections = function(callback, page){
	var uri = 'https://api.clever.com/v1.1/sections';
	var page = null || page;
	if (page) { uri += '?page=' + page};
	var options = {
		method: 'GET',
		json: {},
		uri: uri,
		headers: {
			Authorization: 'Bearer DEMO_TOKEN'
		}
	};
	request(options, function(err, response, body){
		body.data.map(function(section){
			var sectObj = {
				sect: section.data.school,
				students: section.data.students.length
			}
			sections.push(sectObj);
		});
		if (body.paging.current !== body.paging.total) {
			cleverGetSections(callback, body.paging.current + 1);
		}else{
			callback(null, sections);
		}
	});	
}

var indexController = {
	index: function(req, res) {
		var totalStuds = 0;
		cleverGetSections(function(err, sect){
			sect.map(function(sectObj){
				totalStuds += sectObj.students;
			});
			res.send('The current avg is ' + Math.round(totalStuds / sect.length) + ' students.');
		});
	}
};

module.exports = indexController;