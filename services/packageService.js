'use strict';

angular.module('driveStudioHU.services').factory('packageService', ['$http', function ($http) {

    return {

        getPackages: function (packageType, onSuccess, onError) {
            $http.get(config.API.host + '/api/package/getPackagesByType/' + packageType)
            .success(function (response, status) {
                if (onSuccess) {
                    if (response.success) {
                        onSuccess(response.result);
                    } else {
                        console.log(response.error);
                        onSuccess(null);
                    }
                }
            })
            .error(function (response, status) {
                console.log(response, status);
                if (onError) {
                    onError(null);
                }
            });
        },

        getAllApps: function(onSuccess, onError) {
            $http.get(config.API.host + '/api/package/apps/getAll')
            .success(function (response, status) {
                if (onSuccess) {
                    if (response.success) {
                        onSuccess(response.result);
                    } else {
                        console.log(response.error);
                        onSuccess(null);
                    }
                }
            })
            .error(function (response, status) {
                console.log(response, status);
                if (onError) {
                    onError(null);
                }
            });
        },

        getBetterPackages: function (vehicleId, onSuccess, onError) {
            $http.get(config.API.host + '/api/package/getBetter/' + vehicleId)
            .success(function (response, status) {
                if (onSuccess) {
                    if (response.success) {
                        onSuccess(response.result);
                    } else {
                        console.log(response.error);
                        onSuccess(null);
                    }
                }
            })
            .error(function (response, status) {
                console.log(response, status);
                if (onError) {
                    onError(null);
                }
            });
        },

    };

}
]);