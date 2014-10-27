'use strict';

angular.module('driveStudioHU.services').factory('userService', ['$http', function ($http) {

    return {

        getUser: function (userId, onSuccess, onError) {
            $http.get(config.API.host + '/api/user/' + userId)
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

        getLoggedUser: function (onSuccess, onError) {
            // TODO: constants.localStorageKeys.loggedUser
            var user = localStorage.getObject('loggedUser');

            if (!user)
                return onError(undefined);
            else
                return onSuccess(user);
        },

        savePaymentMethod: function (userId, paymentMethod, onSuccess, onError) {
            $http.post(config.API.host + '/api/user/savePaymentMethod/' + userId, { billingInfo: { savePaymentMethod: paymentMethod } })
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

        savePinForPurchase: function (userId, pinForPurchase, onSuccess, onError) {
            $http.post(config.API.host + '/api/user/savePinForPurchase/' + userId, { billingInfo: { pinForPurchase: pinForPurchase } })
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

        saveBillingInfo: function (userId, billingInfo, onSuccess, onError) {
            $http.post(config.API.host + '/api/user/saveBillingInfo/' + userId, { billingInfo: billingInfo })
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

        validateUserAccount: function (userData, onSuccess, onError) {

            $http.post(config.API.host + '/api/user/validateUserAccount/', { userData: userData })
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