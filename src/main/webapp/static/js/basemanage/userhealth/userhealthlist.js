var totalPage;
$(function () {
	//查询按钮
	$(document).on('click', ".search",function(){
		refurshTable();
	});
	//重置按钮
	$(document).on('click', ".reset",function(){
		reset();
	});
	//初始化机构树
    initOrgTree();
});

	//从后台获取第一页的数据
	function tableInit(pageNo){
		
	    var param = new Object();
	    var page = new Object();
	    page.pageSize = 10;
	    page.pageNum = pageNo;
	    param.page = page;
	    param.doctorName = $("#doctorName").val();
	    
		var gridTableUrl = roadPath + '/family/userHealth/getUserHealthPage';
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
	                        '<td>' + item.doctorName + '</td>' +
	                        '<td>' + item.orgName + '</td>' +
	                        '<td>' + item.depName + '</td>' +
	                        '<td>' + item.role + '</td>' +
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
                    hideTree();
                    refurshTable();
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
        if (event.target.id.indexOf('orgTree') == -1){
            if(event.target.id != 'selectDevType'){
                hideTree();
            }
        }
    }
    function refurshTable(){
	   	 //数据获取
	   	tableInit(1);
	   	//table下端的页码
	   	paginationInit(totalPage);
    }
    function reset(){
    	$("#doctorName").val('');
    }