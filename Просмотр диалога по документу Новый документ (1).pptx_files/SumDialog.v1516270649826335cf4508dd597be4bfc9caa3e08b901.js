define("Deprecated/res/wsmodules/SumDialog/SumDialog",["Lib/Control/CompoundControl/CompoundControl","html!Deprecated/res/wsmodules/SumDialog/SumDialog","css!Deprecated/res/wsmodules/SumDialog/SumDialog","Deprecated/Controls/Button/Button"],function(t,o){return t.extend({_dotTplFn:o,$protected:{_options:{autoWidth:false,autoHeight:true,resizable:false,caption:"Суммирование",width:"273px"}},$constructor:function(){this.subscribe("onInit",function(){this.getChildControlByName("okButton").subscribe("onActivated",function(){this.getTopParent().close()}.bind(this))})}})});
//# sourceMappingURL=SumDialog.js.map