var app = angular.module('app', [
    'ngRoute',
    'connectedCarSDK'
]);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/forecast.html',
            controller: 'ForecastCtrl',
            settings: {
                viewName: 'TEMPERATURE'
            }
        })
        .when('/alarm', {
            templateUrl: 'app/views/alarm.html',
            controller: 'SettingsCtrl',
            settings: {
                viewName: 'ALARMS'
            }
        })
        .when('/settings', {
            templateUrl: 'app/views/settings.html',
            controller: 'SettingsCtrl',
            settings: {
                viewName: 'SETTINGS'
            }
        })
        .when('/about', {
            templateUrl: 'app/views/about.html',
            controller: 'AboutCtrl',
            settings: {
                viewName: 'ABOUT'
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.run(function($rootScope) {

    $rootScope.appName = 'DIGITAL LIFE';
    $rootScope.showDrawer = false;

    $rootScope.$on('$routeChangeSuccess',
        function (event, next, current) {
            $rootScope.showDrawer = false;

            if (next && next.$$route && next.$$route.settings) {
                $rootScope.viewName = next.$$route.settings.viewName;
            }
        });

    $rootScope.appLinks = [
        { text: 'Temperature', desc: 'Home thermostats', href: '#/', selected: true },
        { text: 'Alarms', desc: 'Alarm status and notifications', href: '#/alarm', selected: false },
        { text: 'Settings', desc: 'Change units and settings', href: '#/settings', selected: false },
        { text: 'About', desc: 'Copyright &copy;AT&T, 2014.', href: '#/about', selected: false }
    ];

});
