var id;
var menuId;
$(function(){
	id = $.util.getUrlParam('id');
    menuId = $.util.getUrlParam('menuId');
    if(!$.util.isNull(id)){
        initData(id);
    }
    var dictId = $.util.getUrlParam('dictId');
    if(!$.util.isNull(dictId)){
    	$("#saveForm input[name=dictId]").val(dictId);
    }
});
    
  	//初始化数据
    function initData(id){
        //查询数据，绑定到元素
        var showUrl = roadPath + '/family/dict/showSub';
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
    	if(initValidate("字典名称", $("#text").val()) && initValidate("字典值", $("#value").val())){
    		var saveUrl = roadPath + '/family/dict/saveSub';
        	save(saveUrl, 'saveForm', function(){
                parent[1].parent[0].refurshTable();
                parent[1].parent[0].closeDialog(menuId);
            }); 
    	}
    }