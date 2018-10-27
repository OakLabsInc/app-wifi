window.oak.disableZoom()

window.reload = function () {
  window.oak.reload()
}

window.app = window.angular
  .module('wifiApp', [
    'ngAnimate',
    'ngMessages',
    'ngMaterial'
  ])
  .config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.generateThemesOnDemand(true)
  }])
  .constant('os', window.os)
  .constant('oak', window.oak)
  .constant('_', window.lodash)
  .run(function ($rootScope) {
    $rootScope._ = window.lodash
  })
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self'])
  })

window.app.controller('appController', function ($log, $timeout, $scope, $http, $window, oak, _) {
  $scope.visible_access_points = []
  $scope.getAvailableWifi = function () {
    $http({
      method: 'GET',
      url: '/wifi/available'
    }).then(function successCallback (response) {
      $log.info(response)
      $scope.visible_access_points = response.data.visible_access_points
    }, function errorCallback (response) {
      $log.info(response)
    })
  }
  $scope.getKnownWifiNetworks = function () {
    $http({
      method: 'GET',
      url: '/wifi/known'
    }).then(function successCallback (response) {
      $log.info(response)
      $scope.known_wifi_networks = response.data.wifi_networks
    }, function errorCallback (response) {
      $log.info(response)
    })
  }

  $scope.addWifi = function (wifi) {
    var url = '/wifi/add?wifi=' + JSON.stringify(wifi)
    $http.get(url).then(function (response) {
      $log.info(response)
      $scope.getKnownWifiNetworks()
    }, function (response) {
      $log.info(response)
    })
  }
  $scope.forgetWifi = function (wifi) {
    var url = '/wifi/forget?ssid=' + wifi.ssid
    $http.get(url).then(function (response) {
      $log.info(response)
      $scope.getKnownWifiNetworks()
    }, function (response) {
      $log.info(response)
    })
  }

  $scope.getAvailableWifi()
  $scope.getKnownWifiNetworks()
  oak.ready()
})
