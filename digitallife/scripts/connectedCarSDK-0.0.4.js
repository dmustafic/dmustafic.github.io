angular.module('connectedCarSDK', [
	'connectedCarSdk.transition',
	'connectedCarSDK.attAlert',
	'connectedCarSDK.attBadge',
	'connectedCarSDK.attButtons',
	'connectedCarSDK.attCarousel',
	'connectedCarSDK.attDrawer',
	'connectedCarSDK.attDropdown',
	'connectedCarSDK.attHeader',
	'connectedCarSDK.attListView',
	'connectedCarSDK.attLoader',
	'connectedCarSDK.attMenu',
	'connectedCarSDK.attModal',
	'connectedCarSDK.attProgressBar',
	'connectedCarSDK.attTab',
	'connectedCarSDK.attTabset',
	'connectedCarSDK.attToggleSwitch']);

angular.module('connectedCarSdk.transition', [])
.factory('$transition', ['$q', '$timeout', '$rootScope', function ($q, $timeout, $rootScope) {

    var $transition = function (element, trigger, options) {
        options = options || {};
        var deferred = $q.defer();
        var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

        var transitionEndHandler = function (event) {
            $rootScope.$apply(function () {
                element.unbind(endEventName, transitionEndHandler);
                deferred.resolve(element);
            });
        };

        if (endEventName) {
            element.bind(endEventName, transitionEndHandler);
        }

        // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
        $timeout(function () {
            if (angular.isString(trigger)) {
                element.addClass(trigger);
            } else if (angular.isFunction(trigger)) {
                trigger(element);
            } else if (angular.isObject(trigger)) {
                element.css(trigger);
            }
            //If browser does not support transitions, instantly resolve
            if (!endEventName) {
                deferred.resolve(element);
            }
        });

        // Add our custom cancel function to the promise that is returned
        // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
        // i.e. it will therefore never raise a transitionEnd event for that transition
        deferred.promise.cancel = function () {
            if (endEventName) {
                element.unbind(endEventName, transitionEndHandler);
            }
            deferred.reject('Transition cancelled');
        };

        return deferred.promise;
    };

    // Work out the name of the transitionEnd event
    var transElement = document.createElement('trans');
    var transitionEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'transition': 'transitionend'
    };
    var animationEndEventNames = {
        'WebkitTransition': 'webkitAnimationEnd',
        'MozTransition': 'animationend',
        'OTransition': 'oAnimationEnd',
        'transition': 'animationend'
    };
    function findEndEventName(endEventNames) {
        for (var name in endEventNames) {
            if (transElement.style[name] !== undefined) {
                return endEventNames[name];
            }
        }
    }
    $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
    $transition.animationEndEventName = findEndEventName(animationEndEventNames);
    return $transition;
}]);

angular.module('connectedCarSDK.attAlert', [])
    .directive('attAlert', [
        '$timeout', function($timeout) {

            return {
                restrict: 'AE',
                templateUrl: '/templates/attAlert.html',
                transclude: true,
                replace: true,
                scope: {
                    type: '=',                  // info, success, danger
                    showIcon: '=',              // true/false (if showConfirmationBtn is set to true, icon will not be shown)
                    showConfirmationBtn: '=',   // true/false (takes precedence over icon)
                    buttonText: '=',            // string
                    onClick: '&',               // function/callback for confirmation button click
                    onClose: '&',               // function/callback for when the alert is closed
                    autoCloseInterval: '=',     // in miliseconds
                    title: '=',                 // string
                    text: '='                   // string
                },
                link: function(scope, element, attrs) {

                    console.log('Show Confirmation Button', scope.showConfirmationBtn);
                    console.log('Button Text', scope.buttonText);
                    console.log('Alert Text', scope.text);

                    var timeoutPromise;
                    if (scope.autoCloseInterval && parseInt(scope.autoCloseInterval) > 0) {

                        timeoutPromise = $timeout(function() {

                            scope.closeAlert = true;
                            scope.close();

                        }, scope.autoCloseInterval);

                    }

                    scope.close = function () {

                        // if there is no confirmation button
                        // tapping anywhere on the alert will close the alert
                        // otherwise, you must dismiss the alert by clicking
                        // on the confirmation button
                        if (scope.showConfirmationBtn != true) {

                            if (timeoutPromise)
                                $timeout.cancel(timeoutPromise);

                            scope.closeAlert = true;
                            scope.onClose();

                        }
                    };

                }
            };

        }
    ]);


