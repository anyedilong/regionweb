var id;
var menuId;
$(function(){
	id = $.util.getUrlParam('id');
    menuId = $.util.getUrlParam('menuId');
    if(!$.util.isNull(id)){
        initData(id);
    }else{
    	  var parentId = $.util.getUrlParam('parentId');
          if(!$.util.isNull(parentId)){
              $("#saveForm input[name=parentId]").val(parentId);
          }
    }
    
});
    
  	//初始化数据
    function initData(id){
        //查询数据，绑定到元素
        var showUrl = roadPath + '/family/dict/show';
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
    	if(initValidate("字典名称", $("#name").val()) && initValidate("字典编码", $("#code").val())){
    		var saveUrl = roadPath + '/family/dict/save';
        	save(saveUrl, 'saveForm', function(){
                parent[1].parent[0].initDictTree();
                parent[1].parent[0].closeDialog(menuId);
            }); 
    	}
    }