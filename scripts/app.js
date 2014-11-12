"use strict";

var app = angular.module('app', [
	'ng',
    'ngRoute',
    'connectedCarSDK',
	'connectedCarSDK.attMediaPlayer'
]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/firstPage', {
            templateUrl: 'firstPage/views/firstPage.html',
            controller: 'FirstPageCtrl',
            settings: {
                viewName: 'First Page'
            }
        })
        .when('/newsbeatPage', {
            templateUrl: 'newsbeatPage/views/newsbeatPage.html',
            controller: 'MediaPlayerCtrl',
            settings: {
                viewName: 'Newsbeat'
			}
         })
        .otherwise({
            redirectTo: '/firstPage'
        });
});

app.run(function ($rootScope) {

    $rootScope.appName = 'Demo';
    $rootScope.showDrawer = true;

    $rootScope.$on('$routeChangeSuccess',
        function (event, next, current) {
            $rootScope.showDrawer = false;

            $rootScope.$broadcast('changeDrawer', [false]);

            if (next && next.$$route && next.$$route.settings) {
                $rootScope.viewName = next.$$route.settings.viewName;
            }
        });

    $rootScope.appLinks = [
        { text: 'First Page', desc: 'First page description', href: '#/firstPage', selected: true },
		{ text: 'Newsbeat Page', desc: 'Newsbeat Page', href: '#/newsbeatPage', selected: false }
		
    ];

});

