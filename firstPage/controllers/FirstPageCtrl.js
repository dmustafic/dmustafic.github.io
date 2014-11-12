'use strict';

angular.module('app')
  .controller('FirstPageCtrl', ["$rootScope","$scope", function ($rootScope,$scope) {

      $rootScope.appLinks.forEach(function (i) {
          if (i['href'] == '#/firstPage')
              i.selected = true;
          else i.selected = false;
      });
  }]);