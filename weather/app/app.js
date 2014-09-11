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
                viewName: 'FORECAST'
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

    $rootScope.appName = 'WEATHER';
    $rootScope.showDrawer = false;

    $rootScope.$on('$routeChangeSuccess',
        function (event, next, current) {
            $rootScope.showDrawer = false;

            if (next && next.$$route && next.$$route.settings) {
                $rootScope.viewName = next.$$route.settings.viewName;
            }
        });

    $rootScope.appLinks = [
        { text: 'Forecast', desc: 'Get current, hourly and weekly weather', href: '#/', selected: true },
        { text: 'Settings', desc: 'Change units and location settings', href: '#/settings', selected: false },
        { text: 'About', desc: 'Copyright AccuWeather & AT&T, 2014.', href: '#/about', selected: false }
    ];

});
