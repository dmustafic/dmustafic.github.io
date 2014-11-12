'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSDK.badge.directive:attbadge
 * @description
 * # attBadge
 */
angular.module('connectedCarSDK.attBadge', [])
  .directive('attBadge', function () {
      return {
          templateUrl: 'templates/attBadge.html',
          restrict: 'E',
          replace: true,
          scope: {
              value: "@",
              badgeType: "@"
          },
          link: function (scope, element, attrs) {
              var a = 5;
              // sejo
              // ramiz
          }
      };
  });
