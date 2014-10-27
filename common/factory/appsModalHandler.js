'use strict';

angular.module('driveStudioHU.factories').factory('appsModalHandler', [ function () {

    return {

        buyAppModalHandler: function ($scope, $modalInstance) {

            $scope.mobileShare = function () {
                $modalInstance.close("mobileSharePath");
            };

            $scope.creditCard = function () {
                $modalInstance.close("creditCardPath");
            };

        },

    };

}
]);