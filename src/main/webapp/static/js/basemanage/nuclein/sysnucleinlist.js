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
	    param.orgName = $("#orgName").val();
	    param.orgCode = $("#orgCode").val();
	    param.sfzh = $("#sfzh").val();
	    param.residentName = $("#residentName").val();
	    
		var gridTableUrl = roadPath + '/family/poct/getNucleinResultPage';
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
	                        '<td>' + item.sfzh + '</td>' +
	                        '<td width="100px">' + item.residentName + '</td>' +
	                        '<td width="100px">' + item.xb + '</td>' +
	                        '<td width="100px">' + item.nl + '</td>' +
	                        '<td>' + item.jtzz + '</td>';
	        				if(item.proDesc == '阳性'){
	        					tdInfo += '<td width="100px" style="color:#FF8F24 !important;">' + item.proDesc + '</td>'
	        				}else{
	        					tdInfo += '<td width="100px">' + item.proDesc + '</td>'
	        				}
	        				
	        	  tdInfo += '<td>' + item.checkTime + '</td>' +
	                        '<td>' + item.orgName + '</td>' +
	                        '<td>' + item.doctorName + '</td>' +
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
	    
    function refurshTable(){
	   	 //数据获取
	   	tableInit(1);
	   	//table下端的页码
	   	paginationInit(totalPage);
    }
    function reset(){
    	$("#orgName").val('');
    	$("#orgCode").val('');
    	$("#sfzh").val('');
    	$("#residentName").val('');
    }