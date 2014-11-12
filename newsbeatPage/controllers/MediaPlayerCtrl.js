'use strict';

/**
 * @ngdoc function
 * @name connectedCarSDK.controller:MediaPlayerCtrl
 * @description
 * # MediaPlayerCtrl
 * Controller of the connectedCarSDK
 */

angular.module('app').controller('MediaPlayerCtrl',
['$rootScope','$scope','$http','PlayListService',function ($rootScope,$scope,$http,PlayListService) {
	    //init_create_user($scope,$http);
		// $scope.$on( 'newslist.loaded', function( event ) {
// 		     $scope.playlist = PlayListService.newsList;
// 		});
		$scope.playlist = PlayListService.newsList;
		if(!PlayListService.isPlaying){
			
			PlayListService.initNews();
			$scope.autoPlayAfterPageLoad=true;
		}else{
			$scope.autoPlayAfterPageLoad=false;
		}
        $rootScope.appLinks.forEach(function (i) {
            if (i['href'] == '#/newsbeatPage')
                i.selected = true;
            else i.selected = false;
        });
		
	    

  }]);


