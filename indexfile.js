var reg = angular.module("reg", []);
		
	  reg.controller('signCtrl',function($http,$scope){
			$scope.details={
				rname:'',
				rpassword:''
			};
			
			$scope.check=function()
						{	
									$http({
											url:'/sign',
											method:'POST',
											data:$scope.details
										}).success(function(resp){
												if(resp.location!='')
												{
													window.location = '/logged';
												}
												else
												{
													Materialize.toast(resp.msg,2000,'rounded');
												}
									
										})
										.error(function() {	
											Materialize.toast('Error Occured .!',2000,'rounded');
										})
						}
			
		
	  });
		reg.controller('regCtrl', function($http,$scope) {
			$scope.new_form={
				fname:'',
				lname:'',
				uname:'',
				password:'',
				contact:''
			};
		
			
			$scope.sendForm=function()
							{
									$http({
											url:'/register',
											method:'POST',
											data:$scope.new_form
										}).success(function(resp){
											Materialize.toast(resp.msg,2000,'rounded');
										})
										.error(function() {	
											Materialize.toast('Error Occured .!',2000,'rounded');
										})
							};
							
         });
	
	
		$(document).ready(function(){
			$("#si").on('click',function(){
				if($("#register").is(":visible"))
				{
					$("#register").fadeOut();
						setTimeout(function(){
						$("#signin").fadeIn();
					},400);
				}
				else
				{
					$("#signin").fadeIn();
				}
				
			});
			
			$("#si2").on('click',function(){
				if($("#signin").is(":visible"))
				{
					$("#signin").fadeOut();
						setTimeout(function(){
						$("#register").fadeIn();
					},400);
				}
				else
				{
					$("#register").fadeIn();
				}
			});
		});
		
		var uname_error=true;
		
		function check_username()
		{
			var un=document.getElementById("uname").value;
			var data={};
			data.username=un;
			if(un!="")
			{

				$.ajax({
						type: 'POST',
						data: JSON.stringify(data),
				        dataType:'json',
						contentType: 'application/json',
                        url: '/checkuser',						
                        success: function(data){
						   if(data.ret=="yes")
						   {
								uname_error=true;
						   }
						   else
						   {
								uname_error=false;
						   }
						}
				});
			
			}
		}
		
		function validate_r()
		{
			var fname=document.getElementById("fname").value;
			var lname=document.getElementById("lname").value;
			var uname=document.getElementById("uname").value;
			var password=document.getElementById("password").value;
			var contact=document.getElementById("contact").value;
			
			if(fname=='' || lname=='' || uname=='' || password=='' || contact=='')
			{
				Materialize.toast('All the Fields are mandatory',2000,'rounded');
			}
			else if(uname_error)
			{
				Materialize.toast('Username already Exists',2000,'rounded');
			}
			else
			{
				
				var scope = angular.element(document.getElementById("register_form")).scope();
				scope.$apply(function () {
						scope.sendForm();
				});
			}
		}
		
		function validate_s()
		{
			var rname=document.getElementById("rfname").value;
			var rpassword=document.getElementById("rpassword").value;
			
			if(rfname=='' || rpassword=='')
			{
				Materialize.toast('All the Fields are mandatory',2000,'rounded');
			}
			else
			{
				var scope = angular.element(document.getElementById("signin_form")).scope();
				scope.$apply(function () {
						scope.check();
				});
			}
		}