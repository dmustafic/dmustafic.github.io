'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSDK.loader.directive:attLoader
 * @description
 * # attLoader
 */
angular.module('connectedCarSDK.attLoader', [])
  .directive('attLoader', ['$http', function ($http) {
      return {
          restrict: 'E',
          replace: true,
          templateUrl: 'templates/attLoader.html',
          link: function (scope, element, attrs) {

              scope.isLoading = function () {
                  return $http.pendingRequests.length > 0;
              };

              scope.$watch(scope.isLoading, function (v) {
                  if (v) {
                      element.css("display", "flex");
                  } else {
                      element.css("display", "none");
                  }
              });

          }
      };
  }]);
