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
		$.getJSON('http://localhost:8080/tasklist.json?callback=?', 
			function(data) {	
				localStorage["tasklist"] = JSON.stringify(data);
				var tlist = localStorage["tasklist"];
				if (tlist)
					this.list = JSON.parse(tlist);
				
		}).fail(function(data, textStatus, error) {
			console.error("getJSON failed, status: " + textStatus + ", error: "+error)
			return false;
		});
	};

	this.getFromLocal = function() {
		//Returns the tasklist from localStorage. If not found, load it using loadTasklist.
		var tlist = localStorage["tasklist"];
		if (tlist){
			this.list = JSON.parse(tlist);
		}
	};
	
	this.getTaskFromKey = function(key){
	//Returns info about the task given key.
	for (i = 0; i < this.list.length; i++)
		if (this.list[i].key == key)
			return this.list[i];
	
	return null;
	};
}






