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
	//初始化药品等级分类
	InitMedicantLevel();
	//初始化药品中外分类
	InitMedicantZw();
	//初始化药品基药分类
	InitMedicantBase();
});

	//从后台获取第一页的数据
	function tableInit(pageNo){
		
	    var param = new Object();
	    var page = new Object();
	    page.pageSize = 10;
	    page.pageNum = pageNo;
	    param.page = page;
	    param.startDate = $("#startDate").val();
	    param.endDate = $("#endDate").val();
	    param.name = $("#name").val();
	    param.simplePinyin = $("#simplePinyin").val();
	    param.classLevel = $("#classLevel").val();
	    param.classZw = $("#classZw").val();
	    param.classBase = $("#classBase").val();
	    
		var gridTableUrl = roadPath + '/family/medicanttype/getMedicantTypePage';
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
	                        '<td>' + item.code + '</td>' +
	                        '<td>' + item.simplePinyin + '</td>' +
	                        '<td>' + item.name + '</td>' +
	                        '<td>' + item.usage + '</td>' +
	                        '<td>' + levelCover(item.classLevel) + '</td>' +
	                        '<td>' + zwCover(item.classZw) + '</td>' +
	                        '<td>' + baseCover(item.classBase) + '</td>' +
	                        '<td>' + item.updateTime + '</td>' +
	                        '<td>' +
	                            '<i onclick="openEditDialog(\''+item.id+'\');" class="qyhicon_edit tableEdit"></i>' +
	                            '<i onclick="deleteRows(\''+item.id+'\');" class="qyhicon_delete tableDel"></i>' +
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

	function levelCover(value){
		if(value == '1'){ return '普通药品'; }
    	else if(value == '2'){ return '贵重药品'; }
    	else if(value == '3'){ return '麻醉药品'; }
    	else if(value == '4'){ return '精神一类'; }
    	else if(value == '5'){ return '毒性药品'; }
    	else if(value == '6'){ return '特殊管理药'; }
    	else if(value == '7'){ return '剧毒药品'; }
	}
	
	function zwCover(value){
		if(value == '1'){ return '中成药'; }
    	else if(value == '2'){ return '中草药'; }
    	else if(value == '3'){ return '西药'; }
	}
	
	function baseCover(value){
		if(value == '1'){ return '国家基药'; }
    	else if(value == '2'){ return '国家常药'; }
    	else if(value == '3'){ return '省挂网'; }
    	else { return '非基药'; }
	}
	
	function openSaveDialog() {
		var url = '/view/basemanage/medicant/medicantdictedit.html?id=' + '';
		var width = 780;
		var height = 490;
		var title = "新增药品信息";
		openDialog(null, url, width, height, title);
  	}
  
	//打开信息界面
    function openEditDialog(id){
    	var url = '/view/basemanage/medicant/medicantdictedit.html?id=' + id;
		var width = 780;
		var height = 490;
		var title = "编辑药品信息";
		openDialog(null, url, width, height, title);
    }
    
    //删除数据
    function deleteRows(id){
        var delUrl = roadPath + '/family/medicanttype/delete';
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
    //初始化药品等级分类
    function InitMedicantLevel(){
    	$.ajax({
	        type: 'POST',
	        dataType: "json",
	        async: false,
	        contentType: 'application/json',
	        url: roadPath + '/family/dict/querySubListByDictId',
	        data: JSON.stringify({"dictId":"6c04eae171384f2db304b685ea5018a9"}),
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	//debugger;
	        },
	        success: function (data) {
				if(data.retCode == 0){
					var list = data.data;
					var optStr = "<option value=''>请选择</option>";
					$("#classLevel").html('');
					for(let i = 0; i < list.length; i++){
						optStr += "<option value='"+list[i].value+"'>"+list[i].text+"</option>";
					}
					$("#classLevel").append(optStr);
				}
	        },
	        complete: function (XMLHttpRequest, textStatus) {
	        }
	    });
    }
   //初始化药品中外分类
    function InitMedicantZw(){
    	$.ajax({
	        type: 'POST',
	        dataType: "json",
	        async: false,
	        contentType: 'application/json',
	        url: roadPath + '/family/dict/querySubListByDictId',
	        data: JSON.stringify({"dictId":"32dfd68205f8488fb867f4a641813645"}),
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	//debugger;
	        },
	        success: function (data) {
				if(data.retCode == 0){
					var list = data.data;
					var optStr = "<option value=''>请选择</option>";
					$("#classZw").html('');
					for(let i = 0; i < list.length; i++){
						optStr += "<option value='"+list[i].value+"'>"+list[i].text+"</option>";
					}
					$("#classZw").append(optStr);
				}
	        },
	        complete: function (XMLHttpRequest, textStatus) {
	        }
	    });
    }
    //初始化药品基药分类
    function InitMedicantBase(){
    	$.ajax({
	        type: 'POST',
	        dataType: "json",
	        async: false,
	        contentType: 'application/json',
	        url: roadPath + '/family/dict/querySubListByDictId',
	        data: JSON.stringify({"dictId":"4ffff0bff80e406dbd7c36eee66643f7"}),
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	//debugger;
	        },
	        success: function (data) {
				if(data.retCode == 0){
					var list = data.data;
					var optStr = "<option value=''>请选择</option>";
					$("#classBase").html('');
					for(let i = 0; i < list.length; i++){
						optStr += "<option value='"+list[i].value+"'>"+list[i].text+"</option>";
					}
					$("#classBase").append(optStr);
				}
	        },
	        complete: function (XMLHttpRequest, textStatus) {
	        }
	    });
    }
    
    function reset(){
    	$("#startDate").val('');
    	$("#endDate").val('');
    	$("#name").val('');
    	$("#simplePinyin").val('');
    	var select = 'dd[lay-value=""]';// 设置value
    	$('#classLevel').siblings("div.layui-form-select").find('dl').find(select).click();// 查找点击
    	layui.form.render('select');// 再次渲染select
    }