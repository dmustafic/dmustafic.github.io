'use strict';

angular.module('driveStudioHU.providers')
  .provider('$error', [function () {

      var $errorProvider = {
          $get: ['$rootScope', '$compile', '$document', function ($rootScope, $compile, $document) {

              var $error = {};

              $error.show = function (options) {
                  var angularDomEl = angular.element('<att-alert type="danger">' + options.message + '</att-alert>');
                  angularDomEl.attr({
                      'title': options.title ? options.title : 'An error occured',
                      'show-icon': true,
                      'on-close': options.onClose ? options.onClose() : null,
                      'auto-close-interval': options.autoCloseInterval ? options.autoCloseInterval : null,
                  });

                  var errorDomEl = $compile(angularDomEl)($rootScope.$new());
                  $document.find('body').eq(0).append(errorDomEl);
              };

              return $error;

          }]
      };

      return $errorProvider;

  }]);
