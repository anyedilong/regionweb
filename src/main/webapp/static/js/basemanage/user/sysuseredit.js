var id;
var menuId;
$(function(){
	//初始化数据
    id = $.util.getUrlParam('id');
    menuId = $.util.getUrlParam('menuId');
    setTimeout('$("#orgTree").downZtree()', 100);
});

window.onload = function(){
	//等到机构树加载完成；进行数据绑定
    if(!$.util.isNull(id)){
        initData(id);
        $("#passwordPlay").hide();
    }
    //初始化机构树
    initOrgTree();
}
	
  	//保存form表单
    function saveForm(){
    	if($("#roleSel").val() != undefined){
    		$("#saveForm input[name=roleIds]").val($("#roleSel").val().join(","));
    	}else{
    		$("#saveForm input[name=roleIds]").val('');
    	}
    	if(initValidate("用户名称", $("#username").val()) && initValidate("姓名", $("#name").val()) &&
    			initValidate("所属机构", $("#orgId").val()) && initValidate("用户角色", $("#roleIds").val())){
	    	var saveUrl = roadPath + '/family/user/save';
	    	save(saveUrl,'saveForm',function(){
	            parent[1].parent[0].refurshTable();
	            parent[1].parent[0].closeDialog(menuId);
	        });
	    }
    }
  	//初始化数据
    function initData(id){
        //查询数据，绑定到元素
        var showUrl = roadPath + '/family/user/show';
        var json = {'id':id}
        $.ajax({
            type: 'POST',
            async: false,
            url: showUrl,
            contentType: 'application/json',
            data: JSON.stringify(json),
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            	//debugger;
            },
            beforeSend: function (XMLHttpRequest) {
        		XMLHttpRequest.setRequestHeader("authorization","12312");
        	},
            success: function (data) {
    			if(data.retCode == 0){
    				optionCookie(data.authorToke);
    				data = data.data;
    				bindData('saveForm', data);
                    //$("#username").attr('readonly',true);
                    $("#saveForm .show-hidden").addClass("hd");
    			}
            },
            complete: function (XMLHttpRequest, textStatus) {
            }
        });
    }
  	
    var setting = {
   		data: {
               simpleData: {
                   enable: true,
                   idKey: "id",
                   pIdKey: "parentId"
               },
               key:{
               	   name: "orgName"
               },
               
           },
        //回调
        callback: {
            onClick: zTreeOnClick
        },
        view: {
            fontCss: { fontSize: "14px" }
        }
    };
    //节点点击事件
    function zTreeOnClick(event, treeId, treeNode) {
    	$('#orgName').val(treeNode.orgName);
        $('#orgId').val(treeNode.id);
        hideTree();
    };
    var orgTree;
    function initOrgTree(){
    	var initMenuUrl = roadPath + '/family/org/queryOrgList';
	    $.ajax({
	    	type: 'POST',
	        url:initMenuUrl,
	        async : false, // 是否同步
	        contentType: 'application/json',
	        success:function(data){
	        	if(data.retCode == 0){
	        		optionCookie(data.authorToke);
	        		data = data.data;
	        		if($.util.isNull(data)){
		                data = [];
		            }
		            //初始组织树状图
		            orgTree = $.fn.zTree.init($("#orgTree"), setting, data);
		            var node = orgTree.getNodesByParam("id", $("#orgId").val(), null);
                    if(!$.util.isNull(node)){
                    	orgTree.selectNode(node[0]);
                    	$('#orgName').val(node[0].orgName);
                    }
                    hideTree();
                    //初始化角色下拉
                	initRole();
	        	}
	        }
	    });
    };
    //下拉框显示 隐藏
    function showTree(){
        if($('.orgtree').css('display') == 'none'){
            $('.orgtree').css('display','block');
        } else{
            $('.orgtree').css('display','none');
        }
        $("body").bind("mousedown", onBodyDownByActionType);
    }
    function hideTree() {
        $('.ztree').css('display','none');
        $("body").unbind("mousedown", onBodyDownByActionType);
        return false;
    }
    //区域外点击事件
    function onBodyDownByActionType(event) {
        if (event.target.id.indexOf('orgTree') == -1){
            if(event.target.id != 'selectDevType'){
                hideTree();
            }
        }
    }
  	//初始化角色下拉
    function initRole(){
    	var initRoleUrl = roadPath + '/family/role/getRoleList';
    	$.ajax({
    		type: 'POST',
 	        url:initRoleUrl,
 	        data: {},
 	        async : false, // 是否同步
 	        contentType: 'application/json',
             success:function(data){
            	 optionCookie(data.authorToke);
            	 data = data.data;
                 if(!$.util.isNull(data)){
                     var optionHtml = '';
                     $("#roleSel").html("");
                     optionHtml += '<option value=""></option>';
                     for(var i = 0; i < data.length;i++){
                         var item = data[i];
                         var value = item.id;
                         var text = item.roleName;
                         optionHtml += '<option value="'+value+'">'+text+'</option>';
                     }
                     $("#roleSel").html(optionHtml);
                     var roleIds = $("#roleIds").val() == '' ? [] : $('#roleIds').val().split(",");
                     setTimeout(function(){
                    	 $('select[multiple]').val(roleIds);
                     	 layui.multiSelect.render();
                     }, 200);
                 }
             }
         });
    }