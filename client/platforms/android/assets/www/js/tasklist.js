/*
====================================
TASKLIST
Tasklist - Array of task objects
====================================
*/


var Tasklist = function(){
	this.list = [];

	this.getFromServer = function() {
		//Retrieves tasklist from remote server and saves to local storage.
		console.log("getfromserver called");
		
		$.getJSON('http://doingness-of-things.appspot.com/tasklist.json?callback=?', 
		    {
				tags: "jquery",
				tagmode: "any",
				datatype: "jsonp",
				crossDomain: "true"
				},
			function(data) {	
				console.log("getfromserver success");
				localStorage["tasklist"] = JSON.stringify(data);
				
				var tlist = localStorage["tasklist"];
				console.log("getfromserver tlist = " + tlist);
				
				this.list = JSON.parse(tlist);
				
		}).fail(function(data, textStatus, error) {
			console.log("getJSON failed, status: " + textStatus + ", error: "+error)
			return false;
		});
	};

	this.getFromLocal = function() {
		//Returns the tasklist from localStorage. If not found, load it using loadTasklist.
		var tlist = localStorage["tasklist"];
		
		if (typeof(tlist) !== "undefined"){
			this.list = JSON.parse(tlist);
			return true;
		}
		return false;
	};
	
	this.getTaskFromKey = function(key){
	//Returns info about the task given key.
	for (i = 0; i < this.list.length; i++)
		if (this.list[i].key == key)
			return this.list[i];
	
	return null;
	};
}






