'use strict';

angular.module('driveStudioHU.services').factory('mobileShareService', ['$http', function ($http) {

    return {

        saveMobileShareAccount: function (userId, deviceId, activePackageId, deviceType, onSuccess, onError) {

            $http.post(config.API.host + '/api/mobileShare', {
                account: {
                    userId: userId,
                    deviceId: deviceId,
                    deviceType: deviceType,
                    packageId: activePackageId
                }
            })
                .success(function (response, status) {
                    if (onSuccess) {
                        onSuccess(response.result);
                    }
                })
                .error(function (data, status) {
                    console.log(data);
                    if (onError)
                        onError(null);
                });

        },

        updateMobileShareAccount: function (userId, mobileShareAccount, onSuccess, onError) {

            $http.put(config.API.host + '/api/mobileShare/' + userId, mobileShareAccount)
                .success(function (response, status) {
                    if (onSuccess) {
                        onSuccess(response.result);
                    }
                })
                .error(function (data, status) {
                    console.log(data);
                    if (onError)
                        onError(null);
                });

        },

        getMobileShareAccount: function (userId, onSuccess, onError) {
            $http.get(config.API.host + '/api/mobileShare/' + userId)
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