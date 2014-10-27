'use strict';

angular.module('driveStudioHU')
    .controller('LoginCtrl', ['$scope', '$location', '$alert', 'vehicleService', 'authenticationService',
        function ($scope, $location, $alert, vehicleService, authenticationService) {
            
            $scope.confirm = function () {

                authenticationService.validateVinPin(vehicleService.getVIN(), $scope.pin,
                    function (user) {
                        if (user) {

                            authenticationService.setupIdentity(user);
                            $location.path('/overview');

                        } else {
                            $alert.danger({
                                text: 'Invalid PIN. Please try again.'
                            });
                        }
                    },
                    function (errorResponse) {

                    });

            };

        }
    ]);