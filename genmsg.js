var angular= require('angular');

var app=angular.module('returnMsg');


function get(data,res){
		app.controller('msgCtrl',function($scope){
			$scope.m=data;
		});
		res.sendFile('index.html');
}

module.exports=get;
