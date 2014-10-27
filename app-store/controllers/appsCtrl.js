'use strict';

angular.module('driveStudioHU')
    .controller('AppsCtrl', ['$scope', '$alert', '$location', 'vehicleService', 'packageService', 'helper', 'config',
        function($scope, $alert, $location, vehicleService, packageService, helper, config) {

            $scope.config = config;

            vehicleService.getVehicleByVIN(vehicleService.getVIN(), function(vehicle) {

                if (vehicle) {

                    $scope.vehicle = vehicle;
                    $scope.vehicleApps = vehicle.activePackage ? vehicle.activePackage.apps : [];
                    
                } else {
                    $alert.danger({ text: 'Could not retrieve vehicle data from database.' });
                }

                packageService.getAllApps(function (allApps) {

                    // set installed/not installed indicator for each app
                    _.each(allApps, function (app) {
                        app.installed = false;
                        _.each($scope.vehicleApps, function (tempApp) {
                            if (tempApp.appId == app.appId && tempApp.installed) {
                                app.installed = true;
                            }
                        });
                    });

                    $scope.appGroups = helper.group(allApps, 8);

                }, function() {
                    $alert.danger({ text: 'Could not retrieve apps list from database.' });
                });

            }, function() {
                $alert.danger({ text: 'Could not retrieve vehicle data from database.' });
            });

        }
    ]);