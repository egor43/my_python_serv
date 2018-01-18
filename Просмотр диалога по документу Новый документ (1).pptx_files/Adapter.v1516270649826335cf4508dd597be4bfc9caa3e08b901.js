define('webrtc!js!SBIS3.WebRTC.Core/resources/Adapter', [
   'Core/core-merge',
   'Core/Deferred',
   'webrtc!js!SBIS3.WebRTC.Core/resources/Adapter/AdapterInternetExplorer',
   'webrtc!js!SBIS3.WebRTC.Utils',
   'SBIS.VideoCall/Environment'
], function(cMerge, cDeferred, AdapterInternetExplorer, Utils, __webRTC) {
   /*
    *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
    *  Copyright (c) 2014 Doubango Telecom. All Rights Reserved.
    *
    *  Use of this source code is governed by a BSD-style license
    *  that can be found in the LICENSE file in the root of the source
    *  tree.
    */
   var RTCPeerConnection = null;
   var PeerConnectionConstraints = {};
   var getUserMedia = null;
   var getVideoConstraints = function () {
      return true;
   };
   var getAudioConstraints = function() {
      return true;
   };
   var attachMediaStream = null;
   var reattachMediaStream = null;
   var webrtcDetectedBrowser = null;
   var webrtcDetectedVersion = null;
   var processCreateOfferOptions = function (options) {
      return {
         'mandatory': {
            'OfferToReceiveAudio': options.receiveAudio,
            'OfferToReceiveVideo': options.receiveVideo
         }
      };
   };
   var setOutputAudioDevice = function (tag, deviceId) {
      var result = new cDeferred();

      var processSetSinkIdResult = function (tag, setSinkIdResult, resultDefer) {
         if (!resultDefer.isReady()) {
            if (setSinkIdResult && typeof setSinkIdResult.then === 'function' && typeof setSinkIdResult.catch === 'function') {
               setSinkIdResult
                     .catch(function() {
                        return tag.setSinkId('default');
                     })
                     .then(function () {
                        !resultDefer.isReady() && resultDefer.callback(tag.sinkId);
                     })
                     .catch(function (err) {
                        !resultDefer.isReady() && resultDefer.errback(err);
                     });
            } else {
               resultDefer.callback(tag.sinkId);
            }
         }
      };

      deviceId = deviceId || 'communications';

      if (tag && typeof tag.setSinkId === 'function') {
         if(tag.readyState) {
            processSetSinkIdResult(tag, tag.setSinkId(deviceId), result);
         } else {
            var _setSinkId = function () {
               processSetSinkIdResult(tag, tag.setSinkId(deviceId), result);
               tag.removeEventListener('loadeddata', _setSinkId, false);
            };

            tag.addEventListener('loadeddata', _setSinkId, false);
         }
      } else {
         result.callback('setSinkId does not supported');
      }

      return result.addErrback(function (err) {
         Utils.logger.warn('setOutputAudioDevice err:', err, tag);
         return err;
      });
   };

   window.performance = window.performance || {} ;
   window.performance.now = window.performance.now || (function() { var now = Date.now(); return function() { return Date.now() - now ;} } )();

   function trace(text) {
     // This function is used for logging.
     if (text[text.length - 1] == '\n') {
       text = text.substring(0, text.length - 1);
     }
     //console.log((performance.now() / 1000).toFixed(3) + ": " + text);
   }
   function maybeFixConfiguration(pcConfig) {
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
   drawImage = function (context, video, x, y, width, height) {
       context.drawImage(video, x, y, width, height);
   }
   attachEventListener = function (video, type, listener, useCapture) {
       video.addEventListener(type, listener, useCapture);
   }

   if (navigator.mozGetUserMedia) {
     //console.log("This appears to be Firefox");

     webrtcDetectedBrowser = "firefox";

     webrtcDetectedVersion =
              parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10);

     // The RTCPeerConnection object.
      var RTCPeerConnection = function (pcConfig, pcConstraints) {
         // .urls is not supported in FF yet.
         if (webrtcDetectedVersion < 40) {
            maybeFixConfiguration(pcConfig);
            return new mozRTCPeerConnection(pcConfig, pcConstraints);
         }
         if (pcConfig && pcConfig.iceServers instanceof Array) {
            pcConfig.iceServers = pcConfig.iceServers.slice(0, 3);
         }
         return new (window.RTCPeerConnection || window.mozRTCPeerConnection)(pcConfig, pcConstraints);
      }

     // The RTCSessionDescription object.
     RTCSessionDescription = (window.RTCSessionDescription || window.mozRTCSessionDescription);

     // The RTCIceCandidate object.
     RTCIceCandidate = (window.RTCIceCandidate || window.mozRTCIceCandidate);

     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        getUserMedia = function (constraints, cb, eb) {
           navigator.mediaDevices.getUserMedia(constraints).then(cb, eb);
        };
     } else {
        getUserMedia = (navigator.getUserMedia  || navigator.mozGetUserMedia).bind(navigator);
     }
     navigator.getUserMedia = getUserMedia;

     // Creates iceServer from the url for FF.
     createIceServer = function(url, username, password) {
       var iceServer = null;
       var url_parts = url.split(':');
       if (url_parts[0].indexOf('stun') === 0) {
         // Create iceServer with stun url.
         iceServer = { 'url': url };
       } else if (url_parts[0].indexOf('turn') === 0) {
         if (webrtcDetectedVersion < 27) {
           // Create iceServer with turn url.
           // Ignore the transport parameter from TURN url for FF version <=27.
           var turn_url_parts = url.split("?");
           // Return null for createIceServer if transport=tcp.
           if (turn_url_parts.length === 1 ||
               turn_url_parts[1].indexOf('transport=udp') === 0) {
             iceServer = {'url': turn_url_parts[0],
                          'credential': password,
                          'username': username};
           }
         } else {
           // FF 27 and above supports transport parameters in TURN url,
           // So passing in the full url to create iceServer.
           iceServer = {'url': url,
                        'credential': password,
                        'username': username};
         }
       }
       return iceServer;
     };

     createIceServers = function(urls, username, password) {
       var iceServers = [];
       // Use .url for FireFox.
       for (i = 0; i < urls.length; i++) {
         var iceServer = createIceServer(urls[i],
                                         username,
                                         password);
         if (iceServer !== null) {
           iceServers.push(iceServer);
         }
       }
       return iceServers;
     }

     // Attach a media stream to an element.
     attachMediaStream = function(element, stream, needPlay) {
        //console.log("Attaching media stream");
        typeof needPlay === 'undefined' && (needPlay = true);
        element.srcObject = stream;
        needPlay && element.play();
        return element;
     };

     reattachMediaStream = function(to, from) {
       //console.log("Reattaching media stream");
       to.mozSrcObject = from.mozSrcObject;
       to.play();
     };

      getVideoConstraints = function (constraints) {
         var result;

         if (constraints) {
            result = {};

            if (constraints.frameRate) {
               result.frameRate = {
                  ideal: constraints.frameRate
               };
            }

            if (constraints.width) {
               result.width = {
                  max: constraints.width,
                  min: constraints.width,
                  ideal: constraints.width
               };
            }

            if (constraints.height) {
               result.height = {
                  max: constraints.height,
                  min: constraints.height,
                  ideal: constraints.height
               };
            }

            if (constraints.sourceId) {
               result.deviceId = {
                  exact: constraints.sourceId
               }
            }
         }

         return result || true;
      };

      getAudioConstraints = function(constraints) {
         var result;

         if (constraints) {
            result = {};

            if (constraints.sourceId) {
               result.deviceId = {
                  exact: constraints.sourceId
               }
            }
         }

         return result || true;
      };

      processCreateOfferOptions = function (options) {
         return {
            'offerToReceiveAudio': options.receiveAudio,
            'offerToReceiveVideo': options.receiveVideo
         };
      };

   } else if (navigator.webkitGetUserMedia) {
     //console.log("This appears to be Chrome");

     webrtcDetectedBrowser = "chrome";
     // Temporary fix until crbug/374263 is fixed.
     // Setting Chrome version to 999, if version is unavailable.
     var result = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
     if (result !== null) {
       webrtcDetectedVersion = parseInt(result[2], 10);
     } else {
       webrtcDetectedVersion = 999;
     }

     if (!navigator.mediaDevices) {
        navigator.mediaDevices = {};
     }

     if (typeof navigator.mediaDevices.enumerateDevices !== 'function' && window.MediaStreamTrack && typeof MediaStreamTrack.getSources === 'function') {
        navigator.mediaDevices.enumerateDevices = function () {
           return {
              then: function (callback) {
                 MediaStreamTrack.getSources(callback);
              }
           };
        }
     }

     // Creates iceServer from the url for Chrome M33 and earlier.
     createIceServer = function(url, username, password) {
       var iceServer = null;
       var url_parts = url.split(':');
       if (url_parts[0].indexOf('stun') === 0) {
         // Create iceServer with stun url.
         iceServer = { 'url': url };
       } else if (url_parts[0].indexOf('turn') === 0) {
         // Chrome M28 & above uses below TURN format.
         iceServer = {'url': url,
                      'credential': password,
                      'username': username};
       }
       return iceServer;
     };

     // Creates iceServers from the urls for Chrome M34 and above.
     createIceServers = function(urls, username, password) {
       var iceServers = [];
       if (webrtcDetectedVersion >= 34) {
         // .urls is supported since Chrome M34.
         iceServers = {'urls': urls,
                       'credential': password,
                       'username': username };
       } else {
         for (i = 0; i < urls.length; i++) {
           var iceServer = createIceServer(urls[i],
                                           username,
                                           password);
           if (iceServer !== null) {
             iceServers.push(iceServer);
           }
         }
       }
       return iceServers;
     };

     // The RTCPeerConnection object.
     var RTCPeerConnection = function(pcConfig, pcConstraints) {
       // .urls is supported since Chrome M34.
       if (webrtcDetectedVersion < 34) {
         maybeFixConfiguration(pcConfig);
       }
       return new (window.RTCPeerConnection || window.webkitRTCPeerConnection)(pcConfig, pcConstraints);
     };

      PeerConnectionConstraints = {
         optional: [
            {
               googIPv6: false
            },
            {
               googDscp: true
            }
         ]
      };

     // Get UserMedia (only difference is the prefix).
     // Code from Adam Barth.
     getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
     navigator.getUserMedia = getUserMedia;

     // Attach a media stream to an element.
     attachMediaStream = function(element, stream, needPlay) {
        typeof needPlay === 'undefined' && (needPlay = true);
        if (element && stream) {
           if (typeof element.srcObject !== 'undefined') {
              element.srcObject = stream;
           } else if (typeof element.mozSrcObject !== 'undefined') {
              element.mozSrcObject = stream;
           } else if (typeof element.src !== 'undefined') {
              element.src = URL.createObjectURL(stream);
           } else {
              //console.log('Error attaching stream to element.');
           }

           if (needPlay) {
              var playResult = element.play && element.play();
              if (playResult && typeof playResult.then === 'function' && typeof playResult.catch === 'function') {
                 // ловим необработанный DOM Exception
                 playResult.catch(function (err) {
                    Utils.logger.warn('attachMediaStream error:', err, element);
                 });
              }
           }
        }
        return element;
     };

     reattachMediaStream = function(to, from) {
       to.src = from.src;
     };

      getVideoConstraints = function (constraints) {
         var result;

         if (constraints) {
            result = {mandatory: {}};

            if (constraints.frameRate) {
               cMerge(result.mandatory, {
                  maxFrameRate: constraints.frameRate
               });
            }

            if (constraints.width) {
               cMerge(result.mandatory, {
                  maxWidth: constraints.width,
                  minWidth: constraints.width
               });

               if (!constraints.height) {
                  result.mandatory.maxHeight = 720;
               }
            }

            if (constraints.height) {
               cMerge(result.mandatory, {
                  maxHeight: constraints.height,
                  minHeight: constraints.height
               });

               // с двумя мониторами на linux тут есть проблемы, по-этому maxWidth - какая-то константа

               if (!constraints.width) {
                  result.mandatory.maxWidth = 4000;
               }
            }

            if (constraints.sourceId) {
               cMerge(result.mandatory, {
                  sourceId: constraints.sourceId
               })
            }
         }

         return result || true;
      };

      getAudioConstraints = function(constraints) {
         var result;

         if (constraints) {
            result = {
               mandatory: {}
            };

            if (constraints.sourceId) {
               cMerge(result.mandatory, {
                  sourceId: constraints.sourceId
               });
            }
         }

         return result || true;
      };

   } else if (navigator.mediaDevices && __webRTC.browser.edge) {
       var webrtcUtils = {
           log: function() {
               // suppress console.log output when being included as a module.
               if (typeof module !== 'undefined' ||
                   typeof require === 'function' && typeof define === 'function') {
                   return;
               }
               console.log.apply(console, arguments);
           },
           extractVersion: function(uastring, expr, pos) {
               var match = uastring.match(expr);
               return match && match.length >= pos && parseInt(match[pos], 10);
           }
       };
       webrtcDetectedBrowser = 'edge';

       webrtcDetectedVersion = webrtcUtils.extractVersion(navigator.userAgent,
           /Edge\/(\d+).(\d+)$/, 2);

       attachMediaStream = function(element, stream) {
           if (!element || !stream) return element;
           element.srcObject = stream;
           return element;
       };

       reattachMediaStream = function(to, from) {
           to.srcObject = from.srcObject;
       };

       getUserMedia = navigator.getUserMedia.bind(navigator);
       if (__webRTC.browser.majorVersion < 15) {
          if (window.RTCIceGatherer) {
             // Generate an alphanumeric identifier for cname or mids.
             // TODO: use UUIDs instead? https://gist.github.com/jed/982883
             var generateIdentifier = function() {
                return Math.random().toString(36).substr(2, 10);
             };

             // The RTCP CNAME used by all peerconnections from the same JS.
             var localCName = generateIdentifier();

             // SDP helpers - to be moved into separate module.
             var SDPUtils = {};

             // Splits SDP into lines, dealing with both CRLF and LF.
             SDPUtils.splitLines = function(blob) {
                return blob.trim().split('\n').map(function(line) {
                   return line.trim();
                });
             };

             // Splits SDP into sessionpart and mediasections. Ensures CRLF.
             SDPUtils.splitSections = function(blob) {
                var parts = blob.split('\r\nm=');
                return parts.map(function(part, index) {
                   return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
                });
             };

             // Returns lines that start with a certain prefix.
             SDPUtils.matchPrefix = function(blob, prefix) {
                return SDPUtils.splitLines(blob).filter(function(line) {
                   return line.indexOf(prefix) === 0;
                });
             };

             // Parses an ICE candidate line. Sample input:
             // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8 rport 55996"
             SDPUtils.parseCandidate = function(line) {
                var parts;
                // Parse both variants.
                if (line.indexOf('a=candidate:') === 0) {
                   parts = line.substring(12).split(' ');
                } else {
                   parts = line.substring(10).split(' ');
                }

                var candidate = {
                   foundation: parts[0],
                   component: parts[1],
                   protocol: parts[2].toLowerCase(),
                   priority: parseInt(parts[3], 10),
                   ip: parts[4],
                   port: parseInt(parts[5], 10),
                   // skip parts[6] == 'typ'
                   type: parts[7]
                };

                for (var i = 8; i < parts.length; i += 2) {
                   switch (parts[i]) {
                      case 'raddr':
                         candidate.relatedAddress = parts[i + 1];
                         break;
                      case 'rport':
                         candidate.relatedPort = parseInt(parts[i + 1], 10);
                         break;
                      case 'tcptype':
                         candidate.tcpType = parts[i + 1];
                         break;
                      default: // Unknown extensions are silently ignored.
                         break;
                   }
                }
                return candidate;
             };

             // Translates a candidate object into SDP candidate attribute.
             SDPUtils.writeCandidate = function(candidate) {
                var sdp = [];
                sdp.push(candidate.foundation);
                sdp.push(candidate.component);
                sdp.push(candidate.protocol.toUpperCase());
                sdp.push(candidate.priority);
                sdp.push(candidate.ip);
                sdp.push(candidate.port);

                var type = candidate.type;
                sdp.push('typ');
                sdp.push(type);
                if (type !== 'host' && candidate.relatedAddress &&
                      candidate.relatedPort) {
                   sdp.push('raddr');
                   sdp.push(candidate.relatedAddress); // was: relAddr
                   sdp.push('rport');
                   sdp.push(candidate.relatedPort); // was: relPort
                }
                if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
                   sdp.push('tcptype');
                   sdp.push(candidate.tcpType);
                }
                return 'candidate:' + sdp.join(' ');
             };

             // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
             // a=rtpmap:111 opus/48000/2
             SDPUtils.parseRtpMap = function(line) {
                var parts = line.substr(9).split(' ');
                var parsed = {
                   payloadType: parseInt(parts.shift(), 10) // was: id
                };

                parts = parts[0].split('/');

                parsed.name = parts[0];
                parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
                parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1; // was: channels
                return parsed;
             };

             // Generate an a=rtpmap line from RTCRtpCodecCapability or RTCRtpCodecParameters.
             SDPUtils.writeRtpMap = function(codec) {
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                   pt = codec.preferredPayloadType;
                }
                return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
                      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
             };

             // Parses an ftmp line, returns dictionary. Sample input:
             // a=fmtp:96 vbr=on;cng=on
             // Also deals with vbr=on; cng=on
             SDPUtils.parseFmtp = function(line) {
                var parsed = {};
                var kv;
                var parts = line.substr(line.indexOf(' ') + 1).split(';');
                for (var j = 0; j < parts.length; j++) {
                   kv = parts[j].trim().split('=');
                   parsed[kv[0].trim()] = kv[1];
                }
                return parsed;
             };

             // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
             SDPUtils.writeFtmp = function(codec) {
                var line = '';
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                   pt = codec.preferredPayloadType;
                }
                if (codec.parameters && codec.parameters.length) {
                   var params = [];
                   Object.keys(codec.parameters).forEach(function(param) {
                      params.push(param + '=' + codec.parameters[param]);
                   });
                   line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
                }
                return line;
             };

             // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
             // a=rtcp-fb:98 nack rpsi
             SDPUtils.parseRtcpFb = function(line) {
                var parts = line.substr(line.indexOf(' ') + 1).split(' ');
                return {
                   type: parts.shift(),
                   parameter: parts.join(' ')
                };
             };
             // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
             SDPUtils.writeRtcpFb = function(codec) {
                var lines = '';
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                   pt = codec.preferredPayloadType;
                }
                if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
                   // FIXME: special handling for trr-int?
                   codec.rtcpFeedback.forEach(function(fb) {
                      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + ' ' + fb.parameter +
                      '\r\n';
                   });
                }
                return lines;
             };

             // Parses an RFC 5576 ssrc media attribute. Sample input:
             // a=ssrc:3735928559 cname:something
             SDPUtils.parseSsrcMedia = function(line) {
                var sp = line.indexOf(' ');
                var parts = {
                   ssrc: line.substr(7, sp - 7),
                };
                var colon = line.indexOf(':', sp);
                if (colon > -1) {
                   parts.attribute = line.substr(sp + 1, colon - sp - 1);
                   parts.value = line.substr(colon + 1);
                } else {
                   parts.attribute = line.substr(sp + 1);
                }
                return parts;
             };

             // Extracts DTLS parameters from SDP media section or sessionpart.
             // FIXME: for consistency with other functions this should only
             //   get the fingerprint line as input. See also getIceParameters.
             SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
                var lines = SDPUtils.splitLines(mediaSection);
                lines = lines.concat(SDPUtils.splitLines(sessionpart)); // Search in session part, too.
                var fpLine = lines.filter(function(line) {
                   return line.indexOf('a=fingerprint:') === 0;
                })[0].substr(14);
                // Note: a=setup line is ignored since we use the 'auto' role.
                var dtlsParameters = {
                   role: 'auto',
                   fingerprints: [{
                      algorithm: fpLine.split(' ')[0],
                      value: fpLine.split(' ')[1]
                   }]
                };
                return dtlsParameters;
             };

             // Serializes DTLS parameters to SDP.
             SDPUtils.writeDtlsParameters = function(params, setupType) {
                var sdp = 'a=setup:' + setupType + '\r\n';
                params.fingerprints.forEach(function(fp) {
                   sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
                });
                return sdp;
             };
             // Parses ICE information from SDP media section or sessionpart.
             // FIXME: for consistency with other functions this should only
             //   get the ice-ufrag and ice-pwd lines as input.
             SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
                var lines = SDPUtils.splitLines(mediaSection);
                lines = lines.concat(SDPUtils.splitLines(sessionpart)); // Search in session part, too.
                var iceParameters = {
                   usernameFragment: lines.filter(function(line) {
                      return line.indexOf('a=ice-ufrag:') === 0;
                   })[0].substr(12),
                   password: lines.filter(function(line) {
                      return line.indexOf('a=ice-pwd:') === 0;
                   })[0].substr(10)
                };
                return iceParameters;
             };

             // Serializes ICE parameters to SDP.
             SDPUtils.writeIceParameters = function(params) {
                return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
                      'a=ice-pwd:' + params.password + '\r\n';
             };

             // Parses the SDP media section and returns RTCRtpParameters.
             SDPUtils.parseRtpParameters = function(mediaSection) {
                var description = {
                   codecs: [],
                   headerExtensions: [],
                   fecMechanisms: [],
                   rtcp: []
                };
                var lines = SDPUtils.splitLines(mediaSection);
                var mline = lines[0].split(' ');
                for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
                   var pt = mline[i];
                   var rtpmapline = SDPUtils.matchPrefix(
                         mediaSection, 'a=rtpmap:' + pt + ' ')[0];
                   if (rtpmapline) {
                      var codec = SDPUtils.parseRtpMap(rtpmapline);
                      var fmtps = SDPUtils.matchPrefix(
                            mediaSection, 'a=fmtp:' + pt + ' ');
                      // Only the first a=fmtp:<pt> is considered.
                      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
                      codec.rtcpFeedback = SDPUtils.matchPrefix(
                            mediaSection, 'a=rtcp-fb:' + pt + ' ')
                            .map(SDPUtils.parseRtcpFb);
                      description.codecs.push(codec);
                   }
                }
                // FIXME: parse headerExtensions, fecMechanisms and rtcp.
                return description;
             };

             // Generates parts of the SDP media section describing the capabilities / parameters.
             SDPUtils.writeRtpDescription = function(kind, caps) {
                var sdp = '';

                // Build the mline.
                sdp += 'm=' + kind + ' ';
                sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
                sdp += ' UDP/TLS/RTP/SAVPF ';
                sdp += caps.codecs.map(function(codec) {
                   if (codec.preferredPayloadType !== undefined) {
                      return codec.preferredPayloadType;
                   }
                   return codec.payloadType;
                }).join(' ') + '\r\n';

                sdp += 'c=IN IP4 0.0.0.0\r\n';
                sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

                // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
                caps.codecs.forEach(function(codec) {
                   sdp += SDPUtils.writeRtpMap(codec);
                   sdp += SDPUtils.writeFtmp(codec);
                   sdp += SDPUtils.writeRtcpFb(codec);
                });
                // FIXME: add headerExtensions, fecMechanismş and rtcp.
                sdp += 'a=rtcp-mux\r\n';
                return sdp;
             };

             SDPUtils.writeSessionBoilerplate = function() {
                // FIXME: sess-id should be an NTP timestamp.
                return 'v=0\r\n' +
                      'o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n' +
                      's=-\r\n' +
                      't=0 0\r\n';
             };

             SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
                var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

                // Map ICE parameters (ufrag, pwd) to SDP.
                sdp += SDPUtils.writeIceParameters(
                      transceiver.iceGatherer.getLocalParameters());

                // Map DTLS parameters to SDP.
                sdp += SDPUtils.writeDtlsParameters(
                      transceiver.dtlsTransport.getLocalParameters(),
                      type === 'offer' ? 'actpass' : 'active');

                sdp += 'a=mid:' + transceiver.mid + '\r\n';

                if (transceiver.rtpSender && transceiver.rtpReceiver) {
                   sdp += 'a=sendrecv\r\n';
                } else if (transceiver.rtpSender) {
                   sdp += 'a=sendonly\r\n';
                } else if (transceiver.rtpReceiver) {
                   sdp += 'a=recvonly\r\n';
                } else {
                   sdp += 'a=inactive\r\n';
                }

                // FIXME: for RTX there might be multiple SSRCs. Not implemented in Edge yet.
                if (transceiver.rtpSender) {
                   var msid = 'msid:' + stream.id + ' ' +
                         transceiver.rtpSender.track.id + '\r\n';
                   sdp += 'a=' + msid;
                   sdp += 'a=ssrc:' + transceiver.sendSsrc + ' ' + msid;
                }
                // FIXME: this should be written by writeRtpDescription.
                sdp += 'a=ssrc:' + transceiver.sendSsrc + ' cname:' +
                localCName + '\r\n';
                return sdp;
             };

             // Gets the direction from the mediaSection or the sessionpart.
             SDPUtils.getDirection = function(mediaSection, sessionpart) {
                // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
                var lines = SDPUtils.splitLines(mediaSection);
                for (var i = 0; i < lines.length; i++) {
                   switch (lines[i]) {
                      case 'a=sendrecv':
                      case 'a=sendonly':
                      case 'a=recvonly':
                      case 'a=inactive':
                         return lines[i].substr(2);
                   }
                }
                if (sessionpart) {
                   return SDPUtils.getDirection(sessionpart);
                }
                return 'sendrecv';
             };

             // ORTC defines an RTCIceCandidate object but no constructor.
             // Not implemented in Edge.
             window.RTCIceCandidate = function(args) {
                return args;
             };
             // ORTC does not have a session description object but
             // other browsers (i.e. Chrome) that will support both PC and ORTC
             // in the future might have this defined already.
             window.RTCSessionDescription = function(args) {
                return args;
             };

             RTCPeerConnection = window.RTCPeerConnection = function(config) {
                var self = this;

                this.onicecandidate = null;
                this.onaddstream = null;
                this.onremovestream = null;
                this.onsignalingstatechange = null;
                this.oniceconnectionstatechange = null;
                this.onnegotiationneeded = null;
                this.ondatachannel = null;

                this.localStreams = [];
                this.remoteStreams = [];
                this.getLocalStreams = function() { return self.localStreams; };
                this.getRemoteStreams = function() { return self.remoteStreams; };

                this.localDescription = new RTCSessionDescription({
                   type: '',
                   sdp: ''
                });
                this.remoteDescription = new RTCSessionDescription({
                   type: '',
                   sdp: ''
                });
                this.signalingState = 'stable';
                this.iceConnectionState = 'new';
                //Edge требует один turn сервер, хардкодим его, и далее не записываем сервера из config
                this.iceOptions = {
                   gatherPolicy: 'all',
                   iceServers: [
                      {
                         "urls": "turn:turn.sbis.ru:443?transport=udp",
                         "username": "myuser",
                         "credential": "mypass"
                      }
                   ]
                };
                if (config && config.iceTransportPolicy) {
                   switch (config.iceTransportPolicy) {
                      case 'all':
                      case 'relay':
                         this.iceOptions.gatherPolicy = config.iceTransportPolicy;
                         break;
                      case 'none':
                         // FIXME: remove once implementation and spec have added this.
                         throw new TypeError('iceTransportPolicy "none" not supported');
                   }
                }

                // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
                // everything that is needed to describe a SDP m-line.
                this.transceivers = [];

                // since the iceGatherer is currently created in createOffer but we
                // must not emit candidates until after setLocalDescription we buffer
                // them in this array.
                this._localIceCandidatesBuffer = [];
             };

             window.RTCPeerConnection.prototype._emitBufferedCandidates = function() {
                var self = this;
                // FIXME: need to apply ice candidates in a way which is async but in-order
                this._localIceCandidatesBuffer.forEach(function(event) {
                   if (self.onicecandidate !== null) {
                      self.onicecandidate(event);
                   }
                });
                this._localIceCandidatesBuffer = [];
             };

             window.RTCPeerConnection.prototype.addStream = function(stream) {
                // Clone is necessary for local demos mostly, attaching directly
                // to two different senders does not work (build 10547).
                this.localStreams.push(stream.clone());
                this._maybeFireNegotiationNeeded();
             };

             window.RTCPeerConnection.prototype.removeStream = function(stream) {
                var idx = this.localStreams.indexOf(stream);
                if (idx > -1) {
                   this.localStreams.splice(idx, 1);
                   this._maybeFireNegotiationNeeded();
                }
             };

             // Determines the intersection of local and remote capabilities.
             window.RTCPeerConnection.prototype._getCommonCapabilities = function(localCapabilities, remoteCapabilities) {
                var commonCapabilities = {
                   codecs: [],
                   headerExtensions: [],
                   fecMechanisms: []
                };
                localCapabilities.codecs.forEach(function(lCodec) {
                   for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
                      var rCodec = remoteCapabilities.codecs[i];
                      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
                            lCodec.clockRate === rCodec.clockRate &&
                            lCodec.numChannels === rCodec.numChannels) {
                         // push rCodec so we reply with offerer payload type
                         commonCapabilities.codecs.push(rCodec);

                         // FIXME: also need to determine intersection between
                         // .rtcpFeedback and .parameters
                         break;
                      }
                   }
                });

                localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
                   for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
                      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
                      if (lHeaderExtension.uri === rHeaderExtension.uri) {
                         commonCapabilities.headerExtensions.push(rHeaderExtension);
                         break;
                      }
                   }
                });

                // FIXME: fecMechanisms
                return commonCapabilities;
             };

             // Create ICE gatherer, ICE transport and DTLS transport.
             window.RTCPeerConnection.prototype._createIceAndDtlsTransports = function(mid, sdpMLineIndex) {
                var self = this;
                var iceGatherer = window.__iceGatherer = new RTCIceGatherer(self.iceOptions);
                var iceTransport = window.__iceTransport = new RTCIceTransport(iceGatherer);

                iceGatherer.onlocalcandidate = function(evt) {
                   var event = {};
                   event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

                   var cand = evt.candidate;
                   // Edge emits an empty object for RTCIceCandidateComplete‥
                   if (!cand || Object.keys(cand).length === 0) {
                      // polyfill since RTCIceGatherer.state is not implemented in Edge 10547 yet.
                      if (iceGatherer.state === undefined) {
                         iceGatherer.state = 'completed';
                      }
                      return;
                   } else {
                      // RTCIceCandidate doesn't have a component, needs to be added
                      cand.component = iceTransport.component === 'RTCP' ? 2 : 1;
                      event.candidate.candidate = SDPUtils.writeCandidate(cand);
                      if (event.candidate.sdpMLineIndex === 1) {
                         return;
                      }
                   }

                   var complete = self.transceivers.every(function(transceiver) {
                      return transceiver.iceGatherer &&
                            transceiver.iceGatherer.state === 'completed';
                   });
                   // FIXME: update .localDescription with candidate and (potentially) end-of-candidates.
                   //     To make this harder, the gatherer might emit candidates before localdescription
                   //     is set. To make things worse, gather.getLocalCandidates still errors in
                   //     Edge 10547 when no candidates have been gathered yet.

                   if (self.onicecandidate !== null) {
                      // Emit candidate if localDescription is set.
                      // Also emits null candidate when all gatherers are complete.
                      if (self.localDescription && self.localDescription.type === '') {
                         self._localIceCandidatesBuffer.push(event);
                         if (complete) {
                            self._localIceCandidatesBuffer.push({});
                         }
                      } else {
                         self.onicecandidate(event);
                         if (complete) {
                            self.onicecandidate({});
                         }
                      }
                   }
                };

                iceTransport.onicestatechange = function() {
                   self._updateConnectionState();
                };

                iceTransport.ongatheringstatechange = function () {
                   console.log('iceTransport.ongatheringstatechange', iceTransport);
                }

                var dtlsTransport = window.__dtlsTransport = new RTCDtlsTransport(iceTransport);
                dtlsTransport.onstatechange = function () {
                   console.log('dtlsTransport.onstatechange', dtlsTransport);
                }
                dtlsTransport.ondtlsstatechange = function() {
                   self._updateConnectionState();
                };
                dtlsTransport.onerror = function() {
                   // onerror does not set state to failed by itself.
                   dtlsTransport.state = 'failed';
                   self._updateConnectionState();
                };

                return {
                   iceGatherer: iceGatherer,
                   iceTransport: iceTransport,
                   dtlsTransport: dtlsTransport
                };
             };

             // Start the RTP Sender and Receiver for a transceiver.
             window.RTCPeerConnection.prototype._transceive = function(transceiver,
                                                                       send, recv) {
                var params = this._getCommonCapabilities(transceiver.localCapabilities,
                      transceiver.remoteCapabilities);
                if (send && transceiver.rtpSender) {
                   params.encodings = [{
                      ssrc: transceiver.sendSsrc
                   }];
                   params.rtcp = {
                      cname: localCName,
                      ssrc: transceiver.recvSsrc
                   };
                   transceiver.rtpSender.send(params);
                }
                if (recv && transceiver.rtpReceiver) {
                   params.encodings = [{
                      ssrc: transceiver.recvSsrc
                   }];
                   params.rtcp = {
                      cname: transceiver.cname,
                      ssrc: transceiver.sendSsrc
                   };
                   transceiver.rtpReceiver.receive(params);
                }
             };

             window.RTCPeerConnection.prototype.setLocalDescription = function(description) {
                var self = this;
                if (description.type === 'offer') {
                   if (!this._pendingOffer) {
                   } else {
                      this.transceivers = this._pendingOffer;
                      delete this._pendingOffer;
                   }
                } else if (description.type === 'answer') {
                   var sections = SDPUtils.splitSections(self.remoteDescription.sdp);
                   var sessionpart = sections.shift();
                   sections.forEach(function(mediaSection, sdpMLineIndex) {
                      //Игнорируем видео канал
                      if (sdpMLineIndex !== 1) {
                         var transceiver = self.transceivers[sdpMLineIndex];
                         var iceGatherer = transceiver.iceGatherer;
                         var iceTransport = transceiver.iceTransport;
                         var dtlsTransport = transceiver.dtlsTransport;
                         var localCapabilities = transceiver.localCapabilities;
                         var remoteCapabilities = transceiver.remoteCapabilities;
                         var rejected = mediaSection.split('\n', 1)[0]
                                     .split(' ', 2)[1] === '0';

                         if (!rejected) {
                            var remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
                                  sessionpart);
                            iceTransport.start(iceGatherer, remoteIceParameters, 'controlled');

                            var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
                                  sessionpart);
                            dtlsTransport.start(remoteDtlsParameters);

                            // Calculate intersection of capabilities.
                            var params = self._getCommonCapabilities(localCapabilities,
                                  remoteCapabilities);

                            // Start the RTCRtpSender. The RTCRtpReceiver for this transceiver
                            // has already been started in setRemoteDescription.
                            self._transceive(transceiver,
                                  params.codecs.length > 0,
                                  false);
                         }
                      }
                   });
                }

                this.localDescription = description;
                switch (description.type) {
                   case 'offer':
                      this._updateSignalingState('have-local-offer');
                      break;
                   case 'answer':
                      this._updateSignalingState('stable');
                      break;
                   default:
                      throw new TypeError('unsupported type "' + description.type + '"');
                }

                // If a success callback was provided, emit ICE candidates after it has been
                // executed. Otherwise, emit callback after the Promise is resolved.
                var hasCallback = arguments.length > 1 &&
                      typeof arguments[1] === 'function';
                if (hasCallback) {
                   var cb = arguments[1];
                   window.setTimeout(function() {
                      cb();
                      self._emitBufferedCandidates();
                   }, 0);
                }
                var p = Promise.resolve();
                p.then(function() {
                   if (!hasCallback) {
                      window.setTimeout(self._emitBufferedCandidates.bind(self), 0);
                   }
                });
                return p;
             };

             window.RTCPeerConnection.prototype.setRemoteDescription = function(description) {
                var self = this;
                var stream = new MediaStream();
                //Удалим всю информацию о видео из sdp
                if (description.sdp.indexOf('m=video') + 1) {
                   description.sdp = description.sdp.substring(0, description.sdp.indexOf('m=video'));
                }
                var sections = SDPUtils.splitSections(description.sdp);
                var sessionpart = sections.shift();
                sections.forEach(function(mediaSection, sdpMLineIndex) {
                   //Не создаем канал для видео
                   if (sdpMLineIndex !== 1) {
                      var lines = SDPUtils.splitLines(mediaSection);
                      var mline = lines[0].substr(2).split(' ');
                      var kind = mline[0];
                      var rejected = mline[1] === '0';
                      var direction = SDPUtils.getDirection(mediaSection, sessionpart);

                      var transceiver;
                      var iceGatherer;
                      var iceTransport;
                      var dtlsTransport;
                      var rtpSender;
                      var rtpReceiver;
                      var sendSsrc;
                      var recvSsrc;
                      var localCapabilities;

                      // FIXME: ensure the mediaSection has rtcp-mux set.
                      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
                      var remoteIceParameters;
                      var remoteDtlsParameters;
                      if (!rejected) {
                         remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
                               sessionpart);
                         remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
                               sessionpart);
                      }
                      var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0].substr(6);

                      var cname;
                      // Gets the first SSRC. Note that with RTX there might be multiple SSRCs.
                      var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
                            .map(function(line) {
                               return SDPUtils.parseSsrcMedia(line);
                            })
                            .filter(function(obj) {
                               return obj.attribute === 'cname';
                            })[0];
                      if (remoteSsrc) {
                         recvSsrc = parseInt(remoteSsrc.ssrc, 10);
                         cname = remoteSsrc.value;
                      }

                      if (description.type === 'offer') {
                         var transports = self._createIceAndDtlsTransports(mid, sdpMLineIndex);

                         localCapabilities = RTCRtpReceiver.getCapabilities(kind);
                         sendSsrc = (2 * sdpMLineIndex + 2) * 1001;

                         rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);

                         // FIXME: not correct when there are multiple streams but that is
                         // not currently supported in this shim.
                         stream.addTrack(rtpReceiver.track);

                         // FIXME: look at direction.
                         if (self.localStreams.length > 0 &&
                               self.localStreams[0].getTracks().length >= sdpMLineIndex) {
                            // FIXME: actually more complicated, needs to match types etc
                            var localtrack = self.localStreams[0].getTracks()[sdpMLineIndex];
                            rtpSender = new RTCRtpSender(localtrack, transports.dtlsTransport);
                         }

                         self.transceivers[sdpMLineIndex] = {
                            iceGatherer: transports.iceGatherer,
                            iceTransport: transports.iceTransport,
                            dtlsTransport: transports.dtlsTransport,
                            localCapabilities: localCapabilities,
                            remoteCapabilities: remoteCapabilities,
                            rtpSender: rtpSender,
                            rtpReceiver: rtpReceiver,
                            kind: kind,
                            mid: mid,
                            cname: cname,
                            sendSsrc: sendSsrc,
                            recvSsrc: recvSsrc
                         };
                         // Start the RTCRtpReceiver now. The RTPSender is started in setLocalDescription.
                         self._transceive(self.transceivers[sdpMLineIndex],
                               false,
                               direction === 'sendrecv' || direction === 'sendonly');
                      } else if (description.type === 'answer' && !rejected) {
                         transceiver = self.transceivers[sdpMLineIndex];
                         iceGatherer = transceiver.iceGatherer;
                         iceTransport = transceiver.iceTransport;
                         dtlsTransport = transceiver.dtlsTransport;
                         rtpSender = transceiver.rtpSender;
                         rtpReceiver = transceiver.rtpReceiver;
                         sendSsrc = transceiver.sendSsrc;
                         //recvSsrc = transceiver.recvSsrc;
                         localCapabilities = transceiver.localCapabilities;

                         self.transceivers[sdpMLineIndex].recvSsrc = recvSsrc;
                         self.transceivers[sdpMLineIndex].remoteCapabilities =
                               remoteCapabilities;
                         self.transceivers[sdpMLineIndex].cname = cname;

                         iceTransport.start(iceGatherer, remoteIceParameters, 'controlling');
                         dtlsTransport.start(remoteDtlsParameters);

                         self._transceive(transceiver,
                               direction === 'sendrecv' || direction === 'recvonly',
                               direction === 'sendrecv' || direction === 'sendonly');

                         if (rtpReceiver &&
                               (direction === 'sendrecv' || direction === 'sendonly')) {
                            stream.addTrack(rtpReceiver.track);
                         } else {
                            // FIXME: actually the receiver should be created later.
                            delete transceiver.rtpReceiver;
                         }
                      }
                   }
                });

                this.remoteDescription = description;
                switch (description.type) {
                   case 'offer':
                      this._updateSignalingState('have-remote-offer');
                      break;
                   case 'answer':
                      this._updateSignalingState('stable');
                      break;
                   default:
                      throw new TypeError('unsupported type "' + description.type + '"');
                }
                window.setTimeout(function() {
                   if (self.onaddstream !== null && stream.getTracks().length) {
                      self.remoteStreams.push(stream);
                      window.setTimeout(function() {
                         self.onaddstream({stream: stream});
                      }, 0);
                   }
                }, 0);
                if (arguments.length > 1 && typeof arguments[1] === 'function') {
                   window.setTimeout(arguments[1], 0);
                }
                return Promise.resolve();
             };
             //Делаем функцию заглушку для dataChannel в edge data channel отсутствует
             window.RTCPeerConnection.prototype.createDataChannel = function(data) {
                return data;
             };

             window.RTCPeerConnection.prototype.close = function() {
                this.transceivers.forEach(function(transceiver) {
                   /* not yet
                    if (transceiver.iceGatherer) {
                    transceiver.iceGatherer.close();
                    }
                    */
                   if (transceiver.iceTransport) {
                      transceiver.iceTransport.stop();
                   }
                   if (transceiver.dtlsTransport) {
                      transceiver.dtlsTransport.stop();
                   }
                   if (transceiver.rtpSender) {
                      transceiver.rtpSender.stop();
                   }
                   if (transceiver.rtpReceiver) {
                      transceiver.rtpReceiver.stop();
                   }
                });
                // FIXME: clean up tracks, local streams, remote streams, etc
                this._updateSignalingState('closed');
             };

             // Update the signaling state.
             window.RTCPeerConnection.prototype._updateSignalingState = function(newState) {
                this.signalingState = newState;
                if (this.onsignalingstatechange !== null) {
                   this.onsignalingstatechange();
                }
             };

             // Determine whether to fire the negotiationneeded event.
             window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
                // Fire away (for now).
                if (this.onnegotiationneeded !== null) {
                   this.onnegotiationneeded();
                }
             };

             // Update the connection state.
             window.RTCPeerConnection.prototype._updateConnectionState = function() {
                var self = this;
                var newState;
                var states = {
                   'new': 0,
                   closed: 0,
                   connecting: 0,
                   checking: 0,
                   connected: 0,
                   completed: 0,
                   failed: 0
                };
                this.transceivers.forEach(function(transceiver) {
                   states[transceiver.iceTransport.state]++;
                   states[transceiver.dtlsTransport.state]++;
                });
                // ICETransport.completed and connected are the same for this pur ose.
                states.connected += states.completed;

                newState = 'new';
                if (states.failed > 0) {
                   newState = 'failed';
                } else if (states.connecting > 0 || states.checking > 0) {
                   newState = 'connecting';
                } else if (states.disconnected > 0) {
                   newState = 'disconnected';
                } else if (states.new > 0) {
                   newState = 'new';
                } else if (states.connecting > 0 || states.completed > 0) {
                   newState = 'connected';
                }
                if (newState !== self.iceConnectionState) {
                   self.iceConnectionState = newState;
                   if (this.oniceconnectionstatechange !== null) {
                      this.oniceconnectionstatechange();
                   }
                }
             };


             window.RTCPeerConnection.prototype.createOffer = function() {
                var self = this;
                if (this._pendingOffer) {
                   throw new Error('createOffer called while there is a pending offer.');
                }
                var offerOptions;
                if (arguments.length === 1 && typeof arguments[0] !== 'function') {
                   offerOptions = arguments[0];
                } else if (arguments.length === 3) {
                   offerOptions = arguments[2];
                }

                var tracks = [];
                var numAudioTracks = 0;
                var numVideoTracks = 0;
                // Default to sendrecv.
                if (this.localStreams.length) {
                   numAudioTracks = this.localStreams[0].getAudioTracks().length;
                   numVideoTracks = this.localStreams[0].getVideoTracks().length;
                }
                // Determine number of audio and video tracks we need to send/recv.
                if (offerOptions) {
                   if (offerOptions.offerToReceiveAudio !== undefined) {
                      numAudioTracks = offerOptions.offerToReceiveAudio;
                   }
                   if (offerOptions.offerToReceiveVideo !== undefined) {
                      numVideoTracks = offerOptions.offerToReceiveVideo;
                   }
                }
                if (this.localStreams.length) {
                   // Push local streams.
                   this.localStreams[0].getTracks().forEach(function(track) {
                      tracks.push({
                         kind: track.kind,
                         track: track,
                         wantReceive: track.kind === 'audio' ?
                         numAudioTracks > 0 : numVideoTracks > 0
                      });
                      if (track.kind === 'audio') {
                         numAudioTracks--;
                      } else if (track.kind === 'video') {
                         numVideoTracks--;
                      }
                   });
                }
                // Create M-lines for recvonly streams.
                while (numAudioTracks > 0 || numVideoTracks > 0) {
                   if (numAudioTracks > 0) {
                      tracks.push({
                         kind: 'audio',
                         wantReceive: true
                      });
                      numAudioTracks--;
                   }
                   if (numVideoTracks > 0) {
                      tracks.push({
                         kind: 'video',
                         wantReceive: true
                      });
                      numVideoTracks--;
                   }
                }

                var sdp = SDPUtils.writeSessionBoilerplate();
                var transceivers = [];
                tracks.forEach(function(mline, sdpMLineIndex) {
                   //Не создаем transport для видео
                   if ((sdpMLineIndex !== 1)) {
                      // For each track, create an ice gatherer, ice transport, dtls transport,
                      // potentially rtpsender and rtpreceiver.
                      var track = mline.track;
                      var kind = mline.kind;
                      var mid = generateIdentifier();

                      var transports = self._createIceAndDtlsTransports(mid, sdpMLineIndex);

                      var localCapabilities = RTCRtpSender.getCapabilities(kind);
                      var rtpSender;
                      var rtpReceiver;

                      // generate an ssrc now, to be used later in rtpSender.send
                      var sendSsrc = (2 * sdpMLineIndex + 1) * 1001;
                      if (track) {
                         rtpSender = new RTCRtpSender(track, transports.dtlsTransport);
                      }

                      if (mline.wantReceive) {
                         rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);
                      }

                      transceivers[sdpMLineIndex] = {
                         iceGatherer: transports.iceGatherer,
                         iceTransport: transports.iceTransport,
                         dtlsTransport: transports.dtlsTransport,
                         localCapabilities: localCapabilities,
                         remoteCapabilities: null,
                         rtpSender: rtpSender,
                         rtpReceiver: rtpReceiver,
                         kind: kind,
                         mid: mid,
                         sendSsrc: sendSsrc,
                         recvSsrc: null
                      };
                      var transceiver = transceivers[sdpMLineIndex];
                      sdp += SDPUtils.writeMediaSection(transceiver,
                            transceiver.localCapabilities, 'offer', self.localStreams[0]);
                   }
                });
                //Удалим всю информацию о видео из sdp
                if (sdp.indexOf('m=video') + 1) {
                   sdp = sdp.substring(0, sdp.indexOf('m=video'));
                }
                this._pendingOffer = transceivers;
                var desc = new RTCSessionDescription({
                   type: 'offer',
                   sdp: sdp
                });
                if (arguments.length && typeof arguments[0] === 'function') {
                   window.setTimeout(arguments[0], 0, desc);
                }
                return Promise.resolve(desc);
             };

             window.RTCPeerConnection.prototype.createAnswer = function() {
                var self = this;
                var answerOptions;
                if (arguments.length === 1 && typeof arguments[0] !== 'function') {
                   answerOptions = arguments[0];
                } else if (arguments.length === 3) {
                   answerOptions = arguments[2];
                }

                var sdp = SDPUtils.writeSessionBoilerplate();
                this.transceivers.forEach(function(transceiver) {
                   // Calculate intersection of capabilities.
                   var commonCapabilities = self._getCommonCapabilities(
                         transceiver.localCapabilities,
                         transceiver.remoteCapabilities);

                   sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities,
                         'answer', self.localStreams[0]);
                });

                var desc = new RTCSessionDescription({
                   type: 'answer',
                   sdp: sdp
                });
                if (arguments.length && typeof arguments[0] === 'function') {
                   window.setTimeout(arguments[0], 0, desc);
                }
                return Promise.resolve(desc);
             };

             window.RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
                var mLineIndex = candidate.sdpMLineIndex;
                if (candidate.sdpMid) {
                   for (var i = 0; i < this.transceivers.length; i++) {
                      if (this.transceivers[i].mid === candidate.sdpMid) {
                         mLineIndex = i;
                         break;
                      }
                   }
                }
                var transceiver = this.transceivers[mLineIndex];
                if (transceiver && transceiver.type !== 'video') {
                   var cand = Object.keys(candidate.candidate).length > 0 ?
                         SDPUtils.parseCandidate(candidate.candidate) : {};
                   //Edge не воспринимает этих кандидатов и может из-за них упасть
                   if (cand.protocol === 'tcp' && cand.port === 0) {
                      return;
                   }
                   // Ignore RTCP candidates, we assume RTCP-MUX.
                   if (cand.component !== '1') {
                      return;
                   }
                   transceiver.iceTransport.addRemoteCandidate(cand);
                   clearTimeout(this.addEmptyCandidateTimer);
                   //Пустой кандидат нужен для оповещения о том, что передача кандидатов завершена
                   this.addEmptyCandidateTimer = window.setTimeout(function() {
                      transceiver.iceTransport.addRemoteCandidate({});
                   }, 1 * 1000);
                }
                if (arguments.length > 1 && typeof arguments[1] === 'function') {
                   window.setTimeout(arguments[1], 0);
                }
                return Promise.resolve();
             };

             window.RTCPeerConnection.prototype.getStats = function() {
                var promises = [];
                this.transceivers.forEach(function(transceiver) {
                   ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
                      'dtlsTransport'].forEach(function(method) {
                            if (transceiver[method]) {
                               promises.push(transceiver[method].getStats());
                            }
                         });
                });
                var cb = arguments.length > 1 && typeof arguments[1] === 'function' &&
                      arguments[1];
                return new Promise(function(resolve) {
                   var results = {};
                   Promise.all(promises).then(function(res) {
                      res.forEach(function(result) {
                         Object.keys(result).forEach(function(id) {
                            results[id] = result[id];
                         });
                      });
                      if (cb) {
                         window.setTimeout(cb, 0, results);
                      }
                      resolve(results);
                   });
                });
             };
          }
       } else {
          processCreateOfferOptions = function (options) {
             return {
                offerToReceiveAudio: options.receiveAudio,
                offerToReceiveVideo: options.receiveVideo
             };
          };
          RTCPeerConnection = function(RTCConfig, RTCConstrains){
             var iceServer = [];

             for (var i = 0; i < RTCConfig.iceServers.length; i++) {
                if (RTCConfig.iceServers[i].urls.indexOf('transport=udp') + 1) {
                   iceServer.push(RTCConfig.iceServers[i]);
                   break;
                }
             }
             RTCConfig.iceServers = iceServer;

             return new window.RTCPeerConnection(RTCConfig, RTCConstrains);
          };
          RTCIceCandidate = window.RTCIceCandidate;
          RTCSessionDescription = window.RTCSessionDescription;
       }
   } else if (__webRTC.browser.safari) {
       getUserMedia = navigator.getUserMedia.bind(navigator);
       navigator.getUserMedia = getUserMedia;
       RTCPeerConnection = window.RTCPeerConnection;


       attachMediaStream = function(element, stream, needPlay) {
           typeof needPlay === 'undefined' && (needPlay = true);
           if (element && stream) {
               element.srcObject = stream;
               if (needPlay) {
                   var playResult = element.play && element.play();
                   if (playResult && typeof playResult.then === 'function' && typeof playResult.catch === 'function') {
                       // ловим необработанный DOM Exception
                       playResult.catch(function (err) {
                           Utils.logger.warn('attachMediaStream error:', err, element);
                       });
                   }
               }
           }
           return element;
       };

       reattachMediaStream = function(to, from) {
           to.srcObject = from.srcObject;
       };
   } else {
       return AdapterInternetExplorer;
   }

   if (typeof RTCIceCandidate === 'undefined') {
      RTCIceCandidate = null;
   }
   if (typeof RTCSessionDescription === 'undefined') {
      RTCSessionDescription = null;
   }

   return {
      RTCPeerConnection: RTCPeerConnection,
      PeerConnectionConstraints: PeerConnectionConstraints,
      RTCIceCandidate: RTCIceCandidate,
      RTCSessionDescription: RTCSessionDescription,
      getUserMedia: getUserMedia,
      getVideoConstraints: getVideoConstraints,
      getAudioConstraints: getAudioConstraints,
      attachMediaStream: attachMediaStream,
      reattachMediaStream: reattachMediaStream,
      processCreateOfferOptions: processCreateOfferOptions,
      setOutputAudioDevice: setOutputAudioDevice
   };
});
