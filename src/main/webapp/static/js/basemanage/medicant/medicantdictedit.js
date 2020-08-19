var id;
var menuId;
$(function(){
	id = $.util.getUrlParam('id');
    menuId = $.util.getUrlParam('menuId');
    if(!$.util.isNull(id)){
        initData(id);
    }
    //初始化药品分类
    InitMedicantClassify();
});
    
  	//初始化数据
    function initData(id){
        //查询数据，绑定到元素
        var showUrl = roadPath + '/family/medicanttype/show';
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
    	if(initValidate("药品名称", $("#name").val()) && initValidate("药品简拼", $("#simplePinyin").val()) &&
    			initValidate("药品编号", $("#code").val())){
    		var saveUrl = roadPath + '/family/medicanttype/save';
        	save(saveUrl, 'saveForm', function(){
                parent[1].parent[0].refurshTable();
                parent[1].parent[0].closeDialog(menuId);
            });
    	} 
    }
    //初始化药品分类
    function InitMedicantClassify(){
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
					let list = data.data;
					let optStr = "";
					
					for(let i = 0; i < list.length; i++){
						optStr += "<option value='"+list[i].value+"'>"+list[i].text+"</option>";
					}
					$("#classLevel").append(optStr);
				}
	        },
	        complete: function (XMLHttpRequest, textStatus) {
	        }
	    });
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
					let list = data.data;
					let optStr = "";
					
					for(let i = 0; i < list.length; i++){
						optStr += "<option value='"+list[i].value+"'>"+list[i].text+"</option>";
					}
					$("#classZw").append(optStr);
				}
	        },
	        complete: function (XMLHttpRequest, textStatus) {
	        }
	    });
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
					let list = data.data;
					let optStr = "";
					
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