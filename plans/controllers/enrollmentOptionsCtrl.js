(function (app) {
    'use strict';

    app.controller('EnrollmentOptionsCtrl', ['$scope', '$alert', '$location', 'mobileShareService', 'vehicleService',
          function ($scope, $alert, $location, mobileShareService, vehicleService) {
              $scope.showPlan = null;

              var planView = {
                  mobileShare: 'mobileShare',
                  enrollmentOptions: 'enrollmentOptions'
              };
              
              mobileShareService.getMobileShareAccount(config.user.id,
                  function (account) {
                      if (account) {
                          $scope.showPlan = planView.mobileShare;
                      } else {
                          skipEnrollmentWhenActivePackage();
                      }
                  },
                  function () {
                      $alert.danger({ text: "Failed to get mobile share status." });
                  }
               );


              function skipEnrollmentWhenActivePackage() {
                  var vin = vehicleService.getVIN(); // get user VIN
                  // get vehicle
                  vehicleService.getVehicleByVIN(vin,
                      function (vehicle) {
                          //There has to better way to get active package!
                          var hasActivePackage = vehicle && vehicle.activePackage && vehicle.activePackage.id && vehicle.activePackage.price > 0;
                          if (hasActivePackage) {
                              $location.path('/services/pay-as-you-go-plans');
                          } else {
                              $scope.showPlan = planView.enrollmentOptions;
                          }
                      },
                      function () {
                          $alert.danger({ text: "Failed to retrieve vehicle data." });
                      });
              }

          }]);
})(angular.module('driveStudioHU'));

