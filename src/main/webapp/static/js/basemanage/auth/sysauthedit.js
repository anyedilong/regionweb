var id;
var menuId;
$(function(){
	id = $.util.getUrlParam('id');
    menuId = $.util.getUrlParam('menuId');
    if(!$.util.isNull(id)){
        initData(id);
    }else{
    	var uuid = getUuid();
    	$("#authCode").val(uuid);
    }
  //初始化机构树
    initOrgTree();
});
  	//初始化数据
    function initData(id){
        //查询数据，绑定到元素
        var showUrl = roadPath + '/authCode/show';
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
    				optionCookie(data.authorToke);
    				bindData('saveForm',data.data);
    			}
            },
            complete: function (XMLHttpRequest, textStatus) {
            }
        });
    }
    
    //保存form表单
    function saveForm(){
    	if(initValidate("所属机构", $("#orgId").val())){
    		var saveUrl = roadPath + '/authCode/save';
        	save(saveUrl, 'saveForm', function(){
        		parent[1].parent[0].refurshTable();
                parent[1].parent[0].closeDialog(menuId);
            }); 
    	}
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
		            var menuTree = $.fn.zTree.init($("#treeDemo"), setting, data);
		            var node = menuTree.getNodesByParam("id", $("#orgId").val(), null);
                    if(!$.util.isNull(node)){
                    	menuTree.selectNode(node[0]);
                    	$('#orgName').val(node[0].orgName);
                    }
                    hideTree();
	        	}
	        }
	    });
    };
    //下拉框显示 隐藏
    function showTree(){
        if($('.ztree').css('display') == 'none'){
            $('.ztree').css('display','block');
        } else{
            $('.ztree').css('display','none');
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
        if (event.target.id.indexOf('treeDemo') == -1){
            if(event.target.id != 'selectDevType'){
                hideTree();
            }
        }
    }