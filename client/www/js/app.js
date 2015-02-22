var AppConfig;	//Contains configurations specific to mobile app, like last user login
var UserData;		//Array, contains user-specific info for every user using this app instance.
var Tasklist;		//List of all tasks, updates from server.
var UserInfo;		//A specific object from UserData array for current user.

/*
====================================
TASKLIST
Tasklist - Array of task objects
====================================
*/

function loadTasklist() {
	//Retrieves tasklist from remote server and saves to local storage.
	$.getJSON('http://localhost:8080/tasklist.json?callback=?', 
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
		return JSON.parse(tlist);
	} else {
		tlist = loadTasklist();
		if (tlist) 
			return JSON.parse(tlist); 
		else 
			return false;
	}

}

/*
====================================
USER DATA AND INFO
====================================
*/

function getUserData() {
	//TO-DO: Fetching user data from server
	//Returns the user data from localStorage.
	userdata = localStorage["userdata"];
	if (!userdata){
		return [];
	
	}
	
	return JSON.parse(userdata);
}

function getUserInfo (username){
	//UserData stores info about every user using this device.
	if(typeof username !== "undefined"){
		username = username || "anonymous";
	}else{
		username = AppConfig.lastUser;
	}
	
	UserData = getUserData();
	
	//Checks if username already in UserData
	u = -1;
	for (i = 0; i < UserData.length; i++){
		if (UserData[i].username == username)
			u = i;
	}
	
	if (u == -1){
		//Not found, create new.
		userinfo = new Object();
		userinfo.username = username;
		return userinfo;
	}else{
		return UserData[u];
	}
	
}

function saveUserInfo (){
	//Assumes UserInfo object exists. Assumes UserData exists.
	//Saves UserInfo as a UserData entry
	if (!UserInfo) 
		return;
	
	var u = -1;
	UserData = getUserData();
	for (i = 0; i < UserData.length; i++){
		if (UserData[i].username == UserInfo.username)
			u = i;
	}
	
	if (u == -1) {	//not found, create new entry in UserData
		u = UserData.length;
		UserData.push ({});
	}
	
	UserData[u].username = UserInfo.username;
	UserData[u].curTask = UserInfo.curTask;
	UserData[u].deadline = UserInfo.deadline;
	UserData[u].completedTasks = UserInfo.completedTasks;

	localStorage["userdata"] = JSON.stringify(UserData);
}


/*
====================================
APP CONFIGURATION
====================================
*/

function getAppConfig(){
	//retrieve app config
	config = localStorage["appconfig"];
	if (config)
		config = JSON.parse(config);
	else 
		return null;
	
	return config;
}

function initAppConfig(lastUser, callback){
	//Assumes AppConfig is null
	AppConfig = new Object();
	AppConfig.lastUser = lastUser;
	AppConfig.lastDate = Date.now();
	localStorage["appconfig"] = JSON.stringify(AppConfig);
	
	UserData = getUserData();
	UserInfo = getUserInfo();
	if (UserInfo) saveUserInfo();
	
	callback();
}


/*
====================================
TASK ASSIGN / COMPLETE
====================================
*/
function assignTask(index){
	//Assumes UserInfo is loaded.
	//index parameter should be index of Tasklist item, not the key
	//for the datastore
	if (UserInfo.curTask){
		console.log("assignTask: UserInfo.curTask already has something");
		return false;
	}
	
	console.log("assignTask: " + Tasklist[index].key + " assigned.");
	UserInfo.curTask = Tasklist[index].key;
	deadline = new Date();
	UserInfo.deadline = deadline.setDate(deadline.getDate() + 1);
	
	saveUserInfo();
	
	return true;
}

function getTaskFromKey(key){
	//Returns info about the task given key.
	//Intended to have UserInfo.curTask passed as parameter
	
	for (i = 0; i < Tasklist.length; i++)
		if (Tasklist[i].key == key)
			return Tasklist[i];
	
	return null;
}

function addCurTaskToHistory(){
	//called when user completes mission
	task = {};
	d = new Date();
	
	task.date = d;
	
}

function clearTask(){
	UserInfo.curTask = null;
	UserInfo.deadline = null;
}

/*
====================================
INITIALIZE APP DATA
====================================
*/

AppConfig = getAppConfig();
Tasklist = getTasklist();

if (!AppConfig){
	window.location = "#firsttime";
} else {
	UserData = getUserData();
	UserInfo = getUserInfo();
}
