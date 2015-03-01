var AppConfig = (function() {
	var lastUser = "anonymous";
	var lastDate = Date.now();
	var firstTime = true;
	var config = localStorage["appconfig"];
		
	var getFromLocal = function() {
		config = localStorage["appconfig"];
		
		if (typeof(config) !== "undefined"){
			config = JSON.parse(config);
			lastUser = config.lastUser;
			lastDate = config.lastDate;
			firstTime = false;
		} else {
			firstTime = true;
		}
	};
	
	var saveToLocal = function() {
		var save_config = {};
		save_config.lastUser = lastUser;
		save_config.lastDate = lastDate;
		save_config.firstTime = false;
		localStorage["appconfig"] = JSON.stringify(save_config);
	};
	
	getFromLocal();
	
	return {
		setLastUser : function (username){
			//Set default for AppConfig to have anonymous as last user, 
			//this user will be treated as an "undefined" user
			if (typeof(username) !== "undefined")
				lastUser = username;
			else
				lastUser = "anonymous";
				
			saveToLocal();
		},
		setLastDate : function (date){
			//Default is now. If AppConfig object is created with no params,
			//we can assume app is run for the first time
			if (typeof(lastDate) !== "undefined")
				lastDate = lastDate;
			else	
				lastDate = Date.now();
				
			saveToLocal();
		},
		getLastUser : function(){
			return lastUser;
		},
		getLastDate : function(){
			return lastDate;
		},
		isFirstTime : function(){
			return firstTime;
		},
		setConfig : function(username, date){
			lastUser = username;
			lastDate = date;
			firstTime = false;
			saveToLocal();
		},
		reset : function(){
			lastUser = "anonymous";
			lastDate = Date.now();
			firstTime = true;
			saveToLocal();
		}
	};
})();
