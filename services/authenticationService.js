'use strict';

angular.module('driveStudioHU.services')
    .factory('authenticationService', ['$http', 'config', function($http, config) {

        return {

            validateVinPin: function(vin, pin, onSuccess, onError) {

                $http.post(config.API.host + '/api/user/validateVinPin', { vin: vin, pin: pin })
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

            setupIdentity: function (user) {
                config.user.isAuthenticated = true;
                config.user.username = user.username;
                config.user.firstname = user.firstName;
                config.user.lastname = user.lastName;
                config.user.email = user.email;
                config.user.id = user.id;
                config.user.roles.push(user.role);

                // Save currently logged user object, that will be used to repopulate data when browser is refreshed
                // TODO: constants.localStorageKeys.loggedUser
                if (!localStorage.getObject('loggedUser'))
                    localStorage.setObject('loggedUser', user);
            },

            logout: function () {
                config.user.isAuthenticated = false;
                config.user.username = '';
                config.user.firstname = '';
                config.user.lastname = '';
                config.user.email = '';
                config.user.id = '';
                config.user.roles = [];

                localStorage.setObject('loggedUser', undefined);
            }
            
        };

    }
]);