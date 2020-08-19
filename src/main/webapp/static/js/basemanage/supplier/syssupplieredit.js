var id;
var menuId;
$(function(){
	id = $.util.getUrlParam('id');
    menuId = $.util.getUrlParam('menuId');
    if(!$.util.isNull(id)){
        initData(id);
    }
});
    
  	//初始化数据
    function initData(id){
        //查询数据，绑定到元素
        var showUrl = roadPath + '/family/supplier/show';
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
    	if(initValidate("供应商名称", $("#name").val()) && initValidate("供应商编号", $("#code").val())
    			&& initValidate("地址", $("#address").val()) && initValidate("联系方式", $("#phone").val())){
    		var saveUrl = roadPath + '/family/supplier/save';
        	save(saveUrl, 'saveForm', function(){
        		parent[1].parent[0].refurshTable();
                parent[1].parent[0].closeDialog(menuId);
            });
    	} 
    }