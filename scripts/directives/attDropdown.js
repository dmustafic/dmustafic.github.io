'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSDK.dropdown.directive:attDropdown
 * @description
 * # attDropdown
 */
angular.module('connectedCarSDK.attDropdown', [])
    .directive('attDropdown', [
        '$timeout', function($timeout) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'templates/attDropdown.html',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    defaultOption: '@',
                    items: '=',
                    closeButton: '@'
                },
                link: function(scope, element, attrs) {

                    scope.show = false;

                    if (scope.ngModel != null && scope.ngModel != undefined) {
                        $timeout(function() {
                            scope.defaultOption = scope.ngModel.text;
                        });
                    }

                    scope.selectItem = function(item) {
                        scope.ngModel = item;
                        scope.defaultOption = scope.ngModel.text;
                        scope.show = false;
                    };
                }
            };
        }
    ]);