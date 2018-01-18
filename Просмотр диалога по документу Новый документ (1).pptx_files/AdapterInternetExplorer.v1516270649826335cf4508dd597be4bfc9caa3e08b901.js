define('webrtc!js!SBIS3.WebRTC.Core/resources/Adapter/AdapterInternetExplorer', [
   'Core/Deferred'
], function(cDeferred) {
   var CAB_VERSION = '3.0.0.1',
      CAB_ID = 'WebrtcEverywherePluginId',
      CAB_CLASS_ID = '7FD49E23-C8D7-4C4F-93A1-F7EACFA1EC53',
      CAB_LINK = '/webrtc/static/data/webrtceverywhere.cab#version=' + CAB_VERSION.replace(/\./g, ',');

   var maybeFixConfiguration = function(pcConfig) {
     if (!pcConfig) {
       return;
     }
     for (var i = 0; i < pcConfig.iceServers.length; i++) {
       if (pcConfig.iceServers[i].hasOwnProperty('urls')){
         pcConfig.iceServers[i]['url'] = pcConfig.iceServers[i]['urls'];
         delete pcConfig.iceServers[i]['urls'];
       }
     }
   }

   var setOutputAudioDevice = function(tag) {
      var result = new cDeferred();

      if (tag && typeof tag.setSinkId === 'function') {
         result.callback(tag.setSinkId('communications'));
      } else {
         result.callback('setSinkId does not supported');
      }

      return result;
   };

   var drawImage = function(context, video, x, y, width, height) {
      var pluginObj = extractPluginObj(video);
      if (pluginObj && pluginObj.isWebRtcPlugin && pluginObj.videoWidth > 0 && pluginObj.videoHeight > 0) {
         if (typeof pluginObj.getScreenShot !== 'undefined') {
            var bmpBase64 = pluginObj.getScreenShot();
            if (bmpBase64) {
               var image = new Image();
               image.onload = function() {
                  context.drawImage(image, 0, 0, width, height);
               };
               image.src = 'data:image/png;base64,' + bmpBase64;
            }
         } else {
            var imageData = context.createImageData(pluginObj.videoWidth, pluginObj.videoHeight);
            if (imageData) {
               pluginObj.fillImageData(imageData);
               context.putImageData(imageData, x, y /*, width, height*/ );
            }
         }
      }
   };

   var attachEventListener = function(elt, type, listener, useCapture) {
      var _pluginObj = extractPluginObj(elt);
      if (_pluginObj) {
         _pluginObj.bindEventListener(type, listener, useCapture);
      } else {
         if (typeof elt.addEventListener !== 'undefined') {
            elt.addEventListener(type, listener, useCapture);
         } else if (typeof elt.addEvent !== 'undefined') {
            elt.addEventListener('on' + type, listener, useCapture);
         }
      }
   };

   var extractPluginObj = function(elt) {
      return elt.isWebRtcPlugin ? elt : elt.pluginObj;
   };

   var getUserMedia = (function() {
      var getUserMediaDelayed;

      return function(constraints, successCallback, errorCallback) {
         if (document.readyState !== 'complete') {
            if (!getUserMediaDelayed) {
               getUserMediaDelayed = true;
               attachEventListener(document, 'readystatechange', function() {
                  if (getUserMediaDelayed && document.readyState == 'complete') {
                     getUserMediaDelayed = false;
                     if (!getPlugin()) {
                        return errorCallback('plugin_error');
                     }
                     getPlugin().getUserMedia(constraints, successCallback, errorCallback);
                  }
               });
            }
         } else {
            if (!getPlugin()) {
               return errorCallback('plugin_error');
            }
            getPlugin().getUserMedia(constraints, successCallback, errorCallback);
         }
      };
   })();

   var attachMediaStream = function(element, stream) {
      if (!element || !stream) {
         return element;
      }
      if (element.isWebRtcPlugin) {
         element.src = stream;
         return element;
      } else if (element.nodeName.toLowerCase() === 'video') {
         if (!element.pluginObj && stream) {
            var _pluginObj = document.createElement('object');
            var _isIE = (Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject')) || ('ActiveXObject' in window);
            if (_isIE) {
               _pluginObj.setAttribute('classid', 'CLSID:' + CAB_CLASS_ID);
            } else {
               _pluginObj.setAttribute('type', 'application/webrtc-everywhere');
            }
            element.pluginObj = _pluginObj;

            _pluginObj.setAttribute('className', element.className);
            _pluginObj.setAttribute('innerHTML', element.innerHTML);
            //var width;
            //var height;
            //var width = element.getAttribute("width");
            //var height = element.getAttribute("height");
            //var bounds = element.getBoundingClientRect();
            //if (!width) width = bounds.right - bounds.left;
            //if (!height) height = bounds.bottom - bounds.top;

            //width = width || 100;
            //height = height || 100;

            /*
            if ("getComputedStyle" in window) {
            var computedStyle = window.getComputedStyle(element, null);
            if (!width && computedStyle.width != 'auto' && computedStyle.width != '0px') {
            width = computedStyle.width;
            }
            if (!height && computedStyle.height != 'auto' && computedStyle.height != '0px') {
            height = computedStyle.height;
            }
            }
            if (width) _pluginObj.setAttribute('width', width);
            else _pluginObj.setAttribute('autowidth', true);
            if (height) _pluginObj.setAttribute('height', height);
            else _pluginObj.setAttribute('autoheight', true);
            */

            document.body.appendChild(_pluginObj);
            if (element.parentNode) {
               element.parentNode.replaceChild(_pluginObj, element); // replace (and remove) element
               // add element again to be sure any query() will succeed
               document.body.appendChild(element);
               element.style.visibility = 'hidden';
            }
         }

         if (element.pluginObj) {
            element.pluginObj.bindEventListener('play', function( /* objvid */ ) {
               if (element.pluginObj) {
                  //if (element.pluginObj.getAttribute("autowidth") && objvid.videoWidth) {
                  //    element.pluginObj.setAttribute('width', objvid.videoWidth/* + "px"*/);
                  //}
                  //if (element.pluginObj.getAttribute("autoheight") && objvid.videoHeight) {
                  //    element.pluginObj.setAttribute('height', objvid.videoHeight/* + "px"*/);
                  //}
               }
            });
            element.pluginObj.src = stream;
         }

         return element.pluginObj;
      } else if (element.nodeName.toLowerCase() === 'audio') {
         return element;
      }
   };

   var MediaStreamTrack = {
      getSources: (function() {
         var getSourcesDelayed;
         return function(gotSources) {
            if (document.readyState !== 'complete') {
               if (!getSourcesDelayed) {
                  getSourcesDelayed = true;
                  attachEventListener(document, 'readystatechange', function() {
                     if (getSourcesDelayed && document.readyState == 'complete') {
                        getSourcesDelayed = false;
                        getPlugin().getSources(gotSources);
                     }
                  });
               }
            } else {
               getPlugin().getSources(gotSources);
            }
         };
      })()
   };

   /**
    * Добавляем ActiveX через document.body.appendChild, иначе не будут работать события createOffer, createAnswer
    *
    * @param {Element} element - plugin element
    *
    * @return {Element} - новый plugin element
    */
   var replacePlugin = function(element) {
      document.body.removeChild(element);

      var pluginObj = document.createElement('object');

      pluginObj.setAttribute('classid', 'CLSID:' + CAB_CLASS_ID);
      pluginObj.setAttribute('id', CAB_ID);
      pluginObj.setAttribute('codebase', CAB_LINK);

      document.body.appendChild(pluginObj);

      pluginObj.setAttribute('replaced', 'true');
      pluginObj.setAttribute('width', '0');
      pluginObj.setAttribute('height', '0');
      pluginObj.setAttribute('style', 'display: none;');

      return pluginObj;
   }

   /**
    * Проверяем плагин
    *
    * @param {Element} plugin - plugin element
    *
    * @return {Boolean}
    */
   var verifyPlugin = function(plugin) {
      try {
         if (plugin.versionName !== CAB_VERSION) {
            throw new Error('Wrong plugin version');
         }
      } catch (e) {
         return false;
      }

      return true;
   };

   /**
    * Получить plugin element
    *
    * @return {Element || null} - Если verifyPlugin не прошёл, вернётся null, иначе - работающий plugin
    */
   var getPlugin = (function() {
      var pluginReplaced = false;
      var pluginVerified = false;
      var verificationResult = false;

      return function() {
         var element = document.getElementById(CAB_ID);

         if (!pluginVerified) {
            verificationResult = verifyPlugin(element);
            pluginVerified = true;
         }

         if (!verificationResult) {
            return;
         }

         if (pluginReplaced) {
            return element;
         }

         pluginReplaced = true;

         return replacePlugin(element);
      };
   })();

   var installPlugin = function() {
      if (document.getElementById(CAB_ID)) {
         return;
      }

      var isInternetExplorer = !!((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject')) || ('ActiveXObject' in window));

      var pluginElement = '';
      if (isInternetExplorer) {
         pluginElement = '<object width="0" height="0" style="display: none;" id="' + CAB_ID + '" classid="CLSID:' + CAB_CLASS_ID + '" codebase="' + CAB_LINK + '"></object>';
      } else {
         pluginElement = '<object width="0" height="0" style="display: none;" id="' + CAB_ID + '" type="application/webrtc-everywhere"></object>';
      }

      $(document.body).append(pluginElement);
   };

   var RTCPeerConnection = function(configuration, constraints) {
      maybeFixConfiguration(configuration);
      return getPlugin().createPeerConnection(configuration, constraints);
   };

   var RTCIceCandidate = function(RTCIceCandidateInit) {
      return getPlugin().createIceCandidate(RTCIceCandidateInit);
   };

   var RTCSessionDescription = function(RTCSessionDescriptionInit) {
      return getPlugin().createSessionDescription(RTCSessionDescriptionInit);
   };

   var getVideoConstraints = function() {
      return false;
   };

   var processCreateOfferOptions = function(options) {
      return {
         'mandatory': {
            'OfferToReceiveAudio': options.receiveAudio,
            'OfferToReceiveVideo': options.receiveVideo
         }
      };
   };

   var PeerConnectionConstraints = {};

   if (navigator.mozGetUserMedia || navigator.webkitGetUserMedia || (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/))) {
      return null;
   } else {
      window.MediaStreamTrack = MediaStreamTrack;

      if (document.body) {
         installPlugin();
      } else {
         attachEventListener(window, 'load', function() {
            installPlugin();
         });
         attachEventListener(document, 'readystatechange', function() {
            if (document.readyState == 'complete') {
               installPlugin();
            }
         });
      }
   }

   return {
      MediaStreamTrack: MediaStreamTrack,
      PeerConnectionConstraints: PeerConnectionConstraints,
      RTCIceCandidate: RTCIceCandidate,
      RTCPeerConnection: RTCPeerConnection,
      RTCSessionDescription: RTCSessionDescription,
      attachMediaStream: attachMediaStream,
      drawImage: drawImage,
      getUserMedia: getUserMedia,
      getVideoConstraints: getVideoConstraints,
      processCreateOfferOptions: processCreateOfferOptions,
      setOutputAudioDevice: setOutputAudioDevice
   };
});
