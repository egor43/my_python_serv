define("Lib/Control/Infobox/Infobox",["Core/core-instance","Core/helpers/Hcontrol/trackElement","Core/Deferred","Core/helpers/Hcontrol/isElementVisible","Core/constants","Core/helpers/string-helpers","Core/Abstract","Core/helpers/Function/debounce","tmpl!Lib/Control/Infobox/Infobox","Core/WindowManager","css!Lib/Control/Infobox/Infobox","is!browser?cdn!jquery-ui/1.12.1.2/jquery-ui-position.js"],function(t,e,i,o,n,s,r,h,a){"use strict";var l=1/2,f=44,d=300,c=22,u=8,_=4,g=new(r.extend({$protected:{_box:void 0,_content:void 0,_hideTimer:void 0,_showTimer:void 0,_currentTarget:null,_message:"",_width:"auto",_watchTimer:void 0,_measureText:null,_autoHide:false,_state:void 0,_infoboxContentDeferred:new i,_infoboxContent:void 0,_isWaitingToShow:false,_hideAfterDestroyContent:void 0},_dotTplFn:a,$constructor:function(){if(this._publish("onShow","onHide","onChangeTarget","onBeforeShow"),"undefined"!==typeof window)requirejs(["Lib/Control/InfoboxContent/InfoboxContent"],function(t){return this._infoboxContentDeferred.callback(t),t}.bind(this)),this._hideAfterDestroyContent=this._hide.bind(this,true),$(window).on("resize",h(this._resizeHandler.bind(this),50))},_resizeHandler:function(){if(this.getCurrentTarget()&&!this._isWaitingToShow)this._resizeBox()},getContainer:function(){return this._box},_build:function(){var t=$(".ws-body-scrolling-content"),e=this;if(this._box=$(this._dotTplFn(this)).bind("mouseenter",function(){if(e._hideTimer)clearTimeout(e._hideTimer)}).bind("mouseleave",function(){if(this._autoHide)this.hide()}.bind(this)).mousedown(function(t){t.stopPropagation()}),this._content=this.getContainer().find(".ws-infobox-content"),!t.length)t=$(window);t.bind("scroll",function(){e._hide(0)}),$(".ws-infobox-close-button",this.getContainer()).click(function(t){return e.hide(0),t.stopPropagation(),false}),$("body").append(this.getContainer())},isCurrentTarget:function(t){if(this._currentTarget&&t)return this._currentTarget==(t.get?t.get(0):t);else return false},getCurrentTarget:function(){return this._currentTarget},setText:function(t){this._setText(t),this._resizeBox(),this._updateZIndex()},_setText:function(t){var e,i;if(this._message=""+t,e=s.escapeTagsFromStr(this._message,["script"]),!this._isInsertHTML(t))e=e.replace(/\n/g,"<br>");if(this.getContainer().toggleClass("ws-infobox-has-title",!!this._title),this._content)if(this._infoboxContentDeferred.isReady())this._createInfoboxContent(this._infoboxContentDeferred.getResult(),e);else this._infoboxContentDeferred.addCallback(function(t){return this._createInfoboxContent(t,e),t}.bind(this))},_createInfoboxContent:function(t,e){if(this._infoboxContent){var i=this._infoboxContent;setTimeout(function(){i.unsubscribe("onDestroy",this._hideAfterDestroyContent),i.destroy()}.bind(this),0),this._infoboxContent._container.empty()}this._infoboxContent=new t({element:$('<div class="ws-infobox-content-root"></div>').appendTo(this.getContainer()),parent:this._getInfoboxParent(),message:e,title:this._title,options:this._templateOptions,tabindex:0,handlers:{onDestroy:this._hideAfterDestroyContent}}),this.getContainer()[0].wsControl=this._infoboxContent},_getInfoboxParent:function(){var e=$(this.getCurrentTarget()).wsControl();while(!t.instanceOfModule(e,"Lib/Control/AreaAbstract/AreaAbstract")&&null!=e)e=e.getParent();return e},_isInsertHTML:function(t){var e=false;try{e=""!==$(t).text()}catch(t){}return e},_clearShowTimer:function(){if(this._showTimer)clearTimeout(this._showTimer),this._showTimer=void 0},_clearHideTimer:function(){if(this._hideTimer)clearTimeout(this._hideTimer),this._hideTimer=void 0},_clearWatchTimer:function(){if(this._watchTimer)clearTimeout(this._watchTimer),this._watchTimer=void 0},_clearTimers:function(){this._clearShowTimer(),this._clearHideTimer()},hasTarget:function(){return!!this._currentTarget},_watchTargetPresent:function(){var t=$(this.getCurrentTarget()),e=this._isCursorOut();if(t.length&&!o(t)||e&&this._autoHide)this.hide(e?d:0)},_isCursorOut:function(){var t=$(this.getCurrentTarget()),e,i;if(!t.length)return;return e=this._isHovered(t)||this._isHovered(this.getContainer()),i=this._isFocused(t)||this._isFocused(this.getContainer()),!e&&!i},_isFocused:function(t){return!t.hasClass("ws-hidden")&&(t[0]===document.activeElement||!!t.find(document.activeElement).length)},_isHovered:function(t){return!!t.filter(":hover").length},show:function(t,e,i,o,n,s,r){if(1===arguments.length&&$.isPlainObject(arguments[0])){var h=arguments[0],a=h.position,l=h.title,f=h.templateOptions,d=h.modifiers;t=$(h.control),e=h.message,i=h.width,o="number"!==typeof h.showDelay?200:h.showDelay,n=h.hideDelay,s=h.needToShow,r=h.autoHide,this._positionByTarget=h.positionByTarget||t}else t=$(t),o="number"!==typeof o?200:o,this._positionByTarget=t;if(!this._isTargetVisible(t)||!e||"function"===typeof s&&!s())return;if(this._isWaitingToShow=true,this._message=e,this._title=l,this._templateOptions=f,this._autoHide=!!r,this._width=void 0===i?"auto":i,this._position=a||"tl",!this.getContainer())this._build();if(this._setState("showing"),this._subscribeToMoveTarget(t),this._clearShowTimer(),this.isCurrentTarget(t)&&!this._isWaitingToShow)o=0;if(this._currentTarget=t.get(0),this._updateZIndex(),o)this._showTimer=setTimeout(function(){if(!this._autoHide||!this._isCursorOut())this._show(t,d,n);else this._setState("hide")}.bind(this),o);else this._show(t,d,n)},_show:function(t,e,i){if(this._isWaitingToShow=false,false===this._notify("onBeforeShow",t))return void(this._currentTarget=null);if(this._setModifiers(e),this._clearHideTimer(),this._clearWatchTimer(),!this._isTargetVisible(t))return void(this._currentTarget=null);if(!this._currentTarget)this._currentTarget=t.get(0);this._notify("onChangeTarget",this._currentTarget,t.get(0)),this._setText(this._message);var o=this;if(this._infoboxContentDeferred.isReady())this._setInfoboxVisible(t,i);else this._infoboxContentDeferred.addCallback(function(e){return o._setInfoboxVisible(t,i),e})},_setState:function(t){this._state=t},_getState:function(){return this._state},_isTargetVisible:function(t){var e=$(this._positionByTarget);return t.closest("html").length&&o(t)&&e.closest("html").length&&o(e)},_setInfoboxVisible:function(t,e){if(this._resizeBox(),this._watchTimer=setInterval(this._watchTargetPresent.bind(this),500),this._notify("onShow",t),e)this.hide(e)},_subscribeToMoveTarget:function(t){this._unsubscribeToMoveTarget(),this._targetChanges=e(t,true),this._targetChanges.subscribe("onMove",this._onMoveTarget,this)},_unsubscribeToMoveTarget:function(){if(this._targetChanges){if(this._targetChanges.unsubscribe("onMove",this._onMoveTarget,this),this.hasTarget())e(this.getCurrentTarget(),false);this._targetChanges=null}},_onMoveTarget:function(t,e,i){if(!i)this._unsubscribeToMoveTarget(),this.hide(0)},_setModifiers:function(t){var e=this.getContainer(),i=["ws-infobox-type-lite","ws-infobox-type-help","ws-infobox-type-error","ws-infobox-title-red","ws-infobox-title-black","ws-infobox-title-green","ws-infobox-title-orange","ws-infobox-full-width"],o;if(e.removeClass(i.join(" ")),t)for(var n=0,s=(o=t.split(" ")).length;n<s;n++)if(i.indexOf(o[n]>-1))e.addClass(o[n])},_resizeBox:function(){var t=this.getContainer(),e=this._getPosition(),i=this._width;if(t.width(i),t.removeClass("ws-hidden"),t.css({visibility:"hidden",display:"block",left:-1e4,top:-1e4}),"auto"==i)t.css("width",""),t.css("max-width",n.$win.width()*l);else t.css("max-width","");t.css({visibility:"visible"}).position({my:e.my,at:e.at,collision:"flip",of:this._positionByTarget,using:function(i,o){var n=$(".ws-infobox-triangle",t);if("middle"===o.vertical)if(o.element.top===o.target.top)o.vertical="top";else if(o.element.top+o.element.height===o.target.top+o.target.height)o.vertical="bottom";if("t"===this._position[0]||"b"===this._position[0]){if("center"===o.horizontal){if(o.element.left===o.target.left)o.horizontal="left";else if(o.element.left+o.element.width===o.target.left+o.target.width)o.horizontal="right"}else if("middle"!==o.vertical)if("left"===o.horizontal&&i.left<o.target.left)o.horizontal="right";else if("right"===o.horizontal&&Math.abs(o.target.left+o.target.width-(o.element.width+i.left))>1)o.horizontal="left";var s=o.target.element[0],r=s.clientWidth||s.offsetWidth,h=c,a;if(r<f)if(a=Math.floor(h-r/2),"left"==o.horizontal)i.left-=a;else if("right"==o.horizontal)i.left+=a}n.toggleClass("ws-infobox-triangle-top",!e.isSide&&"top"===o.vertical).toggleClass("ws-infobox-triangle-bottom",!e.isSide&&"bottom"===o.vertical).toggleClass("ws-infobox-triangle-right",!e.isSide&&"right"===o.horizontal).toggleClass("ws-infobox-triangle-left",!e.isSide&&"left"===o.horizontal).toggleClass("ws-infobox-triangle-center",!e.isSide&&"center"===o.horizontal).toggleClass("ws-infobox-triangle-vertical-top",e.isSide&&"top"===o.vertical).toggleClass("ws-infobox-triangle-vertical-bottom",e.isSide&&"bottom"===o.vertical).toggleClass("ws-infobox-triangle-vertical-middle",e.isSide&&"middle"===o.vertical).toggleClass("ws-infobox-triangle-vertical-right",e.isSide&&"right"===o.horizontal).toggleClass("ws-infobox-triangle-vertical-left",e.isSide&&"left"===o.horizontal),t.css({top:Math.ceil(i.top),left:Math.ceil(i.left)})}.bind(this)})},_getPosition:function(){var t=$(".ws-infobox-triangle").height(),e=this._position[0]||"t",i=this._position[1]||"l",o,n,s={t:"top",b:"bottom",c:"center",l:"left",r:"right",invertr:"left",invertl:"right",invertt:"bottom",invertb:"top"};switch(e){case"t":case"b":o=s[i]+" "+s["invert"+e],n=s[i]+" "+s[e]+("t"===e?"-":"+")+t;break;case"r":case"l":o=s["invert"+e]+" "+s[i],n=s[e]+("l"===e?"-":"+")+t+" "+s[i]}return{my:o,at:n,isSide:"r"===e||"l"===e}},_updateZIndex:function(){var t=$(this.getCurrentTarget()),e,i;if(t)if(e=t.closest(".ws-float-area-stack-cut-wrapper"),e.length)i=e.css("z-index");this.getContainer().css("z-index",i||this._getNewZIndex())},_hide:function(t){if("showing"===this._getState())return;if(this._setState("hide"),this._clearWatchTimer(),t)this._hideCallback();else this.getContainer().stop().css("opacity",1).fadeOut("fast",this._hideCallback.bind(this))},_hideCallback:function(){this.getContainer().addClass("ws-hidden"),this._notify("onChangeTarget",this._currentTarget,null),this._unsubscribeToMoveTarget(),this._currentTarget=null,this._notify("onHide")},hide:function(t){if(this._clearTimers(),this._setState("hiding"),this.getContainer())if(0===t)this._hide();else{var e=this;this._hideTimer=setTimeout(function(){e._hide()},void 0===t||"number"!==typeof t?d:t)}},_getNewZIndex:function(){var t=this.getCurrentTarget(),e=".ws-smp-dlg, .controls-Menu__Popup:not(.ws-hidden)",i;if(t)if(i=$(t).closest(".controls-SubmitPopup_popup").length,!i)e+=", .controls-SubmitPopup_popup";return this._highZIndex()+(!$("body").find(e).length?1:-1)},_highZIndex:function(t,e){e=e||1/0;var i,o,n=1,s,r=0,h=(t=t||document.body).childNodes,a=h.length;while(r<a){if(i=h[r++],1!=i.nodeType||"none"===this._deepCss(i,"display")||"hidden"===this._deepCss(i,"visibility")||$(i).hasClass("ws-info-box"))continue;if(s=this._deepCss(i,"opacity"),"static"!==this._deepCss(i,"position"))if(o=this._deepCss(i,"z-index"),"auto"==o)o=s<1?0:this._highZIndex(i);else o=parseInt(o,10)||0;else o=s<1?0:this._highZIndex(i);if(o>n&&o<=e)n=o}return n},_deepCss:function(t,e){var i,o,n=document.defaultView||window;if(1==t.nodeType)if(i=e.replace(/\-([a-z])/g,function(t,e){return e.toUpperCase()}),o=t.style[i],!o)if(t.currentStyle)o=t.currentStyle[i];else if(n.getComputedStyle)o=n.getComputedStyle(t,"").getPropertyValue(e);return o||""}}));return g.HIDE_TIMEOUT=500,g.SHOW_TIMEOUT=500,g.ACT_CTRL_HIDE_TIMEOUT=1e4,g});
//# sourceMappingURL=Infobox.js.map