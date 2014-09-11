var app = angular.module('app');

app.controller('ForecastCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {

        $scope.currentDate = new Date();

        $scope.weatherStats = {
            minTemp: 'MIN 65°',
            maxTemp: 'MAX 75°',
            currentTemp: 96,

            precipitation: '10',
            chanceOfRain: 75,
            humidity: '10',
            wind: 'NW 5'
        };

    }]);
