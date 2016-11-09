/**
 * Created by dalvi on 11/2/2016.
 */
(function () {
    'use strict';
    
    var myApp = angular.module('myApp', ['ngRoute', 'formly','ngMask', 'formlyBootstrap', 'ngMessages']);

    myApp.run(function(formlyConfig, formlyValidationMessages) {
        formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';

        formlyValidationMessages.addStringMessage('required', 'This field is required');
        formlyValidationMessages.addStringMessage('type', 'This field contains invalid characters');


        formlyConfig.setType({
            name: 'maskedInput',
            extends: 'input',
            defaultOptions: {
                ngModelAttrs: { // this is part of the magic... It's a little complex, but super powerful
                    mask: { // the key "ngMask" must match templateOptions.ngMask
                        attribute: 'mask' // this the name of the attribute to be applied to the ng-model in the template
                    },
                    // applies the 'clean' attribute with the value of "true"
                    'true': {
                        value: 'clean'
                    }
                },
                // this is how you hook into formly's messages API
                // however angular-formly doesn't ship with ng-messages.
                // You have to display these messages yourself.
                validation: {
                    messages: {
                        mask: '"Invalid input"'
                    }
                }
            }
        });

        formlyConfig.setType({
            name: 'alphaNum',
            extends: 'input',
            defaultOptions: {
                validators: {
                    alphaNum: function ($viewValue, $modelValue, scope) {
                        var value = $modelValue || $viewValue, $parent = scope.$parent, data = $parent.options.data || {};
                        if (data.modelField && data.modelValue && $parent.model[data.modelField] === data.modelValue) {
                            if (data.regExValue) {
                                //console.log('data.regExValue: ' + data.regExValue);
                                var regex = new RegExp(data.regExValue.replace('\\', ''), 'i');
                                return (!value) ? false : regex.test(value);
                            }  else {
                                return (!value) ? false : /^[0-9]{10}(\-[0-9]{2})$/.test(value);
                            }
                        } else {
                            return (!value) ? false : /^[a-zA-Z0-9-_ ]+$/.test(value);
                        }
                    }
                },
                validation: {
                    messages: {
                        alphaNum: function (viewValue, modelValue, scope) {
                            var $parent = scope.$parent, data = $parent.options.data || {};
                            if (data.modelField && data.modelValue && $parent.model[data.modelField] === data.modelValue) {
                                return viewValue + ' is not a valid ' + data.modelValue + ' value';
                            } else {
                                return viewValue + ' is not a valid Alphanumeric value';
                            }
                        }
                    }
                }
            }
        });

        formlyConfig.setType({
            name: 'alphabet',
            extends: 'input',
            defaultOptions: {
                validators: {
                    alphabet: {
                        expression: function ($viewValue, $modelValue) {
                            var value = $modelValue || $viewValue;
                            return (!value) ? true : /^[a-zA-Z\-_ ']+$/.test(value);
                        },
                        message: '$viewValue + " contains invalid characters"'
                    }
                },
                validation: {
                    messages: {
                        alphabet: function (viewValue, modelValue, scope) {
                            return viewValue + ' contains invalid characters';
                        }
                    }
                }
            }
        });
    });











    myApp.config(function (formlyConfigProvider) {

        formlyConfigProvider.setWrapper({
            name: 'validation',
            types: ['input', 'maskedInput', 'alphabet', 'alphaNum'],
            templateUrl: 'error-messages.html'
        });

    });

    myApp.config(function ($routeProvider) {
        $routeProvider

            .when('/', {
                templateUrl:'pages/home.html',
                controller: 'mainController as vm'
            })
            .when('/hello', {
                templateUrl: 'pages/hello.html',
                controller: 'helloController as vm'
            })

            .when('/thanks', {
                templateUrl: 'pages/backgroundCheck.html',
                controller : 'thanksController as vm'
            })
    });

    myApp.controller('thanksController', ['$scope', '$filter', function ($scope, $filter) {

        $scope.thanks = 'Thank You for Form Submission';
    }]);
    myApp.controller('mainController', ['$scope', '$filter', function ($scope, $filter) {

        var vm = this;
        vm.onSubmit = onSubmit;
        vm.model = {};
        vm.options = {
            formState: {
                disabled: false
            }
        };

        vm.fields = [
            {
                key: 'first_name',
                type: 'alphabet',
                "className": "col-xs-12 col-sm-12 col-md-8 col-lg-8",
                templateOptions: {
                    label: 'First Name',
                    maxlength : 15,
                    required: true
                }
            },
            {
                key: 'last_name',
                type: 'alphabet',
                "className": "col-xs-12 col-sm-12 col-md-8 col-lg-8",
                templateOptions: {
                    label: 'Last Name',
                    required: true
                }
            },
            {
                key: 'email',
                type: 'input',
                "className": "col-xs-12 col-sm-12 col-md-8 col-lg-8",
                templateOptions: {
                    type: 'email',
                    label: 'Email',
                    required: true
                }
            },
            {
                key: 'phone',
                type: 'maskedInput',
                "className": "col-xs-12 col-sm-12 col-md-8 col-lg-8",
                templateOptions: {
                    label: 'Phone',
                    mask: '999-999-9999',
                    required: true
                }

            }
        ];
        function onSubmit() {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                alert(JSON.stringify(vm.model), null, 2);
            }
        }

    }]);


    myApp.controller('helloController', ['$scope', function ($scope) {

        var vm = this;
        vm.onSubmit = onSubmit;
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
                "className": "col-xs-12 col-sm-12 col-md-8 col-lg-8",
                templateOptions: {
                    label: 'Current Address',
                    required: true,
                    maxlength: 10
                }
            },
            {
                key: 'current_address_line_2',
                type: 'input',
                "className": "col-xs-12 col-sm-12 col-md-8 col-lg-8",
                templateOptions: {
                    label: 'Apartment',
                    required: true
                }
            },
            {
                key: 'city',
                type: 'alphabet',
                "className": "col-xs-12 col-sm-12 col-md-8 col-lg-8",
                templateOptions: {
                    label: 'City',
                    required: true
                }
            },
            {
                key: 'state',
                type: 'alphabet',
                "className": "col-xs-12 col-sm-12 col-md-8 col-lg-8",
                templateOptions: {
                    type: 'alphabet',
                    label: 'State',
                    required: true
                }
            },
            {
                key: 'zip_code',
                type: 'maskedInput',
                "className": "col-xs-12 col-sm-12 col-md-8 col-lg-8",
                templateOptions: {
                    type: 'maskedInput',
                    label: 'Zip-Code',
                    required: true,
                    maxlength : 5,
                    mask : '99999'
                }
            }
        ];
        function onSubmit() {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                alert(JSON.stringify(vm.model), null, 2);
            }
        }
    }])
})();
