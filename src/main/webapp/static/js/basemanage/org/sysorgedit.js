var id;
var menuId;
$(function(){
	//初始化数据
    id = $.util.getUrlParam('id');
    menuId = $.util.getUrlParam('menuId');
    if(!$.util.isNull(id)){
        initData(id);
    }
});

window.onload = function(){
	//初始化区划树
    initAreaTree();
}
	
  	//保存form表单
    function saveForm(){
    	if(initValidate("机构名称", $("#orgName").val()) && initValidate("机构代码", $("#orgCode").val())
    			&& initValidate("所属区划", $("#areaId").val()) && initValidate("上级机构", $("#parentId").val())){
    		var saveUrl = roadPath + '/family/org/save';
        	save(saveUrl,'saveForm',function(){
                parent[1].parent[0].refurshTable();
                parent[1].parent[0].closeDialog(menuId);
            });
    	}
    }
  	//初始化数据
    function initData(id){
        //查询数据，绑定到元素
        var showUrl = roadPath + '/family/org/show';
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
            success: function (data) {
    			if(data.retCode == 0){
    				bindData('saveForm',data.data);
                    $("#username").attr('readonly',true);
                    $("#saveForm .show-hidden").addClass("hd");
                    optionCookie(data.authorToke);
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
        //$('#orgName option').eq(0).val(treeNode.orgName).attr("selected","selected");
       // $('#orgName option').eq(0).html(treeNode.orgName)
        $('#parentOrgName').val(treeNode.orgName);
        $('#parentId').val(treeNode.id);
        hideTree();       
    };
    function initOrgTree(){
    	var intiMenuUrl = roadPath + '/family/org/queryOrgList';
	    $.ajax({
	    	type: 'POST',
	        url:intiMenuUrl,
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
		            var orgTree = $.fn.zTree.init($("#orgTree"), setting, data);
		            var node = orgTree.getNodesByParam("id", $("#parentId").val(), null);
                    if(!$.util.isNull(node)){
                    	orgTree.selectNode(node[0]); 
                    	//$('#orgName option').eq(0).val(node[0].orgName).attr("selected","selected");
                    	//$('#orgName option').eq(0).html(node[0].orgName)
                    	$('#parentOrgName').val(node[0].orgName);
                    }
                    hideTree();
	        	}
	        }
	    });
    };
    //下拉框显示 隐藏
    function showOrgTree(){
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
    
    var settingArea = {
       		data: {
                   simpleData: {
                       enable: true,
                       idKey: "id",
                       pIdKey: "parentId"
                   },
                   key:{
                   	   name: "areaName"
                   },
                   
               },
            //回调
            callback: {
                onClick: areaTreeOnClick
            },
            view: {
                fontCss: { fontSize: "14px" }
            }
        };
        //节点点击事件
        function areaTreeOnClick(event, treeId, treeNode) {
            //$('#areaName option').eq(0).val(treeNode.areaName).attr("selected","selected");
            //$('#areaName option').eq(0).html(treeNode.areaName)
        	$('#areaName').val(treeNode.areaName);
            $('#areaId').val(treeNode.id);
            hideAreaTree();
        };
        function initAreaTree(){
        	var intiMenuUrl = roadPath + '/family/org/queryAreaList';
    	    $.ajax({
    	    	type: 'POST',
    	        url:intiMenuUrl,
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
    		            var areaTree = $.fn.zTree.init($("#areaTree"), settingArea, data);
    		            var node = areaTree.getNodesByParam("id", $("#areaId").val(), null);
                        if(!$.util.isNull(node)){
                        	areaTree.selectNode(node[0]);
                        	//$('#areaName option').eq(0).val(node[0].areaName).attr("selected","selected");
                            //$('#areaName option').eq(0).html(node[0].areaName)
                        	$('#areaName').val(node[0].areaName);
                        }
                        hideAreaTree();
                        //初始化机构树
                        initOrgTree();
    	        	}
    	        }
    	    });
        };
        //下拉框显示 隐藏
        function showAreaTree(){
            if($('.areatree').css('display') == 'none'){
                $('.areatree').css('display','block');
            } else{
                $('.areatree').css('display','none');
            }
            $("body").bind("mousedown", onBodyDownByActionType1);
        }
        function hideAreaTree() {
            $('.ztree').css('display','none');
            $("body").unbind("mousedown", onBodyDownByActionType1);
            return false;
        }
        //区域外点击事件
        function onBodyDownByActionType1(event) {
            if (event.target.id.indexOf('areaTree') == -1){
                if(event.target.id != 'selectDevType'){
                	hideAreaTree();
                }
            }
        }