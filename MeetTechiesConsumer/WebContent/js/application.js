var meetUpManagement=angular.module("meetUpManagement",['ngRoute']);
meetUpManagement.config(function($routeProvider) {
	$routeProvider
	.when("/",
	{
		templateUrl:"templates/main.html",
		controller:'mainController'
	})
	.when("/home",
	{
		templateUrl:"templates/main.html",
		controller:'mainController'
	})
	.when("/login",
	{
		templateUrl:"templates/login.html",
		controller:'loginController'
	})
	.when("/register",
	{
		templateUrl:"templates/register.html",
		controller:'registerController'
	})
	.when("/about",
	{
		templateUrl:"templates/about.html",
		controller:'aboutController'
	})
	.when("/services",
	{
		templateUrl:"templates/services.html",
		controller:'servicesController'
	})
	.when("/meetups",
	{
		templateUrl:"templates/meetups.html",
		controller:'meetUpsController'
	})
	.when("/logout",
	{
		templateUrl:"templates/logout.html",
		controller:'logoutController'
	})
	.when("/userHome",
	{
		templateUrl:"templates/userHome.html",
		controller:'userHomeController'
	})
	.when("/admin",
	{
		templateUrl:"templates/admin.html",		
		controller:'adminMeetUpController'
	})
});

meetUpManagement.controller('meetUpsController',['$window','$scope','$http','$location','$rootScope',function($window,$scope,$http,$location,$rootScope)	
{	
	 $http.get("http://localhost:8080/meetups/all")
	    .then(function (response) {$scope.meetUps = response.data;});
	 
	 if($rootScope.logout){
		 var audiences;
		 var userID = $window.localStorage.userid;
		 $http.get("http://localhost:8080/audiences/allEvents/"+userID)
		 	.then(function (response) {audiences = response.data;
		 	//console.log(JSON.stringify(audiences));
		 	for(var i=0;i<$scope.meetUps.length;i++){
		 		for(var j=0;i<audiences.length;j++){
		 			if($scope.meetUps[i].meetUpID==audiences[j].meetUpID){
		 				//console.log(JSON.stringify($scope.meetUps[i]));
		 				$scope.meetUps[i].alreadyRegistered=true;
		 				break;
		 			}
		 		}
		 	}
		 	});
		 }
	 $scope.registerMeetup = function(meetUp){
		 if(!$rootScope.logout){
			 $location.path('/login');
		 }
		 else{
			 var audienceData = {
					 meetUpId:meetUp.meetUpID,
					 userID: $window.localStorage.userid
			 }
			 $http.post("http://localhost:8080/audiences",audienceData)
			 	.then(function(response){
			 		if(response.status==208)
			 			$scope.responseData = {message:response.data,
			 								statusCode:response.status};
			 		else{
			 			$scope.responseData = {message:"Congratulation! You have been successfully registered for the MeetupID: "+meetUp.meetUpID,
 								statusCode:response.status};
			 			meetUp.alreadyRegistered=true;
			 		}
			 	});
		 }
	 }
}]);

meetUpManagement.controller('mainController',function($scope)		
{
	$scope.message="you are in main page";
	//$scope.isBlog=true;	
}
);


meetUpManagement.controller('logoutController',function($scope,$rootScope)		
{
	console.log("logout controller called");
	$rootScope.login=true;
	$rootScope.register=true;
	$rootScope.services=true;
	$rootScope.about=true;
	$rootScope.home=true;
	$rootScope.meetup=true;
	$rootScope.forum=false;
	$rootScope.jobs=false;
	$rootScope.logout=false;
	$rootScope.chat=false;
	$rootScope.admin=false;
	$rootScope.users=false;
}
);
meetUpManagement.controller('loginController',['$window','$scope','$http','$location','$rootScope',function($window,$scope,$http,$location,$rootScope)		
		{
	
             console.log(" login controller");
			 $scope.login=function()
			 {
				  var loginData={
						emailID: $scope.emailID,	
						password: $scope.password,  
				  };
				  $http.post('http://localhost:8080/user/login',loginData).then(successLogin,errorLogin);
			 };		
					  
			function successLogin(response) {
				 console.log("result   data:"+response.data);
				 var message=response.data.toString();
				 var arr = message.split(":");
				 var r = arr[0];
				 var name = arr[1];
				 $window.localStorage.userid = r;
				 $rootScope.name = name;
				 //console.log("r:"+r);
				 //console.log("Name"+name);
			     
				 if(r==1)
				{
					$rootScope.login=false;
					$rootScope.register=false;
					$rootScope.services=false;
					$rootScope.about=false;
					$rootScope.home=false;
					$rootScope.meetup=false;					
					$rootScope.admin=true;
					//$rootScope.users=true;
					$rootScope.registeredUsers=true;
					$rootScope.logout=true;
					console.log("before /admin")
					$location.path('/admin');
				}	
				else
				{
					$scope.name = name;
					//$rootScope.admin=true;
					$rootScope.forum=true;
					$rootScope.jobs=true;
					$rootScope.users=true;
					$rootScope.login=false;
					$rootScope.register=false;
					$rootScope.services=false;
					$rootScope.about=false;
					$rootScope.home=false;
					$rootScope.logout=true;
					$rootScope.chat=true;
					//console.log('logout:'+$rootScope.logout);
					//console.log("wat is this ya:"+response.data);
					
					$location.path('/userHome');
				}
					
			};
		
			function errorLogin(response,$scope){
				console.log("Invalid credentials");
				$rootScope.userName="";
				$rootScope.password="";
				$rootScope.message="username/password incorrect";
				$location.path('/login');
			};
		}
	]
);