angular.module('connectedCarSDK.attBadge', [])
  .directive('attBadge', function () {
      return {
          templateUrl: '/templates/attBadge.html',
          restrict: 'E',
          replace: true,
          scope: {
              value: "@"
          },
          link: function (scope, element, attrs) {
          }
      };
  });

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

angular.module('connectedCarSDK.attCarousel', ['connectedCarSdk.transition'])
.controller('CarouselController', ['$scope', '$timeout', '$transition', '$animate', function ($scope, $timeout, $transition, $animate) {
      $animate.enabled(false);
      var self = this,
        slides = self.slides = $scope.slides = [],
        currentIndex = -1,
        currentTimeout, isPlaying;
      self.currentSlide = null;

      var destroyed = false;
      /* direction: "prev" or "next" */
      self.select = $scope.select = function (nextSlide, direction) {
          var nextIndex = slides.indexOf(nextSlide);
          //Decide direction if it's not given
          if (direction === undefined) {
              direction = nextIndex > currentIndex ? 'next' : 'prev';
          }
          if (nextSlide && nextSlide !== self.currentSlide) {
              if ($scope.$currentTransition) {
                  $scope.$currentTransition.cancel();
                  //Timeout so ng-class in template has time to fix classes for finished slide
                  $timeout(goNext);
              } else {
                  goNext();
              }
          }
          function goNext() {
              // Scope has been destroyed, stop here.
              if (destroyed) { return; }
              //If we have a slide to transition from and we have a transition type and we're allowed, go
              if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
                  //We shouldn't do class manip in here, but it's the same weird thing bootstrap does. need to fix sometime
                  nextSlide.$element.addClass(direction);
                  var reflow = nextSlide.$element[0].offsetWidth; //force reflow

                  //Set all other slides to stop doing their stuff for the new transition
                  angular.forEach(slides, function (slide) {
                      angular.extend(slide, { direction: '', entering: false, leaving: false, active: false });
                  });
                  angular.extend(nextSlide, { direction: direction, active: true, entering: true });
                  angular.extend(self.currentSlide || {}, { direction: direction, leaving: true });

                  $scope.$currentTransition = $transition(nextSlide.$element, {});
                  //We have to create new pointers inside a closure since next & current will change
                  (function (next, current) {
                      $scope.$currentTransition.then(
                        function () { transitionDone(next, current); },
                        function () { transitionDone(next, current); }
                      );
                  }(nextSlide, self.currentSlide));
              } else {
                  transitionDone(nextSlide, self.currentSlide);
              }
              self.currentSlide = nextSlide;
              currentIndex = nextIndex;
              //every time you change slides, reset the timer
              restartTimer();
          }
          function transitionDone(next, current) {
              angular.extend(next, { direction: '', active: true, leaving: false, entering: false });
              angular.extend(current || {}, { direction: '', active: false, leaving: false, entering: false });
              $scope.$currentTransition = null;
          }
      };
      $scope.$on('$destroy', function () {
          destroyed = true;
      });

      /* Allow outside people to call indexOf on slides array */
      self.indexOfSlide = function (slide) {
          return slides.indexOf(slide);
      };

      $scope.next = function () {
          var newIndex = (currentIndex + 1) % slides.length;

          //Prevent this user-triggered transition from occurring if there is already one in progress
          if (!$scope.$currentTransition) {
              return self.select(slides[newIndex], 'next');
          }
      };

      $scope.prev = function () {
          var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;

          //Prevent this user-triggered transition from occurring if there is already one in progress
          if (!$scope.$currentTransition) {
              return self.select(slides[newIndex], 'prev');
          }
      };

      $scope.isActive = function (slide) {
          return self.currentSlide === slide;
      };

      $scope.$watch('interval', restartTimer);
      $scope.$on('$destroy', resetTimer);

      function restartTimer() {
          resetTimer();
          var interval = +$scope.interval;
          if (!isNaN(interval) && interval >= 0) {
              currentTimeout = $timeout(timerFn, interval);
          }
      }

      function resetTimer() {
          if (currentTimeout) {
              $timeout.cancel(currentTimeout);
              currentTimeout = null;
          }
      }

      function timerFn() {
          if (isPlaying) {
              $scope.next();
              restartTimer();
          } else {
              $scope.pause();
          }
      }

      $scope.play = function () {
          if (!isPlaying) {
              isPlaying = true;
              restartTimer();
          }
      };
      $scope.pause = function () {
          if (!$scope.noPause) {
              isPlaying = false;
              resetTimer();
          }
      };

      self.addSlide = function (slide, element) {
          slide.$element = element;
          slides.push(slide);
          //if this is the first slide or the slide is set to active, select it
          if (slides.length === 1 || slide.active) {
              self.select(slides[slides.length - 1]);
              if (slides.length == 1) {
                  $scope.play();
              }
          } else {
              slide.active = false;
          }
      };

      self.removeSlide = function (slide) {
          //get the index of the slide inside the carousel
          var index = slides.indexOf(slide);
          slides.splice(index, 1);
          if (slides.length > 0 && slide.active) {
              if (index >= slides.length) {
                  self.select(slides[index - 1]);
              } else {
                  self.select(slides[index]);
              }
          } else if (currentIndex > index) {
              currentIndex--;
          }
      };

  }])
