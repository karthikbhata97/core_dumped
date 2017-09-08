var app = angular.module("myApp");

app.controller("homeController", function($scope, $http, $resource, $route , FileName, uploadAPI) {

    var info=$resource('/fetchdetails');
    var devices = $resource('/getdevices');
    info.query(function(result){
      $scope.feed = result;
       $scope.path = result.filepath;
     })

    devices.query(function(result){
       $scope.devicefeed = result;
      })

    $scope.add_record = function(add_record) {
      $scope.record = add_record;
      console.log($scope.record);
      $scope.record.filename=FileName.getname();
      uploadAPI.upload($scope.myFile, $scope.record).then(function(data) {
          if(data.data.success) {
            // $scope.newrecord = {}
            alert("success")
            location.reload();
          }
          else {
            alert("Failed")
          }
        }, function(err){});
      }

    $scope.add_device = function(device) {
    //  alert(JSON.stringify(device))
      $http({
           url: '/adddevice',
           method: 'post',
           data: device
         }).then(function(data) {
           if(data.data.success) {
             $scope.device = {}
             alert("success")
             location.reload();
           }
           else {
             alert("Failed")
           }
         }, function(err){});
    }

    $scope.deleteData = function(item) {
      $http({
           url: '/deletedata',
           method: 'post',
           data: item
         }).then(function(data) {
           if(data.data.success) {
             $scope.device = {}
             alert("deleted successfully")
             location.reload();
           }
           else {
             alert("Failed")
           }
         }, function(err){});
    }

    $scope.deleteDevice = function(item) {
      $http({
           url: '/deleteDevice',
           method: 'post',
           data: item
         }).then(function(data) {
           if(data.data.success) {
             $scope.device = {}
             alert("deleted successfully")
             location.reload();
           }
           else {
             alert("Failed")
           }
         }, function(err){});
    }

})