meetUpManagement.controller('adminMeetUpController',function($window,$scope,$http,$location,$rootScope)	
{	
	//console.log("i am in adminMeetup controller");
	//console.log("after this");
	console.log("I am in adminMeetup controller");
	//console.log("after this");
	if($rootScope.admin)
		$http.get("http://localhost:8080/meetups/all")
	   	.then(function (response) {$scope.meetUps = response.data;});
	else
		$location.path('/');
			    	
	$scope.newMeetUp={};
	console.log("In Controller");
	$scope.addMeetup=function()
	{
		var dataObj = {
				location: $scope.location,
				guest: $scope.guest,
				presenter: $scope.presenter,
				title: $scope.title,
				date: $scope.date,
				startTime: $scope.startTime,
				endTime: $scope.endTime,
				description:$scope.description
			};
		console.log("title:"+dataObj);
		$http.post('http://localhost:8080/meetups',dataObj)		 
	 	    .then(function (response) {
	 	    	$http.get("http://localhost:8080/meetups/all")
	    		.then(function (response) {
	    			$scope.meetUps = response.data;
	    		});	    	
	    });
	 	    
	};
	$scope.editMeetUp=function(meetUp)
	{
		console.log("inside editMeetUp");
		console.log("meetUp:"+meetUp);
		$scope.MeetUpDataToEdit=meetUp;
	};
	$scope.saveEdit=function()
	{
		var meetUpId = $scope.MeetUpDataToEdit.meetUpID;
		
		var dataObj = {				
				location: $scope.MeetUpDataToEdit.location,
				guest: $scope.MeetUpDataToEdit.guest,
				presenter: $scope.MeetUpDataToEdit.presenter,
				title: $scope.MeetUpDataToEdit.title,
				date: $scope.MeetUpDataToEdit.date,
				startTime: $scope.MeetUpDataToEdit.startTime,
				endTime: $scope.MeetUpDataToEdit.endTime,
				description:$scope.MeetUpDataToEdit.description
			};
		$http.put('http://localhost:8080/meetups/'+meetUpId, dataObj)		
		    .then(function (response) {
		    	$http.get("http://localhost:8080/meetups/all")
		    		.then(function (response) {
		    			$scope.meetUps = response.data;
		    		});	    	
		    });
	};
	$scope.deleteMeetUp=function(meetUpId)
	{
		console.log("delete meetUp called");
		$http['delete']('http://localhost:8080/meetups/'+meetUpId)
			.then(function (response) {
		    	$http.get("http://localhost:8080/meetups/all")
	    		.then(function (response) {
	    			$scope.meetUps = response.data;
	    		});	    	
	    });
	}			
});
	
	
meetUpManagement.controller('registerController',function($scope,$http)
{	    
	$scope.register=function()
	{
		var userData={
				userName: $scope.userName,
				mobileNumber: parseInt($scope.mobileNumber,10),
				emailID: $scope.emailID,
				password: $scope.password,
				company: $scope.company,
				companyAddress: $scope.companyAddress,
				technicalCapabilities: $scope.technicalCapabilities,
				yearsOfExperience: $scope.experience
		};
		console.log(userData);
		var config = {
                headers : 
                {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Access-Control-Allow-Header':'content-type'
                }
        	};							
	$http.post('http://localhost:8080/user',userData,config)
	.then(function successReturn(response) {
				console.log("status:"+response.status);
				//console.log(userData);
				console.log("Header:  " + response.headers);
				console.log("Data:  " + response.data);
				console.log("Config:  "+response.config);
				$scope.message = "Data registered successfully";
			},
		function errorReturn(response) {
		        $scope.message = response.data;	
		        console.log("Data:  " + response.data);
				alert('POST failed.');
			}							
		);	
	}
});

