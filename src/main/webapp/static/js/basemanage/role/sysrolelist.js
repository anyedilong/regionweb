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
	refurshTable();
});

	//从后台获取第一页的数据
	function tableInit(pageNo){
		
	    var param = new Object();
	    var page = new Object();
	    page.pageSize = 10;
	    page.pageNum = pageNo;
	    param.page = page;
	    param.roleName = $("#roleName").val();
	    
		var gridTableUrl = roadPath + '/family/role/getRolePage';
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
	                        '<td>' + item.roleName + '</td>' +
	                        '<td>' + item.orgName + '</td>' +
	                        '<td>' + item.remarks + '</td>' +
	                        '<td>' + (item.status == '1' ? '正常' : (item.status == '2' ? '冻结' : '删除')) + '</td>' +
	                        '<td>' +
	                            '<i onclick="openEditDialog(\''+item.id+'\');" class="qyhicon_edit tableEdit"></i>';
				        if(item.status=='1'){
							tdInfo += '<i onclick="openAuthorizeDialog(\''+item.id+'\');" class="qyhshouquan tableEdit"></i>';
						}
				        tdInfo += '<i onclick="deleteRows(\''+item.id+'\');" class="qyhicon_delete tableDel"></i>';
	        			
	             tdInfo += '</td>' +
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

    function openSaveDialog() {
		var url = '/view/basemanage/role/sysroleedit.html?id=' + '';
		var width = 780;
		var height = 490;
		var title = "新增角色信息";
		openDialog(null, url, width, height, title);
  	}
  
	//打开信息界面
    function openEditDialog(id){
    	var url = '/view/basemanage/role/sysroleedit.html?id=' + id;
		var width = 780;
		var height = 490;
		var title = "编辑角色信息";
		openDialog(null, url, width, height, title);
    }
    
  	//删除数据
    function deleteRows(id){
    	var delUrl = roadPath + '/family/role/delete';
        del(delUrl, "dataGrid", id, function(){
        	refurshTable();
        });
    }
    
    //打开角色授权界面
    function openAuthorizeDialog(id,btnEle){
    	var url = '/view/basemanage/role/sysroleauthorize.html?id=' + id;
		var width = 780;
		var height = 490;
		var title = "角色授权";
		openDialog(null, url, width, height, title);
    }
    
    function refurshTable(){
	   	 //数据获取
	   	tableInit(1);
	   	//table下端的页码
	   	paginationInit(totalPage);
    }
    function reset(){
    	$("#roleName").val('');
    }