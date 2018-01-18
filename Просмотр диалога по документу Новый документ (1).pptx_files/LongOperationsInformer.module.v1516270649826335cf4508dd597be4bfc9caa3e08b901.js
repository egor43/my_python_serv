(function() {
   var availableDict = {"en-US":true},
      langMatch = String(typeof document === 'undefined' ? '' : document.cookie).match(/lang=([A-z-]+)/),
      langName = langMatch ? langMatch[1] : 'ru-RU',
      langModule = 'text!SBIS3.CONTROLS/lang/' + langName + '/' + langName + '.json';
   if (langName in availableDict) {
      define('SBIS3.CONTROLS_localization', ['Core/i18n', langModule], function(i18n, data) {
         if (data){
            i18n.setDict(JSON.parse(data), langModule, langName);
         }
      });
   } else {
      define('SBIS3.CONTROLS_localization', function() {});
   }
})();

(function() {
   var availableDict = {"en-US":true},
      langMatch = String(typeof document === 'undefined' ? '' : document.cookie).match(/lang=([A-z-]+)/),
      langName = langMatch ? langMatch[1] : 'ru-RU',
      langModule = 'text!SBIS3.ENGINE/lang/' + langName + '/' + langName + '.json';
   if (langName in availableDict) {
      define('SBIS3.ENGINE_localization', ['Core/i18n', langModule], function(i18n, data) {
         if (data){
            i18n.setDict(JSON.parse(data), langModule, langName);
         }
      });
   } else {
      define('SBIS3.ENGINE_localization', function() {});
   }
})();

