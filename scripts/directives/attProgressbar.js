'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSDK.progressbar.directive:attProgressBar
 * @description
 * # attprogressbar
 */
angular.module('connectedCarSDK.attProgressBar', [])
 .constant('progressConfig', {
     animate: true,
     max: 100,
     min: 0
 })

.controller('ProgressController', ['$scope', '$attrs', 'progressConfig', function ($scope, $attrs, progressConfig) {
    var self = this,
        animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

    this.bars = [];
    $scope.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : progressConfig.max;
    $scope.min = angular.isDefined($attrs.min) ? $scope.$parent.$eval($attrs.min) : progressConfig.min;
    $scope.textLeft = angular.isDefined($attrs.textLeft) ? $scope.$parent.$eval($attrs.textLeft) : progressConfig.textLeft;
    $scope.textRight = angular.isDefined($attrs.textRight) ? $scope.$parent.$eval($attrs.textRight) : progressConfig.textRight;

    this.addBar = function (bar, element) {
        if (!animate) {
            element.css({ 'transition': 'none' });
        }

        this.bars.push(bar);

        bar.$watch('value', function (value) {
            bar.percent = +(100 * value / $scope.max).toFixed(2);
        });

        bar.$on('$destroy', function () {
            element = null;
            self.removeBar(bar);
        });
    };

    this.removeBar = function (bar) {
        this.bars.splice(this.bars.indexOf(bar), 1);
    };
}])

.directive('attProgressBar', function () {
    return {
        restrict: 'EA',
        replace: true,
        controller: 'ProgressController',
        scope: {
            value: '=',
            type: '@'
        },
        templateUrl: 'templates/attProgressBar.html',
        link: function (scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, angular.element(element.children()[0]));
        }
    };
});
