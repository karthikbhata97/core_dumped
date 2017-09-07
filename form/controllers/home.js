var app = angular.module("myApp");

app.controller("homeController", function($scope, $http, $resource, $route , FileName) {
  $scope.main = "Home"




  $scope.add_record = function(record) {
    alert(record);
  //  $scope.record.filename=FileName.getname();
    // uploadAPI.upload($scope.myFile,record).then(function(data) {
    $http({
      url: '/addrecord',
      method: 'post',
      data: record
    }).then(function(data) {
      if(data.data.success) {
        $scope.newrecord = {}
        alert("success")
      }
      else {
        alert("Failed")
      }
    }, function(err){});
  }
})
