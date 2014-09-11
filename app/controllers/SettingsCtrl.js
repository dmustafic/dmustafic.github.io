var app = angular.module('app');

app.controller('SettingsCtrl', ['$rootScope', '$scope', '$modal',
    function ($rootScope, $scope, $modal) {        

        $scope.temperature = "celsius";
        $scope.location = true;

        $scope.change = function () {
            var modalInstance = $modal.open({
                templateUrl: 'modalContent.html',
                controller: ModalInstanceCtrl,
                size: 'lg'
            });

            modalInstance.result.then(function () {
            }, function () {});
        };
}]);

var ModalInstanceCtrl = function ($scope, $modalInstance) {
    
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};