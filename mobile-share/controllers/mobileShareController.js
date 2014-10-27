'use strict';

angular.module('driveStudioHU')
  .controller('MobileShareCtrl', [
      '$scope', 'vehicleService', '$location', 'userService', '$alert', 'packageService', 'helper', 'mobileShareService', 'constants',
      function ($scope, vehicleService, $location, userService, $alert, packageService, helper, mobileShareService, constants) {

          $scope.step = 1;
          $scope.accountInfoModel = {};
          $scope.acceptedTerms = false;

          vehicleService.getVehicleByVIN(vehicleService.getVIN(),
            function (result) {
                $scope.vehicle = result;
            },
            function () { });

          $scope.validateAccount = function () {

              // validate account info
              userService.validateUserAccount($scope.accountInfoModel, function (success) {
                  if (success) {
                      $scope.accountInfoError = '';
                      $scope.plans();                      
                  }
                  else $alert.show({
                      type: 'danger',
                      autoCloseInterval: 5000,
                      title: 'Validation failed',
                      text: 'The information you entered does not seem to be correct.'
                  });
              },
              function () {
                  $scope.accountInfoError = 'An error occured.';
              });

          };

          $scope.back = function () {
              $location.path('/services');
          };

          $scope.plans = function () {
              if (!$scope.packages) {
                  packageService.getBetterPackages($scope.vehicle.id,
                          function (packages) {
                              $scope.packages = helper.group(packages, 3);
                              $scope.currentPackageId = $scope.vehicle.activePackage.id;
                              $scope.step = 2;
                          },
                          function () { });
              } else $scope.step = 2;
          };

          $scope.selectPlan = function (plan) {

              if (plan.id == $scope.currentPackageId)
                  return;

              $scope.selectedPlan = plan;
              $scope.activePackageId = plan.id;
              $scope.groups();
          };

          $scope.groups = function () {

              // get mobile share account
              mobileShareService.getMobileShareAccount(config.user.id,
              function (account) {
                  if (account) {
                      $scope.step = 3;
                      $scope.mobileShareGroups = account.groups;
                      $scope.mobileShareAccount = account;
                  }
                  else {
                      // create new mobile share account
                      mobileShareService.saveMobileShareAccount(config.user.id, $scope.vehicle.id, $scope.vehicle.activePackage.id, constants.mobileShareDeviceType.vehicle,
                          function (mobileShareAccount) {
                              $scope.step = 3;
                              $scope.mobileShareGroups = mobileShareAccount.groups;
                              $scope.mobileShareAccount = mobileShareAccount;
                          },
                          function () {
                              $alert.show({
                                  type: 'danger',
                                  autoCloseInterval: 5000,
                                  title: 'Error',
                                  text: 'Something went wrong! Creating a new mobile share account failed.'
                              });
                          });
                  }
              },
              function () { });
          };

          $scope.selectGroup = function (groupId) {
              $scope.selectedGroup = groupId;
          };

          $scope.specialOffer = function (accept) {
              $scope.acceptSpecialOffer = accept;
              $scope.step = 5;
          };

          $scope.purchase = function () {
              var vehicle = { _id: $scope.vehicle.id, activePackage: $scope.selectedPlan };

              vehicle.status = constants.vehicleStatus.retail;
              vehicle.activePackage.activeSince = new Date();
              vehicle.activePackage.dataUsage.used = 0;

              // save new plan
              vehicleService.updateVehicle(vehicle,
                  function (success) {                      
                      $scope.purchaseSuccess = true;
                      $scope.step = 7;
                  },
                  function () {
                      $scope.purchaseSuccess = false;
                      $scope.step = 7;
                  });
          };

          $scope.completed = function () {
              if ($scope.purchaseSuccess)
                  $location.path("/overview");
              else $location.path("/services");
          };

      }]);