/*letzChaat.controller("adminJobsController",function($scope,$http,$rootScope)
{
	 $rootScope.login=false;
		$rootScope.register=false;
		$rootScope.services=false;
		$rootScope.about=false;
		$rootScope.home=false;
		$rootScope.adminBlog=true;
		$rootScope.users=true;
		$rootScope.registeredUsers=true;
		$rootScope.logout=true;
		$rootScope.adminJobs=true;
	  console.log("you are in adminjobs");
	  console.log("inside job controller");
	    $http.get("http://localhost:8080/letzchaat/viewAllJobs")
	    .then(function (response) {$scope.jobs = response.data;});
	   
});

*/

meetUpManagement.controller('aboutController',function($scope)		
	{
		$scope.message="you are in about page";
	}
);
meetUpManagement.controller('servicesController',function($scope)		
	{
		$scope.message="you are in services page";
	}
);
/*letzChaat.controller("blogController",function($scope,$http)	
		{	
			 $http.get("http://localhost:8080/letzchaat/viewBlogs")
			    .then(function (response) {$scope.blogs = response.data;});
			
			$scope.newBlog={};
			console.log("In Controller");
			$scope.addBlog=function(newBlog)
			{
				var dataObj = {
		    			blogTitle:$scope.blogTitle,
		    			blogDescription:$scope.blogDescription,
		 				category:$scope.category
		 		};
				console.log("title:"+dataObj);
				 var res = $http.post('http://localhost:8080/letzchaat/addBlog',dataObj);
				 $http.get("http://localhost:8080/letzchaat/viewBlogs")
			 	    .then(function (response) {$scope.blogs = response.data;});
			 		res.success(function(data, status, headers, config) {
			 			$scope.message = data;
			 			console.log("status:"+status);
			 		});
			 		 
			};
			$scope.editBlog=function(blog)
			{
				console.log("inside editblog");
				console.log("blog:"+blog);
				$scope.blogDataToEdit=blog;
			}
			$scope.saveEdit=function()
			{
				var dataObj = {
		    			blogTitle:$scope.blogDataToEdit.blogTitle,
		    			blogDescription:$scope.blogDataToEdit.blogDescription,
		 				category:$scope.blogDataToEdit.category,
		 				blog_id:$scope.blogDataToEdit.blog_id
		 		};
				$http.put('http://localhost:8080/letzchaat/updateBlog', dataObj);
				$http.get("http://localhost:8080/letzchaat/viewBlogs")
		 	    .then(function (response) {$scope.blogs = response.data;});
			}
			$scope.deleteBlog=function(blogDataToEdit)
			{
				console.log("delete blog called");
				blog_id:$scope.blogDataToEdit.blog_id;
				console.log("blog_id:"+blogDataToEdit.blog_id);
				$http.delete("http://localhost:8080/letzchaat/deleteBlog/"+blogDataToEdit.blog_id);
				 $http.get("http://localhost:8080/letzchaat/viewBlogs")
			 	    .then(function (response) {$scope.blogs = response.data;});
			}
			
		}

		);

letzChaat.controller('forumController',function($scope)		
		{
			$scope.message="you are in forum page";
		}
		);
*/
meetUpManagement.controller('userHomeController',function($scope)		
		{
			$scope.message="you are in userhome page";
		}
		);

meetUpManagement.controller('adminController',function($scope)		
		{
			$scope.message="you are in admin controller";
		}
		);


/*letzChaat.controller('jobsController',function($scope,$http)		
		{
	console.log("inside job controller");
    $http.get("http://localhost:8080/letzchaat/viewAllJobs")
    .then(function (response) {$scope.jobs = response.data;});
    
    $scope.applyJob=function()
    {
    	 console.log("applyJob function called");
    	 var jobData={
           jobId:$scope.jobId,
    	 registrationNumber:$scope.registrationNumber,
    	 studentId:$scope.studentId,
    	 certificateNumber:$scope.certificateNumber	
    	 };
    	 var res = $http.post('http://localhost:8080/letzchaat/registerJob',jobData);
    }
		}
       
		);
*/
