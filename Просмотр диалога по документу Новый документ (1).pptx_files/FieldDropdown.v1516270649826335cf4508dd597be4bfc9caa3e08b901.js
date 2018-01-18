define("Deprecated/Controls/FieldDropdown/FieldDropdown",["Core/core-merge","Deprecated/RecordSet","Core/helpers/string-helpers","Core/helpers/Hcontrol/getScrollWidth","Core/helpers/Hcontrol/trackElement","Core/helpers/getType","Core/WindowManager","Core/moduleStubs","Core/IoC","Core/Deferred","Deprecated/Enum","Core/constants","Deprecated/Controls/FieldAbstract/FieldAbstract","Lib/Type/TDataSource/TDataSource","html!Deprecated/Controls/FieldDropdown/FieldDropdown","Transport/HTTPError","Core/detection","css!Deprecated/Controls/FieldDropdown/FieldDropdown","is!browser?cdn!jquery-ui/1.12.1.2/jquery-ui-position.js","i18n!Deprecated/Controls/FieldDropdown/FieldDropdown"],function(t,e,i,o,n,s,r,a,l,u,d,h,p,c,f,_){"use strict";var v=2,m=300,C=650,y=11,g=rk("Не выбрано"),w={my:{standard:"left top-1",simple:"left-2 top-4",hover:"left-6 top-3"},at:{standard:"left bottom",simple:"left top",hover:"left top"}},k=p.extend({$protected:{_recordSet:null,_initialFilter:{},_options:{allowEmpty:false,emptyValue:"",filterParams:{},dataSource:c,valueRender:"",titleRender:"",displayColumn:"",data:"",width:"100px",mode:"",itemValueColumn:"",wordWrap:false,firstYear:2008,lastYear:0,required:false,renderStyle:"standard",showSelectedInList:true,showTooltip:false,flipVertical:false},_menuTarget:void 0,_enum:"",_desiredDefaultValue:"",_dSetReady:"",_valueSet:false,_optCont:null,_optContHead:null,_optContList:null,_optArrow:void 0,_lastQueryFilter:void 0,_emptyInit:false,_hovered:false,_fKeyType:"",_dataType:"",_zIndex:void 0,_hoverenOnChild:false},$constructor:function(){this._configChecking(),this._publish("onAfterLoad","onBeforeLoad","onClickMore","onClickDefault"),this._createLoadingIndicator(),this._dSetReady=this._prepareDeferredChain(),this._initialFilter=t({},this._options.filterParams),this._lastQueryFilter=this._initialFilter;var e=this._options.data,i=this;if(this._isDataNotEmpty(e))for(var o=(e=this._options.data=this._convertDataToExpectedFormat(e)).keys,n=0,s=o.length;n<s;n++)if(null===o[n]){if(!this.isAllowEmpty()&&this.getEmptyValue())this.setAllowEmpty(true)}else if("string"!==typeof o[n])o[n]=o[n].toString();if(this._container.attr("title",this._options.tooltip).css("width",this._options.width+"px").find(".ws-field").addClass("ws-field-dropdown"),h.browser.isMobilePlatform)if(this.isHover())this._container.addClass("ws-mobile");else this._container.find(".ws-native-select").height(this._container.height()).css("z-index",1);this._inputControl.css("width",this._options.width+"px"),this._initializeContent(),this._bindEvents(),this.subscribe("onAfterLoad",function(){i._fillDropdown(),i._dSetReady.addCallback(function(t){return i._changeFunc(i._inputControl[0]),t})})},_isDataNotEmpty:function(t){return $.isPlainObject(t)&&!Object.isEmpty(t)||Array.isArray(t)&&t.length},_bindEvents:function(){var t=this,e=this._container,i=e.find(".custom-select");if(this._optCont.mousedown(function(t){t.preventDefault(),t.stopImmediatePropagation()}).bind("mousewheel",function(t){return t.stopPropagation(),true}),i.mousedown(function(e){if(!t._optCont.hasClass("ws-hidden"))e.stopImmediatePropagation()}).click(function(){if(!e.hasClass("ws-disabled"))t._inputControl.focus(),t._showAndPlace()}),"function"!==typeof this.getValueRender()&&"simple"===this.getRenderStyle())this._optContList.addClass("ws-custom-options-border");if(this.isHover())i.mouseenter(function(){if(!e.hasClass("ws-disabled"))t._showAndPlace()}).mouseleave(function(){t._hideOptionsAfterTimeout()}),this._optContList.mouseleave(function(e){var i=$(e.relatedTarget).wsControl()?$(e.relatedTarget).wsControl().getTopParent():void 0;if(!h.browser.isMobileSafari||0===t._optContList.closest(this).length)t._hideOptionsAfterTimeout();if(i&&i._opener==t)t._hovered=true,t._hoverenOnChild=true,i.once("onAfterClose",function(e){if(t._hoverenOnChild)t._hideOptionsAfterTimeout()})}).mouseenter(function(){t._hovered=true,t._hoverenOnChild=false}),this._optContHead.mouseleave(function(){t._hideOptionsAfterTimeout()}).mouseenter(function(){t._hovered=true,t._hoverenOnChild=false});$(document).bind("mousedown."+this.getId()+" wsmousedown."+this.getId(),function(){if(t._optCont)t._hideOptions()}),t._container.bind("keydown",function(e){if(e.which==h.key.esc&&t._optCont&&!t._optCont.hasClass("ws-hidden"))t._hideOptions(),e.stopImmediatePropagation();else if(e.altKey&&(e.keyCode==h.key.down||e.keyCode==h.key.up)){if(t.isEnabled()&&t._optCont&&t._optCont.hasClass("ws-hidden"))t._showAndPlace();return false}else if(e.keyCode==h.key.enter&&!e.ctrlKey&&!e.altKey&&!e.shiftKey)return false}),this._inputControl.blur(function(){if(!t.isActive())t._hideOptions()}).bind("change.themed keypress keyup",function(){if(!t._options.showSelectedInList)t._fillDropdown();t._changeFunc(this),t._hideOptions(),t._notifyOnSizeChanged()})},_hoverOption:function(t){var e=$(this._optContList.find(".custom-select-option")),i=$(this._optContList.find(".custom-select-option-hover")),o,n;if(!i.length)o=t==h.key.down?$(e[0]):$(e[e.length-1]),e.removeClass("custom-select-option-hover"),o.toggleClass("custom-select-option-hover");else if(n=t==h.key.down?i.next():i.prev(),n.length)e.removeClass("custom-select-option-hover"),n.toggleClass("custom-select-option-hover")},_getMinWidth:function(t,e,i){return t.parent().width()-(e&&this._isSubtractingScrollWidth()?i:0)+(this.isHover()?y:0)},_isSubtractingScrollWidth:function(){return h.browser.isIE&&!h.browser.isIE9&&!h.browser.isIE8||this.isHover()},_showAndPlace:function(){var t=this,e={},i=this.getContainer().find(".custom-select"),s=t._container.hasClass("ws-dropdown-fixed-width"),a=o(),l=t._optCont.hasClass("ws-hidden"),u,d;if(this._zIndex=r.acquireZIndex(false,false,true),r.setVisible(this._zIndex),this._optCont.css("z-index",this._zIndex),h.browser.isMobilePlatform&&!t.isHover())return;if($(document).bind("keydown."+t.getId(),function(e){if(~$.inArray(e.which||e.keyCode,[h.key.tab,h.key.esc]))t._hideOptions()}),this.isHover())this._optContHead.css("margin-left",0);if(t._optCont.css("overflow-y","hidden").removeClass("ws-hidden"),u=t._optCont.width()+2*v,d=t._optCont.get(0).scrollHeight>m&&!t.isHover()||t._optCont.get(0).scrollHeight>t._optCont.get(0).clientHeight+1,e["min-width"]=t._getMinWidth(i,d,a),s)e["max-width"]=i.parent().width();if(e["min-width"]>=parseInt(t._optCont.css("max-width"),10))delete e["min-width"];if(e["overflow-y"]=h.browser.isIE&&d?"scroll":"",d&&t.isHover()&&u+a<C)u+=a,e["width"]=u;if(t._optContList.css(e).toggleClass("custom-options-container-with-scrollbar",d),t._menuTarget=t._container.find(".ws-field"),t._recalculateMenu(w),n(t._menuTarget).subscribe("onMove",function(){t._recalculateMenu(w)},t),!h.browser.isIE){var p=t._optCont.find(".custom-select-option").toArray();for(var c in p)if(p.hasOwnProperty(c)){var f=p[c],_=document.createRange(),y,g,k=$(f);if(_.selectNodeContents(f),y=_.getClientRects(),g=y[0],g&&g.width>k.width()&&(!t.isHover()||t.isHover()&&t._options.showTooltip))k.attr("title",k.text())}}if(l){if(!t.isHover())t._optArrow.addClass("custom-select-arrow-open");t._container.trigger("wsSubWindowOpen")}else t._hideCustomContainer()},_changeFunc:function(t){for(var e=this,i=this.getContainer(),o=(e.isShowSelectedInList()?e._optCont.find('[value="'+t.value+'"]').html():e._textSelectedRow)||"&nbsp;",n=i.find(".custom-select-text"),s=e._recordSet&&e._recordSet.contains(t.value)&&e._recordSet.getRecordByPrimaryKey(t.value),r,a=e.getTitleRender(),l=e._options.data,u,d=0,h=l.k.length;d<h;++d)if(l.k[d]==t.value){r=l.v[d];break}if(!e.isAllowEmpty()&&""===e._options.emptyValue&&e._isEmptyOption(t.value,o))n.addClass("ws-dropdown-placeholder").text(e.getTooltip());else{if(n.removeClass("ws-dropdown-placeholder"),e.isAllowEmpty()&&e._isEmptyOption(t.value,o))o=e.getEmptyValue();if("function"===typeof a)n.empty().append(a.apply(e,s?[s]:[t.value,r]));else n.html(o);e._optCont.find("div").removeClass("selected-option").each(function(){if(u=$(this),u.attr("value")==t.value)u.addClass("selected-option")})}},_initializeContent:function(){var t=this.getRenderStyle(),e=['<div class="custom-select'+("simple"===t?" asLink":"")+'">','<div class="custom-select-text">'+rk("Загрузка...")+"</div>",'<div class="custom-select-arrow"></div>',"</div>"],i=['<div class="custom-options-container ws-hidden not-hovered'+" custom-options-container-"+t+'"'+' dropdown-owner-name="'+(this.getName()||"")+'"'+">","</div>"],o=this.getContainer();if(o.find(".ws-field").append(e.join("")).end().find(".dropdown-fake").remove(),this._optCont=$(i.join("")).addClass(this._options.cssClassName),this._optContHead=$("<div></div>",{class:"custom-options-container-head"}).appendTo(this._optCont),this._optContList=$("<div></div>",{class:"custom-options-container-list"}).appendTo(this._optCont),this._optArrow=o.find(".custom-select-arrow"),this.isHover())this._optArrow.addClass("custom-select-arrow-hover icon-16 icon-DayForward icon-primary").insertBefore(this._container.find(".custom-select-text")),this._optContHead.append('<i class="custom-options-container-head-rounding"/>');this._optCont[0].wsControl=this,$("body").append(this._optCont)},_recalculateMenu:function(t){var e=this._menuTarget.offset(),i,o,n=this.getRenderStyle(),s=0;if(this._optCont.position({my:t.my[n],at:t.at[n],collision:this._options.flipVertical?"flip":"flip none",of:this._menuTarget,using:function(t){var o=e.left;if(h.browser.isMobilePlatform||$("body").hasClass("fixed-content"))o-=window.pageXOffset;t.left=Math.round(t.left),i=Math.round(o)-6>t.left,this._optCont.toggleClass("custom-options-container-left-turn",i).css(t)}.bind(this)}),this.isHover()){if(o=this._optContList[0].offsetWidth-this._optContHead[0].offsetWidth,this._optCont.toggleClass("custom-options-container-widthEquals",0<=o&&o<=3),i)if(s=o,s<0)s=0;this._optContHead.css("margin-left",s+"px").toggleClass("custom-options-container-head-reversed",parseFloat(this._optContList.css("top"))<-1).attr("title",this._options.showTooltip?this._optContHead.text():"")}},hideMenu:function(){this._hideOptions()},_hideOptionsAfterTimeout:function(){this._hovered=false,this._hoverenOnChild=false;var t=this;setTimeout(function(){if(t.isDestroyed())return;if(!t._hovered)t._hideOptions()},42)},_configChecking:function(){if(this.isHover())this.setShowSelectedInList(false)},_canValidate:function(){return this.isRequired()||k.superclass._canValidate.apply(this,arguments)},_isEmpty:function(){var t=this._curValue();return"undefined"===typeof t||null===t||null===t},_invokeValidation:function(){var t=k.superclass._invokeValidation.apply(this,arguments);if(this.isRequired()&&this._isEmpty())t.result=false,t.errors.push(this._options.errorMessageFilling);return t},isHover:function(){return"hover"===this.getRenderStyle()},_valuesAreEqual:function(t){var e=this._curval;if(e instanceof d)e=e.getCurrentValue();return null===e||"null"===e?null===t||"null"===t:t==e},_fillDropdown:function(){var t=this._options.data,e,i,o,n,s;if(!t)return;e=t.k,i=t.v,o=t.r,this._optCont.find(".custom-select-option").unbind("click").remove();for(var r=0,a=e.length;r<a;r++)if(s=o[r]||i[r],!(this.isMultiplyMode()&&"hasMore"==e[r])&&(!this.isRequired()||!this._isEmptyOption(e[r],s))){if(n=this._createCustomRow(e[r],s),this.isMultiplyMode())this._toggleCurrentRow(n,false),this._optContList.append(n);if(this.isShowSelectedInList()||!this._valuesAreEqual(e[r]))this._toggleCurrentRow(n,false),this._optContList.append(n);else if(this._textSelectedRow=i[r],"simple"===this.getRenderStyle())this._toggleCurrentRow(n,true),this._optContList.prepend(n);else if(this.isHover()){if(this._options.titleRender)n=this._options.titleRender.apply(this,[e[r],i[r]]),n=this._createCustomRow(e[r],n);else n=n.clone();n.prepend(this._optArrow.clone().addClass("custom-select-arrow-open"+(this.isHover()?" icon-ArrowDown icon-hover":"")).removeClass("icon-DayForward icon-primary")).prependTo(this._optContHead),this._toggleCurrentRow(n,true)}}},_toggleCurrentRow:function(t,e){var i="ws-field-dropdown-current";if(void 0===e)e=true;if(!e&&t.hasClass(i))t.removeClass(i);else if(e)this._optContList.find("."+i).removeClass(i),t.addClass(i)},_isEmptyOption:function(t,e){return e+="",("null"===t||null===t)&&("null"==e||""===e.replace(/^\s+|\s+$/g,"")||"&nbsp;"===e)||e===g},_hideCustomContainerIfVisible:function(){if(this._optCont&&!this._optCont.hasClass("ws-hidden"))this._hideCustomContainer()},_hideCustomContainer:function(){this._optArrow.removeClass("custom-select-arrow-open"),this._optCont.addClass("ws-hidden"),$(".custom-select-option",this._optContList).removeClass("custom-select-option-hover"),n(this._menuTarget,false),this._container.trigger("wsSubWindowClose"),r.setHidden(this._zIndex),r.releaseZIndex(this._zIndex)},_hideOptions:function(){this._hideCustomContainerIfVisible(),$(document).unbind("keypress."+this.getId())},_createCustomRow:function(t,e){var o=e instanceof jQuery,n=o?e:$("<div></div>"),s=this,r=!e;if(n.addClass("custom-select-option").attr("value",t+"").click(this._selectingEvent.bind(this)).hover(function(t){$(".custom-select-option",this._optContList).removeClass("custom-select-option-hover"),$(this).toggleClass("custom-select-option-hover","mouseenter"===t.type)}),!o){if("null"===t&&this.isAllowEmpty()&&this.getEmptyValue())e=this.getEmptyValue();else if(r)n.addClass("ws-field-dropdown-empty");n.attr("title",null===e?"":e).css({whiteSpace:s.isWordWrap()?"normal":"nowrap"}).html(i.escapeHtml(""+(null===e?"":e))||g)}return n},_selectingEvent:function(t){if(this._curval=$(t.target).closest(".custom-select-option").attr("value"),!this.isHover()||this._inputControl.val()!==this._curval){if(this._hideOptions(),"hasMore"!==this._curval)this._inputControl.val(this._curval),this._inputControl.change();else if("default"===this._curval)return this._notifyDefault();else return this._notify("onClickMore"),false;this._inputControl.focus()}t.stopImmediatePropagation()},_notifyDefault:function(){return this._notify("onClickDefault"),true},_dotTplFn:f,_bindInternals:function(){this._inputControl=this._container.find("select")},init:function(){this._fillData(),k.superclass.init.apply(this,arguments),this._dSetReady.addBoth(function(t){return this._notify("onReady"),t}.bind(this)).addCallback(function(t){return this._initialValueSetted=true,t}.bind(this))},_prepareFillData:function(){this._inputControl.children().remove(),this._createLoadingIndicator(),this._emptyInit=false,this._dSetReady=this._prepareDeferredChain(),this._initialValueSetted=true},_fillData:function(){var t=this._options.data,e=new Date,i=this.getMode(),o=e.getFullYear(),n=this.getFirstYear(),s=this.getLastYear()||o;if(""!==i){switch(i){case"month":t={keys:[0,1,2,3,4,5,6,7,8,9,10,11],values:h.Date.longMonthsSmall},this._desiredDefaultValue=e.getMonth();break;case"year":if(t={keys:[],values:[]},n>=s)s=n;for(var r=n;r<=s;r++)t.keys.push(r),t.values.push(r);if(this._desiredDefaultValue=n,o<=s&&o>=n)if(this._desiredDefaultValue=o,!this._options.value)this._options.value=o;break;default:throw new Error("Wrong predefined type specified for FieldDropdown: "+i)}this._dSetReady.callback(t)}else if(this._isDataNotEmpty(t))this._dSetReady.callback(t);else if(this._options.dataSource.isConfigured())this._prepareRecordSet();else this._dSetReady.callback({keys:[],values:[]}),this._emptyInit=true},_markInitialValueSetted:function(){},setEmptyValue:function(t){if(this.isAllowEmpty()&&t)this.setValue(t),this.getEmptyValue()?this.changeValueByIndex(null,t):this.insertOption(null,t,this.getKeys()[0]),this._inputControl.trigger("change.themed"),this._options.emptyValue=t},getEmptyValue:function(){return this._options.emptyValue},setFirstYear:function(t){this.setYears(t,this._options.lastYear)},setMaxWidthForHoverStyle:function(t){if(t&&this.isHover())this._optContHead.find("div").css("max-width",t+"px")},setMinWidthListForHoverStyle:function(t){if(t&&"hover"===this._options.renderStyle)this._optContList.find("div").css("min-width",t+"px"),this._options.width=t+"px",this._container.css("width",this._options.width+"px"),this._inputControl.css("width",this._options.width+"px")},setLastYear:function(t){this.setYears(this._options.firstYear,t)},setYears:function(t,e){if("year"===this.getMode()){var i={keys:[],values:[]},o=this.getValue(),n=this;if(isNaN(t))t=this.getFirstYear();else this._options.firstYear=t;if(isNaN(e))e=this.getLastYear();else this._options.lastYear=e;for(var s=t;s<=e;s++)i.keys.push(s),i.values.push(s);this._inputControl.children().remove(),this._dSetReady=this._prepareDeferredChain(),this._dSetReady.addCallback(function(t){if(-1!==t.k.indexOf(n._castValue(o)))n.setValue(o);else{var e=t.v[0];if(void 0!==e||o!==e)n.setValue(e),n._notify("onChange",e)}return t}),this._dSetReady.callback(i)}},getDisplayColumn:function(){return this._options.displayColumn},getItemValueColumn:function(){return this._options.itemValueColumn},setDisplayColumn:function(t){this._options.displayColumn=t},setItemValueColumn:function(t){this._options.itemValueColumn=t},setData:function(t){var i=t,o=this,n=this.getValue();if("object"!==typeof t)throw new TypeError(rk("В метод setData можно передать либо простой JavaScript-объект либо RecordSet"));if(t instanceof e)if(""===this.getDisplayColumn())throw new TypeError(rk("Невозможно установить данные через RecordSet т.к. не задана отображаемая колонка записи. Задайте отображаемую конолку через setDisplayColumn."));if(this._prepareFillData(),this._dSetReady.addCallback(function(t){return o.setValue(n),t}),i=this._convertDataToExpectedFormat(t),null!==this._recordSet)this._recordSet=null;this._dSetReady.callback(i)},_convertDataToExpectedFormat:function(t){var i=t,o=function(t){return t=void 0===t?"":t+"","null"===t?null:t};if(!(t instanceof e))if(t.keys instanceof Array&&t.values instanceof Array){if(t.keys.length!==t.values.length)throw"setData, keys and values have different length"}else if(i={keys:[],values:[]},"array"===s(t))for(var n=0;n<t.length;++n)i.keys.push(o(t[n].key)),i.values.push(t[n].value||"");else for(var r in t)if(t.hasOwnProperty(r))i.keys.push(o(r)),i.values.push(t[r]);return i},_setEnabled:function(t){k.superclass._setEnabled.apply(this,arguments)},setActive:function(t,e,i,o){if(!t)this._hideCustomContainerIfVisible();k.superclass.setActive.apply(this,[t,void 0,h.browser.isMobileSafari&&!this.isHover(),o])},setRequired:function(t){t=!!t,this._options.required=t},isRequired:function(){return this._options.required},_prepareRecordSet:function(){if(null===this._recordSet){var e=this,i=t({handlers:{onAfterLoad:function(t,i,o,n){if(e._dSetReady&&e._dSetReady.isReady())e._dSetReady=e._prepareDeferredChain();if(e._dSetReady)if(o)e._onAfterLoadRecordSet(i),e._dSetReady.callback(i);else if(!(n instanceof _)||0!==n.httpError)e._dSetReady.errback(n)}}},this._options.dataSource);i.context=this.getLinkedContext(),i.filterParams=t(i.filterParams||{},this._options.filterParams),this._notify("onBeforeLoad"),a.require("Deprecated/RecordSet").addCallbacks(function(t){var o=t[0];if(e._recordSet=new o(i),false===e._options.dataSource.firstRequest)e._dSetReady.callback(e._recordSet);return e._recordSet},function(t){return e._dSetReady.errback(t),t})}},_onAfterLoadRecordSet:function(t){if(this.isHover()&&t.hasNextPage())this.insertOption("hasMore",rk("Еще..."))},_optionTemplate:function(t,e){var o=""===(""+e).trim()||null===e?g:e;return o=i.escapeHtml(o),'<option value="'+t+'" >'+o+"</option>"},_renderOrNot:function(t){var e=this.getValueRender();return(!h.browser.isMobilePlatform||this.isHover())&&"function"===typeof e?e.apply(this,t):""},_prepareDeferredChain:function(){var t=this,i=t.isAllowEmpty();return(new u).addBoth(function(e){return t._inputControl.find(".ws-loading-line").remove(),e}).addCallback(function(o){var n={k:[],v:[],r:[]};if(o instanceof e){var s,r,a=t.getDisplayColumn(),l=t.getItemValueColumn(),u;if(t._dataType="RecordSet",i)n.k.push(null),n.v.push(t.getEmptyValue()),n.r.push(t._renderOrNot([null]));o.rewind(),t._recordSet=o;while(false!==(s=o.next())){if(s.hasColumn(a))u=s.get(a);if(l&&s.hasColumn(l))switch(r=s.get(l),s.getColumnType(l)){case"Число целое":case"Числовое значение":r=Number(r);break;case"Строка":r+=""}else r=s.getKey();u=null===u?"null":u,n.k.push(r),n.v.push(u),n.r.push(t._renderOrNot([s]))}}else{if(n.k=o.keys,n.v=o.values,n.r=[],"function"===typeof t.getValueRender()||t.isMultiplyMode())for(var d=0,h=o.values.length;d<h;d++)n.r[d]=t._renderOrNot([o.keys[d],o.values[d]]);var p;if((p=n.k.indexOf("null"))>0){n.k.splice(p,1);var c=n.v.splice(p,1),f=n.r.splice(p,1);n.k.unshift("null"),n.v.unshift(c[0]),n.r.unshift(f[0])}}return t._fKeyType=typeof n.k[i?1:0],n}).addCallback(function(e){if(t._options.data=e,""!==t._options.value)t._desiredDefaultValue=t._options.value;for(var i=0,o=e.k.length;i<o;i++){var n=e.r[i]||e.v[i],s=e.k[i];if(0===i)if(""===t._desiredDefaultValue&&""===t._options.value)if(t._desiredDefaultValue=s,isNaN(t._desiredDefaultValue))t._desiredDefaultValue=s;n=n instanceof jQuery?n.text():n,t._inputControl.append(t._optionTemplate(s,n))}return t._defaultValue=t._desiredDefaultValue,e}).addCallbacks(function(e){return t._notify("onAfterLoad",true,e),e},function(e){return t._notify("onAfterLoad",false,e),t._showError(e),e})},isMultiplyMode:function(){return false},_onValueChangeHandler:function(){var t=this._inputControl.val();if(this._enum instanceof d)this._enum.set("null"==t||null===t?"null":parseInt(t,10));k.superclass._onValueChangeHandler.apply(this,arguments),this._valueSet=true},setQuery:function(t,e){var i=this;if(this._lastQueryFilter=t,e=void 0===e?true:e,e)this._inputControl.children().remove(),this._createLoadingIndicator();if(null!==this._recordSet)this._dSetReady=this._prepareDeferredChain(),this._dSetReady.addCallback(function(t){if(e){var o=i.getValue();if(-1!==t.k.indexOf(i._castValue(o)))i.setValue(o);else{var n;if(n=t.k[0],void 0!==n||o!==n)i.setValue(n),i._notify("onChange",n)}}return t}),this._recordSet.setQuery(this._prepareFilter(t),true);else throw new Error("Setting a query to FieldDropdown which has empty dataSource configuration")},reload:function(){this.setQuery(this._lastQueryFilter)},_prepareFilter:function(t){for(var e in t)if(t.hasOwnProperty(e)&&void 0===t[e])t[e]=this._initialFilter[e];return t},_onContextValueReceived:function(t){var e=this;if(t instanceof d)if(this._dSetReady.isReady()&&!this._emptyInit)if(""!==this._enum){if(this._enum.getCurrentValue()!==t.getCurrentValue())if(t.hashCode()!==this._enum.hashCode())throw new Error("Another Enum came from context, not the same as before (different available values)");else this._setValueInternal(t.getCurrentValue()),this._notifyOnValueChange(t)}else throw new Error("FieldDropdown is already filled with data and Enum is came from context.");else this._setValueInternal(t),this._notifyOnValueChange(t);else this._dSetReady.addCallback(function(i){if(void 0!==t)if(!(null===t&&!e.isAllowEmpty())&&(t!==e._notFormatedVal()||false===e._valueSet&&t!==e._desiredDefaultValue)){var o=!e._valueSet;if(e._setValueInternal(t),!o)e._notify("onChange",t),e._notifyOnValueChange(t)}if(false===e._valueSet)e.setValue(e._desiredDefaultValue,true,true);return i})},_insertEnum:function(t){var e=this,i=t.getValues(),o=t.getCurrentValue(),n={keys:[],values:[]};for(var s in i)if(i.hasOwnProperty(s)){if(null===s)this.setAllowEmpty(true);n.keys.push(null===s?"null":s),n.values.push(i[s])}this._enum=new d(t.toObject()),this._desiredDefaultValue=null===o?"null":o,this._dSetReady.callback(n).addCallback(function(t){return e._setValueInternal(e._desiredDefaultValue),t})},_defaultValueHandler:function(){var t=this;this._dSetReady.addCallback(function(e){if(false===t._valueSet&&""===t._desiredDefaultValue)k.superclass._defaultValueHandler.apply(t,[]);return e})},_curValue:function(){return this._notFormatedVal()},_castValue:function(t){if(null===t)return t;switch(this._fKeyType){case"string":t=""+t;break;case"number":t=Number(t)}return t},getStringValue:function(){var t=""===this._inputControl.val()?this._curval:this._inputControl.val();if(t="null"===t?null:t,null!==t)t=this._castValue(t);if(this._options.data.v){var e=this._options.data.k.indexOf(t),i;return i=this._options.data.r[e]||this._options.data.v[e],i instanceof jQuery?i.text():i}else return""+t},getSelectedRecord:function(){var t,e=this,i,o=this.getRecordSet();if(!o)return;if(!this._options.itemValueColumn)return o.contains(this._curValue())?o.getRecordByPrimaryKey(this._curValue()):void 0;else return i=e.getItemValueColumn(),o.each(function(o){if(o.get(i)==e._curValue())return t=o,false}),t},_createLoadingIndicator:function(){this._inputControl.append('<option class="ws-loading-line" value="">'+rk("Загрузка")+"&hellip;</option>")},_notFormatedVal:function(){var t;if(this._enum instanceof d)return new d(this._enum.toObject());if(t=this._castValue(this._inputControl.val()),"null"===t||"number"===typeof t&&isNaN(t))t=this._curval||"null";if("null"===t)return null;else if(void 0===t||""===t||"RecordSet"===this._dataType)return t;else{var e=Number(t);return isNaN(e)||e+""!==t?t:e}},_getElementToFocus:function(){return this._inputControl},_testOnEmptyInit:function(){if(this._emptyInit)this._emptyInit=false,this._dSetReady=this._prepareDeferredChain()},_setValueInternal:function(t){var e,i;if(void 0===t)return;if(t instanceof d){if(this._testOnEmptyInit(),!this._dSetReady.isReady())this._insertEnum(t);t=t.getCurrentValue()}if(this._enum instanceof d)try{this._enum.set(t)}catch(t){l.resolve("ILogger").log("FieldDropdown",t)}function o(t,e){var i=false;return t.find("option").each(function(){if(!i)i=$(this).val()==e}),i}if(this._curval=null===t?"null":t,e=this._inputControl.val(),i=e===this._curval.toString(),!i&&o(this._inputControl,this._curval))this._inputControl.val(this._curval);if(e!=this._inputControl.val()||i)this._valueSet=true,this._inputControl.trigger("change.themed"),this._updateInPlaceValue(this.getStringValue())},_showError:function(t){this._inputControl.children().remove().end().append('<option value="">'+t.message+"</option>")},_passthroughControlButtons:function(){var t=this;this._inputControl.bind("keypress.readonly, change.readonly, keyup.readonly, keydown.readonly",function(e){if(!t._isChangeable()&&e.which!=h.key.tab&&e.which!=h.key.esc)t._inputControl.val(t._curval),e.stopImmediatePropagation()})},destroy:function(){if(this._dSetReady=null,this._enum=null,this._optCont)this._hideCustomContainerIfVisible(),this._optCont.empty().remove(),this._optCont=$();if(this._optContList)this._optContList.empty().remove(),this._optContList=$();if(this._optContHead)this._optContHead.empty().remove(),this._optContHead=$();if(this._optArrow)this._optArrow.empty().remove(),this._optArrow=$();$(document).unbind("."+this.getId()),k.superclass.destroy.apply(this,arguments)},getValueDeferred:function(){return this._dSetReady},_initDefaultValue:function(){},_updateOddClasses:function(){this._optCont.find(".ws-item-odd").removeClass("ws-item-odd"),this._optCont.find(".custom-select-option:odd").addClass("ws-item-odd")},insertOption:function(t,e,i){if(this._emptyInit)this._emptyInit=false;this._dSetReady.addCallback(function(){var o=this._renderOrNot([t,e]),n,s=this._options.data;if(void 0!==i)if("boolean"===typeof i)n=i?0:s.k.length;else for(var r=0;r<s.k.length;++r)if(s.k[r]==i){n=r;break}var a=$(this._optionTemplate(t,o||e)),l=this._createCustomRow(t,o||e);if(void 0!==n){if(s.k.splice(n,0,t),s.v.splice(n,0,e),s.r.splice(n,0,o),a.insertBefore(this._inputControl.children().eq(n)),l)l.insertBefore(this._optContList.children().eq(n))}else if(s.k.push(t),s.v.push(e),s.r.push(o),a.appendTo(this._inputControl),l)l.appendTo(this._optContList)}.bind(this))},removeOption:function(t){var e=this._options.data,i=this._inputControl.val()==t;this._dSetReady.addCallback(function(){for(var o=0;o<e.k.length;++o)if(t==e.k[o]){if(e.k.splice(o,1),e.r.splice(o,1),e.v.splice(o,1),this._inputControl.children().eq(o).remove(),this._optContList.children().eq(o).remove(),i)this._inputControl.trigger("change.themed");return}}.bind(this))},toggleOptionsToContainer:function(t){this._optCont.appendTo(t?this._container:$("body"))},_modifyValue:function(t){this._dSetReady.addCallback(function(){for(var e=this._options.data.k,i=this.getValue(),o,n=0;n<e.length;++n)if(e[n]==i){o=n;break}if(void 0!==o){var s=e[o+t];if(void 0!==s)this.setValue(s)}}.bind(this))},setNextValue:function(){this._modifyValue(1)},setPrevValue:function(){this._modifyValue(-1)},changeValueByIndex:function(t,e){var i=this._options.data.k;if(t>=i.length||t<0)return;var o=i[t],n=this._options.data.v,s=this._options.data.r,r=this._renderOrNot([o,e]),a=$(this._optionTemplate(o,r||e)),l=this._createCustomRow(o,r||e),u=this._inputControl.val();if(n[t]=e,s[t]=r,this._inputControl.children().eq(t).replaceWith(a),l)this._optContList.children().eq(t).replaceWith(l);if(this._curval==o)this._inputControl.val(u),this._inputControl.trigger("change.themed")},getRecordSet:function(){return this._recordSet},getKeys:function(){return[].concat(this._options.data.k)},getValues:function(){return[].concat(this._options.data.v)},getValueByKey:function(t){var e=this._options.data.k;return this._options.data.v[e.indexOf(t)]},getKeyByValue:function(t){return this._options.data.k[this._options.data.v.indexOf(t)]},isAllowEmpty:function(){return this._options.allowEmpty},setAllowEmpty:function(t){if("boolean"===typeof t||null===t)this._options.allowEmpty=t;if(!t)this.removeOption("null")},getMode:function(){return this._options.mode},isWordWrap:function(){return this._options.wordWrap},setWordWrap:function(t){this._options.wordWrap=!!t},getFirstYear:function(){return this._options.firstYear},getLastYear:function(){return this._options.lastYear},getRenderStyle:function(){return this._options.renderStyle},isShowSelectedInList:function(){return this._options.showSelectedInList},setShowSelectedInList:function(t){this._options.showSelectedInList=!!t},getValueRender:function(){return this._options.valueRender},getTitleRender:function(){return this._options.titleRender}});return k});
//# sourceMappingURL=FieldDropdown.js.map