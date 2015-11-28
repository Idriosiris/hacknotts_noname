angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

.controller('OutCtrl', function($scope, LoginService, $ionicPopup, $state) {
  $scope.data = {};

  $scope.login = function() {
    console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
    LoginService.loginUser($scope.data.username, $scope.data.password)
      .success(function(data) {
        $state.go('in.home');
      })
      .error(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
  }
})

.controller('InCtrl', function(SocketService, $scope, $state, $ionicScrollDelegate, $location) {

})
;