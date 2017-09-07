var app = angular.module("myApp");

app.controller('loginController', function($scope, $location, $http) {
  $scope.main = "Login";
  $scope.username = "";
  $scope.password = "";

  $scope.login = function() {
    $http({
      url: '/login',
      method: 'post',
      data: {
        "username": $scope.username,
        "password": $scope.password
      }
    }).then(function(data) {
      if(data.data.success) {
        $location.path('/home');
      }
      else {
        alert(data.data.message);
      }
    }, function(err){})
  }
})
