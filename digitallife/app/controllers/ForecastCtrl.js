var app = angular.module('app');

app.controller('ForecastCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {

        $scope.currentDate = new Date();

        $scope.weatherStats = {
            minTemp: 'MIN 65°',
            maxTemp: 'MAX 75°',
            currentTemp: 75,

            precipitation: 'ON',
            chanceOfRain: 83,
            humidity: '10',
            wind: 'AVG'
        };

    }]);
