define('webrtc!js!SBIS3.WebRTC.Utils', [], function () {
   var self;
   var formatTime = function(date) {
      function pad(number) {
         var r = String(number);
         if ( r.length === 1 ) {
            r = '0' + r;
         }
         return r;
      }
      return pad(date.getHours())
            + ':' + pad(date.getMinutes())
            + ':' + pad(date.getSeconds())
            + '.' + pad(date.getMilliseconds());
   };

   var patchConsoleFunction = function (original, prefix) {
      return function () {
         var args = Array.prototype.slice.call(arguments);
         args.unshift(prefix);
         self.consoleLog[formatTime(new Date())] = args.map(function (elem) {
            return typeof elem !== 'string' && !(elem instanceof Error) ? JSON.stringify(elem) : elem;
         }).join(' ');
         original.apply(console, arguments);
      };
   };

   if (console) {
      console.error = patchConsoleFunction(console.error, 'ERROR:');
      console.warn = patchConsoleFunction(console.warn, 'WARN:');
   }

   return self = {
      consoleLog: {},
      logger: (function() {
         var extenders = [];

         var log = function(type) {
            return function( /*message*/ ) {
               var args = arguments;
               window.__WebRtcLogs__ && window.__WebRtcLogs__.push(new Date().toLocaleString().replace(',', '') + ' ' + type + ' : ' + JSON.stringify(args));
               Array.prototype.unshift.call(args, formatTime(new Date()));
               Array.prototype.unshift.call(args, 'WebRTC:');
               console && console[type].apply(console, args);
               var typedArgs = [type].concat(Array.prototype.slice.call(args));
               for (var i = 0, length = extenders.length; i < length; extenders[i++].apply(null, typedArgs)) {}
            };
         };

         var extend = function(callback) {
            if (typeof(callback) === 'function') {
               extenders.push(function() {
                  try {
                     callback.apply(null, arguments);
                  } catch (e) {}
               });
            }
         };

         return {
            extend: extend,
            error: log('error'),
            log: log('log'),
            warn: log('warn'),
            info: log('info')
         };

      })(),

      extend: function(target, source) {
         if (!source) return target;
         for (var key in source) if (source.hasOwnProperty(key)) {
            target[key] = source[key];
         }
         return target;
      }
   };
});
