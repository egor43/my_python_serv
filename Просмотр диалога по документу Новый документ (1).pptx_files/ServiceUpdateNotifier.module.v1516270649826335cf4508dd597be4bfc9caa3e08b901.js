"use strict";define("js!SBIS3.Engine.ServiceUpdateNotifier",["Core/constants","SBIS3.CONTROLS/Utils/InformationPopupManager","Core/EventBus","Transport/XHRTransport","Lib/ServerEvent/Bus","Core/Deferred","Core/IoC"],function(e,n,o,i,r,t,s){var u=["inside","inside-only","c​a","standard","ext","ext-pilot","ext-demo","ext-partners","admin.sbis.ru","my.sbis.ru","reg.tensor.ru","operator-admin"],a=rk("Сайт был обновлен, во избежание ошибок рекомендуем перезагрузить страницу."),c,l=7e3,d={isDialogClosed:true,show:function(){if(!this.isDialogClosed)return;this.isDialogClosed=false,n.showConfirmDialog({message:a,positiveButton:{caption:rk("Перезагрузить")},negativeButton:{caption:rk("Отмена")}},function(){setTimeout(function(){window.location.reload()},0),d.isDialogClosed=true},function(){d.isDialogClosed=true})}},f=("undefined"!==typeof window&&window["service"]&&window["service"]["resourcesRoot"]||"/resources/")+"version.xml";function v(){g().addCallback(function(e){c=e})}function b(){setTimeout(x,l)}function p(n,o){var i=window.product,r=o.get("Product"),t=o.get("Distribution");if(d.isDialogClosed&&(-1!==u.indexOf(t)&&i===r||-1!==["specifications","Спецификации ФЭД"].indexOf(t)&&"specifications"in e.services))s.resolve("ILogger").log("Lib/ServiceUpdateNotifier/ServiceUpdateNotifier","distr: "+t+"; "+"prod: "+r+";"),x()}var C=0;function g(e){if(!e)e=new t;return new i({url:f,method:"GET",dataType:"xml"}).execute().addCallbacks(function(n){C=0,e.callback({core_version:n.querySelector("version_core>version_number").textContent,core_build:n.querySelector("version_core>build_number").textContent,version:n.querySelector("version>version_number").textContent,build:n.querySelector("version>build_number").textContent})},function(n){if(C++,3===C)C=0,s.resolve("ILogger").warn("Ошибка получения version.xml",n),e.errback(n);else setTimeout(function(){g(e)},l)}),e}function m(e){if(!c)return c=e,true;for(var n in e){if(!e.hasOwnProperty(n))continue;if(e[n]===c[n])continue;return c=e,true}return false}function w(){return g().addCallback(function(e){return m(e)})}function x(){w().addCallback(function(e){if(e)d.show()})}o.globalChannel().once("bootupready",v),r.serverChannel("versionmanager.updatestaticcomplete").subscribe("onMessage",p),o.globalChannel().subscribe("onwakeup",b)});
//# sourceMappingURL=ServiceUpdateNotifier.module.js.map