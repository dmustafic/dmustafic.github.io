"use strict";

angular.module('driveStudioHU', ['connectedCarSDK']);
angular.module('driveStudioHU.services', []);
angular.module('driveStudioHU.directives', []);
angular.module('driveStudioHU.providers', []);
angular.module('driveStudioHU.filters', []);
angular.module('driveStudioHU.helpers', []);
angular.module('driveStudioHU.factories', []);

var app = angular.module('app', [
    'ngRoute',
    'driveStudioHU',
    'driveStudioHU.services',
    'driveStudioHU.directives',
    'driveStudioHU.providers',
    'driveStudioHU.filters',
    'driveStudioHU.helpers',
    'driveStudioHU.factories',
    'connectedCarSDK'
]);

var config = {

    user: {
        isAuthenticated: false,
        roles: [],
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        id: "",
        hasRole: function(id) {
            return _.contains(this.roles, id);
        }
    },

    API: {
        host: 'http://i.maestralsolutions.com:8080'
    },

    trialExpiresLength: 3

};

app.value('config', config);

app.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'authentication/views/login.html',
            controller: 'LoginCtrl',
            settings: {
                viewName: 'Enter driver PIN',
                hasAccess: function() {
                    return true;
                }
            }
        })
        .when('/overview', {
            templateUrl: 'overview/views/overview.html',
            controller: 'OverviewCtrl',
            settings: {
                viewName: 'OVERVIEW',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/billing', {
            templateUrl: 'billing/views/billing.html',
            controller: 'BillingCtrl',
            settings: {
                viewName: 'BILLING',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/profile', {
            templateUrl: 'profile/views/profile.html',
            controller: 'ProfileCtrl',
            settings: {
                viewName: 'PROFILE',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services', {
            templateUrl: 'plans/views/enrollment-options.html',
            settings: {
                viewName: 'ENROLLMENT OPTIONS',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/mobile-share', {
            templateUrl: 'mobile-share/views/mobile-share.html',
            controller: 'MobileShareCtrl',
            settings: {
                viewName: 'MOBILE SHARE',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/mobile-share/account-verification', {
            templateUrl: 'plans/views/mobile-share-account-verification.html',
            settings: {
                viewName: 'ENABLE WI-FI WITH AT&T MOBILE SHARE',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/mobile-share/plans', {
            templateUrl: 'plans/views/mobile-share-plans.html',
            settings: {
                viewName: 'ENABLE WI-FI WITH AT&T MOBILE SHARE',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/mobile-share/select-group', {
            templateUrl: 'plans/views/mobile-share-group-selection.html',
            settings: {
                viewName: 'ENABLE WI-FI WITH AT&T MOBILE SHARE',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/mobile-share/special-offer', {
            templateUrl: 'plans/views/mobile-share-special-offer.html',
            settings: {
                viewName: 'ENABLE WI-FI WITH AT&T MOBILE SHARE',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/mobile-share/purchase-summary', {
            templateUrl: 'plans/views/mobile-share-summary.html',
            settings: {
                viewName: 'ENABLE WI-FI WITH AT&T MOBILE SHARE',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/mobile-share/result', {
            templateUrl: 'plans/views/mobile-share-result.html',
            settings: {
                viewName: 'ENABLE WI-FI WITH AT&T MOBILE SHARE',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/mobile-share/terms-and-conditions', {
            templateUrl: 'plans/views/mobile-share-tc.html',
            settings: {
                viewName: 'ENABLE WI-FI WITH AT&T MOBILE SHARE',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/pay-as-you-go-plans', {
            templateUrl: 'plans/views/plans.html',
            controller: 'PlansCtrl',
            settings: {
                viewName: 'PAY AS YOU GO PLANS',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/pay-as-you-go-plans/details', {
            templateUrl: 'plans/views/plan-details.html',

            settings: {
                viewName: 'PLAN DETAILS',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/services/pay-as-you-go-plans/summary', {
            templateUrl: 'plans/views/summary.html',

            settings: {
                viewName: 'Summary of charges',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/settings', {
            templateUrl: 'settings/views/settings.html',
            controller: 'SettingsCtrl',
            settings: {
                viewName: 'SETTINGS',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/apps', {
            templateUrl: 'app-store/views/apps.html',
            controller: 'AppsCtrl',
            settings: {
                viewName: 'Applications',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .when('/app/:appId/details/:vehicleId', {
            templateUrl: 'app-store/views/app-details.html',
            controller: 'AppDetailsCtrl',
            settings: {
                viewName: 'App details',
                hasAccess: function () {
                    return true;
                }
            }
        })
        .otherwise({
            redirectTo: '/login'
        });
});

app.run(function($rootScope, $location, $header, authenticationService, vehicleService, userService) {

    $rootScope.appName = 'AT&T DRIVE';
    $rootScope.showDrawer = true;
    $header.showBackButton(false);

    $rootScope.$on('$routeChangeSuccess',
        function (event, next, current) {
            $rootScope.showDrawer = false;

            $rootScope.$broadcast('changeDrawer', [false]);

            if (next && next.$$route && next.$$route.settings) {
                $rootScope.viewName = next.$$route.settings.viewName;
            }
        });

    $rootScope.appLinks = [
        { text: 'Overview', desc: 'Glance at your plan info', href: '#/overview', selected: true },
        { text: 'Profile', desc: 'View your account info', href: '#/profile', selected: false },
        { text: 'Billing', desc: 'View billing and payment', href: '#/billing', selected: false },
        { text: 'Services', desc: 'View and change plans', href: '#/services', selected: false },
        { text: 'Apps', desc: 'Install new apps', href: '#/apps', selected: false },
        { text: 'Settings', desc: 'Change app settings', href: '#/settings', selected: false }
    ];

    // Check if user is already logged in (used for page refresh scenario) and repopulate his data
    userService.getLoggedUser(function (user) {
        if (!user) {
            // could not get user from local storage, go to login
            $location.path('login');
        } else {
            // populate config object to be used throughout the app
            authenticationService.setupIdentity(user);
        }

    }, function () { });

});
