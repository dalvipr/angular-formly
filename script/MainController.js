/**
 * Created by dalvi on 11/2/2016.
 */
(function() {
	'use strict';
	var app = angular.module('formlyApp', ['formly', 'formlyBootstrap', 'ngRoute']);

	app.config(function ($routeProvider) {
		$routeProvider

			.when('/',  {
				templateUrl:'pages/home.html',
				controller: 'MainController'
			})

			.when('/bgCheck', {
				templateUrl: 'pages/backgroundCheck.html',
				controller: 'bgCheck'
			})
			.when('/hello', {
				templateUrl: 'pages/hello.html',
				controller: 'hello'
			})
	});

	app.controller('hello', ['$scope', function ($scope) {
		console.log("Welcome Pratik");
	}]);
	app.controller('MainController', ['$scope', 'formlyVersion', function MainCtrl($scope, formlyVersion) {
		var vm = this;
		// funcation assignment
		/*vm.onSubmit = onSubmit;*/
		// variable assignment



		vm.model = {};
		vm.options = {
			formState: {
				disabled: false
			}
		};

		vm.fields = [
			{
				key: 'first_name',
				type: 'input',
				templateOptions: {
					label: 'First Name'
				}
			},
			{
				key: 'last_name',
				type: 'input',
				templateOptions: {
					label: 'Last Name'
				}
			},
			{
				key: 'email',
				type: 'input',
				templateOptions: {
					type: 'email',
					label: 'Email'
				}
			},
			{
				key: 'phone',
				type: 'input',
				templateOptions: {
					type: 'number',
					label: 'Phone'
				}
			}
		];
		// apply expressionProperty for disabled based on formState to all fields
		angular.forEach(vm.fields, function(field) {
			field.expressionProperties = field.expressionProperties || {};
			field.expressionProperties['templateOptions.disabled'] = 'formState.disabled';
		});
		// watch formState because angular-formly isn't doing this for us
		// yet.... https://github.com/formly-js/angular-formly/issues/270
		$scope.$watch('vm.options.formState', function() {
			angular.forEach(vm.fields, function(field) {
				field.runExpressions && field.runExpressions();
			});
		}, true);
		vm.originalFields = angular.copy(vm.fields);
		// function definition
		function onSubmit() {
			vm.options.updateInitialValue();
			alert(JSON.stringify(vm.model), null, 2);
		}
	}] );
	

	
	app.controller('bgCheck', ['$scope', 'formlyVersion', function bgCheck($scope, formlyVersion ) {
		var vm = this;

		vm.model = {};
		vm.options = {
			formState: {
				disabled: false
			}
		};

		vm.fields = [
			{
				key: 'current_address_line_1',
				type: 'input',
				templateOptions: {
					label: 'Current Address'
				}
			},
			{
				key: 'current_address_line_2',
				type: 'input',
				templateOptions: {
					label: 'Apartment'
				}
			},
			{
				key: 'city',
				type: 'input',
				templateOptions: {
					label: 'City'
				}
			},
			{
				key: 'state',
				type: 'input',
				templateOptions: {
					label: 'State'
				}
			},
			{
				key: 'zip_code',
				type: 'input',
				templateOptions: {
					type: 'number',
					label: 'Zip-Code'
				}
			}
		];
	}] );
})();