'use strict';

/**
 * @ngdoc directive
 * @name connectedCarSdk.alert.directive:attAlert
 * @description
 * # attAlert
 */
angular.module('connectedCarSDK.attAlert', [])
     .constant('alertConfig', {
         type: 'info',
         max: 100,
         min: 0
     })
    .factory('alertProvider', ['$timeout', 'alertConfig', function ($timeout, alertConfig) {
        return {
            alerts: [],
            timeoutPromise: null,

            addAlert: function(scope) {

                scope.alert = {
                    type: angular.isDefined(scope.type) ? scope.type : alertConfig.type,
                    onClose: angular.isDefined(scope.onClose) ? scope.onClose : null,
                    onClick: angular.isDefined(scope.onClick) ? scope.onClick : null,
                    showIcon: angular.isDefined(scope.showIcon) ? scope.showIcon : false,
                    showConfirmationBtn: angular.isDefined(scope.showConfirmationBtn) ? scope.showConfirmationBtn : false,
                    buttonText: angular.isDefined(scope.buttonText) ? scope.buttonText : '',
                    autoCloseInterval: angular.isDefined(scope.autoCloseInterval) ? scope.autoCloseInterval : null,
                    title: angular.isDefined(scope.title) ? scope.title : '',
                };

                if (this.alerts.length == 0)
                    scope.alert.isActive = true;

                this.alerts.push(scope.alert);
            },

            removeActiveAlert: function() {
                this.alerts[0].isActive = false;
                this.alerts.splice(0, 1);

                if (this.alerts.length > 0)
                    this.alerts[0].isActive = true;
            },

            closeAlert: function() {
                
                    if (this.timeoutPromise)
                        $timeout.cancel(this.timeoutPromise);

                    this.alerts[0].onClose();
                    this.removeActiveAlert();
                

                this.handleAutoClose();
            },

            handleAutoClose: function() {
                if (this.alerts[0] && this.alerts[0].autoCloseInterval && parseInt(this.alerts[0].autoCloseInterval) > 0) {
                    var that = this;
                    this.timeoutPromise = $timeout(function() {
                        that.closeAlert();
                    }, this.alerts[0].autoCloseInterval);
                }
            }
        };
    }])
    .factory('$alert', ['$rootScope', '$compile', '$document', function ($rootScope, $compile, $document) {

        return {
            
            show: function(options) {
                var angularDomEl = angular.element('<att-alert on-close="onClose()" on-click="onClick()">' + options.text + '</att-alert>');
                angularDomEl.attr({
                    'type': options.type,
                    'title': options.title,
                    'show-icon': options.showIcon,
                    'show-confirmation-btn': options.showConfirmationBtn,
                    'button-text': options.buttonText,
                    'auto-close-interval': options.autoCloseInterval ? options.autoCloseInterval : null,
                });

                var alertScope = $rootScope.$new(false);
                alertScope.onClose = options.onClose ? options.onClose : null;
                alertScope.onClick = options.onClick ? options.onClick : null;
                
                var alertDomEl = $compile(angularDomEl)(alertScope);
                $document.find('body').eq(0).append(alertDomEl);
            },

            info: function(options) {
                options.type = 'info';
                this.show(options);
            },

            success: function(options) {
                options.type = 'success';
                this.show(options);
            },

            danger: function(options) {
                options.type = 'danger';
                this.show(options);
            }

        };
    }])
    .directive('attAlert', [
         'alertProvider', function (alertProvider) {
             return {
                 restrict: 'AE',
                 templateUrl: 'templates/attAlert.html',
                 replace: true,
                 transclude: true,
                 scope: {
                     type: '@',
                     showIcon: '=',
                     showConfirmationBtn: '=',
                     buttonText: '@',
                     onClick: '&',  // click on confirmation button
                     onClose: '&',
                     autoCloseInterval: '=',
                     title: '@',
                     text: '@'
                 },
                 link: function (scope, element, attrs) {

                     alertProvider.addAlert(scope);

                     if (scope.alert.isActive)
                         alertProvider.handleAutoClose();

                     scope.close = function () {
                         // if there is no confirmation button
                         // tapping anywhere on the alert will close the alert
                         // otherwise, you must dismiss the alert by clicking
                         // on the confirmation button
                         if (!scope.showConfirmationBtn) {
                             alertProvider.closeAlert();
                         }
                     };

                     scope.btnClick = function() {
                         scope.onClick();
                         alertProvider.closeAlert();
                     };

                 }
             };

         }
    ]);
