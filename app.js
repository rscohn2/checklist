/**
 * @author Robert S Cohn
 */

/* 
 * Task manager is driven by events from UI and does not need to expose an API so wrap in an anonymous function. 
 * If we need to expose an API, then turn it into a singleton object.
 */

(function() {
	var tasks = [];
	var categories = ["Home", "Office"];
	var currentTask;
	
	/*
	 * Create a new Task
	 */
	function Task() {
		// Default values
		this.name = "";
		this.description = "";
		this.category = 0;
		this.dueDate = new Date();
		this.done = false;
	};
	
	Task.prototype.updateForm = function (){
		$("#taskName").val(this.name);
		$("#taskDescription").val(this.description);
		$("#taskCategory").val(this.category);
		$("#taskDueDate").val(this.dueDate)
	}
	
	Task.prototype.updateFromForm = function () {
		this.name = $("#taskName").val();
		this.description = $("#taskDescription").val();
		this.category = $("#taskCategory").val();
		this.dueDate = $("#taskDueDate").val();
	}

	function TaskList() {
			
	}
	
	function newTask(){
		var newTask = new Task();
		
		// Add to list
		currentTask = tasks.length();
		tasks.push(this);
	};
	
	$("#taskFormPage").live('pageinit', function() {
		if (currentTask == null) {
			alert("CurentTask null");
		}
	})

})();
