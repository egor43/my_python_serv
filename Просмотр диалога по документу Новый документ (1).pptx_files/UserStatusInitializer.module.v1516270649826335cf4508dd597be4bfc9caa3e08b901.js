define("js!SBIS3.Activity.UserStatusInitializer",["Core/EventBus","Lib/ServerEvent/Bus","WS.Data/Source/SbisService","Core/UserInfo"],function(n,e,o,i){function t(n){return n=(n||"").replace("icon-24","icon-16").replace("icon-16 icon-PhoneGetAutomatically icon-hover","icon-16 icon-Profile icon-primary").replace("icon-16 icon-PhoneGetManually icon-hover","icon-16 icon-Profile icon-disabled"),n}n.globalChannel().once("bootupReady",function(){var c="undefined"!==typeof location&&location.hostname;if("__сбис__физики"!==i.get("КлассПользователя")&&i.get("real_enter")&&c&&!~c.indexOf("reg.tensor.ru")){var a=n.channel("ChannelUserAccount");if(!!SBIS3.Engine&&!!SBIS3.Engine.UserPanelItems&&SBIS3.Engine.UserPanelItems.addComponents)SBIS3.Engine.UserPanelItems.addComponents([{id:0,component:"SBIS3.Activity.UserStatuses",componentOptions:{}}]);e.serverChannel("LastActivity.UserStatus").subscribe("onMessage",function(n,e){if(e)a.notify("onIconChanged",t(e.StatusIcon)),a.notify("onIconTitleChanged",rk(e.StatusNote))}),new o({endpoint:"Местоположение"}).call("GetMyStatus",{}).addCallback(function(n){var e,o,i;if(n.getAll().getCount()>0){if(e=n.getAll().at(0),o=e.get("Icon"),i=e.get("StatusNote"),!o||!i)o="icon-16 icon-Profile icon-primary",i="Работаю";a.notify("onIconChanged",t(o)),a.notify("onIconTitleChanged",rk(i))}else a.notify("onIconChanged","icon-16 icon-Profile icon-primary")})}})});
//# sourceMappingURL=UserStatusInitializer.module.js.map