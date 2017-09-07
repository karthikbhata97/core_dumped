var app = angular.module("myApp");

app.controller("homeController", function($scope, $http, $resource, $route , FileName, uploadAPI) {
  $scope.main = "Home"

  $scope.add_record = function(add_record) {

    $scope.record = add_record;
    console.log($scope.record);
    $scope.record.filename=FileName.getname();
    uploadAPI.upload($scope.myFile, $scope.record).then(function(data) {
      if(data.data.success) {
        // $scope.newrecord = {}
        alert("success")
      }
      else {
        alert("Failed")
      }
    }, function(err){});
  }
})
