var Users = (function() {
	var userInfo = [];
	var userdata_local = localStorage["userdata"];
		
	var saveToLocal = function() {
		localStorage["userdata"] = JSON.stringify(userInfo);
	};
	
	var getFromLocal = function(){	
		userdata_local = localStorage["userdata"];	
		if (typeof(userdata_local) !== "undefined" && userdata_local !== "undefined")
			userInfo = JSON.parse(userdata_local);
		else
			userInfo = [];
	};
	
	var getUserInfo = function(username) {
		//fetches user info. if not found, return null
		getFromLocal();
		if(typeof username == "undefined")
			return null;
			
		var u = -1;
		for (i = 0; i < userInfo.length; i++){
			if (userInfo[i].username == username)
				u = i;
		}
			
		if (u > -1)
			return userInfo[u];
		else
			return null; //Not found
	}
		
	getFromLocal();
	
	return {
		update : function(username, curTask, deadline, completedTasks) {
			if (typeof(username) === "undefined")
				return;
				
			var u = -1;
			if (userInfo.length != 0){
				for (i = 0; i < userInfo.length; i++){
					if (userInfo[i].username == username)
						u = i;
				}
				
				if (u == -1) {	//not found, create new entry in UserData
					u = userInfo.length;
					userInfo.push({});
				}
			} else {
				u = 0;
				userInfo.push({});
			}
			
			if (typeof(username) !== "undefined")
				userInfo[u].username = username;
			else
				userInfo[u].username = null;
			
			if (typeof(curTask) !== "undefined")
				userInfo[u].curTask = curTask;
			else
				userInfo[u].curTask = null;
			
			userInfo[u].deadline = deadline;
			
			if (typeof(completedTasks) !== "undefined")
				userInfo[u].completedTasks = completedTasks;
		
			saveToLocal();
		},
		
		addCurTaskToHistory : function(username, comment){
			//called when user completes mission
			//task history only needs to store task key, completed date, and comments
			var task = {};
			var d = new Date();
			var current_user = getUserInfo(username);
			
			task.key = current_user.curTask;
			task.completeDate = d;
			task.comment = comment;
			
			if (!current_user.completedTasks)
				current_user.completedTasks = [];
				
			current_user.completedTasks.push(task);
			
			this.update(username, null, null, current_user.completedTasks);
		},
		
		assignTask : function (username, key){
			//index parameter should be index of Tasklist item, not the key
			//for the datastore
			var current_user = getUserInfo(username);
			
			if (current_user && current_user.curTask)
				return false;
			
			var deadline = new Date();
			deadline = deadline.setDate(deadline.getDate() + 1);
			
			this.update(username, key, deadline);
			return true;
		},
	
		clearTask : function (username){
			this.update(username, null, null);
		},
	
		getCurTask (username){
			var current_user = getUserInfo(username);
			if (current_user){
				return current_user.curTask;
			}
		},
	
		getDeadline (username){
			var current_user = getUserInfo(username);
			if (current_user){
				return current_user.deadline;
			}
		},
		
		getCompletedTasks (username){
			var current_user = getUserInfo(username);
			if (current_user && current_user.completedTasks){
				return current_user.completedTasks;
			}
			return [];
		},
	
		reset : function (){
			localStorage.removeItem("userdata");
			getFromLocal();
		}
	}
})();