define('SBIS3.CONTROLS/LongOperations/Const',['SBIS3.CONTROLS_localization'],function(){'use strict';return{ERR_UNLOAD:''+rk('Операция прекращена ввиду того, что пользователь покинул страницу','ДлительныеОперации'),MSG_UNLOAD:''+rk('Если Вы покинете эту страницу сейчас, то некоторые длительные операции не будут завершены корректно. Покинуть страницу?','ДлительныеОперации')};});
define('SBIS3.CONTROLS/LongOperations/TabKey',['SBIS3.CONTROLS_localization'],function(){'use strict';return function(n){for(var r=[],t=0;t<n;t++)r[t]=Math.round(15*Math.random()).toString(16);return r.join('');}(50);});
define('SBIS3.CONTROLS/LongOperations/Tools/Postloader',['Core/Deferred','SBIS3.CONTROLS_localization'],function(e){'use strict';var t=function(e,t){if(!e||'string'!==typeof e)throw new TypeError('Argument "sourceModule" must be a string');this._src=e,this._args=t,this._mod=null,this._waits={};};(t.prototype={method:function(e){if(!e||'string'!==typeof e)throw new TypeError('Argument "name" must be a string');var t=this;return function(){if(!this||'object'!==typeof this)throw new Error('Сall without object context');return r.call(this,t,e,[].slice.call(arguments));};}}).constructor=t;var r=function(t,r,n){var i=new e();if(t._mod)o(this,r,t._mod[r],n,i);else{var a=t._waits[r];if(!a)t._waits[r]=a=new e(),require([t._src],function(e){if(!e||'function'!==typeof e)return void i.errback(new TypeError('Loaded module must be a function'));var o=e.apply(null,t._args);if(!o||'object'!==typeof o)return void i.errback(new TypeError('Module function must return an object'));t._mod=o,delete t._src,delete t._args,delete t._waits[r],a.callback();}.bind(this));a.addCallback(function(){o(this,r,t._mod[r],n,i);}.bind(this));}return i;},o=function(t,r,o,n,i){if(!o||'function'!==typeof o)return void i.errback(new TypeError('Loaded module does not contain specified method'));t[r]=o;var a;try{a=o.apply(t,n);}catch(e){return void i.errback(e);}i[a instanceof e?'dependOn':'callback'](a);};return t;});
define('SBIS3.CONTROLS/LongOperations/Tools/ProtectedScope',['SBIS3.CONTROLS_localization'],function(){'use strict';var e='undefined'!==typeof WeakMap;function t(){}return t.prototype={scope:e?function(e,t){var r=this.members=this.members||new WeakMap();if(!r.has(e)&&!t)r.set(e,{});return r.get(e);}:function(e,t){var r='__pr0tected__';if(!(r in e)&&!t)Object.defineProperty(e,r,{value:{}});return e[r];},clear:e?function(e){if(this.members)this.members.delete(e);}:function(e){var t='__pr0tected__';if(t in e)delete e[t];}},t.prototype.constructor=t,{create:function(){var e=new t(),r=e.scope.bind(e);return r.clear=e.clear.bind(e),r;}};});
define('SBIS3.CONTROLS/LongOperations/Manager',['Core/core-instance','Core/EventBus','Lib/TabMessage/TabMessage','SBIS3.CONTROLS/LongOperations/Const','SBIS3.CONTROLS/LongOperations/TabKey','SBIS3.CONTROLS/LongOperations/Tools/Postloader','SBIS3.CONTROLS/LongOperations/Tools/ProtectedScope','SBIS3.CONTROLS_localization'],function(e,r,t,n,o,a,s){'use strict';var i={status:true,startedAt:false},c=10,u=s.create(),f=new a('SBIS3.CONTROLS/LongOperations/ManagerLib',[u]),d,p={_moduleName:'SBIS3.CONTROLS/LongOperations/Manager',getTabKey:function(){return u(this)._tabKey;},getByName:function(e){if(!e||'string'!==typeof e)throw new TypeError('Argument "prodName" must be a string');var r=u(this);if(!r._isDestroyed)return r._producers[e];},register:function(e){if(!u(this)._isDestroyed)l(e);},unregister:function(e){if(!u(this)._isDestroyed)return b(e);},isRegistered:function(r){if(!r||!('string'===typeof r||e.instanceOfMixin(r,'SBIS3.CONTROLS/LongOperations/IProducer')))throw new TypeError('Argument "producer" must be string or  SBIS3.CONTROLS/LongOperations/IProducer');var t=u(this);if(!t._isDestroyed)return'string'===typeof r?!!t._producers[r]:!!g(r);},fetch:f.method('fetch'),callAction:f.method('callAction'),canHasHistory:function(e,r){if(e&&'string'!==typeof e)throw new TypeError('Argument "tabKey" must be a string');if(!r||'string'!==typeof r)throw new TypeError('Argument "prodName" must be a string');var t=u(this);if(!t._isDestroyed){if(!e||e===t._tabKey){var n=t._producers[r];if(!n)throw new Error('Producer not found');return t._canHasHistory(n);}else if(e in t._tabManagers&&r in t._tabManagers[e])return t._tabManagers[e][r].canHasHistory;return false;}},history:f.method('history'),subscribe:function(e,r,t){if(!u(this)._isDestroyed)d.subscribe(e,r,t);},unsubscribe:function(e,r,t){if(!u(this)._isDestroyed)d.unsubscribe(e,r,t);},canDestroySafely:function(){var e=u(this);if(!e._isDestroyed)for(var r in e._producers)if(e._producers[r].canDestroySafely&&!e._producers[r].canDestroySafely())return false;return true;},destroy:function(){var e=u(this);if(!e._isDestroyed){e._isDestroyed=true;for(var r in e._producers)e._producers[r].destroy(),b(r);if(d)d.notifyWithTarget('ondestroy',p),d.unsubscribeAll(),d.destroy(),d=null;if(e._tabChannel)e._tabChannel.notify('LongOperations:Manager:onActivity',{type:'die',tab:e._tabKey}),e._tabChannel.unsubscribe('LongOperations:Manager:onActivity',_),e._tabChannel.destroy(),e._tabChannel=null;if(e._tabCalls)e._tabCalls.destroy(),e._tabCalls=null;}}};Object.defineProperty(p,'DEFAULT_FETCH_SORTING',{value:i,enumerable:true}),Object.defineProperty(p,'DEFAULT_FETCH_LIMIT',{value:c,enumerable:true});var l=function(r){if(!r||!e.instanceOfMixin(r,'SBIS3.CONTROLS/LongOperations/IProducer'))throw new TypeError('Argument "producer" must be SBIS3.CONTROLS/LongOperations/IProducer');var t=r.getName();if(!t)throw new Error('Producer has no name');if(!y(r))throw new Error('Producer name is invalid');var n=u(p);if(!(n._producers[t]===r)){if(n._producers[t])throw new Error('Other producer with such name already registered');if(g(r))throw new Error('This producer with other name already registered');if(n._producers[t]=r,['onlongoperationstarted','onlongoperationchanged','onlongoperationended','onlongoperationdeleted'].forEach(function(e){r.subscribe(e,h);}),n._tabChannel.notify('LongOperations:Manager:onActivity',{type:'register',tab:n._tabKey,producer:t,isCrossTab:r.hasCrossTabData(),hasHistory:n._canHasHistory(r)}),n._fetchCalls)for(var o=n._fetchCalls.listPools(),a=0;a<o.length;a++){var s=o[a];n._fetchCalls.add(s,{tab:n._tabKey,producer:t},n._producers[t].fetch(s.where,s.orderBy,s.offset,s.limit,s.extra));}d.notifyWithTarget('onproducerregistered',p);}},b=function(r){if(!r||'string'!==typeof r&&!e.instanceOfMixin(r,'SBIS3.CONTROLS/LongOperations/IProducer'))throw new TypeError('Argument "producer" must be SBIS3.CONTROLS/LongOperations/IProducer or string');var t=u(p),n;if('string'===typeof r){if(n=r,!t._producers[n])return false;}else if(n=r.getName(),!n||t._producers[n]!==r)n=g(r);var o=false;if(n){if(['onlongoperationstarted','onlongoperationchanged','onlongoperationended','onlongoperationdeleted'].forEach(function(e){t._producers[n].unsubscribe(e,h);}),t._fetchCalls)t._fetchCalls.remove(null,{tab:t._tabKey,producer:n});if(delete t._producers[n],t._offsetBunch)t._offsetBunch.removeAll({tab:t._tabKey,producer:n});if(o=true,t._tabChannel.notify('LongOperations:Manager:onActivity',{type:'unregister',tab:t._tabKey,producer:n}),!t._isDestroyed)d.notifyWithTarget('onproducerunregistered',p);}return o;},y=function(e){var r=e.getName(),t=r.indexOf(':'),n=-1!==t?r.substring(0,t):r,o=requirejs.defined(n)?require(n):'js!'!==n.substring(0,3)&&requirejs.defined('js!'+n)?require('js!'+n):null;return!!o&&('function'===typeof o?e instanceof o:e===o);},g=function(e){var r=u(p);for(var t in r._producers)if(e===r._producers[t])return t;};u(p)._canHasHistory=function(r){return e.instanceOfMixin(r,'SBIS3.CONTROLS/LongOperations/IHistoricalProducer');},u(p)._tabTargets=function(e,r,t){var n=u(p);for(var o in t)if(!n._tabManagers[r][o].hasCrossTabData||!n._producers[o]){if(!e)e={};if(!(r in e))e[r]=[];e[r].push(o);}return e;},u(p)._expandTargets=function(e){var r=[];for(var t in e)r.push.apply(r,e[t].map(function(e){return{tab:t,producer:e};}));return r;};var h=function(e,r,t){var n=u(p);if(n._isDestroyed)return;var o;if(!t){if(!r.producer||'string'!==typeof r.producer)throw new TypeError('Unknown event');if(o=n._producers[r.producer],!o)throw new Error('Unknown event');var a={tab:n._tabKey,producer:r.producer};if(n._fetchCalls)for(var s=n._fetchCalls.listPools(a),i=0;i<s.length;i++){var c=s[i];n._fetchCalls.replace(c,a,o.fetch(c));}}var f='object'===typeof e?e.name:e;if(d.notifyWithTarget(f,p,!t?r?O({tabKey:n._tabKey},r):{tabKey:n._tabKey}:r),!t&&!o.hasCrossTabEvents())n._tabChannel.notify('LongOperations:Manager:onActivity',{type:f,tab:n._tabKey,isCrossTab:o.hasCrossTabData(),hasHistory:n._canHasHistory(o),data:r});},_=function(e,r){if(!(r&&'object'===typeof r&&r.type&&'string'===typeof r.type&&r.tab&&'string'===typeof r.tab))throw new TypeError('Unknown event');var t=r.type,n=r.tab;switch(t){case'born':var o=u(p);o._tabManagers[n]={};var a={};for(var s in o._producers)a[s]={isCrossTab:o._producers[s].hasCrossTabData(),hasHistory:o._canHasHistory(o._producers[s])};o._tabChannel.notify('LongOperations:Manager:onActivity',{type:'handshake',tab:o._tabKey,producers:a});break;case'handshake':if(!(r.producers&&'object'===typeof r.producers))throw new Error('Unknown event');v(n,r.producers);break;case'die':C(n);break;case'register':if(!(r.producer&&'string'===typeof r.producer&&'isCrossTab'in r&&'boolean'===typeof r.isCrossTab&&'hasHistory'in r&&'boolean'===typeof r.hasHistory))throw new Error('Unknown event');v(n,r.producer,r.isCrossTab,r.hasHistory);break;case'unregister':if(!(r.producer&&'string'===typeof r.producer))throw new Error('Unknown event');C(n,r.producer);break;case'onlongoperationstarted':case'onlongoperationchanged':case'onlongoperationended':case'onlongoperationdeleted':var i=r.data;if(!(i&&'object'===typeof i&&i.producer&&'string'===typeof i.producer&&'isCrossTab'in r&&'boolean'===typeof r.isCrossTab&&'hasHistory'in r&&'boolean'===typeof r.hasHistory))throw new Error('Unknown event');v(n,i.producer,r.isCrossTab,r.hasHistory),h(t,O({tabKey:n},i),true);}},v=function(e,r,t,n){var o=u(p);if(!(e in o._tabManagers))o._tabManagers[e]={};var a=o._tabManagers[e],s;if('object'==typeof r&&Object.keys(r).length){s={};for(var i in r)if(!(i in a)){var c=r[i];a[i]=s[i]={hasCrossTabData:c.isCrossTab,canHasHistory:c.hasHistory};}}else if(!(r in a))s={},a[r]=s[r]={hasCrossTabData:t,canHasHistory:n};if(s){if(o._fetchCalls){var f=o._fetchCalls.listPools();if(f.length){var l=o._tabTargets(null,e,s);if(l)for(var b=o._expandTargets(l),y=0;y<f.length;y++){var g=f[y],h=o._fetchFromTabs(l,g,false);o._fetchCalls.addList(g,b,h);}}}d.notifyWithTarget('onproducerregistered',p);}},C=function(e,r){var t=u(p);if(e in t._tabManagers){if(t._fetchCalls)t._fetchCalls.remove(null,r?{tab:e,producer:r}:{tab:e});if(r)delete t._tabManagers[e][r];else delete t._tabManagers[e];if(t._offsetBunch)t._offsetBunch.removeAll(r?{tab:e,producer:r}:{tab:e});d.notifyWithTarget('onproducerunregistered',p);}},O=Object.assign||function(e){return[].slice.call(arguments,1).reduce(function(e,r){return Object.keys(r).reduce(function(e,t){return e[t]=r[t],e;},e);},e);};if(u(p)._producers={},u(p)._tabManagers={},u(p)._tabKey=o,d=r.channel(),u(p)._tabChannel=new t(),d.publish('onlongoperationstarted','onlongoperationchanged','onlongoperationended','onlongoperationdeleted','onproducerregistered','onproducerunregistered','ondestroy'),u(p)._tabChannel.subscribe('LongOperations:Manager:onActivity',_),u(p)._tabChannel.notify('LongOperations:Manager:onActivity',{type:'born',tab:u(p)._tabKey}),'undefined'!==typeof window)window.addEventListener('beforeunload',function(e){if(!p.canDestroySafely())return e.returnValue=n.MSG_UNLOAD,n.MSG_UNLOAD;}),window.addEventListener('unload',p.destroy.bind(p));return p;});
define('SBIS3.CONTROLS/LongOperations/IHistoricalProducer',['SBIS3.CONTROLS_localization'],function(){'use strict';return{history:function(e,r,t){throw new Error('Method must be implemented');}};});
define('SBIS3.CONTROLS/LongOperations/IProducer',['SBIS3.CONTROLS_localization'],function(){'use strict';var r='Method must be implemented';return{getName:function(){throw new Error(r);},hasCrossTabEvents:function(){throw new Error(r);},hasCrossTabData:function(){throw new Error(r);},fetch:function(n){throw new Error(r);},callAction:function(n,o){throw new Error(r);},subscribe:function(n,o){throw new Error(r);},unsubscribe:function(n,o){throw new Error(r);},canDestroySafely:function(){throw new Error(r);},destroy:function(){throw new Error(r);}};});
define('js!SBIS3.Engine.LongOperations.LRSProducer',['Core/core-extend','Lib/ServerEvent/Bus','WS.Data/Entity/ObservableMixin','SBIS3.CONTROLS/LongOperations/IHistoricalProducer','SBIS3.CONTROLS/LongOperations/IProducer','SBIS3.CONTROLS/LongOperations/Tools/Postloader','SBIS3.CONTROLS/LongOperations/Tools/ProtectedScope','SBIS3.ENGINE_localization'],function(e,n,t,o,r,i,s){'use strict';var a='SBIS3.Engine.LongOperations.LRSProducer',c=new i('js!SBIS3.Engine.LongOperations.LRSProducerLib',[s.create()]),d=[],u=e.extend({},[r,o,t],{_moduleName:a,$protected:{_isActivated:null},init:function(){this._publish('onlongoperationstarted','onlongoperationchanged','onlongoperationended','onlongoperationdeleted');},destroy:function(){l(this);},subscribe:function(e,n){if(!this._isActivated&&['onlongoperationstarted','onlongoperationchanged','onlongoperationended','onlongoperationdeleted'].some(function(n){return e===n;}))g(this);u.superclass.subscribe.apply(this,arguments);},unsubscribe:function(e,n){u.superclass.unsubscribe.apply(this,arguments);var t=['onlongoperationstarted','onlongoperationchanged','onlongoperationended','onlongoperationdeleted'];if(this._isActivated&&t.some(function(n){return e===n;})){var o=this._eventBusChannel;if(o)if(!t.some(function(e){return o.hasEventHandlers(e);}))l(this);}},getName:function(){return a;},hasCrossTabEvents:function(){return true;},hasCrossTabData:function(){return true;},fetch:c.method('fetch'),callAction:c.method('callAction'),history:c.method('history'),canDestroySafely:function(){return true;}}),g=function(e){if(!e._isActivated){if(!e._serviceListener)e._serviceListener=p.bind(e);n.serverChannel('lrs.event_informer').subscribe('onMessage',e._serviceListener),e._isActivated=true;}},l=function(e){if(e._isActivated&&e._serviceListener)n.serverChannel('lrs.event_informer').unsubscribe('onMessage',e._serviceListener),e._isActivated=false;},p=function(e,n){var t=n.get('LRId'),o=d.indexOf(t),r,i;switch(n.get('EventType')){case'lr_state_changed':switch(n.get('State')){case 0:if(-1===o)r='onlongoperationstarted',i={progress:{value:0,total:n.get('TaskCount')}};else r='onlongoperationchanged',i={changed:'status',status:0};break;case 1:r='onlongoperationchanged',i={changed:'status',status:1};break;case 2:r='onlongoperationended',i={progress:{value:n.get('TaskCount'),total:n.get('TaskCount')}};break;case 3:r='onlongoperationended',i={error:'Long operation error'};break;case 4:case 5:if(r='onlongoperationdeleted',-1!==o)d.splice(o,1);}break;case'lr_progress_changed':r='onlongoperationchanged',i={changed:'progress',progress:{value:n.get('ExecTask'),total:n.get('TotalTask')}};break;case'lr_notification':r='onlongoperationchanged',i={changed:'notification',notification:n.get('Notification'),workflowId:t},t=void 0;}if(!r)throw new Error('Unknown event received');if(-1===o)d.push(o);var s={producer:this.getName(),operationId:t},a=n.get('CustomData');if(a&&'object'===typeof a&&Object.keys(a).length)s.custom=a;this._notify(r,i?f(s,i):s);},f=Object.assign||function(e,n){return Object.keys(n).reduce(function(e,t){return e[t]=n[t],e;},e);};return new u();});
define('SBIS3.CONTROLS/LongOperations/Entry',['Core/core-extend','SBIS3.CONTROLS_localization'],function(e){'use strict';var r={running:0,suspended:1,ended:2,deleted:4},t={status:r.running,timeSpent:0,timeIdle:0,progressCurrent:0,progressTotal:1,canDelete:true,canSuspend:true},n={title:'string',id:['string','number'],producer:'string',tabKey:'string',startedAt:'Date',timeSpent:'number',timeIdle:'number',status:'number',isFailed:'boolean',progressTotal:'number',progressCurrent:'number',canDelete:'boolean',canSuspend:'boolean',resumeAsRepeat:'boolean',userId:'number',userUuId:'string',userFirstName:'string',userPatronymicName:'string',userLastName:'string',userPic:'string',resultChecker:'string',resultCheckerArgs:['string','object'],resultWayOfUse:'string',resultMessage:'string',resultUrl:'string',resultUrlAsDownload:'boolean',resultValidUntil:'Date',resultHandler:'string',resultHandlerArgs:['string','object'],useResult:'boolean',custom:'object',extra:'object',notification:'string'},s=e.extend({_moduleName:'SBIS3.CONTROLS/LongOperations/Entry',constructor:function e(s){if(!s||'object'!==typeof s)throw new TypeError('Argument "options" must be object');var o=['id','title','producer','startedAt'],u=['user','result','progress'],a={};for(var l in n){var f=null;if(s.hasOwnProperty(l))f=s[l];else for(var g=0;g<u.length;g++){var d=u[g];if(d.length<l.length&&0===l.indexOf(d)){if(!(d in a))a[d]=s.hasOwnProperty(d)&&s[d]&&'object'===typeof s[d];if(a[d]){var c=l.charAt(d.length).toLowerCase()+l.substring(d.length+1);if(s[d].hasOwnProperty(c))f=s[d][c];}}}var p=n[l],b;if(null!=f){var m=Array.isArray(p);if(b=m?p.some(function(e){return i(f,e);}):i(f,p),!b){if(m?-1!==p.indexOf('Date'):'Date'===p)f=new Date(f),b=true;if('status'===l&&'string'===typeof f)if(f in r)f=r[f],b=true;}else if('status'===l&&!Object.keys(r).some(function(e){return f===r[e];}))b=false;}if(null==f||!b)if(-1!==o.indexOf(l))throw new TypeError('Argument "options.'+l+'" must be '+(Array.isArray(p)?p.join(' or '):'a '+p));else f=l in t?t[l]:null;this[l]=f;}if(!this.progressCurrent&&this.status===r.ended)this.progressCurrent=this.progressTotal;},toSnapshot:function(){var e={};for(var r in n){var s=this[r];if(null!=s&&!(r in t&&s===t[r]))e[r]=s instanceof Date?s.getTime():s;}return e;}});s.STATUSES=r,s.DEFAULTS=t;var i=function(e,r){if(typeof e===r)return true;if(-1===['boolean','number','string','object'].indexOf(r)){var t='undefined'!==typeof window?window:'undefined'!==typeof global?global:null;if(t)return'function'===typeof t[r]&&e instanceof t[r];}return false;};return s;});
define('SBIS3.CONTROLS/LongOperations/AbstractProducer',['Core/core-extend','Core/Deferred','Core/IoC','WS.Data/Entity/ObservableMixin','SBIS3.CONTROLS/LongOperations/IProducer','SBIS3.CONTROLS/LongOperations/Entry','SBIS3.CONTROLS/LongOperations/Const','SBIS3.CONTROLS_localization'],function(e,r,t,n,o,i,a){'use strict';var u={status:true,startedAt:false},s,f=e.extend({},[o,n],{_moduleName:'SBIS3.CONTROLS/LongOperations/AbstractProducer',$constructor:function e(){this._isDestroyed=null;},init:function(){this._publish('onlongoperationstarted','onlongoperationchanged','onlongoperationended','onlongoperationdeleted');},fetch:function(e){if(e&&'object'!==typeof e)throw new TypeError('Argument "options" must be an object if present');if(e&&'extra'in e&&'object'!==typeof e.extra)throw new TypeError('Argument "options.extra" must be an object if present');if(this._isDestroyed)return r.fail(a.ERR_UNLOAD);e=e||{};var t=this._list(true,e.where,e.orderBy||u,e.offset,e.limit);if(t.length)if(e.extra&&e.extra.needUserInfo)return p(t);return r.success(t);},canDestroySafely:function(){if(!this._isDestroyed)return true;},destroy:function(){if(!this._isDestroyed)this._isDestroyed=true;},_getStorageNS:function(){throw new Error('Method must be implemented');},_getStorageNextId:function(){return h.nextCounter(this._getStorageNS());},_put:function(e){if(!e||'object'!==typeof e)throw new TypeError('Argument "operation" must be object');var r=this.getName(),t=this._getStorageNS();if(e instanceof i){if(e.producer!==r)throw new Error('Argument "operation" has invalid producer');}else{var n=m({producer:r},e);if(!n.startedAt)n.startedAt=new Date();e=new i(n);}return h.put(t,e.id,l(e)),e.id;},_get:function(e,r){if(e&&'boolean'!==typeof e)throw new TypeError('Argument "asOperation" must be boolean');if(!r||!('string'===typeof r||'number'===typeof r))throw new TypeError('Argument "operationId" must be number or string');var t=h.get(this._getStorageNS(),r);return t?e?g(t,this.getName()):t:null;},_list:function(e,r,t,n,o){if(e&&'boolean'!==typeof e)throw new TypeError('Argument "asOperation" must be boolean');if(r&&'object'!==typeof r)throw new TypeError('Argument "where" must be an object');if(t&&'object'!==typeof t)throw new TypeError('Argument "orderBy" must be an array');if(n&&!('number'===typeof n&&0<=n))throw new TypeError('Argument "offset" must be not negative number');if(o&&!('number'===typeof o&&0<o))throw new TypeError('Argument "limit" must be positive number');var a=h.list(this._getStorageNS());if(!a.length)return a;var u=i.DEFAULTS;if(r)if(a=a.filter(function(e){for(var t in r)if(!c(t in e?e[t]:u[t],r[t]))return false;return true;}),!a.length)return a;if(t)a.sort(function(e,r){for(var n in t){var o=n in e?e[n]:u[n],i=n in r?r[n]:u[n];if(o<i)return t[n]?-1:+1;else if(i<o)return t[n]?+1:-1;}return 0;});if(o||n)a=a.slice(n||0,o?(n||0)+o:a.length);if(!e)return a;var s=this.getName();return a.map(function(e){return g(e,s);});},_remove:function(e){if(!e||!('string'===typeof e||'number'===typeof e))throw new TypeError('Argument "operationId" must be number or string');if(!h.remove(this._getStorageNS(),e))throw new Error('Operation not found');},_clear:function(){return h.clear(this._getStorageNS());}}),c=function(e,r){if(null==r||'object'!==typeof r)return null!=r?e===r:null==e;if(Array.isArray(r))return-1!==r.indexOf(e);if(!(r.condition&&'string'===typeof r.condition)||!('value'in r))throw new TypeError('Wrong condition object');switch(r.condition){case'<':return e<r.value;case'<=':return e<=r.value;case'>=':return e>=r.value;case'>':return e>r.value;case'contains':if('string'!==typeof e||'string'!==typeof r.value)throw new TypeError('Value and condition is incompatible');return-1!==(r.sensitive?e:e.toLowerCase()).indexOf(r.sensitive?r.value:r.value.toLowerCase());}return false;},l=function(e){if(!e||!(e instanceof i))throw new TypeError('Argument must be instance of LongOperationEntry');var r=e.toSnapshot();return delete r.producer,r;},g=function(e,r){if(!e||!('object'===typeof e))throw new TypeError('Argument "snapshot" must be an object');return new i(m({producer:r},e));},p=function(e){var t=e.reduce(function(e,r){if(r.userUuId&&-1===e.indexOf(r.userUuId))e.push(r.userUuId);return e;},[]);if(!t.length)return r.success(e);var n=new r();return require(['WS.Data/Source/SbisService','WS.Data/Chain'],function(r,o){if(!i)var i=new r({endpoint:{address:'/service/',contract:'Персона'}});i.call('ПодробнаяИнформация',{'Персоны':t,'ДляДокумента':null,'ПроверитьЧерныйСписок':false}).addCallbacks(function(r){var t=e.reduce(function(e,r,t){if(r.userUuId){if(!e[r.userUuId])e[r.userUuId]=[];e[r.userUuId].push(t);}return e;},{});o(r.getAll()).each(function(r){var n=r.get('Персона'),o=t[n];if(o)for(var i=0;i<o.length;i++){var a=e[o[i]];a.userFirstName=r.get('Имя'),a.userPatronymicName=r.get('Отчество'),a.userLastName=r.get('Фамилия'),a.userPic=d(n);}}),n.callback(e);},function(r){n.callback(e);});}),n;},d=function(e){return'/service/?id=0&method=PProfileServicePerson.GetPhoto&protocol=4&params='+window.btoa(JSON.stringify({person:e,kind:'mini'}));},m=Object.assign||function(e){return[].slice.call(arguments,1).reduce(function(e,r){return Object.keys(r).reduce(function(e,t){return e[t]=r[t],e;},e);},e);},h={nextCounter:function(e){var r=e+'-'+'(n)',t=localStorage.getItem(r);return t=t?parseInt(t)+1:1,localStorage.setItem(r,t),t;},put:function(e,r,t){localStorage.setItem(e+'-'+r,JSON.stringify(t));},get:function(e,r){var t=localStorage.getItem(e+'-'+r);return t?this._jsonParse(t):null;},list:function(e){for(var r=[],t=e+'-',n=0,o=localStorage.length;n<o;n++){var i=localStorage.key(n);if(0===i.indexOf(t))if(0<parseInt(i.substring(t.length))){var a=this._jsonParse(localStorage.getItem(i));if(a)r.push(a);}}return r;},remove:function(e,r){var t=e+'-'+r,n=!!localStorage.getItem(t);if(n)localStorage.removeItem(t);return n;},clear:function(e){for(var r=[],t=e+'-',n=localStorage.length-1;0<=n;n--){var o=localStorage.key(n);if(0===o.indexOf(t)){localStorage.removeItem(o);var i=parseInt(o.substring(t.length));if(!isNaN(i))r.push(i);}}return r;},_jsonParse:function(e){if(e){var r;try{r=JSON.parse(e);}catch(e){t.resolve('ILogger').error('SBIS3.CONTROLS/LongOperations/AbstractProducer','JSON data is corrupted');}return r;}}};return f;});
define('SBIS3.CONTROLS/LongOperations/GenericProducer',['Core/Deferred','Core/UserInfo','Core/EventBusChannel','SBIS3.CONTROLS/LongOperations/Const','SBIS3.CONTROLS/LongOperations/TabKey','SBIS3.CONTROLS/LongOperations/Entry','SBIS3.CONTROLS/LongOperations/AbstractProducer','SBIS3.CONTROLS_localization'],function(e,t,r,n,s,o,i){'use strict';var a='SBIS3.CONTROLS/LongOperations/GenericProducer',u='wslop-gen',l={},d=i.extend({_moduleName:a,$protected:{_key:null,_actions:{}},$constructor:function e(t){if(t&&'string'!==typeof t)throw new TypeError('Argument "key" must be a string');if(t=t||'',t in l)return l[t];this._key=t||null,l[t]=this;},destroy:function(){if(!this._isDestroyed){this._isDestroyed=true;for(var e=o.STATUSES,t=o.DEFAULTS,r=n.ERR_UNLOAD,s=this._list(false),i=[],a=0;a<s.length;a++){var u=s[a],d='status'in u?u.status:t.status,c=d===e.running;if(c||d===e.suspended){var f=u.id;if(this._actions?this._actions[f]:null)delete this._actions[f],u.status=e.ended,u.isFailed=true,u.resultMessage=r,u[c?'timeSpent':'timeIdle']=new Date().getTime()-u.startedAt-(u[c?'timeIdle':'timeSpent']||0),this._put(u),i.push(f);}}if(i.length)this._notify('onlongoperationended',{producer:this.getName(),operationIds:i,error:r});Object.keys(l).some(function(e){if(this===l[e])return delete l[e],true;}.bind(this));}},getName:function(){return this._key?a+':'+this._key:a;},hasCrossTabEvents:function(){return false;},hasCrossTabData:function(){return true;},callAction:function(t,r){if(!t||'string'!==typeof t)throw new TypeError('Argument "action" must be a string');if(!r||!('string'===typeof r||'number'===typeof r))throw new TypeError('Argument "operationId" must be string or number');if(this._isDestroyed)return e.fail(n.ERR_UNLOAD);var s={suspend:'onSuspend',resume:'onResume',delete:'onDelete'};if(!(t in s))throw new Error('Unknown action');try{var i=this._actions&&r in this._actions&&t in s?this._actions[r][s[t]]:null;if('delete'!==t&&!i)throw new Error('Action not found or not applicable');var a=o.STATUSES;switch(t){case'suspend':f(this,r,a.suspended,i);break;case'resume':f(this,r,a.running,i);break;case'delete':var u=this._get(false,r);if(!u)throw new Error('Operation not found');if(!('canDelete'in u?u.canDelete:o.DEFAULTS.canDelete))throw new Error('Deleting is not allowed');if(i&&!i.call(null))throw new Error('Deleting is not performed');this._remove(r);var l=this._actions[r];if(l&&l.progressor){var d=l.progressor;d.channel.unsubscribe(d.event,d.handler);}delete this._actions[r],this._notify('onlongoperationdeleted',{producer:this.getName(),operationId:r});}return e.success();}catch(t){return e.fail(t);}},canDestroySafely:function(){if(!this._isDestroyed){if(this._actions){var e=this._list(false);if(e.length)for(var t=o.STATUSES,r=o.DEFAULTS,n=0;n<e.length;n++){var i=e[n];if(this._actions[i.id]){var a='status'in i?i.status:r.status;if((a===t.running||a===t.suspended)&&i.tabKey===s)return false;}}}return true;}},_getStorageNS:function(){return u+'('+(this._key||'')+')';},make:function(n,i){if(!n||'object'!==typeof n)throw new TypeError('Argument "options" must be an object');if(!i&&n.stopper)i=n.stopper;if(!(i instanceof e))throw new TypeError('Argument "stopper" must be a Deferred');if(n.progressor&&!('object'===typeof n.progressor&&n.progressor.channel instanceof r&&n.progressor.event&&'string'===typeof n.progressor.event&&'function'===typeof n.progressor.extractor))throw new TypeError('Argument "options.progressor" is not valid');if(this._isDestroyed)return;var a=o.STATUSES;n.canSuspend='function'===typeof n.onSuspend&&'function'===typeof n.onResume,n.canDelete='function'===typeof n.onDelete;var u=n.canSuspend||n.canDelete;if(u)n.tabKey=s;n.userId=t.get('Пользователь'),n.userUuId=t.get('ИдентификаторСервисаПрофилей');var l=this._getStorageNextId();if(n.id=l,this._put(n),u){var d={};if(n.canSuspend)d.onSuspend=n.onSuspend,d.onResume=n.onResume;if(n.canDelete)d.onDelete=n.onDelete;this._actions[l]=d;}var p,g=n.progressor;if(g)p={channel:g.channel,event:g.event,extractor:g.extractor,handler:c.bind(null,this,l)},(this._actions[l]=this._actions[l]||{}).progressor=p;if(this._notify('onlongoperationstarted',{producer:this.getName(),operationId:l}),p)p.channel.subscribe(p.event,p.handler);i.addCallbacks(function(e){if(e&&'object'!==typeof e)throw new TypeError('Invalid result');f(this,l,a.ended,e||null);}.bind(this),function(e){f(this,l,a.ended,{error:e.message||'Long operation error'});}.bind(this));}}),c=function(e,t,r,n){var s=e._actions[t];if(!s)return;var o=e._get(false,t);if(!o)return;if(!s.progressor)throw new Error('Progressor is missed');var i=s.progressor.extractor.call(null,n);if(!('number'===typeof i&&0<=i&&i<=1))throw new Error('Illegal progress value');o.progressCurrent=i,e._put(o),e._notify('onlongoperationchanged',{producer:e.getName(),operationId:t,changed:'progress',progress:{value:i,total:1}});},f=function(e,t,r,n){if(!('number'===typeof t&&0<t))throw new TypeError('Argument "operationId" must be positive number');var s=o.STATUSES;if('number'!==typeof r||!Object.keys(s).some(function(e){return r===s[e];}))throw new TypeError('Invalid argument "status"');var i=e._get(true,t);if(!i)throw new Error('Operation not found');if(r!==i.status){var a,u=i.status,l=u===s.running;switch(r){case s.running:a=u===s.suspended;break;case s.suspended:a=l;break;case s.ended:a=l||u===s.suspended;}if(!a)throw new Error('Action is not allowed');i.status=r;var d,c;switch(r){case s.running:case s.suspended:var f='function'===typeof n?n:null;if(f&&!f.call(null))throw new Error('Action is not performed');d='onlongoperationchanged',c={changed:'status'};break;case s.ended:i.tabKey=null;var g=e._actions[t];if(g&&g.progressor){var h=g.progressor;h.channel.unsubscribe(h.event,h.handler);}if(i.canDelete)delete g.onSuspend,delete g.onResume;else delete e._actions[t];d='onlongoperationended';var m=n?n.error:null;if(!m){if(i.progressCurrent=i.progressTotal,n){if(n.url&&'string'===typeof n.url){if(i.resultUrl=n.url,n.urlAsDownload)i.resultUrlAsDownload=n.urlAsDownload;}else if(n.handler&&'string'===typeof n.handler)if(i.resultHandler=n.handler,n.handlerArgs)i.resultHandlerArgs=n.handlerArgs;if(n.message&&'string'===typeof n.message)i.resultMessage=n.message;if(n.validUntil)i.resultValidUntil=n.validUntil instanceof Date?n.validUntil:new Date(n.validUntil);}}else i.isFailed=true,i.resultMessage=m,c={error:m};}i[l?'timeSpent':'timeIdle']=new Date().getTime()-i.startedAt-i[l?'timeIdle':'timeSpent'],e._put(i);var y={producer:e.getName(),operationId:t,status:r};e._notify(d,c?p(y,c):y);}},p=Object.assign||function(e){return[].slice.call(arguments,1).reduce(function(e,t){return Object.keys(t).reduce(function(e,r){return e[r]=t[r],e;},e);},e);};return d.getInstance=function(e){return new d(e);},d;});
define('js!SBIS3.Engine.LongOperationsInformer',['Core/Deferred','Core/EventBus','Core/helpers/Object/isEqual','Core/SessionStorage','Core/UserInfo','SBIS3.CONTROLS/LongOperations/Manager','js!SBIS3.Engine.LongOperations.LRSProducer','SBIS3.CONTROLS/LongOperations/GenericProducer','SBIS3.ENGINE_localization'],function(e,t,n,i,o,r,a,s){'use strict';var c=i.get('autoTestConfig');if(c&&c.hideLongOperationsPanel)return;var f='ws-longop-starter',u,l=[],g=function(e){var t=d(),n=o.get('Пользователь');if(-1===t.indexOf(n))S(t.concat(n));require(['SBIS3.CONTROLS/LongOperations/Popup','browser!js!SBIS3.CONTROLS/Utils/NotificationStackManager'],function(t,n){if(!u||u.isDestroyed()){var i=function(){var e=d(),t=e.indexOf(o.get('Пользователь'));if(-1!==t)e.splice(t,1),S(e);u=null;};if((u=new t({customConditions:l,element:$('<div></div>'),waitIndicatorText:e?e.waitIndicatorText:void 0,withAnimation:e?e.withAnimation:void 0})).isDestroyed())i();else u.subscribe('onClose',i),n.showNotification(u,true);}else if(e&&e.withAnimation)u.animationAtStart(e.waitIndicatorText);});},d=function(){var e,t=localStorage.getItem(f);if(t)e=JSON.parse(t);return e&&e.length?e:[];},S=function(e){if(e&&e.length)localStorage.setItem(f,JSON.stringify(e));else localStorage.removeItem(f);};if('undefined'!==typeof window){r.register(a),r.register(new s()),t.channel('LongOperations').subscribe('onOperationStarted',function(e,t){var n,i;if(t)if('object'===typeof t)n=t.text,i=t.noAnimation;else if('string'===typeof t)n=t;g({waitIndicatorText:n,withAnimation:!i});}),['onlongoperationstarted','onlongoperationended'].forEach(function(e){r.subscribe(e,g);});var p=function(e){return function(t){var n;try{n=e.apply(null,[].slice.call(arguments));}catch(e){n=e;}t.setResult(n);};},O=function(e,t){var i=-1;if(e&&e.length)e.some(function(e,o){if(n(e,t))return i=o,true;else return false;});return i;};if(t.channel('LongOperations').subscribe('onCustomViewerStarted',p(function(t,n){if(!n||'object'!==typeof n||!Object.keys(n).length)throw new Error('None empty object required');if(-1===O(l,n))if((l=l||[]).push(n),u&&!u.isDestroyed())u.reload();var i=new e();return require(['SBIS3.CONTROLS/LongOperations/CustomSlice'],function(e){var t;try{t=new e(n);}catch(e){return void i.errback(e);}i.callback(t);}),i;})),t.channel('LongOperations').subscribe('onCustomViewerStopped',p(function(t,n){if(!n||'object'!==typeof n||!Object.keys(n).length)throw new Error('None empty object required');var i=O(l,n);if(-1!==i)if(l.splice(i,1),u&&!u.isDestroyed())u.reload();return e.success(-1!==i);})),-1!==d().indexOf(o.get('Пользователь')))g();}return null;});