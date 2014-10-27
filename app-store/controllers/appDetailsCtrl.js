'use strict';

angular.module('driveStudioHU')
    .controller('AppDetailsCtrl',
    ['$scope', '$routeParams', '$alert', '$location', 'vehicleService', 'packageService', 'mobileShareService', 'userService', 'helper', 'config', '$modal', 'appsModalHandler',
        function ($scope, $routeParams, $alert, $location, vehicleService, packageService, mobileShareService, userService, helper, config, $modal, appsModalHandler) {

            $scope.config = config;

            vehicleService.getVehicleById($routeParams.vehicleId, function (vehicle) {

                if (vehicle) {

                    $scope.vehicle = vehicle;

                    if ($scope.vehicle.activePackage && $scope.vehicle.activePackage.apps) {
                        $scope.app = _.find($scope.vehicle.activePackage.apps, function(app) {
                            return app.appId == $routeParams.appId;
                        });
                    }

                } else {
                    $alert.danger({ text: 'Could not retrieve app list from database.' });
                }

            }, function () {
                $alert.danger({ text: 'Could not retrieve app list from database.' });
            });

            $scope.goToAppsPage = function() {
                $location.path('/apps');
            };

            $scope.installApp = function (vehicleApp, install) {
                vehicleApp.installed = install;
                vehicleService.updateVehicle($scope.vehicle, function (success) {
                    if (success) {
                        $alert.success({ text: 'Operation completed', autoCloseInterval: 3000, showIcon: true });
                        $location.path('/apps');
                    } else {
                        $alert.danger({ text: 'Could not update app status', autoCloseInterval: 3000, showIcon: true });
                    }
                }, function () {
                    $alert.danger({ text: 'Could not update app status', autoCloseInterval: 3000, showIcon: true });
                });
            };

            // install == true => install the app
            // install == false => uninstall the app
            $scope.setInstallStatus = function(app, install) {

                if ($scope.vehicle && $scope.vehicle.activePackage) {
                    var vehicleApp = _.find($scope.vehicle.activePackage.apps, function(a) {
                        return a.appId == app.appId;
                    });

                    if (install) {

                        // if user has Mobile Share account active and a valid credit card, let him choose how he wants to pay the app
                        mobileShareService.getMobileShareAccount(config.user.id,
                            function (account) {

                                userService.getUser(config.user.id,
                                    function (user) {
                                        if (account && user.billingInfo.cardNumber) {

                                            // show modal with pay options
                                            var modalInstance = $modal.open({
                                                templateUrl: '/app-store/views/pay-options-modal.html',
                                                controller: appsModalHandler.buyAppModalHandler
                                            });

                                            modalInstance.result.then(function (location) {
                                                $scope.installApp(vehicleApp, install);
                                            }, function () {
                                            });
                                        }
                                        else $scope.installApp(vehicleApp, install);
                                    },
                                    function () { });


                            },
                            function () {
                                $alert.danger({ text: 'An error occured, could not process your request', autoCloseInterval: 3000, showIcon: true });
                            });
                    } else $scope.installApp(vehicleApp, install);
                }

            };

        }
    ]);