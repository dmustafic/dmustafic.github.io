var app = angular.module('app');

app.controller('LayoutCtrl', [
    '$rootScope', '$scope', '$location', 'authenticationService', 'vehicleService', 'config',
    function($rootScope, $scope, $location, authenticationService, vehicleService, config) {

        var vm = this;

        $scope.$watch(function() { return config.user.isAuthenticated; }, function() {
            vm.showAuthenticatedContent = config.user.isAuthenticated;
        });

    }
]);