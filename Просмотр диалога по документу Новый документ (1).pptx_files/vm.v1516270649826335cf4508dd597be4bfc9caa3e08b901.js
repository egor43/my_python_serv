var _ua = navigator.userAgent.toLowerCase();
var now = +new Date(), timeShift2014 = +new Date(2014, 9, 26);

require(["Core/detection", 'Core/constants'], function (detection, $wsConst) {
   $wsConst.videoMsgAvailability = typeof(window) !== 'undefined' && (function () {
            var pc = window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.RTCPeerConnection;
            return (pc && !!pc.prototype) || detection.isMobileIOS || detection.isMobileAndroid;
         }());
   define('vm', function () {
      return {
         load: function (name, require, onload) {
            // для более простого обращения к VideoContainer
            if (name === 'MediaContainer') {
               name = 'MediaContainer/MediaContainer'
            }
            else if (name === 'VideoContainer') {
               name = 'VideoContainer/VideoContainer'
            }
            else if (name === 'AudioRecorder') {
               name = 'AudioRecorder/AudioRecorder'
            }
            else if (name === 'AudioPlayer') {
               name = 'AudioPlayer/AudioPlayer'
            }
            require(['/vmsg/' + name + '.v' + $wsConst.buildnumber + '.js'], onload, onload.error)
         },
         isVmsgAvailable: function () {
            return !!(detection.isMobileIOS || detection.isMobileAndroid || navigator.mozGetUserMedia || navigator.webkitGetUserMedia);
         }
      }
   });
});