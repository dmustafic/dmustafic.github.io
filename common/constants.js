(function (app) {
    'use strict';

    var constants = {
        
        packageType: {
            demo: 0,
            trial: 1,
            retail: 2
        },

        vehicleStatus: {
            inactive: {
                value: 0,
                text: 'Inactive'
            },
            demo: {
                value: 1,
                text: 'Demo'
            },
            trial: {
                value: 2,
                text: 'Trial'
            },
            retail: {
                value: 3,
                text: 'Retail'
            }
        },

        mobileShareDeviceType: {
            vehicle: 'vehicle'
        },
    };

    app.constant('constants', constants);
})(angular.module('app'));