.directive('attCarousel', [function () {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        controller: 'CarouselController',
        require: 'carousel',
        templateUrl: '/templates/carousel/carousel.html',
        scope: {
            interval: '=',
            noTransition: '=',
            noPause: '='
        }
    };
}])
.directive('attSlide', function () {
    return {
        require: '^attCarousel',
        restrict: 'EA',
        transclude: true,
        replace: true,
        templateUrl: '/templates/carousel/slide.html',
        scope: {
            active: '=?'
        },
        link: function (scope, element, attrs, carouselCtrl) {
            carouselCtrl.addSlide(scope, element);
            //when the scope is destroyed then remove the slide from the current slides array
            scope.$on('$destroy', function () {
                carouselCtrl.removeSlide(scope);
            });

            scope.$watch('active', function (active) {
                if (active) {
                    carouselCtrl.select(scope);
                }
            });
        }
    };
});

angular.module('connectedCarSDK.attDrawer', [])
    .directive('attDrawer', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: '/templates/attDrawer.html',
            transclude: true,
            link: function (scope, element, attrs) {

                scope.closeDrawer = function() {
                    $rootScope.showDrawer = false;
                };

            }
        };
    });

	
angular.module('connectedCarSDK.attDropdown', [])

.directive('attDropdown', function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/attDropdown.html',
        require: '^ngModel',
        scope: {
            ngModel: '=',
            defaultOption: '@',
            items: '=',
            closeButton: '@'
        },
        link: function (scope, element, attrs) {

            scope.show = false;
            
            if (scope.ngModel != null && scope.ngModel != undefined) {
                $timeout(function () {
                    scope.defaultOption = scope.ngModel.text;
                });
            }

            scope.selectItem = function (item){
                scope.ngModel = item;
                scope.defaultOption = scope.ngModel.text;
                scope.show = false;
            };
        }
    };
});


angular.module('connectedCarSDK.attHeader', [])
  .directive('attHeader', function () {
    return {
        restrict: 'E',
        templateUrl: '/templates/attHeader.html',
        replace: true,
        scope: {
            appName:  '=',
            currentItem: '=',
            appImage: '@'
        },
        link: function (scope, element, attrs) {
        }
    };
  });

