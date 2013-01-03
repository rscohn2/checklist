/**
 * @author Robert S Cohn
 */

/*
 * Task manager is driven by events from UI and does not need to expose an API so wrap in an anonymous function.
 * If we need to expose an API, then turn it into a singleton object.
 */

(function() {
	var categories = ['Home', 'Office'];

	/*
	 * Create a new Task
	 */
	function Task() {
		// Default values
		this.name = 'Name';
		this.description = 'Description';
		this.category = 0;
		this.dueDate = new Date();
		this.done = false;
	};

	Task.prototype.updateForm = function() {
		$('#taskName').val(this.name);
		$('#taskDescription').val(this.description);
		$('#taskCategory').val(this.category);
		$('#taskDueDate').val(this.dueDate);
		$('#taskCompleted').val(this.completed);
	}

	Task.prototype.updateFromForm = function() {
		this.name = $('#taskName').val();
		this.description = $('#taskDescription').val();
		this.category = $('#taskCategory').val();
		this.dueDate = $('#taskDueDate').val();
	}
	function TaskList() {
		this.tasks = [];
		this.currentTask = -1;
	}


	TaskList.prototype.writeLocalStorage = function() {
		if (localStorage) {
			localStorage['tasks'] = JSON.stringify(this.tasks)
		}
	}

	TaskList.prototype.readLocalStorage = function() {
		if (localStorage) {
			this.tasks = JSON.parse(localStorage['tasks']);
		}
	}

	TaskList.prototype.add = function() {
		var newTask = new Task();
		this.currentTask = this.tasks.length;
		this.tasks.push(newTask);
		return newTask;
	}

	TaskList.prototype.getCurrentTask = function() {
		return this.tasks[this.currentTask];
	}

	TaskList.prototype.deleteCurrentTask = function() {
		this.tasks.splice(this.currentTask, 1);
		this.writeLocalStorage();
		this.render();
	}

	TaskList.prototype.updateTask = function() {
		var t = this.getCurrentTask();
		t.updateFromForm();
		this.render();
		this.writeLocalStorage();
	}

	TaskList.prototype.render = function() {
		var createEditTapHandler = function(index) {
			return function(event, data) {
				taskList.currentTask = index;
				taskList.getCurrentTask().updateForm();
			};
		};

		var createDoneTapHandler = function(index) {
			return function(event, data) {
			};
		};

		var list = $('#taskList');
		list.empty();

		for (var i = 0; i < this.tasks.length; i++) {
			var task = this.tasks[i];

			// Don't display done tasks
			if (task.done) {
				continue;
			}

			/*
			 * For each task, create something like this:
			 * <li>
			 * 		<a href='#taskFormPage' data-transition='slide'>Task Name</a>
			 * </li>
			 */
			console.dir('Task: ' + task.name);
			console.dir(task);
			var edit = $('<a>');
			var li = $('<li>');
			edit.attr('href', '#taskFormPage');
			edit.attr('data-transition', 'slide');
			edit.bind('tap', createEditTapHandler(i));
			edit.append(task.name);

			li.append(edit);
			list.append(li);

			// Tell JQM to do its magic to the inserted li elements
			list.listview('refresh');
		}

	}
	var taskList = new TaskList();
	taskList.readLocalStorage();

	$('#indexPage').live('pageinit', function() {

		taskList.render();

		$('#newTaskButton').bind('tap', function(event, data) {
			console.dir('New task');
			var t = taskList.add();
			t.updateForm();
		});

		$('#saveTaskButton').bind('tap', function(event, data) {
			console.dir('Save task');
			taskList.updateTask();
		});

		$('#cancelTaskButton').bind('tap', function(event, data) {
			console.dir('Cancel task update');
		});

		$('#deleteTaskButton').bind('tap', function(event, data) {
			console.dir('Delete task');
			taskList.deleteCurrentTask();
		});
	});

})();
