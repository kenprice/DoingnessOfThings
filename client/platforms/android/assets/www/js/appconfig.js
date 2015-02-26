function AppConfig(lastUser, lastDate) {
	
	//Set default for AppConfig to have anonymous as last user, 
	//this user will be treated as an "undefined" user
	if (typeof(lastUser) !== "undefined")
		this.lastUser = lastUser;
	else
		this.lastUser = "anonymous";
	
	//Default is now. If AppConfig object is created with no params,
	//we can assume app is run for the first time
	console.log("appconfig: lastDate = " + lastDate);
	if (typeof(lastDate) !== "undefined")
		this.lastDate = lastDate;
	else	
		this.lastDate = Date.now();
	
	console.log("appconfig: this.lastDate = " + this.lastDate);
	console.log("appconfig: this.lastUser = " + this.lasetUser);
	
	this.getFromLocal = function() {
		config = localStorage["appconfig"];
		console.log("appconfig.getfromlocal: config == " + config);
		
		if (typeof(config) !== "undefined"){
			config = JSON.parse(config);
			this.lastUser = config.lastUser;
			this.lastDate = config.lastDate;
			this.firstTime = false;
		} else {
			this.firstTime = true;
		}
	};
	
	this.saveToLocal = function() {
		var config = {};
		config.lastUser = this.lastUser;
		config.lastDate = this.lastDate;
		config.firstTime = false;
		localStorage["appconfig"] = JSON.stringify(config);
	};
}