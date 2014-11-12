'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSDK.toggleSwitch.directive:attToggleSwitch
 * @description
 * # attToggleSwitch
 */
angular.module('connectedCarSDK.attToggleSwitch', [])
  .directive('attToggleSwitch', function () {
      return {
          templateUrl: 'templates/attToggleSwitch.html',
          restrict: 'E',
          scope: {
              ngModel: '=',
              onChange: '&'
          },
          require: '^ngModel',
          link: function (scope, element, attrs) {

              if (angular.isDefined(attrs.disabled) && (attrs.disabled == "true" || attrs.disabled == "")) {
                  element.find('*').attr('disabled', 'disabled');
              }

              scope.click = function(enabled) {
                  scope.ngModel = enabled;
              };

              scope.$watch('ngModel', function (newValue, oldValue) {
                  if (angular.isDefined(oldValue) && newValue != oldValue)
                      scope.onChange();
              });

          }
      };
  });
