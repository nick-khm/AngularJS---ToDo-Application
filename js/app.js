var edit_form_element = '#editform-modal';
var delete_modal_element = '#deletion-confirm';

var app = angular.module('App',[]);

app.config(['$logProvider', function($logProvider){
    $logProvider.debugEnabled(true);
}]);

app.controller('TaskListCtrl', function($scope,$log){
	$scope.todo_list = [{id:1,title:'first'},{id:2,title:'second'}];
	
	$scope.createTask = function() {
		$scope.selectTask({});
		$scope.form_mode = 'creation';
	};
	$scope.saveTask = function() {

	};
	$scope.selectTask = function(task) {
		$log.debug('TaskListCtrl: task selected');
		$log.debug(task);
		$scope.selected = {task: task};
		$scope.editable = false;
		$scope.creation = false;
		$(edit_form_element).modal('show');
	};
	$scope.editTask = function(event,task){
		event.stopPropagation();
		$scope.selectTask(task);
		$scope.editable = true;
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
	$scope.removeTask = function(event,task) {
		event.stopPropagation();
		$scope.selected = {task: task};
		$(delete_modal_element).modal('show');
	};
	$scope.deleteTask = function(task) {
		angular.forEach($scope.todo_list, function(item, key) {
			if(item.id == task.id){
				$scope.todo_list.splice(key,1);
			}
		});
	}
});

app.directive('task', function(){
	return {
		restrict: 'E',
		templateUrl: '../partials/task.html'
	}
});

app.directive('editform',function($log){
	return {
		restrict: 'E',
		scope: {
			selected: '=selectedData',
			mode_editable: '=modeEditable',
			onUpdate: '&',
			onDelete: '&'
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
				scope.mode_editable = false;
				scope.current_task = angular.copy(scope.selected.task);
			};

			scope.edit = function(){
				$log.debug('Edit form: edit');
				scope.mode_editable = true;
			};

			scope.update = function(){
				$log.debug('Edit form: update');
				$log.debug(scope.current_task);
				scope.onUpdate({task: scope.current_task});
				scope.mode_editable = false;
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
		}
	}
});