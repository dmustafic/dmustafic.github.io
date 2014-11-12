'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSDK.attHeader.directive:attHeader
 * @description
 * # attHeader
 */
angular.module('connectedCarSDK.attHeader', [])
    .factory('$header', ['$rootScope', '$interval', function ($rootScope, $interval) {
        return {
            showBackButton: function (show, callback) {
                var that = this,
                    backButtonInterval;
                this.backButtonInterval = $interval(function () {
                    $rootScope.$broadcast('showBackButton', [show, callback, function () {
                        $interval.cancel(that.backButtonInterval);
                    }]);
                }, 100);
            }
        };
    }])
    .directive('attHeader', [
        '$rootScope', function ($rootScope) {
            return {
                restrict: 'E',
                templateUrl: 'templates/attHeader.html',
                replace: true,
                scope: {
                    appName: '=',
                    currentItem: '=',
                    appImage: '@',
                    showBackButton: '=',
                    backButtonCallback: '&'
                },
                link: function (scope, element, attrs) {

                    scope.backButton = scope.showBackButton ? scope.showBackButton : false;
                    scope.backCallback = scope.backButtonCallback ? scope.backButtonCallback : null;

                    scope.openMenu = function () {
                        $rootScope.$broadcast('changeDrawer', [true]);
                    };

                    $rootScope.$on('showBackButton', function (event, args) {
                        scope.backButton = args[0];
                        scope.backCallback = args[1];
                        args[2]();
                    });

                }
            };
        }
    ]);
