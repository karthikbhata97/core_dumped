var app = angular.module("myApp", ['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: '/views/login.html',
    controller: 'loginController'
  })
  .when('/home', {
    templateUrl: '/views/home.html',
    controller: 'homeController'
  })
  .otherwise({
    redirectTo: '/login'
  })
})



app.directive('fileModel', ['$parse', 'FileSizeError', 'FileName', function ($parse, FileSizeError, FileName) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      var maxsize = 2000000;
      element.bind('change', function(){
        scope.$apply(function(){
          FileName.setname(element[0].files[0].name);
          modelSetter(scope, element[0].files[0]);
          var filesize = element[0].files[0].size;
          if(filesize>maxsize)
          FileSizeError.seterror(true)
          else
          FileSizeError.seterror(false)
        });
      });
    }
  };
}]);

app.factory('FileName', function() {
  var file = {
    name: null
  }
  return {
    getname: function() {
      return file.name;
    },
    setname: function(val) {
      file.name = val
    }
  }
})


app.factory('FileSizeError', function() {
  var whatsup = {
    error: false
  }
  return {
    geterror: function() {
      return whatsup.error;
    },
    seterror: function(val) {
      whatsup.error = val;
    }
  }
});










app.service('uploadAPI', function($http) {
  return {
    upload: function(file,record) {
      var formData = new FormData();
      formData.append("file", file);
      formData.append("record", record);
      alert(formData);
      return $http({
        url: '/addrecord',
        data: formData,
        method: 'post',
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      });
    }
  }
});



app.controller('mainController', function($scope) {
  $scope.main = "Smart Notice Board";
})
