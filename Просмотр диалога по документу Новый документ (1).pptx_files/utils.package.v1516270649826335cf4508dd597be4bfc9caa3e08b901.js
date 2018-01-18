(function(){
var global = (function(){ return this || (0, eval)('this'); }());
var require = global.requirejs;
var exports = {};
var deps = ['Core/Serializer', 'Core/IoC', 'Core/core-instance', 'Core/TimeInterval', 'Core/defaultRenders', 'WS.Data/Collection/RecordSet', 'Core/ParallelDeferred', 'Core/Abstract', 'WS.Data/Entity/Model'];

Object.defineProperty(exports,'WS.Data/Di',{configurable:true,get:function(){delete exports['WS.Data/Di'];return exports['WS.Data/Di']=function(){'use strict';var e={},r;return r={_moduleName:'WS.Data/Di',register:function(t,i,n){r._checkAlias(t),e[t]=[i,n];},unregister:function(t){r._checkAlias(t),delete e[t];},isRegistered:function(t){return r._checkAlias(t),e.hasOwnProperty(t);},create:function(e,t){var i=r.resolve(e,t);if('function'===typeof i)return r.resolve(i,t);return i;},resolve:function(t,i){var n,s,a;switch(typeof t){case'function':n=t;break;case'object':n=t,s={instantiate:false};break;default:if(!r.isRegistered(t))throw new ReferenceError('Alias '+t+' is not registered');n=e[t][0],s=e[t][1],a=e[t][2];}if(s){if(false===s.instantiate)return n;if(true===s.single){if(void 0===a)a=e[t][2]=new n(i);return a;}}return new n(i);},_checkAlias:function(e){if('string'!==typeof e)throw new TypeError('Alias should be a string');if(!e)throw new TypeError('Alias is empty');}},r;}();}});
Object.defineProperty(exports,'WS.Data/MoveStrategy/IMoveStrategy',{configurable:true,get:function(){delete exports['WS.Data/MoveStrategy/IMoveStrategy'];return exports['WS.Data/MoveStrategy/IMoveStrategy']=function(){'use strict';return{move:function(e,t,r){throw new Error('Method must be implemented');},hierarchyMove:function(e,t){throw new Error('Method must be implemented');}};}();}});
Object.defineProperty(exports,'WS.Data/Utils',{configurable:true,get:function(){delete exports['WS.Data/Utils'];return exports['WS.Data/Utils']=function(e,t){return{_moduleName:'WS.Data/Utils',getItemPropertyValue:function(e,t){if(t=t||'',!(e instanceof Object))return;if(t in e)return e[t];if(e&&e._wsDataEntityIObject&&e.has(t))return e.get(t);var r=this._getPropertyMethodName(t,'get');if('function'===typeof e[r]&&!e[r].deprecated)return e[r]();return;},setItemPropertyValue:function(e,t,r){if(t=t||'',!(e instanceof Object))throw new TypeError('Argument item should be an instance of Object');if(t in e)e[t]=r;if(e&&e._wsDataEntityIObject&&e.has(t))return e.set(t,r);var n=this._getPropertyMethodName(t,'set');if('function'===typeof e[n]&&!e[n].deprecated)return e[n](r);throw new ReferenceError('Object doesn\'t have setter for property "'+t+'".');},clone:function(t){if(t instanceof Object)if(t._wsDataEntityICloneable)return t.clone();else{var r=new e();return JSON.parse(JSON.stringify(t,r.serialize),r.deserialize);}else return t;},logger:{log:function(){var e=t.resolve('ILogger');e.log.apply(e,arguments);},error:function(){var e=t.resolve('ILogger');e.error.apply(e,arguments);},info:function(){var e=t.resolve('ILogger');e.info.apply(e,arguments);},stack:function(e,r,n){r=r||0,n=n||'info';var i=new Error(e),o=2+r,s='',a='';if('stack'in i){var c=(i.stack+'').split('\n');if(this._stackReg=this._stackReg||/:[0-9]+:[0-9]+/,!this._stackReg.test(c[0]))o++;if(s=c.splice(o,1).join('').trim(),a=e+s,this._stackPoints=this._stackPoints||{},this._stackPoints.hasOwnProperty(a))return;this._stackPoints[a]=true;}t.resolve('ILogger')[n](i.message+(s?' ['+s+']':''));}},_getPropertyMethodName:function(e,t){return t+e.substr(0,1).toUpperCase()+e.substr(1);}};}(require(deps[0]),require(deps[1]));}});
Object.defineProperty(exports,'WS.Data/Shim/Set',{configurable:true,get:function(){delete exports['WS.Data/Shim/Set'];return exports['WS.Data/Shim/Set']=function(){'use strict';if('undefined'!==typeof Set)return Set;return function(){var t=function(){this.clear();};return t.prototype._hash=null,t.prototype._objectPrefix='{[object]}:',t.prototype._objects=null,Object.defineProperty(t.prototype,'size',{get:function(){return Object.keys(this._hash).length;},enumerable:true,configurable:false}),t.prototype.add=function(t){var e=t;if(this._isObject(t))e=this._addObject(t);return this._hash[e]=t,this;},t.prototype.clear=function(){this._hash={},this._objects=[];},t.prototype.delete=function(t){var e=t;if(this._isObject(t))if(e=this._deleteObject(t),!e)return;this._hash[e]=void 0;},t.prototype.entries=function(){throw new Error('Method is not supported');},t.prototype.forEach=function(t,e){var o=this._hash;for(var r in o)if(o.hasOwnProperty(r)&&void 0!==o[r])t.call(e,o[r],o[r],this);},t.prototype.has=function(t){var e=t;if(this._isObject(t))if(e=this._getObjectKey(t),!e)return false;return this._hash.hasOwnProperty(e)&&void 0!==this._hash[e];},t.prototype.keys=function(){throw new Error('Method is not supported');},t.prototype.values=function(){throw new Error('Method is not supported');},t.prototype._isObject=function(t){return t&&'object'===typeof t;},t.prototype._addObject=function(t){var e=this._objects.indexOf(t);if(-1===e)e=this._objects.length,this._objects.push(t);return this._objectPrefix+e;},t.prototype._deleteObject=function(t){var e=this._objects.indexOf(t);if(e>-1)return this._objects[e]=null,this._objectPrefix+e;return;},t.prototype._getObjectKey=function(t){var e=this._objects.indexOf(t);if(-1===e)return;return this._objectPrefix+e;},t;}();}();}});
Object.defineProperty(exports,'WS.Data/Functor/Compute',{configurable:true,get:function(){delete exports['WS.Data/Functor/Compute'];return exports['WS.Data/Functor/Compute']=function(){'use strict';var n=function(r,t){if(t=t||[],!(r instanceof Function))throw new TypeError('Argument "fn" be an instance of Function');if(!(t instanceof Array))throw new TypeError('Argument "properties" be an instance of Array');return Object.defineProperty(r,'functor',{get:function(){return n;}}),Object.defineProperty(r,'properties',{get:function(){return t;}}),r;};return n.isFunctor=function(r){return r&&r.functor===n;},n;}();}});
Object.defineProperty(exports,'WS.Data/Shim/Map',{configurable:true,get:function(){delete exports['WS.Data/Shim/Map'];return exports['WS.Data/Shim/Map']=function(t){'use strict';if('undefined'!==typeof Map)return Map;return function(){var e=function(){this.clear();};return e.prototype._hash=null,e.prototype._objectPrefix=t.prototype._objectPrefix,e.prototype._objects=null,Object.defineProperty(e.prototype,'size',{get:function(){return Object.keys(this._hash).length;},enumerable:true,configurable:false}),e.prototype.clear=function(){this._hash={},this._objects=[];},e.prototype.delete=function(t){if(this._isObject(t))if(t=this._addObject(t),!t)return;this._hash[t]=void 0;},e.prototype.entries=function(){throw new Error('Method is not supported');},e.prototype.forEach=function(t,e){var o=this._hash,r,i;for(r in o)if(o.hasOwnProperty(r)&&void 0!==o[r]){if(i=o[r],this._isObjectKey(r))r=this._getObject(r);t.call(e,i,r,this);}},e.prototype.get=function(t){if(this._isObject(t))if(t=this._getObjectKey(t),!t)return;return this._hash[t];},e.prototype.has=function(t){if(this._isObject(t))if(t=this._getObjectKey(t),!t)return false;return this._hash.hasOwnProperty(t)&&void 0!==this._hash[t];},e.prototype.keys=function(){throw new Error('Method is not supported');},e.prototype.set=function(t,e){if(this._isObject(t))t=this._addObject(t);return this._hash[t]=e,this;},e.prototype._isObjectKey=function(t){return String(t).substr(0,this._objectPrefix.length)===this._objectPrefix;},e.prototype._getObject=function(t){var e=parseInt(t.substr(this._objectPrefix.length),10);return this._objects[e];},e.prototype._isObject=t.prototype._isObject,e.prototype._addObject=t.prototype._addObject,e.prototype._deleteObject=t.prototype._deleteObject,e.prototype._getObjectKey=t.prototype._getObjectKey,e;}();}(exports['WS.Data/Shim/Set']);}});
Object.defineProperty(exports,'WS.Data/Factory',{configurable:true,get:function(){delete exports['WS.Data/Factory'];return exports['WS.Data/Factory']=function(e,t,r,a){'use strict';var n={cast:function(t,n,i){if(i=i||{},this._isNullable(n,t,i))return t;if('string'===typeof n)switch(n.toLowerCase()){case'recordset':n=e.resolve('collection.$recordset');break;case'record':n=e.resolve('entity.$model');break;case'enum':n=e.resolve('types.$enum');break;case'flags':n=e.resolve('types.$flags');break;case'link':case'integer':return'number'===typeof t?t:isNaN(parseInt(t,10))?null:parseInt(t,10);case'real':case'double':return'number'===typeof t?t:isNaN(parseFloat(t))?null:parseFloat(t);case'boolean':return!!t;case'money':var s=this._getPrecision(i.format);if(s>3)return a.real(t,s,false,true);return void 0===t?null:t;case'date':case'time':case'datetime':if(t instanceof Date)return t;else if('infinity'===t)return 1/0;else if('-infinity'===t)return-1/0;return Date.fromSQL(''+t,false);case'timeinterval':if(t instanceof r)return t.toString();return r.toString(t);case'array':var o=this._getKind(i.format);if(!(t instanceof Array))t=[t];return t.map(function(e){return this.cast(e,o,i);},this);default:return t;}if('function'===typeof n){if(t instanceof n)return t;if(n.prototype._wsDataEntityIProducible)return n.prototype.produceInstance.call(n,t,i);return new n(t);}throw new TypeError('Unknown type '+n);},serialize:function(e,n){n=n||{};var i=this._getTypeName(n.format);if(this._isNullable(i,e,n))return e;if(e&&'object'===typeof e)if(e._wsDataEntityFormattableMixin)e=e.getRawData(true);else if(e._wsDataTypeIFlags)e=this._serializeFlags(e);else if(e._wsDataTypeIEnum)e=e.get();else if(e._wsDataCollectionIList&&'recordset'===i)e=this._convertListToRecordSet(e);else if(t.instanceOfModule(e,'Deprecated/Record'))throw new TypeError('Deprecated/Record can\'t be used with WS.Data');else if(t.instanceOfModule(e,'Deprecated/RecordSet'))throw new TypeError('Deprecated/RecordSet can\'t be used with WS.Data');else if(t.instanceOfModule(e,'Deprecated/Enum'))throw new TypeError('Deprecated/Enum can\'t be used with WS.Data');switch(i){case'integer':return e=this._toScalar(e),'number'===typeof e?e:isNaN(e-=0)?null:parseInt(e,10);case'real':case'double':return this._toScalar(e);case'link':return parseInt(e,10);case'money':e=this._toScalar(e);var s=this._getPrecision(n.format);if(s>3)return a.real(e,s,false,true);return e;case'date':case'time':case'datetime':e=this._toScalar(e);var o;switch(i){case'datetime':o=Date.SQL_SERIALIZE_MODE_DATETIME;break;case'time':o=Date.SQL_SERIALIZE_MODE_TIME;}if(!e)e=Date.fromSQL(''+e);if(e instanceof Date)return e.toSQL(o);else if(e===1/0)return'infinity';else if(e===-1/0)return'-infinity';return e;case'timeinterval':if(e=this._toScalar(e),e instanceof r)return e.toString();return r.toString(e);case'array':var c=this._getKind(n.format);if(!(e instanceof Array))e=[e];return e.map(function(e){return this.serialize(e,{format:c});},this);default:return e;}},_toScalar:function(e){if(Array.isArray(e)&&e.length<2)return e.length?e[0]:null;return e;},_getTypeName:function(e){var t;if('object'===typeof e)t=e.getType?e.getType():e.type;else t=e;return(''+t).toLowerCase();},_getPrecision:function(e){if(!e)return 0;return(e.getPrecision?e.getPrecision():e.meta&&e.meta.precision)||0;},_getDictionary:function(e){return(e.getDictionary?e.getDictionary():e.meta&&e.meta.dictionary)||[];},_getKind:function(e){return(e.getKind?e.getKind():e.meta&&e.meta.kind)||'';},_serializeFlags:function(e){var t=[];return e.each(function(r){t.push(e.get(r));}),t;},_isNullable:function(e,t,r){if(void 0===t||null===t){switch(e){case'identity':return false;case'enum':return this._isEnumNullable(t,r);}if('function'===typeof e){var a=Object.create(e.prototype);if(a&&a._wsDataTypeIEnum)return this._isEnumNullable(t,r);}return true;}return false;},_isEnumNullable:function(e,t){var r=this._getDictionary(t.format);if(null===e&&!r.hasOwnProperty(e))return true;if(void 0===e)return true;return false;},_convertListToRecordSet:function(t){var r='adapter.json',a,n=t.getCount(),i;for(i=0;i<n;i++)if(a=t.at(i),a&&a._wsDataEntityIObject&&a._wsDataEntityFormattableMixin){r=a.getAdapter();break;}var s=e.resolve('collection.recordset',{adapter:r});for(i=0;i<n;i++)s.add(t.at(i));return s.getRawData(true);}};return e.register('factory',n,{instantiate:false}),n;}(exports['WS.Data/Di'],require(deps[2]),require(deps[3]),require(deps[4]));}});
Object.defineProperty(exports,'WS.Data/MoveStrategy/Base',{configurable:true,get:function(){delete exports['WS.Data/MoveStrategy/Base'];return exports['WS.Data/MoveStrategy/Base']=function(e,t,i,o,r,n){'use strict';var a=n.extend([e],{_moduleName:'WS.Data/MoveStrategy/Base',$protected:{_options:{hierField:void 0,dataSource:null,listView:null,items:null,invertOrder:false},_orderProvider:void 0},$constructor:function(){o.logger.error(this._moduleName,'Move strategy has been deprecated, please use events onBeginMove, onEndMove on a listview instead');},move:function(e,t,i){return this._callReoderMove(e,t,i).addCallback(function(){this._moveInItems(e,t,i);}.bind(this));},_callReoderMove:function(e,t,i){var o=new r();return e.forEach(function(e){o.push(this._getDataSource().move(e.getId(),t.getId(),{before:this._options.invertOrder?i:!i,hierField:this._options.hierField}));}.bind(this)),o.done().getResult();},hierarhyMove:function(e,i){if(!this._options.hierField)throw new Error('Hierrarhy Field is not defined.');var o=i?i.getId():null,r=this._options.hierField,n=[],a=[];if(e.forEach(function(e){var t=e.clone();a.push(t.get(r)),t.set(r,o),n.push(t);}),e.length>1){var s=new t({adapter:e[0].getAdapter()});s.append(n),n=s;}else n=n[0];var d=this._getItems();return this._callHierarchyMove(n).addCallback(function(t){return e.forEach(function(e){if(e.set(r,o),d&&-1==d.getIndex(e))d.add(e);}),t;});},hierarchyMove:function(e,t){return this.hierarhyMove(e,t);},_callHierarchyMove:function(e){return this._getDataSource().update(e);},_getDataSource:function(){var e;if(this._options.dataSource)e=this._options.dataSource;else if(this._options.listView)e=this._options.listView.getDataSource();if(e)if(!e._$binding.moveBefore)if(e._$binding.moveBefore='ВставитьДо',e._$binding.moveAfter='ВставитьПосле','IndexNumber'==e._$endpoint.moveContract)e._$endpoint.moveContract='ПорядковыйНомер';return e;},_getItems:function(){if(this._options.listView)return this._options.listView.getItems();return this._options.items;},_moveInItems:function(e,t,i){var o=this._getItems();if(o)e.forEach(function(e){o.setEventRaising(false,true);var r=o.getIndex(e);if(-1==r)o.add(e),r=o.getCount()-1;if(this._options.hierField)e.set(this._options.hierField,t.get(this._options.hierField));var n=o.getIndex(t);if(i&&n<r)n=n+1<o.getCount()?++n:o.getCount();else if(!i&&n>r)n=0!==n?--n:0;o.move(r,n),o.setEventRaising(true,true);}.bind(this));}});return i.register('movestrategy.base',a),a;}(exports['WS.Data/MoveStrategy/IMoveStrategy'],require(deps[5]),exports['WS.Data/Di'],exports['WS.Data/Utils'],require(deps[6]),require(deps[7]));}});
Object.defineProperty(exports,'WS.Data/Builder',{configurable:true,get:function(){delete exports['WS.Data/Builder'];return exports['WS.Data/Builder']=function(e,t){'use strict';var a={_moduleName:'WS.Data/Builder',reduceTo:function(o,r,n){n=n||a.getModule(o);var c=e.create(n,{adapter:o.getAdapter(),format:[]});if(r.each(function(e){var t=o.get(e.getName());if(t&&'object'===typeof t)if('function'===typeof t.clone)t=t.clone();else t=Object.create(t);c.addField(e,void 0,t);}),!o.isChanged())c.acceptChanges();if(o instanceof t&&c instanceof t)c.setIdProperty(o.getIdProperty()),c.setState(o.getState());return c;}};return a.getModule=function(e){return Object.getPrototypeOf(e).constructor;},a;}(exports['WS.Data/Di'],require(deps[8]));}});
Object.defineProperty(exports,'WS.Data/MoveStrategy/Sbis',{configurable:true,get:function(){delete exports['WS.Data/MoveStrategy/Sbis'];return exports['WS.Data/MoveStrategy/Sbis']=function(e){return e;}(exports['WS.Data/MoveStrategy/Base']);}});
define('WS.Data/Di', [], function() {return exports['WS.Data/Di'];});
define('WS.Data/MoveStrategy/IMoveStrategy', [], function() {return exports['WS.Data/MoveStrategy/IMoveStrategy'];});
define('WS.Data/Utils', ['Core/Serializer','Core/IoC'], function() {return exports['WS.Data/Utils'];});
define('WS.Data/Shim/Set', [], function() {return exports['WS.Data/Shim/Set'];});
define('WS.Data/Functor/Compute', [], function() {return exports['WS.Data/Functor/Compute'];});
define('WS.Data/Shim/Map', ['WS.Data/Shim/Set'], function() {return exports['WS.Data/Shim/Map'];});
define('WS.Data/Factory', ['WS.Data/Di','Core/core-instance','Core/TimeInterval','Core/defaultRenders'], function() {return exports['WS.Data/Factory'];});
define('WS.Data/MoveStrategy/Base', ['WS.Data/MoveStrategy/IMoveStrategy','WS.Data/Collection/RecordSet','WS.Data/Di','Core/Serializer','Core/IoC','WS.Data/Utils','Core/ParallelDeferred','Core/Abstract'], function() {return exports['WS.Data/MoveStrategy/Base'];});
define('WS.Data/Builder', ['WS.Data/Di','WS.Data/Entity/Model'], function() {return exports['WS.Data/Builder'];});
define('WS.Data/MoveStrategy/Sbis', ['WS.Data/MoveStrategy/IMoveStrategy','WS.Data/Collection/RecordSet','WS.Data/Di','Core/Serializer','Core/IoC','WS.Data/Utils','Core/ParallelDeferred','Core/Abstract','WS.Data/MoveStrategy/Base'], function() {return exports['WS.Data/MoveStrategy/Sbis'];});
})()