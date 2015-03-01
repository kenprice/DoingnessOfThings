function User(username, curTask, deadline, completedTasks) {	
	if (!username) {
		this.username = "anonymous";
	} else {	
		this.username = username;
		this.curTask = curTask;
		this.deadline = deadline;
		this.completedTasks = [];

		if (completedTasks)
			this.completedTasks = completedTasks;
		else
			this.completedTasks = []; //empty array if no completed tasks
	}
	
	this.assignTask = function (key){
		//index parameter should be index of Tasklist item, not the key
		//for the datastore
		if (this.curTask)
			return false;
		
		this.curTask = key;
		var deadline = new Date();
		this.deadline = deadline.setDate(deadline.getDate() + 1);
		
		return true;
	};
	
	this.addCurTaskToHistory = function(comment){
		//called when user completes mission
		//task history only needs to store task key, completed date, and comments
		var task = {};
		
		var d = new Date();
		task.key = this.curTask;
		task.completeDate = d;
		task.comment = comment;
		
		if (!this.completedTasks)
			this.completedTasks = [];
			
		console.log(this.completedTasks);
		this.completedTasks.push(task);
		
		this.curTask = null;
		this.deadline = null;
	};
	
	this.clearTask = function(){	
		this.curTask = null;
		this.deadline = null;
	}
}

function UserData() {

	this.userInfo = [];

	this.updateUserEntry = function (user, save){
		//userinfo corresponds to UserInfo-type object
		if (typeof(user) === "undefined"){
			console.log("UserData: updateUserEntry() failed, user undefined");
			return;
		}
			
		var u = -1;
		if (this.userInfo.length != 0){
			for (i = 0; i < this.userInfo.length; i++){
				if (this.userInfo[i].username == user.username)
					u = i;
			}
			
			if (u == -1) {	//not found, create new entry in UserData
				u = this.userInfo.length;
				this.userInfo.push({});
			}
		} else {
			u = 0;
			this.userInfo.push({});
		}
		
		this.userInfo[u].username = user.username;
		this.userInfo[u].curTask = user.curTask;
		this.userInfo[u].deadline = user.deadline;
		this.userInfo[u].completedTasks = user.completedTasks;
		
		console.log("updateUserEntry: pushed user: ", this.userInfo[u]);
	
		if (save)
			this.saveToLocal();
	};

	this.saveToLocal = function() {
		localStorage["userdata"] = JSON.stringify(this.userInfo);
	};

	this.getUserInfo = function(username) {
		//fetches user info. if not found, return null
		if(typeof username == "undefined")
			return null;
		
		var u = -1;
		for (i = 0; i < this.userInfo.length; i++){
			if (this.userInfo[i].username == username)
				u = i;
		}
		
		if (u > -1)
			return this.userInfo[u];
		else
			return null; //Not found
	};
	
	this.getFromLocal = function(){	
		var ud = localStorage["userdata"];	
		console.log(typeof(ud));
		if (typeof(ud) !== "undefined" && ud !== "undefined")
			this.userInfo = JSON.parse(ud);
	};

	

}









