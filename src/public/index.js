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
  // ripples
  $scope.untapped = true
  $scope.cursor = {
    x: 0, y: 0
  }
  $scope.showCursor = false
  $scope.cursorTimeout = 10000
  var cursorPromises = []
  var timer

  // main window touches. this will log all tapped items, and also add the UI ripple of the tapped area
  $scope.ripples = []

  $scope.mouseMoved = function ({ pageX: x, pageY: y }) {
    // dont show cursor if the settings has `false` or 0 as the cursorTimeout
    if ($scope.cursorTimeout) {
      resetCursorTimer()
      $scope.cursor = { x, y }
    }
  }
  var clearCursorPromises = function () {
    cursorPromises.forEach(function (timeout) {
      $timeout.cancel(timeout)
    })
    cursorPromises = []
  }
  var resetCursorTimer = function () {
    clearCursorPromises()
    $scope.showCursor = true
    timer = $timeout(function () {
      $scope.showCursor = false
    }, $scope.cursorTimeout)
    cursorPromises.push(timer)
  }

  $scope.$on('$destroy', function () {
    clearCursorPromises()
  })

  $scope.tapped = function ({ pageX, pageY }) {
    let id = $window.uuid.v4()
    $scope.showCursor = false
    $scope.ripples.push({
      x: pageX, y: pageY, id
    })
    $timeout(function () {
      _.remove($scope.ripples, { id })
    }, 500)

    if ($scope.untapped) {
      $scope.untapped = false
    }
  }

  $scope.visibleAccessPoints = []
  $scope.getAvailableWifi = function () {
    $http({
      method: 'GET',
      url: '/wifi/available'
    }).then(function successCallback (response) {
      $log.info(response)
      $scope.visibleAccessPoints = response.data.visibleAccessPoints
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
      $scope.knownWifiNetworks = response.data.wifiNetworks
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
