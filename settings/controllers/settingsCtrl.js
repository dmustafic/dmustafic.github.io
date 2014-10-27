'use strict';

angular.module('driveStudioHU')
  .controller('SettingsCtrl', ['$scope', '$alert', '$location', 'vehicleService', 'config',
      function ($scope, $alert, $location, vehicleService, config) {

          $scope.config = config;

          vehicleService.getVehicleByVIN(vehicleService.getVIN(), function(vehicle) {

              if (vehicle) {

                  $scope.vehicle = vehicle;
                  $scope.vehicleApps = vehicle.activePackage ? vehicle.activePackage.apps : [];
                  $scope.vehicleServices = vehicle.activePackage ? vehicle.activePackage.services : [];

              } else {
                  $alert.danger({ text: 'Could not retrieve vehicle data from database.' });
              }

          }, function() {
              $alert.danger({ text: 'Could not retrieve vehicle data from database.' });
          });

          $scope.appStatusChanged = function (vehicle) {
              vehicleService.updateVehicle(vehicle, function (updateStatus) {
                  if (updateStatus) {
                      console.log('App setting updated');
                  } else {
                      $alert.danger({ text: 'Could not update app setting' });
                  }
              }, function() {
                  $alert.danger({ text: 'Could not update app setting' });
              });
          };

          $scope.serviceStatusChanged = function(vehicle) {
              vehicleService.updateVehicle(vehicle, function (updateStatus) {
                  if (updateStatus) {
                      console.log('Service setting updated');
                  } else {
                      $alert.danger({ text: 'Could not update service setting' });
                  }
              }, function () {
                  $alert.danger({ text: 'Could not update service setting' });
              });
          };

      }]);