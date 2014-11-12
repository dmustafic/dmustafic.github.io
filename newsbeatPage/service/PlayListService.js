var base_url = "http://staging.api.newsbeat.me:8081";
var server_version="/pfn/v2/";
var api_create_user="createUser";

var parter_key="78979ab6P7d56F40e8Na1c81437f49a747ebfab7f7efPfdc6F41b4Nac9a10131ac234f14";
var post_string='{"userName":"","name":"RS","deviceInfo":{"osName":"Android","deviceId":"358239053801082","osVersion":"4.4.4"}}';
var date=new Date().toUTCString()+"+00:00";
var currentUser;
var newsList;

var app=angular.module("app");
app.service( 'PlayListService', [ '$rootScope','$http', function( $rootScope,$http ) {
    var PlayListService = {
		isPlaying:false,
      	newsList: [],
	  	initNews:function(){
	  		get_news($rootScope,$http,PlayListService);
			
	  	},
	  	addMoreNews:function(){},
	  	reloadNews:function(){},
      	addNews: function ( book ) {
        	service.books.push( book );
        	$rootScope.$broadcast( 'books.update' );
      	}
   	}
   return PlayListService;
}]);




function hmac_sha256(org_string){

	return CryptoJS.HmacSHA256(org_string, parter_key);
}

function base64_encode(org_base_string){
	return CryptoJS.enc.Base64.stringify(org_base_string);
}

function encrypt(org){
	return base64_encode(hmac_sha256(org));
}

function init_create_user($scope,$http){
	    date=new Date().toUTCString()+"+00:00";
		var orginalAuthString = "POST" + "\n" + date + "\n" +server_version+ api_create_user + "\n" + post_string;
		var returndata;
		$http({ url:base_url+server_version+api_create_user,
				method:'POST',
				data:post_string,
				headers:{
									"Authorization":encrypt(orginalAuthString),
									//"Authorization":'oB/JlQICKHonsV5hBYdPrWN48hEMR0JOZqJRC7+08eY=',
									"Content-Type": "text/plain; charset=utf-8",
									"X-PFN-Date":date,
									"X-PFN-Partner-ID":""
					   }
				
					   
				
			}).success(function(data, status) {
          		currentUser=data;
			}).error(function(data, status) {
			 	
		  	});
	
	 	
		/*var orginalAuthString = "POST" + "\n" + date + "\n" +server_version+ api_create_user + "\n" + post_string;
		
		 var cors = require('cors');
		 cors.post({
						'url': base_url+server_version+api_create_user,
						'headers':{
									"Authorization":encrypt(orginalAuthString),
									//"Authorization":'oB/JlQICKHonsV5hBYdPrWN48hEMR0JOZqJRC7+08eY=',
									"Content-Type": "text/plain; charset=utf-8",
									"X-PFN-Date":date,
									"X-PFN-Partner-ID":""
					   },
					   'params':post_string,
						'success': function (data) {
							alert(data);
							document.getElementById('content').innerHTML = data;
						},
						'error': function (data) {
								alert("fa");
							document.getElementById('content').innerHTML = 'Error!';
						}
					});
				
*/
			
}

function get_news($rootScope,$http,PlayListService){
	var server_version="/pfn/v3/";
	var api_get_news="news/";
	date=new Date().toUTCString()+"+00:00";
	
		var user_id='095c384f-a661-45c9-b94f-0dd49a330972';
		var orginalAuthString = "GET" + "\n" + date + "\n" +server_version+ api_get_news+user_id;
		$http({ url:base_url+server_version+ api_get_news+user_id+'?location=%7B%22lon%22%3A118.178493%2C%22lat%22%3A24.4931112%7D&timezoneOffset=480',
				method:'GET',
				headers:{
									"Authorization":encrypt(orginalAuthString),
									//"Authorization":'oB/JlQICKHonsV5hBYdPrWN48hEMR0JOZqJRC7+08eY=',
									"Content-Type": "text/plain; charset=utf-8",
									"X-PFN-Date":date,
									"X-PFN-Partner-ID":""
					   }
				
					   
				
			}).success(function(data, status) {
			
          		newsList=data['result'];
				
				for(var i=0;i<newsList.length;i++){
					var news=new Object();
					news.src=newsList[i].summaryAudioLink;
					news.title=newsList[i].headline;
					news.author=newsList[i].author;
					news.time=newsList[i].time;
					news.category=newsList[i].displayCategory;
					news.publisher=newsList[i].affiliate;
					news.img=newsList[i].photos[0];
					
					PlayListService.newsList.push(news);
				}
				$rootScope.$broadcast( 'newslist.loaded' )
	
		        // $scope.playlist = [
 // 		  	  	{src:"http://d1ggq1hoismrj6.cloudfront.net/audio/7914cc1b-5786-3a4f-a4e7-ebce2f21f3dd1412892862-2014-10-09-22:14:22-1.mp3",
 // 		  		 title:"4 Eagles miss practice, including Ryans, Kendricksh",
 // 		  		 author:"loovis",
 // 		  		 time:"5 hours ago",
 // 		  		 category:'Top Stories',
 // 		  		 publisher:'Fox News'
 // 		  			},
 // 		  			
 // 		        ];
				
			}).error(function(data, status) {
			 	
		  	});

	
}
	
	