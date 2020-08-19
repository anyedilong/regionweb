$(function () {
	
	//查询按钮
	$(document).on('click', ".search",function(){
		refurshTable();
	});
	//重置按钮
	$(document).on('click', ".reset",function(){
		reset();
	});
	initOrgTree();
	$('#checkDiv').click(function () {
		if ($(this).attr('act') == 'false') {
			$(this).attr('act', 'true')
			$(this).addClass('chekact')
		} else {
			$(this).attr('act', 'false')
			$(this).removeClass('chekact')
		}
	})
});
	
	//从后台获取第一页的数据
	function tableInit(pageNo){
		
	    var param = new Object();
	    var page = new Object();
	    page.page_size = 10;
	    page.page_no = pageNo;
	    param.page = page;
	    param.name = $("#name").val();
	    param.username = $("#username").val();
	    param.orgId = $("#orgId").val();
	    // param.isCludeSubFlg = ($("#includeSubFlg")[0].checked ? "1" : "");
	    param.isCludeSubFlg = ($('#checkDiv').attr('act') == 'true' ? "1" : "");
	    
		var gridTableUrl = roadPath + '/family/user/getUserPage';
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
	                        '<td>' + item.username + '</td>' +
	                        '<td>' + item.name + '</td>' +
	                        '<td>' + item.roleNames + '</td>' +
	                        '<td>' + (item.status == '1' ? '正常' : "冻结") + '</td>' +
	                        '<td>' +
	                            '<i onclick="openEditDialog(\''+item.id+'\')" class="qyhicon_edit tableEdit"></i>' +
	                            '<i onclick="deleteHandRows(\''+item.id+'\')" class="qyhicon_delete tableDel"></i>' +
	                        '</td>' +
	                    '</tr>'
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

	//初始化机构树
    function initOrgTree(){
    	var initOrgUrl = roadPath + '/family/org/queryOrgList';
    	
    	$.ajax({
    		type: 'POST',
            async: false,
            url: initOrgUrl,
            contentType: 'application/json',
            success:function(data){
            	if(data.retCode == 0){
            		optionCookie(data.authorToke);
            		data = data.data;
            	}
                if($.util.isNull(data)){
                    data = [];
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
                    callback : {
                        onClick:function(event, treeId, treeNode){
                        	//如果有下级 ，则不做操作
                            $("input[name=orgId]").val(treeNode.id);
                            refurshTable();
                        }
                    }
                };

                var orgTree = $.fn.zTree.init($("#menuTree"), setting, data);
                var node = orgTree.getNodesByFilter(function (node) { return node.level == 0 }, true);
                $("input[name=orgId]").val(node.id);
                orgTree.expandAll(true); 
                refurshTable();
            }
        });
    }
	
	function openSaveDialog() {
		var url = '/view/basemanage/user/sysuseredit.html?id=';
		var width = 780;
		var height = 490;
		var title = "新增用户信息";
		openDialog(null, url, width, height, title);
  	}
  
	//打开信息界面
    function openEditDialog(id){
    	var url = '/view/basemanage/user/sysuseredit.html?id=' + id;
		var width = 780;
		var height = 490;
		var title = "编辑用户信息";
		openDialog(null, url, width, height, title);
    }
	
    //删除数据
    function deleteHandRows(id){
        var delUrl = roadPath + '/family/user/delete';
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
    function reset(){
    	$("#username").val('');
    	$("#name").val('');
    	//$("#includeSubFlg").attr({"checked":true});
    	$('#checkDiv').attr('act', 'false')
    	$('#checkDiv').removeClass('chekact')
    }