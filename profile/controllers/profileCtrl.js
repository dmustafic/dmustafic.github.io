'use strict';

angular.module('driveStudioHU')
  .controller('ProfileCtrl', ["$scope", "userService", "authenticationService", "$alert", "$location",
      function ($scope, userService, authenticationService, $alert, $location) {
      
      // get user
      userService.getUser(config.user.id,
          function (user) {
              $scope.user = user;
          },
          function () {
              $alert.danger({ text: "Failed to retrieve user data." });
          });

      $scope.signOut = function () {
          authenticationService.logout();
          $location.path('/');
      };

  }]);