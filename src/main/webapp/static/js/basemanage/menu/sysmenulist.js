var totalPage;
$(function () {
	//初始化菜单树
    initMenuTree();
	//查询按钮
	$(document).on('click', ".search",function(){
		refurshTable();
	});
	//重置按钮
	$(document).on('click', ".reset",function(){
		reset();
	});
});
	var dictTree;
	//初始化字典树
    function initMenuTree(){
    	var initMenuUrl = roadPath + '/family/menu/getmenutree';
    	
    	$.ajax({
    		type: 'POST',
            async: false,
            url: initMenuUrl,
            contentType: 'application/json',
            success:function(data){
            	if(data.retCode == 0){
            		optionCookie(data.authorToke);
            		data = data.data;
            		refurshTable();
            	}
                if($.util.isNull(data)){
                    data = [];
                }
                
                data.push({id:"0",parentId:"-1",dictName:"菜单",name:"菜单",open:true});

                var setting = {
            		view: {
                        addHoverDom: addHoverDom,//需要显示自定义控件的节点
                        removeHoverDom: removeHoverDom
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId"
                        },
                        key:{
                        	name: "name"
                        },
                        
                    },
                    edit: {
                        enable: true,
                        showRenameBtn: function(treeId, treeNode){
                        	return treeNode.id!='0';
                        },
                        showRemoveBtn: function(treeId, treeNode){
                        	return !treeNode.isParent || treeNode.id!='0';
                        },
                        drag: {
                            isCopy: false,
                            isMove: false
                        }
                    },
                    callback : {
                        onClick:function(event, treeId, treeNode){
                        	//如果有下级 ，则不做操作
                            $("input[name=parentId]").val(treeNode.id);
                            refurshTable();
                        },
                        beforeEditName:function(treeId, treeNode){
                        	openMenuDialog(treeNode.id);
                        	return false;
                        },
                        beforeRemove:function(treeId, treeNode){
                            return removeMenu(treeNode.id);
                        },
                    }
                };
                dictTree = $.fn.zTree.init($("#menuTree"), setting, data);
                dictTree.expandAll(true); 
            }
        });
    }
    
    //zTree显示添加按钮
    function addHoverDom(treeId, treeNode) {
    	var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='添加' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_"+treeNode.tId);
        if (btn) btn.bind("click", function(){
        	openMenuDialog(null,treeNode.id,treeNode.name);
        	//dictTree.addNodes(treeNode, {id:(100 + 'aaa'), pId:treeNode.id, name:"new nodeaaaa "});
            return true;
        });
    };
    
    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_"+treeNode.tId).unbind().remove();
    };
	
  //从后台获取第一页的数据
	function tableInit(pageNo){
		
        var param = new Object();
        var page = new Object();
        page.page_size = 10;
        page.page_no = pageNo;
        param.page = page;
        param.name = $("#name").val();
        param.parentId = $("#parentId").val();
        
		var gridTableUrl = roadPath + '/family/menu/querymenu';
		$.ajax({
	        type: 'POST',
	        dataType: "json",
	        async: false,
	        contentType: 'application/json',
	        url: gridTableUrl,
	        data: JSON.stringify(param),
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	//debugger;
	        },
	        success: function (data) {
				if(data.retCode == 0){
					var reslutArr =  data.data.list;
					totalPage = data.data.totalPage;
					addTable(reslutArr);
				}
	        },
	        complete: function (XMLHttpRequest, textStatus) {
	        }
	    });
	}

	//列表填充数据
	function addTable(arrInfo) {
		$('.tabledata-box table tbody').html("");
        arrInfo.forEach((item, index) => {
            let tdInfo = '<tr>' +
                            '<td>' + item.name + '</td>' +
                            '<td>' + (item.type == '1' ? '菜单' : '操作') + '</td>';
            				if(item.type == '2'){
            					tdInfo += '<td>' + (item.handleType == 1 ? '添加' : (item.handleType == 2 ? '编辑' : '删除') ) + '</td>';
            				}else{
            					tdInfo += '<td></td>';
            				}
            				tdInfo += '<td>';
            					if(item.type == '1'){
            						tdInfo += '<i onclick="openMenuDialog(\''+item.id+'\')" class="qyhicon_edit tableEdit"></i>'+
            								  '<i onclick="removeMenu(\''+item.id+'\')" class="qyhicon_delete tableDel"></i>';
            					}else if(item.type == '2'){
            						tdInfo += '<i onclick="openEditHandDialog(\''+item.id+'\')" class="qyhicon_edit tableEdit"></i>'+
  								  			  '<i onclick="deleteHandRows(\''+item.id+'\')" class="qyhicon_delete tableDel"></i>';
            					}
            tdInfo +=       '</td>' +
                        '</tr>';
            $('.tableBox table').eq(0).append(tdInfo)
        });
    }
	//底部页码
	function paginationInit(totalPage){
		$("#myPage").pagination(totalPage, {
	        num_edge_entries: 1, //边缘页数
	        num_display_entries: (totalPage > 4 ? 4 : totalPage), //主体页数
	        callback: pageselectCallback,
	        items_per_page:1, //每页显示1项
	        prev_show_always:false,
	        next_show_always:false,
	    });
	}
	
	function pageselectCallback(page_index, jq){
    	if(jq.length != undefined){
    		tableInit(page_index+1);
    	}
    }
	
    //打开编辑界面
    function openMenuDialog(id, parentId, parentName){
    	var url = "/view/basemanage/menu/sysmenuedit.html?id="+id+"&parentId="+parentId+"&parentName="+parentName;
    	
    	var width = 780;
        var height =   510;
        var title = "更新菜单";
        openDialog(null, url, width, height, title);
    }
    
	function openSaveHandDialog() {
		var url = '/view/basemanage/menu/syshandedit.html?id=' + '&dictId=' + $("#dictId").val();
		var width = 780;
		var height = 490;
		var title = "新增操作信息";
		openDialog(null, url, width, height, title);
  	}
  
	//打开信息界面
    function openEditHandDialog(id){
    	var url = '/view/basemanage/menu/syshandedit.html?id=' + id;
		var width = 780;
		var height = 490;
		var title = "编辑操作信息";
		openDialog(null, url, width, height, title);
    }
    
	
   //删除菜单
	function removeMenu(id){
		var url = roadPath + '/family/menu/delete';
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
            	$.ajax({
            		type: 'POST',
                    url:url,
                    data:JSON.stringify({'id':id}),
                    contentType: 'application/json',
                    async : false, // 是否同步
                    success:function(data){
                        $.util.toastr.success('删除成功');
                        optionCookie(data.authorToke);
                        //删除
                        var nodes = dictTree.getNodesByParam("id", id);
                        dictTree.removeNode(nodes[0]);
                        
                        swal({
                            title : "",
                            timer : 0
                        });
                        return true;
                    }
                });
                
            }
        );
        return false;
	}
	
    //删除数据
    function deleteHandRows(id){
        var delUrl = roadPath + '/family/menu/delete';
        del(delUrl, "dataGrid", id, function(){
        	refurshTable();
        });
    }
    function refurshTable(){
	   	 //数据获取
	   	tableInit(1);
	   	//table下端的页码
	   	paginationInit(totalPage);
    }
    function refreshTableAndTree(){
    	initMenuTree();
    }
    function reset(){
    	$("#name").val('');
    }