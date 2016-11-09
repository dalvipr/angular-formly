(function() {
    'use strict';
    var app = angular.module('formlyExample', ['formly', 'formlyBootstrap']);
    app.controller('MainCtrl', function MainCtrl($scope, formlyVersion) {
        var vm = this;

        vm.onSubmit = onSubmit;

        vm.exampleTitle = 'Form State'; // add this
        vm.env = {
            angularVersion: angular.version.full,
            formlyVersion: formlyVersion
        };
        vm.model = {};
        vm.options = {

        };
        vm.checkboxField = {
            key: 'disabled',
            type: 'checkbox',
            templateOptions: {
                label: 'formState.disabled'
            }
        };
        vm.fields = [
            {
                key: 'text',
                type: 'input',
                templateOptions: {
                    label: 'First Name'
                }
            },
            {
                key: 'text',
                type: 'input',
                templateOptions: {
                    label: 'Last Name'
                }
            },
            {
                key: 'text',
                type: 'input',
                templateOptions: {
                    label: 'Email'
                }
            },
            {
                key: 'text',
                type: 'input',
                templateOptions: {
                    label: 'Phone',
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
    });
})();