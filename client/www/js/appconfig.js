function AppConfig(lastUser, lastDate) {

	this.data = localStorage["appconfig"];
		
	//Set default for AppConfig to have anonymous as last user, 
	//this user will be treated as an "undefined" user
	if (lastUser)
		this.lastUser = lastUser;
	else
		this.lastUser = "anonymous";
	
	//Default is now. If AppConfig object is created with no params,
	//we can assume app is run for the first time
	if (lastDate)
		this.lastDate = lastDate;
	else	
		this.lastDate = Date.now();
	
	this.getFromLocal = function() {
		console.log(this);
		config = localStorage["appconfig"];
		config = JSON.parse(config);
		if (config){
			this.lastUser = config.lastUser;
			this.lastDate = config.lastDate;
			this.firstTime = false;
		} else {
			this.firstTime = true;
		}
	};
	
	this.saveToLocal = function() {
		localStorage["appconfig"] = JSON.stringify(AppConfig);
	};
}