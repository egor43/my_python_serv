define("js!SBIS3.Staff.Employee",["Core/moduleStubs","Core/Indicator","Core/IoC","Core/Context","Core/Deferred","WS.Data/Source/SbisService","js!SBIS3.Staff.StaffConst","i18n!SBIS3.Staff.Employee","SBIS.VideoCall/Utils","Core/SessionStorage","Core/UserInfo"],function(e,r,t,a,n,o,i,d,l,c,s){var u=!!c.get("OldEmployeeCard"),f;function S(r,t){var a=d("Не удалось открыть карточку сотрудника"),n=d("Неизвестная ошибка");if(r&&r.error_code in i.errorCode)n=i.errorCode[r.error_code].userMessage;else if(r.message)n=r.message;if(r&&!r.processed&&403!=r.httpError)e.requireModule("SBIS3.CONTROLS/Utils/InformationPopupManager").addCallback(function(e){e[0].showMessageDialog({message:n,opener:t})}),r.processed=true}function p(o){var i=new n;return e.require("Core/core-attach","Deprecated/helpers/transport-helpers").addCallback(function(e){var t=e[0],n=e[1];if(!o.filter)o.filter={};function d(e){i.dependOn(t.attachInstance("Control/Area:RecordFloatArea",{className:"ws-float-area__block-layout",name:o.template,template:o.template,height:"auto",isStack:true,side:"right",record:e,context:new a,autoHide:o.autoHide?o.autoHide:false,opener:o.opener,handlers:o.handlers?o.handlers:{},componentOptions:{activeItem:o.activeItem},newRecord:o.isCreate||false}))}if(o.template)if(r.setMessage("Пожалуйста, подождите..."),o.record)d(o.record);else n.newRecordSet(o.object,o.method_list,{},"ReaderUnifiedSBIS",false,void 0,void 0,o.readerParams).addCallback(function(e){if(o.key)e.readRecord(parseInt(o.key,10)).addCallback(function(e){n.newRecordSet("Персонал","СписокДляКарточкиСотрудника",{},"ReaderUnifiedSBIS",false,void 0,void 0,{readMethodName:"ПрочитатьСПользователем",updateMethodName:"ЗаписатьКарточку"}).addCallback(function(r){e.setRecordSet(r,true)}),d(e)}).addErrback(function(e){i.errback(e)});else o.filter["ВызовИзБраузера"]=true,e.createRecord(o.filter,o.object+"."+o.method_list).addCallback(function(e){d(e)}).addErrback(function(e){i.errback(e)})});else i.errback(new Error("Не указан шаблон редактирования записи"))}),i.addErrback(function(e){var r="Ошибка при инициализации плавающей панели"+(e.message?": "+e.message:"");return t.resolve("ILogger").log("js!SBIS3.Staff.Employee",r),S(e,o.opener),e}).addBoth(function(e){return r.hide(),e})}function m(e,r,t,a,n,o,i){return p({key:r||e,opener:t,object:"Персонал",method_list:"СписокДляКарточкиСотрудника",template:"js!SBIS3.Staff.CardEmployee",readerParams:{readMethodName:r?"ПрочитатьПоСотруднику":"ПрочитатьСПользователем",createMethodName:"СоздатьСотрудника"},updateMethodName:"ЗаписатьКарточку",autoHide:false,filter:a?a:{},handlers:n?n:{},activeItem:o,isCreate:i})}return f={create:function(e,r,t){if(!u){var a={};if(e["РабочаяГруппа"])a["РабочаяГруппа"]=e["РабочаяГруппа"];if(e["Контрагент"])a["org"]=e["Контрагент"];if(e["РП.ТекущееПодразделение"])a["РП.ТекущееПодразделение"]=e["РП.ТекущееПодразделение"];if(e["РП.ТекущийКонтрагент"])a["РП.ТекущийКонтрагент"]=e["РП.ТекущийКонтрагент"];return f.createNew(a,r,t)}return m(null,null,r,e,t,void 0,true)},edit:function(e,r,t,a,n){if(!u)return f.editNew(e,r,t,a,n);return m(e,r,t,null,a,n,false)},editHistoryEntity:function(r,t,a,n,o){if("Сотрудники"===n)f.edit(r,t,a,o).addErrback(function(r){return e.requireModule("SBIS3.CONTROLS/Utils/InformationPopupManager").addCallback(function(e){e[0].showMessageDialog({message:"Сотрудник удален",opener:a})}),r});else e.requireModule("SBIS3.Staff.DepartmentFunction").addCallback(function(t){return t[0].showDept(r,a).addErrback(function(r){e.requireModule("SBIS3.CONTROLS/Utils/InformationPopupManager").addCallback(function(e){e[0].showMessageDialog({message:"Подразделение удалено",opener:a})})}),t})},editByFace:function(e,r,t,a,n,i){if(!u)return f.editByFaceNew(e,r,t,a,n,i);var d={key:e,opener:r,object:"Персонал",method_list:"СписокДляКарточкиСотрудника",template:"js!SBIS3.Staff.CardEmployee",readerParams:{readMethodName:"ПрочитатьПоЧЛ"},updateMethodName:"ЗаписатьКарточку",handlers:t?t:{},activeItem:n};if(e&&a&&"-1"!==a.toString()&&"-2"!==a.toString())return new o({endpoint:"PrivateFace"}).call("НайтиСотрудника",{"Лицо":e,"пКонтрагент":parseInt(a,10),"ТолькоРаботающий":false}).addCallback(function(e){var a=e.getAll();if(a&&a.getCount()>0&&a.at(0).get("@Сотрудник"))return f.edit(null,a.at(0).get("@Сотрудник"),r,t,n);else return p(d)});else return p(d)},sendMsg:function(e,r){require(["js!SBIS3.Contacts.MessagePanel"],function(t){var a={parent:r.getTopParent()};if(function(r){return!isNaN(+e)}(e))a["messageRecievers"]=[{clientID:s.get("ИдентификаторКлиента"),faceID:e}],t.openWithFaces(a);else a["messageRecievers"]=[{personID:e}],t.open(a)})},call:function(e,r){l.initCall(e,r)},createNew:function(r,t,a,n){return e.requireModule("SBIS3.Staff.Employee.Card").addCallback(function(e){return e[0]._functions.open(r,t,{activeItem:n,handlers:a})})},editByFaceNew:function(r,t,a,n,o,i){return e.requireModule("SBIS3.Staff.Employee.Card").addCallback(function(e){return e[0]._functions.open({face:r,org:n},t,{activeItem:o,handlers:a,componentOpts:i})})},editNew:function(r,t,a,n,o){return e.requireModule("SBIS3.Staff.Employee.Card").addCallback(function(e){return e[0]._functions.open({userLink:r,employee:t},a,{activeItem:o,handlers:n})})}}});
//# sourceMappingURL=StaffEmployee.module.js.map