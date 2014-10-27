'use strict';

angular.module('driveStudioHU')
  .controller('PlansCtrl', ['$scope', 'packageService', 'vehicleService', 'userService', 'constants', '$alert', '$header', '$location', '$pinPad',
      function ($scope, packageService, vehicleService, userService, constants, $alert, $header, $location, $pinPad) {

          $scope.imageRootURL = config.API.host;
          $scope.user = config.user;
          $scope.activePlan;
          $scope.purchase;
          $scope.autoRenewPayment = false;

          var VIN = vehicleService.getVIN(); // get user VIN

          // get vehicle
          vehicleService.getVehicleByVIN(VIN,
              function (vehicle) {
                  $scope.vehicle = vehicle;
                  $scope.autoRenewPayment = $scope.vehicle.activePackage.autoRenew ? $scope.vehicle.activePackage.autoRenew : false;
                  packageService.getPackages(vehicle.activePackage.packageType,
                      function (packages) {
                          $scope.packages = group(packages, 3);
                      },
                      function () {
                          $alert.danger({ text: "Failed to retrieve packages data." });
                      }
                  );
              },
              function () {
                  $alert.danger({ text: "Failed to retrieve vehicle data." });
              });

          $scope.setActivePackage = function (p) {
              $scope.activePlan = p;

              var show = p ? true : false,
                  callback = null;

              if (show)
                  callback = function () {
                      $scope.setActivePackage(null);
                  };

              $header.showBackButton(show, callback);
          };

          $scope.activatePlan = function () {
              $scope.purchase = true;

              $header.showBackButton(true, function () {
                  $scope.purchase = false;
                  $scope.setActivePackage($scope.activePlan);
              });

              // retrieve primary driver
              userService.getUser($scope.vehicle.primaryDriverId,
                  function (primaryDriver) {
                      $scope.primaryDriver = primaryDriver;
                  }, function () {
                      $alert.danger({
                          text: "Failed to retrieve primary driver data."
                      });
                  });              
          };

          $scope.purchasePlan = function () {

              userService.getUser(config.user.id, // retrieve user data
                  function (user) {

                      // check if user is required to enter PIN before doing a purchase
                      // if so, display pin pad
                      // otherwise just purchase
                      if ($scope.primaryDriver.billingInfo.pinForPurchase) {
                          $pinPad.show({
                              numDigits: 6,
                              onConfirm: function (pin) {
                                  if (pin == $scope.primaryDriver.pin) {
                                      purchase(user);
                                      $pinPad.close();
                                  } else {
                                      $alert.danger({
                                          text: "Wrong PIN! Please try again.",
                                          autoCloseInterval: 5000,
                                      });
                                  }
                              }
                          });
                      }
                      else purchase(user);
                  },
                  function () {
                      $alert.danger({ text: "Failed to retrieve user data." });
                  });
          };

          function purchase(user) {

              // validation: prevent purchase if credit card has expired
              var today = new Date();
              if ((user.billingInfo.expirationMonth < today.getMonth() + 1) &&
                     ((user.billingInfo.expirationYear <= today.getFullYear()))) {
                  $alert.danger({ text: "Your credit card has expired. Please enter new credit card information to complete this purchase." });
                  return;
              }

              // assign package to vehicle, set activeSince date
              $scope.vehicle.activePackage = $scope.activePlan;
              $scope.vehicle.activePackage.activeSince = new Date();
              $scope.vehicle.activePackage.autoRenew = $scope.autoRenewPayment;

              // reset data usage
              $scope.vehicle.activePackage.dataUsage.used = 0;

              //set status to retail
              $scope.vehicle.status = constants.vehicleStatus.retail;

              if (!user.billingInfo.charges)
                  user.billingInfo.charges = [];

              // create new charge in users billing info
              user.billingInfo.charges.push({
                  invoiceDate: new Date(),
                  planName: $scope.activePlan.name + ' package for ' + vehicleService.getVehicleLabel($scope.vehicle),
                  amount: $scope.activePlan.price
              });

              // remove account balance too low flag
              user.billingInfo.accountBallanceTooLow = false;

              // save vehicle
              vehicleService.updateVehicle($scope.vehicle, function (updateVehicleResult) {

                  // save new charge for user
                  userService.saveBillingInfo(user.id, user.billingInfo, function (updateBillingResult) {

                      $alert.success({
                          text: "Congratulations! You successfully purchased a new plan.",
                          autoCloseInterval: 5000,
                          onClose: function () {
                              $location.path('/overview');
                          }
                      });

                  }, function () {
                      $alert.danger({ text: "Failed to save billing data." });
                  });
              },
              function () {
                  $alert.danger({ text: "Failed to update vehicle data." });
              });
          }

          function group(list, itemsNr) {
              var result = [],
                  set = [];
              _.each(list, function (p, index) {
                  if (index > 0 && index % itemsNr == 0) {
                      result.push(set);
                      set = [];
                      set.push(p);
                  }
                  else set.push(p);
              });

              if (set.length > 0)
                  result.push(set);

              return result;
          };

      }]);