angular.module('connectedCarSDK.attListView', [])
    .directive('attListView', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/attListView.html',
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
	
	
angular.module('connectedCarSDK.attLoader', [])
  .directive('attLoader', ['$http', function ($http) {
      return {
          restrict: 'E',
          replace: true,
          templateUrl: '/templates/attLoader.html',
          link: function (scope, element, attrs) {

              scope.isLoading = function () {
                  return $http.pendingRequests.length > 0;
              };

              scope.$watch(scope.isLoading, function (v) {
                  if (v) {
                      element.css("display", "block");
                  } else {
                      element.css("display", "none");
                  }
              });

          }
      };
  }]);

  
angular.module('connectedCarSDK.attMenu', [])
  .directive('attMenu', function () {
      return {
          templateUrl: '/templates/attMenu.html',
          restrict: 'E',
          replace: true,
          scope: {
              items: '=',         // list of objects to bind {text, desc, selected}
              title: '='          // string
          },
          link: function (scope, element, attrs) {

              scope.onItemClick = function (item) {
                  if (scope.items) {
                      scope.items.forEach(function (i) {
                          if (i == item)
                              i.selected = true;
                          else i.selected = false;
                      });
                  }
              };

          }
      };
  });

angular.module('connectedCarSDK.attModal', ['connectedCarSdk.transition'])
  /**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function () {
      return {
          createNew: function () {
              var stack = [];

              return {
                  add: function (key, value) {
                      stack.push({
                          key: key,
                          value: value
                      });
                  },
                  get: function (key) {
                      for (var i = 0; i < stack.length; i++) {
                          if (key == stack[i].key) {
                              return stack[i];
                          }
                      }
                  },
                  keys: function () {
                      var keys = [];
                      for (var i = 0; i < stack.length; i++) {
                          keys.push(stack[i].key);
                      }
                      return keys;
                  },
                  top: function () {
                      return stack[stack.length - 1];
                  },
                  remove: function (key) {
                      var idx = -1;
                      for (var i = 0; i < stack.length; i++) {
                          if (key == stack[i].key) {
                              idx = i;
                              break;
                          }
                      }
                      return stack.splice(idx, 1)[0];
                  },
                  removeTop: function () {
                      return stack.splice(stack.length - 1, 1)[0];
                  },
                  length: function () {
                      return stack.length;
                  }
              };
          }
      };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('modalBackdrop', ['$timeout', function ($timeout) {
      return {
          restrict: 'EA',
          replace: true,
          templateUrl: '/templates/modal/backdrop.html',
          link: function (scope, element, attrs) {
              scope.backdropClass = attrs.backdropClass || '';

              scope.animate = false;

              //trigger CSS transitions
              $timeout(function () {
                  scope.animate = true;
              });
          }
      };
  }])

  .directive('modalWindow', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
      return {
          restrict: 'EA',
          scope: {
              index: '@',
              animate: '='
          },
          replace: true,
          transclude: true,
          templateUrl: function (tElement, tAttrs) {
              return tAttrs.templateUrl || '/templates/modal/window.html';
          },
          link: function (scope, element, attrs) {
              element.addClass(attrs.windowClass || '');
              scope.size = attrs.size;

              $timeout(function () {
                  // trigger CSS transitions
                  scope.animate = true;

                  /**
                   * Auto-focusing of a freshly-opened modal element causes any child elements
                   * with the autofocus attribute to loose focus. This is an issue on touch
                   * based devices which will show and then hide the onscreen keyboard.
                   * Attempts to refocus the autofocus element via JavaScript will not reopen
                   * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                   * the modal element if the modal does not contain an autofocus element.
                   */
                  if (!element[0].querySelectorAll('[autofocus]').length) {
                      element[0].focus();
                  }
              });

              scope.close = function (evt) {
                  var modal = $modalStack.getTop();
                  if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
                      evt.preventDefault();
                      evt.stopPropagation();
                      $modalStack.dismiss(modal.key, 'backdrop click');
                  }
              };
          }
      };
  }])

  .directive('modalTransclude', function () {
      return {
          link: function ($scope, $element, $attrs, controller, $transclude) {
              $transclude($scope.$parent, function (clone) {
                  $element.empty();
                  $element.append(clone);
              });
          }
      };
  })

  .factory('$modalStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
    function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

        var OPENED_MODAL_CLASS = 'modal-open';

        var backdropDomEl, backdropScope;
        var openedWindows = $$stackedMap.createNew();
        var $modalStack = {};

        function backdropIndex() {
            var topBackdropIndex = -1;
            var opened = openedWindows.keys();
            for (var i = 0; i < opened.length; i++) {
                if (openedWindows.get(opened[i]).value.backdrop) {
                    topBackdropIndex = i;
                }
            }
            return topBackdropIndex;
        }

        $rootScope.$watch(backdropIndex, function (newBackdropIndex) {
            if (backdropScope) {
                backdropScope.index = newBackdropIndex;
            }
        });

        function removeModalWindow(modalInstance) {

            var body = $document.find('body').eq(0);
            var modalWindow = openedWindows.get(modalInstance).value;

            //clean up the stack
            openedWindows.remove(modalInstance);

            //remove window DOM element
            removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function () {
                modalWindow.modalScope.$destroy();
                body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
                checkRemoveBackdrop();
            });
        }

        function checkRemoveBackdrop() {
            //remove backdrop if no longer needed
            if (backdropDomEl && backdropIndex() == -1) {
                var backdropScopeRef = backdropScope;
                removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
                    backdropScopeRef.$destroy();
                    backdropScopeRef = null;
                });
                backdropDomEl = undefined;
                backdropScope = undefined;
            }
        }

        function removeAfterAnimate(domEl, scope, emulateTime, done) {
            // Closing animation
            scope.animate = false;

            var transitionEndEventName = $transition.transitionEndEventName;
            if (transitionEndEventName) {
                // transition out
                var timeout = $timeout(afterAnimating, emulateTime);

                domEl.bind(transitionEndEventName, function () {
                    $timeout.cancel(timeout);
                    afterAnimating();
                    scope.$apply();
                });
            } else {
                // Ensure this call is async
                $timeout(afterAnimating);
            }

            function afterAnimating() {
                if (afterAnimating.done) {
                    return;
                }
                afterAnimating.done = true;

                domEl.remove();
                if (done) {
                    done();
                }
            }
        }

        $document.bind('keydown', function (evt) {
            var modal;

            if (evt.which === 27) {
                modal = openedWindows.top();
                if (modal && modal.value.keyboard) {
                    evt.preventDefault();
                    $rootScope.$apply(function () {
                        $modalStack.dismiss(modal.key, 'escape key press');
                    });
                }
            }
        });

        $modalStack.open = function (modalInstance, modal) {

            openedWindows.add(modalInstance, {
                deferred: modal.deferred,
                modalScope: modal.scope,
                backdrop: modal.backdrop,
                keyboard: modal.keyboard
            });

            var body = $document.find('body').eq(0),
                currBackdropIndex = backdropIndex();

            if (currBackdropIndex >= 0 && !backdropDomEl) {
                backdropScope = $rootScope.$new(true);
                backdropScope.index = currBackdropIndex;
                var angularBackgroundDomEl = angular.element('<div modal-backdrop></div>');
                angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
                backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
                body.append(backdropDomEl);
            }

            var angularDomEl = angular.element('<div modal-window></div>');
            angularDomEl.attr({
                'template-url': modal.windowTemplateUrl,
                'window-class': modal.windowClass,
                'size': modal.size,
                'index': openedWindows.length() - 1,
                'animate': 'animate'
            }).html(modal.content);

            var modalDomEl = $compile(angularDomEl)(modal.scope);
            openedWindows.top().value.modalDomEl = modalDomEl;
            body.append(modalDomEl);
            body.addClass(OPENED_MODAL_CLASS);
        };

        $modalStack.close = function (modalInstance, result) {
            var modalWindow = openedWindows.get(modalInstance);
            if (modalWindow) {
                modalWindow.value.deferred.resolve(result);
                removeModalWindow(modalInstance);
            }
        };

        $modalStack.dismiss = function (modalInstance, reason) {
            var modalWindow = openedWindows.get(modalInstance);
            if (modalWindow) {
                modalWindow.value.deferred.reject(reason);
                removeModalWindow(modalInstance);
            }
        };

        $modalStack.dismissAll = function (reason) {
            var topModal = this.getTop();
            while (topModal) {
                this.dismiss(topModal.key, reason);
                topModal = this.getTop();
            }
        };

        $modalStack.getTop = function () {
            return openedWindows.top();
        };

        return $modalStack;
    }])

  .provider('$modal', function () {

      var $modalProvider = {
          options: {
              backdrop: false, //can be also false or 'static'
              keyboard: true
          },
          $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
            function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

                var $modal = {};

                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template) :
                      $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                        { cache: $templateCache }).then(function (result) {
                            return result.data;
                        });
                }

                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    angular.forEach(resolves, function (value) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        }
                    });
                    return promisesArr;
                }

                $modal.open = function (modalOptions) {

                    var modalResultDeferred = $q.defer();
                    var modalOpenedDeferred = $q.defer();

                    //prepare an instance of a modal to be injected into controllers and returned to a caller
                    var modalInstance = {
                        result: modalResultDeferred.promise,
                        opened: modalOpenedDeferred.promise,
                        close: function (result) {
                            $modalStack.close(modalInstance, result);
                        },
                        dismiss: function (reason) {
                            $modalStack.dismiss(modalInstance, reason);
                        }
                    };

                    //merge and clean up options
                    modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
                    modalOptions.resolve = modalOptions.resolve || {};

                    //verify options
                    if (!modalOptions.template && !modalOptions.templateUrl) {
                        throw new Error('One of template or templateUrl options is required.');
                    }

                    var templateAndResolvePromise =
                      $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


                    templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

                        var modalScope = (modalOptions.scope || $rootScope).$new();
                        modalScope.$close = modalInstance.close;
                        modalScope.$dismiss = modalInstance.dismiss;

                        var ctrlInstance, ctrlLocals = {};
                        var resolveIter = 1;

                        //controllers
                        if (modalOptions.controller) {
                            ctrlLocals.$scope = modalScope;
                            ctrlLocals.$modalInstance = modalInstance;
                            angular.forEach(modalOptions.resolve, function (value, key) {
                                ctrlLocals[key] = tplAndVars[resolveIter++];
                            });

                            ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                            if (modalOptions.controllerAs) {
                                modalScope[modalOptions.controllerAs] = ctrlInstance;
                            }
                        }

                        $modalStack.open(modalInstance, {
                            scope: modalScope,
                            deferred: modalResultDeferred,
                            content: tplAndVars[0],
                            backdrop: modalOptions.backdrop,
                            keyboard: modalOptions.keyboard,
                            backdropClass: modalOptions.backdropClass,
                            windowClass: modalOptions.windowClass,
                            windowTemplateUrl: modalOptions.windowTemplateUrl,
                            size: modalOptions.size
                        });

                    }, function resolveError(reason) {
                        modalResultDeferred.reject(reason);
                    });

                    templateAndResolvePromise.then(function () {
                        modalOpenedDeferred.resolve(true);
                    }, function () {
                        modalOpenedDeferred.reject(false);
                    });

                    return modalInstance;
                };

                return $modal;
            }]
      };

      return $modalProvider;
  });

  
