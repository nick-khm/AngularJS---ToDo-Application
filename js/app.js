var edit_form_element = '#editform-modal';
var delete_modal_element = '#deletion-confirm';

var app = angular.module('App',['LocalStorageModule','dndLists']);

app.config(['$logProvider', function($logProvider){
    $logProvider.debugEnabled(true);
}]);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('myApp')
    // .setStorageType('sessionStorage')
    // .setNotify(true, true)
});


app.controller('TaskListCtrl', function($scope,localStorageService,$log){
	// $scope.models = {
 //        selected: null
 //    };
	$scope.todo_list = [];
	console.log(localStorageService.get('todo'))
	if(localStorageService.get('todo') !== null) {
		$scope.todo_list = localStorageService.get('todo');;
	}

	$scope.$watch('todo_list', function(value){
		localStorageService.set('todo',value);
	},true);
	
	$scope.createTask = function() {
		$scope.selectTask({});
		$scope.form_mode = 'creation';
	};
	$scope.saveTask = function(task) {
		task.id = $scope.todo_list.length;
		$scope.todo_list.push(angular.copy(task));
	};
	$scope.selectTask = function(task) {
		$log.debug('TaskListCtrl: task selected');
		$log.debug(task);
		$scope.selected = {task: task};
		$scope.form_mode = 'show';
		$(edit_form_element).modal('show');
	};
	$scope.editTask = function(event,task){
		event.stopPropagation();
		$scope.selectTask(task);
		$scope.form_mode = 'edition';
	};
	$scope.removeTask = function(event,task) {
		event.stopPropagation();
		$scope.selected = {task: task};
		$scope.form_mode = 'deletion';
		$(delete_modal_element).modal('show');
	};
	$scope.updateTask = function(task) {
		$log.debug('TaskListCtrl: task update');
		angular.forEach($scope.todo_list, function(item, key) {
			if(item.id == task.id){
				$scope.todo_list[key] = angular.copy(task);
				$scope.selected.task = task;
			}
		});
	};
	$scope.deleteTask = function(task) {
		angular.forEach($scope.todo_list, function(item, key) {
			if(item.id == task.id){
				$scope.todo_list.splice(key,1);
			}
		});
	};
});

app.directive('task', function(){
	return {
		restrict: 'E',
		templateUrl: '../partials/task.html'
	}
});

app.directive('editform',function($log,$timeout){
	return {
		restrict: 'E',
		scope: {
			selected: '=selectedData',
			form_mode: '=formMode',
			onUpdate: '&',
			onDelete: '&',
			onSave: '&'
		},
		templateUrl: '../partials/editform.html',
		link: function(scope, element, attrs){
			scope.$watch('selected', function(new_selected){
				$log.debug('Edit form: selected changed');
				$log.debug(scope.selected);
				if(scope.selected !== undefined){
					scope.current_task = angular.copy(scope.selected.task);
					// scope.mode_editable = scope.change?true:false;
				}
			}, true);

			scope.cancel = function(){
				$log.debug('Edit form: cancel');
				scope.form_mode = 'show';
				scope.current_task = angular.copy(scope.selected.task);
			};

			scope.edit = function(){
				$log.debug('Edit form: edit');
				scope.form_mode = 'edition';
				scope.current_task = angular.copy(scope.selected.task);
			};

			scope.update = function(){
				$log.debug('Edit form: update');
				$log.debug(scope.current_task);
				scope.onUpdate({task: scope.current_task});
				scope.form_mode = 'show';
				scope.showFlashMessage();
			};

			scope.delete = function(){
				$log.debug('Edit form: delete');
				$(delete_modal_element).modal('show');
			};

			scope.deleteConfirm = function(){
				$log.debug('Edit form: deletion confirmed');
				scope.onDelete({task: scope.selected.task});
				scope.current_task = undefined;
			};

			scope.reset = function(){
				// scope.current_task.title = '';
				// scope.current_task.content = '';
			};

			scope.save = function(){
				scope.onSave({task: scope.current_task});
				scope.current_task = {};
			};

			scope.showFlashMessage = function(){
				// scope.flash_msg.className += ' '+ 'active';
				// $timeout(function(){
				// 	scope.flash_msg.className = scope.flash_msg.className.replace(new RegExp(' active',"gi"),'');
				// },1500);
				
				$('.flash-msg').show().addClass('active');
				$timeout(function(){
					$('.flash-msg').removeClass('active').hide();
				},1500);
			};
		}
	}
});