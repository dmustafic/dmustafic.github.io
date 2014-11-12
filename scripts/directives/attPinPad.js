'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSdkApp.directive:attpinpad
 * @description
 * # attpinpad
 */
angular.module('connectedCarSDK.attPinPad', [])
    .factory('$pinPad', ['$rootScope', '$compile', '$document', function ($rootScope, $compile, $document) {

        return {

            show: function (options) {

                // first remove any existing pinPad elements from DOM
                var pinPadDomEl = $document.find('body').find('att-pin-pad');
                if (pinPadDomEl)
                    pinPadDomEl.remove();

                var angularDomEl = angular.element('<att-pin-pad ng-model="ngModel" on-confirm="onConfirm(ngModel)"></att-pin-pad>');
                angularDomEl.attr({
                    'num-digits': options.numDigits
                });

                var pinPadScope = $rootScope.$new(false);
                pinPadScope.ngModel = options.ngModel || '';
                pinPadScope.onConfirm = options.onConfirm ? options.onConfirm : null;
                
                pinPadDomEl = $compile(angularDomEl)(pinPadScope);
                
                $document.find('body').eq(0).append(pinPadDomEl);
            },

            close: function() {
                var pinPadDomEl = $document.find('body').find('att-pin-pad');
                if (pinPadDomEl)
                    pinPadDomEl.remove();
            }

        };
    }])
    .directive('attPinPad', function() {
        return {
            templateUrl: 'templates/attPinPad.html',
            restrict: 'EA',
            scope: {
                numDigits: '@',
                ngModel: '=',
                onConfirm: '&'
            },
            link: function(scope, element, attrs) {

                // if model is undefined, set to empty string
                if (!scope.ngModel) {
                    scope.ngModel = '';
                }

                // if number of digits is undefined, default is 4 digits for pin number
                var numberOfDigits = 4;
                if (scope.numDigits) {
                    numberOfDigits = scope.numDigits;
                }

                scope.backspace = function () {
                    if (scope.ngModel && scope.ngModel.length > 0) {
                        scope.ngModel = scope.ngModel.slice(0, -1);
                    }
                };

                scope.appendToPin = function (val) {
                    if (val>=0 && scope.ngModel.length < numberOfDigits)
                        scope.ngModel += val.toString();
                };

                scope.isDisabled = function() {
                    if (scope.ngModel.length < numberOfDigits)
                        return true;
                    else return false;
                };
            }
        };
    });