angular.module('connectedCarSDK.attProgressBar', [])
 .constant('progressConfig', {
     animate: true,
     max: 100
 })

.controller('ProgressController', ['$scope', '$attrs', 'progressConfig', function ($scope, $attrs, progressConfig) {
    var self = this,
        animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

    this.bars = [];
    $scope.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : progressConfig.max;

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
        transclude: true,
        controller: 'ProgressController',
        scope: {
            value: '=',
            type: '@'
        },
        templateUrl: '/templates/attProgressBar.html',
        link: function (scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, angular.element(element.children()[0]));
        }
    };
});


angular.module('connectedCarSDK.attTab', ['connectedCarSDK.attTabset'])
.directive('attTab', ['$parse', function ($parse) {
      return {
          require: '^attTabset',
          restrict: 'EA',
          replace: true,
          templateUrl: '/templates/tabs/attTab.html',
          transclude: true,
          scope: {
              active: '=?',
              heading: '@',
              onSelect: '&select', //This callback is called in contentHeadingTransclude
              //once it inserts the tab's content into the dom
              onDeselect: '&deselect'
          },
          controller: function () {
              //Empty controller so other directives can require being 'under' a tab
          },
          compile: function (elm, attrs, transclude) {
              return function postLink(scope, elm, attrs, tabsetCtrl) {
                  scope.$watch('active', function (active) {
                      if (active) {
                          tabsetCtrl.select(scope);
                      }
                  });

                  scope.disabled = false;
                  if (attrs.disabled) {
                      scope.$parent.$watch($parse(attrs.disabled), function (value) {
                          scope.disabled = !!value;
                      });
                  }

                  scope.select = function () {
                      if (!scope.disabled) {
                          scope.active = true;
                      }
                  };

                  tabsetCtrl.addTab(scope);
                  scope.$on('$destroy', function () {
                      tabsetCtrl.removeTab(scope);
                  });

                  //We need to transclude later, once the content container is ready.
                  //when this link happens, we're inside a tab heading.
                  scope.$transcludeFn = transclude;
              };
          }
      };
  }])
