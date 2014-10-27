'use strict';

angular.module('driveStudioHU')
  .controller('BillingCtrl', ["$scope", "userService", "$alert", function ($scope, userService, $alert) {

      // get user
      userService.getUser(config.user.id,
          function (user) {
              $scope.user = user;
              $scope.savePaymentMethod = ($scope.user.billingInfo && $scope.user.billingInfo.savePaymentMethod) ? $scope.user.billingInfo.savePaymentMethod : false;
              $scope.pinForPurchase = ($scope.user.billingInfo && $scope.user.billingInfo.pinForPurchase) ? $scope.user.billingInfo.pinForPurchase : false;
              $scope.enabled = $scope.user.billingInfo && $scope.user.billingInfo.savePaymentMethod != undefined &&
                               $scope.user.billingInfo.pinForPurchase != undefined;
          },
          function () {
              $alert.danger({ text: "Failed to retrieve user data." });
          });

      $scope.changePaymentMethod = function () {
          userService.savePaymentMethod(config.user.id, $scope.savePaymentMethod,
              function (data) {
                  if (!data)
                      $alert.danger({ text: "Failed to change payment method." });
              },
              function () {
                  $alert.danger({ text: "Failed to change payment method." });
              });
      };

      $scope.changePinForPurchase = function () {
          userService.savePinForPurchase(config.user.id, $scope.pinForPurchase,
              function (data) {
                  if (!data)
                      $error.show({ message: "Failed to change PIN for purchase status." });
              },
              function () {
                  $error.show({ message: "Failed to change PIN for purchase status." });
              });
      };

  }]);