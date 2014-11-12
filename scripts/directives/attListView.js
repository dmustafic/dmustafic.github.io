'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSdkApp.directive:attlistview
 * @description
 * # attlistview
 */
angular.module('connectedCarSDK.attListView', [])
    .directive('attListView', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/attListView.html',
            replace: true,
            
            scope: {
                items: '=',         // list of objects to bind {text, desc, selected}
                title: '=',         // string
                multiSelect: '='    // true/false
            },
            link: function (scope, element, attrs) {

                scope.onItemClick = function(item) {

                    console.log("Selected item ", item);

                    if (item.selected) {
                        item.selected = false;
                    } else {
                        if (scope.items) {
                            scope.items.forEach(function(i) {
                                if (i == item) {
                                    i.selected = true;
                                } else {
                                    if (scope.multiSelect != true) {
                                        i.selected = false;
                                    }
                                }
                            });
                        }
                    }
                };

            }
        };
    });
