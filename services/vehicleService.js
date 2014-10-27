'use strict';

angular.module('driveStudioHU.services').factory('vehicleService', [
    '$http', function($http) {

        return {

            getVehicleByVIN: function(VIN, onSuccess, onError) {
                var that = this;
                $http.get(config.API.host + '/api/vehicle/vin/' + VIN)
                    .success(function(response, status) {
                        if (onSuccess) {
                            if (response.success) {
                                onSuccess(response.result);
                            } else {
                                console.log(response.error);
                                onSuccess(null);
                            }
                        }
                    })
                    .error(function(response, status) {
                        console.log(response, status);
                        if (onError) {
                            onError(null);
                        }
                    });
            },

            getVehicleById: function(vehicleId, onSuccess, onError) {
                $http.get(config.API.host + '/api/vehicle/' + vehicleId)
                    .success(function(response, status) {
                        if (onSuccess) {
                            if (response.success) {
                                onSuccess(response.result);
                            } else {
                                console.log(response.error);
                                onSuccess(null);
                            }
                        }
                    })
                    .error(function(response, status) {
                        console.log(response, status);
                        if (onError) {
                            onError(null);
                        }
                    });
            },

            updateVehicle: function (vehicle, onSuccess, onError) {
                $http.put(config.API.host + '/api/vehicle/' + vehicle.id, { vehicle: vehicle })
                    .success(function(response, status) {
                        if (onSuccess) {
                            if (response.success) {
                                onSuccess(response.result);
                            } else {
                                console.log(response.error);
                                onSuccess(null);
                            }
                        }
                    })
                    .error(function(response, status) {
                        console.log(response, status);
                        if (onError) {
                            onError(null);
                        }
                    });
            },

            // temporary
            getVIN: function() {
                return '1ZVHT82H485113111';
            },

            getVehicleLabel: function (vehicle) {
                return vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model;
            },

        };
    }
]);