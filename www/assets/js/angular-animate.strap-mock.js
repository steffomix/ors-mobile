angular.module('ngAnimate', [])

  .factory('$$animateReflow', ['$window', '$timeout', function($window, $timeout) {
    var requestAnimationFrame = $window.requestAnimationFrame       ||
                                $window.webkitRequestAnimationFrame ||
                                function(fn) {
                                  return $timeout(fn, 10, false);
                                };

    var cancelAnimationFrame = $window.cancelAnimationFrame       ||
                               $window.webkitCancelAnimationFrame ||
                               function(timer) {
                                 return $timeout.cancel(timer);
                               };
    return function(fn) {
      var id = requestAnimationFrame(fn);
      return function() {
        cancelAnimationFrame(id);
      };
    };
  }])