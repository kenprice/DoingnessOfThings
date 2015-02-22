function loadTasklist() {
	//Retrieves tasklist from remote server and saves to local storage.
	$.getJSON('http://localhost:8080/tasklist.js?callback=?', 
		function(data) {	
			console.log(JSON.stringify(data));
			localStorage["tasklist"] = JSON.stringify(data);
			console.log(data);
			for (i = 0; i < data.length; i++)
			{
				item = data[i];
				console.log(item.category);
				console.log(item.description);
				console.log(item.key);
			}
			tlist = localStorage["tasklist"];
			console.log(JSON.parse(tlist));
			return tlist;
			
	}).fail( function(data, textStatus, error) {
        console.error("getJSON failed, status: " + textStatus + ", error: "+error)
		return false;
    });
}

function getTasklist() {
	//Returns the tasklist from localStorage. If not found, load it using loadTasklist.
	tlist = localStorage["tasklist"];
	if (tlist) {
		console.log("getTasklist: List fetched from localStorage['tasklist']");
		console.log("getTasklist: Content of localStorage['tasklist']:\n" + tlist);
		return tlist;
	} else {
		tlist = loadTasklist();
		if (tlist) 
			return tlist; 
		else 
			return false;
	}

}