.directive('tabHeadingTransclude', [function () {
    return {
        restrict: 'A',
        require: '^attTab',
        link: function (scope, elm, attrs, tabCtrl) {
            scope.$watch('headingElement', function updateHeadingElement(heading) {
                if (heading) {
                    elm.html('');
                    elm.append(heading);
                }
            });
        }
    };
}])
.directive('tabContentTransclude', function () {
    return {
        restrict: 'A',
        require: '^attTabset',
        link: function (scope, elm, attrs) {
            var tab = scope.$eval(attrs.tabContentTransclude);

            //Now our tab is ready to be transcluded: both the tab heading area
            //and the tab content area are loaded.  Transclude 'em both.
            tab.$transcludeFn(tab.$parent, function (contents) {
                angular.forEach(contents, function (node) {
                    if (isTabHeading(node)) {
                        //Let tabHeadingTransclude know.
                        tab.headingElement = node;
                    } else {
                        elm.append(node);
                    }
                });
            });
        }
    };
    function isTabHeading(node) {
        return node.tagName && (
          node.hasAttribute('tab-heading') ||
          node.hasAttribute('data-tab-heading') ||
          node.tagName.toLowerCase() === 'tab-heading' ||
          node.tagName.toLowerCase() === 'data-tab-heading'
        );
    }
});


