'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSdkApp.directive:attdrawer
 * @description
 * # attdrawer
 */
angular.module('connectedCarSDK.attDrawer', [])
    .directive('attDrawer', [
        '$rootScope', '$timeout', function ($rootScope, $timeout) {
            return {
                restrict: 'E',
                templateUrl: 'templates/attDrawer.html',
                transclude: true,
                scope: {},
                link: function(scope, element, attrs) {

                    scope.showDrawer = false;

                    scope.closeDrawer = function() {
                        scope.showDrawer = false;
                    };

                    $rootScope.$on('changeDrawer', function(event, args) {
                        scope.showDrawer = args[0];
                    });
                }
            };
        }
    ]);
