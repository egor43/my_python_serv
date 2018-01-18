define('webrtc/static/socket', [
   'SBIS.VideoCall/Environment',
   'Core/Deferred',
   'webrtc!js!SBIS3.WebRTC.GUI/resources/uuid',
   'webrtc!js!SBIS3.WebRTC.Utils'
], function (environment, Deferred, uuid, Utils) {
   var wsUrl = (location.protocol === 'http:' ? 'ws' : 'wss') + '://' + location.hostname + '/webrtc/websocket',
       socket;

   var deferredStore = {
      store:  {},
      create: function (requestId) {
         var d = new Deferred();
         this.store[requestId] = d;
         return d;
      },
      remove: function (requestId) {
         delete this.store[requestId];
      },
      get:    function (requestId) {
         return this.store[requestId];
      }
   };

   var createSocket = function (event) {
      if (socket) {
         event && Utils.logger.error('socket reopen', {
            wasClean: event.wasClean,
            code: event.code,
            reason: event.reason,
            message: event.message
         });
         socket.onclose = null;
         socket.onerror = null;
         try {
            socket.close();
         } catch (err) {}
      }
      socket = new WebSocket(wsUrl);
      socket.onopen = function () {
         Utils.logger.log('socket', 'opened');
      };
      socket.onclose = createSocket;
      socket.onerror = createSocket;
      socket.onmessage = function (event) {
         var response  = JSON.parse(event.data),
             requestId = response.requestId,
             payload   = JSON.parse(response.payload),
             status    = response.status,
             defer     = deferredStore.get(requestId);

         if (defer && !defer.isReady()) {
            defer[status === 200 ? 'callback' : 'errback'](payload);
            deferredStore.remove(requestId);
         } else {
            Utils.logger.error('socket.send', !defer ? 'no response deferred' : 'response deferred is ready');
         }
      };
   };

   if (environment.inProgress && window.WebSocket) {
      createSocket();
   }
   return function initSocket (type) {
      return {
         send: function socketSend (data) {
            return Deferred.success().addCallback(function () {
               if (!socket || socket.readyState !== WebSocket.OPEN) {
                  return new Error('no socket');
               } else {
                  try {
                     var requestId = uuid.v4();
                     socket.send(JSON.stringify({
                        requestId: requestId,
                        payload:   data,
                        type:      type,
                     }));
                     return deferredStore.create(requestId);
                  } catch (err) {
                     Utils.logger.error('socket.send', err);
                     socket.close();
                     return err;
                  }
               }
            });
         }
      };
   };
});