angular.module('connectedCarSDK.attTabset', [])
.controller('TabsetController', [
    '$scope', function($scope) {
        var ctrl = this,
            tabs = ctrl.tabs = $scope.tabs = [];

        ctrl.select = function(selectedTab) {
            angular.forEach(tabs, function(tab) {
                if (tab.active && tab !== selectedTab) {
                    tab.active = false;
                    tab.onDeselect();
                }
            });
            selectedTab.active = true;
            selectedTab.onSelect();
        };

        ctrl.addTab = function addTab(tab) {
            tabs.push(tab);
            // we can't run the select function on the first tab
            // since that would select it twice
            if (tabs.length === 1) {
                tab.active = true;
            } else if (tab.active) {
                ctrl.select(tab);
            }
        };

        ctrl.removeTab = function removeTab(tab) {
            var index = tabs.indexOf(tab);
            //Select a new tab if the tab to be removed is selected
            if (tab.active && tabs.length > 1) {
                //If this is the last tab, select the previous tab. else, the next tab.
                var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
                ctrl.select(tabs[newActiveIndex]);
            }
            tabs.splice(index, 1);
        };
    }
])
.directive('attTabset', function() {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            type: '@'
        },
        controller: 'TabsetController',
        templateUrl: '/templates/tabs/attTabset.html',
        link: function(scope, element, attrs) {
            scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
            scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
            scope.topPosition = angular.isDefined(attrs.topPosition) ? scope.$parent.$eval(attrs.topPosition) : false;
        }
    };
});


angular.module('connectedCarSDK.attToggleSwitch', [])
  .directive('attToggleSwitch', function () {
      return {
          templateUrl: '/templates/attToggleSwitch.html',
          restrict: 'E',
          scope: {
              ngModel: '='
          },
          require: '^ngModel',
          link: function (scope, element, attrs) {

              if (angular.isDefined(attrs.disabled)) {
                  element.find("label").attr("disabled", "disabled");
              }

              scope.change = function(enabled) {
                  scope.ngModel = enabled;
              };

          }
      };
  });
