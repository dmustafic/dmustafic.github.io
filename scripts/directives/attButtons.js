'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSDK.buttons.directive:attBtnRadio, attBtnCheckbox
 * @description
 * # attButtons
 */
angular.module('connectedCarSDK.attButtons', [])
  .constant('buttonConfig', {
      activeClass: 'active',
      toggleEvent: 'click'
  })

.controller('ButtonsController', ['buttonConfig', function (buttonConfig) {
    this.activeClass = buttonConfig.activeClass || 'active';
    this.toggleEvent = buttonConfig.toggleEvent || 'click';
}])

.directive('attBtnRadio', function () {
    return {
        require: ['attBtnRadio', 'ngModel'],
        controller: 'ButtonsController',
        link: function (scope, element, attrs, ctrls) {
            var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

            //model -> UI
            ngModelCtrl.$render = function () {
                element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.attBtnRadio)));
            };

            //ui->model
            element.bind(buttonsCtrl.toggleEvent, function () {
                var isActive = element.hasClass(buttonsCtrl.activeClass);

                if (!isActive || angular.isDefined(attrs.uncheckable)) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.attBtnRadio));
                        ngModelCtrl.$render();
                    });
                }
            });
        }
    };
})

.directive('attBtnCheckbox', function () {
    return {
        require: ['attBtnCheckbox', 'ngModel'],
        controller: 'ButtonsController',
        link: function (scope, element, attrs, ctrls) {
            var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

            function getTrueValue() {
                return getCheckboxValue(attrs.attBtnCheckboxTrue, true);
            }

            function getFalseValue() {
                return getCheckboxValue(attrs.attBtnCheckboxFalse, false);
            }

            function getCheckboxValue(attributeValue, defaultValue) {
                var val = scope.$eval(attributeValue);
                return angular.isDefined(val) ? val : defaultValue;
            }

            //model -> UI
            ngModelCtrl.$render = function () {
                element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
            };

            //ui->model
            element.bind(buttonsCtrl.toggleEvent, function () {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
                    ngModelCtrl.$render();
                });
            });
        }
    };
});
