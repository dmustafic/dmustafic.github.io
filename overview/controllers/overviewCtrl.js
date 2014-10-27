'use strict';

angular.module('driveStudioHU')
  .controller('OverviewCtrl', ["$scope", "vehicleService", "userService", "$alert", function ($scope, vehicleService, userService, $alert) {

      var VIN = vehicleService.getVIN(); // get user VIN

      // get vehicle
      vehicleService.getVehicleByVIN(VIN,
          function (data) {
              $scope.vehicle = data;

              // calculate billing cycle data
              var startData = moment($scope.vehicle.activePackage.activeSince),
                  expireDate = moment($scope.vehicle.activePackage.activeSince).add(1, "months"),
                  left = Math.floor(moment.duration(expireDate.diff(moment())).asDays()),
                  value = Math.floor(moment.duration(moment().diff(startData)).asDays()),
                  max = Math.floor(moment.duration(expireDate.diff(startData)).asDays());

              $scope.billingCycle = {
                  min: 0,
                  max: max,
                  value: value,
                  textLeft: 'Billing Cycle',
                  textRight: left == 1 ? (left + " day left") : (left < 0 ? 0 : left + " days left")
              };

              // calculate data usage data
              var leftData = $scope.vehicle.activePackage.dataUsage.monthlyQuota - $scope.vehicle.activePackage.dataUsage.used;

              $scope.dataUsage = {
                  min: 0,
                  max: $scope.vehicle.activePackage.dataUsage.monthlyQuota,
                  value: $scope.vehicle.activePackage.dataUsage.used,
                  textLeft: $scope.vehicle.activePackage.dataUsage.used.toFixed(2) + ' ' + $scope.vehicle.activePackage.dataUsage.unit + ' of ' +
                            $scope.vehicle.activePackage.dataUsage.monthlyQuota + ' used',
                  textRight: leftData + $scope.vehicle.activePackage.dataUsage.unit + ' left'
              };

              // check user account
              if (left <= config.trialExpiresLength) {
                  $scope.showTrialExpires = true;
                  $scope.expirationDate = activeUntil.format("MMMM D");
              }

              // check account balance
              userService.getUser($scope.vehicle.primaryDriverId,
                  function (primaryDriver) {
                      $scope.primaryDriver = primaryDriver;
                  },
                  function () {
                      $alert.danger({ text: "Failed to retrieve user data." });
                  });

          },
          function () {
              $alert.danger({ text: 'Failed to retrieve vehicle data.' });
          });

  }]);