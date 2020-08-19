$.validator.setDefaults({
    highlight: function(e) {
        $(e).closest(".form-group").removeClass("has-success").addClass("has-error")
    },
    success: function(e) {
        e.closest(".form-group").removeClass("has-error").addClass("has-success")
    },
    errorElement: "span",
    errorPlacement: function(e, r) {
        e.appendTo(r.is(":radio") || r.is(":checkbox") ? r.parent().parent().parent() : r.parent())
    },
    errorClass: "help-block m-b-none tl none-margin",
    validClass: "help-block m-b-none tl none-margin"
});
var menuId = '';
var dialogSet = {};
var handleData = {};
var handleRowData ={};
$(function(){
	
	
	/*//验证 菜单ID
//	alert(window.location);
	menuId = $.util.getUrlParam('menuId');
	//获取可操作权限
	if(!$.util.isNull(menuId)){
		var getHandleUrl = $.util.basePath + '/r/menu/getUserHandleByMenuId';
		 $.util.ajax({
            url:getHandleUrl,
            data:{'menuId':menuId},
            async : false, // 是否同步
            success:function(data1){
            	if(!$.util.isNull(data1)){
            		 for(var i = 0; i < data1.length;i++){
            			 var dataItem = data1[i];
            			 var handleType = dataItem.handleType;
            			 var rowHandleFlg = dataItem.rowHandleFlg;
            			 if(!$.util.isNull(handleType)){
            				 if(rowHandleFlg == '1'){
            					 handleRowData[handleType] = dataItem;
            				 }else{
            					 handleData[handleType] = dataItem;
            				 }
            			 }
            		 }
            	}
            }
		 });
	}
	
	initHandle();*/
	
});

//初始化 操作
function initHandle(){
	//handleData
	$("#handle-div .button-handle").each((function(index,element){
		var handleType = $(this).attr("handle-type");
		if(!$.util.isNull(handleType)){
			var handleItem = handleData[handleType];
			if($.util.isNull(handleItem)){
				$(this).addClass("hd");
				$(this).remove();
			}else{
				$(this).find("i").addClass(handleItem.icon);
				$(this).append(handleItem.name);
			}
		}
	}));
}

function initRowHandle(tableId){
	//handleRowData
	$("#"+tableId).find(".button-handle-row").each((function(index,element){
		var handleType = $(this).attr("handle-type");
		if(!$.util.isNull(handleType)){
			var handleItem = handleRowData[handleType];
			if($.util.isNull(handleItem)){
				$(this).addClass("hd");
				$(this).remove();
			}else{
				$(this).find("i").addClass(handleItem.icon);
				$(this).append(handleItem.name);
			}
		}
	}));
}

//打开弹出框
function openDialogByHandle(btnEle,url){
	var handleType = $(btnEle).attr("handle-type");
	var handleItem;
	if($(btnEle).hasClass("button-handle-row")){
		handleItem = handleRowData[handleType];
	}else{
		handleItem = handleData[handleType];
	}
	
	if(!$.util.isNull(handleItem)){
		openDialog(handleItem.id,url,handleItem.width,handleItem.height,handleItem.title);
	}else{
		openDialog(new Date().getTime(),url);
	}
	
}

function getDialogId(btnEle){
	var handleType = $(btnEle).attr("handle-type");
	var handleItem;
	if($(btnEle).hasClass("button-handle-row")){
		handleItem = handleRowData[handleType];
	}else{
		handleItem = handleData[handleType];
	}
	return handleItem.id;
}

//打开弹出窗
function openDialog(id,url,width,height,title){
	if($.util.isNull(id)){
		id = new Date().getTime(); 
	}
	var param = 'menuId='+id+'&';
	
	if(url.indexOf("?") >= 0){
		url += "&"+param ;
	}else{
		url += "?"+param ;
	}
	
	var dialogId = 'menu_'+menuId+'_dialog_'+id;
	dialogSet[id] = dialogId;
	$.dialog({
		'id':dialogId,
		'content':'url:'+url,
		'width':width,
		'height':height,
		'title':title		
	});
}

//关闭弹出窗
function closeDialog(id,closeAfter){
	$.dialog({id:dialogSet[id]}).close();
	
	closeAfter; 
}

//保存
function save(url,formId,saveAfter,param){
	if($("#"+formId).valid()){
		var json = $('#'+formId).serializeJSON(); 
		var jsonNew ;
		if($.util.isNull(param)){
			jsonNew = json;
		}else{
			jsonNew = $.extend({},json,param);
		}
		var submitUrl = url;
		$.util.ajax({
			url:submitUrl,
			data:jsonNew,
			success:function(data){
				parent.$.util.toastr.success('保存成功');
				saveAfter(data);
			}
		});
	}
	
}

//删除
function del(url,tableId,idField,deleteAfter){
	if($.util.isNull(idField)){
		idField = "id";
	}
	var selectionRows = $('#'+tableId).bootstrapTable('getSelections');
	if(selectionRows.length <= 0){
		swal("请选择需要删除行", "", "warning");
	}else{
		var ids = [];
		for(var i = 0 ; i < selectionRows.length ; i++){
			var row = selectionRows[i];
			ids.push(row[idField]);
		}
		
		//删除提示
		swal({   
			title: "确认是否删除?",
			text: "删除后的数据将无法查看",
			type: "warning",   
			showCancelButton: true,   
			confirmButtonColor: "#DD6B55",   
			confirmButtonText: "删除",   
			cancelButtonText:"取消",
			closeOnConfirm: false }, 
			function(){   
				$.util.ajax({
					url:url,
					data:{'ids':ids},
		            async : false, // 是否同步
					success:function(data){
						$.util.toastr.success('删除成功');
						deleteAfter();
						swal({
							title : "",
							timer : 0
						});
					}
				});
				
			}
		);
	}
}


//绑定数据
function bindData(formId,data){
	$('#'+formId).setForm(data);
	$("select").trigger("chosen:updated"); 
}

//绑定详情界面
function bindShowData(data){
	$(".show-data").each(function(index,ele){
		var eleName = $(this).attr("data-name");
		var eleData  = [];
		if(!$.util.isNull(data) && !$.util.isNull(eleName)){
			var nameArray = eleName.split(".");
			getShowData(data,nameArray,0,eleData)
		}
		$(this).html(eleData.join(','));
	})
}

function getShowData(data,nameArray,nameIndex,value){
	//验证是否为集合
	if(!$.util.isNull(data)){
		//验证是否为集合
		if(typeof(data) == 'object' && data.length > 0 ){
			for(var i = 0 ; i < data.length ; i++){
				getShowData(data[i],nameArray,nameIndex,value);
			}
		}else{
			var name = nameArray[nameIndex]; 
			var dataItem = data[name];
			
			if((nameIndex+1) >= nameArray.length ){
				if(!$.util.isNull(dataItem)){
					value.push(dataItem);
				}
			}else{
				getShowData(dataItem,nameArray,nameIndex+1,value);
			}
		}
	}
}


//初始化行操作按钮

//设置form只读
function setReadonly(formId){
	$('#'+formId).find('input,textarea,select').not('').attr('readonly',true);
}

//获取字典集合
function getDictList(dictProp,queryAfter){
	var url = $.util.basePath+'/getDict';
	$.util.ajax({
		url:url,
		data:{'dictProp':dictProp},
        async : false, // 是否同步
		success:function(data){
			queryAfter(data);
		}
	});
	
}




