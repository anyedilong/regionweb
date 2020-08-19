var menuTree;
var id;
var menuId;
$(function(){
    id = $.util.getUrlParam('id');
    menuId = $.util.getUrlParam('menuId');
    if($.util.isNull(id)){
    	swal("授权操作错误", "", "error");
    	parent.closeDialog(menuId);
    }
	//初始化菜单
	initMenuTree();
});
	
	function initMenuTree(){
	    var intiMenuUrl = roadPath + '/family/menu/getmenutree';
	    $.ajax({
	    	type: 'POST',
	        url:intiMenuUrl,
	        async : false, // 是否同步
	        contentType: 'application/json',
	        success:function(data){
	        	if(data.retCode == 0){
	        		optionCookie(data.authorToke);
	        		data = data.data == null ? [] : data.data;
		            if($.util.isNull(data)){
		                data = [];
		            }
		            var setting = {
		            	check: {
		                    enable: true,
		                    chkboxType: { "Y": "s", "N": "s" }
		                },
		                data: {
		                    simpleData: {
		                        enable: true,
		                        idKey: "id",
		                        pIdKey: "parentId"
		                    },
		                    key:{
		                    	name: "name"
		                    }
		                },
		                callback: {
		                	beforeCheck: function zTreeBeforeCheck(treeId, treeNode) {
		                        //取消上级节点选中
		                        var bl = true;
		                        var childeNode = treeNode;
		                        while(bl){
		                        	childeNode = childeNode.getParentNode();
		                        	if(!$.util.isNull(childeNode)){
		                        		childeNode.checked = false;
		                        	}else{
		                        	    bl = false;
		                        	}
		                        }
		                    }
		                }
		            };
		
		            menuTree = $.fn.zTree.init($("#menuTree"), setting, data);
		            initData($.util.getUrlParam('id'));
	        	}
	        }
	    });
	}
	
	function initData(id){
		var showAuthUrl = roadPath + '/family/role/showAuthorize';
		$.ajax({
            type: 'POST',
            async: false,
            url: showAuthUrl,
            contentType: 'application/json',
            data: JSON.stringify({"id":id}),
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            	//debugger;
            },
            success: function (data) {
    			if(data.retCode == 0){
    				optionCookie(data.authorToke);
    				data = data.data == null ? [] : data.data;
    				for(var i = 0 ; i < data.length ; i++){
	        			var node = menuTree.getNodesByParam("id", data[i], null);
	                    if(!$.util.isNull(node)){
	                    	//menuTree.selectNode(node[0]);
	                    	node[0].checked = true;
	                    	menuTree.updateNode(node[0]); 
	                    }
	        		}
    			}
            },
            complete: function (XMLHttpRequest, textStatus) {
            }
        });
	}
	
	function saveForm(){
		var id = $.util.getUrlParam('id');
	    if($.util.isNull(id)){
	        swal("授权操作错误", "", "error");
	        parent.closeDialog(menuId);
	    }
		var menuArray = [];
		var nodes = menuTree.getCheckedNodes(true);
		if(!$.util.isNull(nodes)){
			for(var i=0;i <nodes.length; i++ ){
				var nodeItem = nodes[i];
				menuArray.push(nodeItem.id);
			}
		}
		var saveAuthorizeUrl = roadPath + '/family/role/authorize';
		$.ajax({
            type: 'POST',
            async: false,
            url: saveAuthorizeUrl,
            contentType: 'application/json',
            data: JSON.stringify({'id':id,'menuIds':menuArray}),
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            	//debugger;
            },
            success: function (data) {
    			if(data.retCode == 0){
    				optionCookie(data.authorToke);
    				parent[1].parent[0].$.util.toastr.success('授权成功');
    				parent[1].parent[0].closeDialog(menuId);
    			}
            },
            complete: function (XMLHttpRequest, textStatus) {
            }
        });
	}
	
