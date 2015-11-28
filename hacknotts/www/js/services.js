angular.module('starter.services', [])

.factory('LoginService', ['$q', function($q) {
  return {
    loginUser: function(name, pw) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      if (name == 'user' && pw == 'secret') {
        deferred.resolve('Welcome ' + name + '!');
      } else {
        deferred.reject('Wrong credentials.');
      }
      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    }
  }
}])

.service('SocketService', function() {
  var self = this;
  var handlers = {};
  var socket = io('http://www.google.com');

  self.send = function(e, message) {
    socket.emit(e, message);
  }
  
  self.registerHandler = function(handler, callback) {
    handlers[handler] = callback;
  }

  socket.on('data_back', function (data) {
    if (handlers[data.handler]) {
      handlers[data.handler](data)
    }
  });
})
;