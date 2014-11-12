'use strict';

angular.module('connectedCarSDK.attTab', ['connectedCarSDK.attTabset'])
.directive('attTab', ['$parse', function ($parse) {
      return {
          require: '^attTabset',
          restrict: 'EA',
          replace: true,
          templateUrl: 'templates/tabs/attTab.html',
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
