var id;
var menuId;
var iconDialog;
$(function(){
	//初始化菜单select
	initMenuTree($.util.getUrlParam('parentId'));
	
	//初始化数据
	id = $.util.getUrlParam('id');
	menuId = $.util.getUrlParam('menuId');
	if(!$.util.isNull(id)){
		initData(id);
	}
	
	$("#chooseIcon").on("click",function(){
		var iconUrl = '/view/basemanage/menu/sysmenuicon.html';
		iconDialog = $.dialog({
			width:600,
			height:400,
			min:false,
			max:false,
			drag:false,
			lock:true,
			zIndex:2000,
			title: '菜单图标选择',
			content: 'url:'+iconUrl
		});
	});
	
});
    
    //初始化菜单select
   function initMenuTree(parentId){
        var initMenuUrl = roadPath + '/family/menu/getmenutree';
        $.ajax({
        	type: 'POST',
            async: false,
            url: initMenuUrl,
            contentType: 'application/json',
            success:function(data){
                if(!$.util.isNull(data)){
                	optionCookie(data.authorToke);
                	data = data.data;
                    var optionHtml = [];
                    optionHtml.push(' <option selected value="0">菜单</option> ');
                    for(var i = 0; i < data.length;i++){
                        var item = data[i];
                        var value = item.id;
                        var text = item.name;
                        var level = item.menuLevel-1;
                        while (level > 0){
                            text = "&nbsp;&nbsp;&nbsp;"+text;
                            level--; 
                        }
                        if(parentId == value){
                            optionHtml.push(' <option selected value="'+value+'">'+text+'</option> ');
                        }else{
                            optionHtml.push(' <option value="'+value+'">'+text+'</option> ');
                        }
                    }
                    $("#parentId").html(optionHtml.join(''));
                }
            }
        });
    }
    
    //初始化数据
    function initData(id){
    	//查询数据，绑定到元素
    	var showUrl = roadPath + '/family/menu/show';
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
    				bindData('menuForm',data.data);
    				var iconPath = data.data.icon;
                    if(!$.util.isNull(iconPath)){
                        iconChoose(iconPath)
                    }
                    $("#menuForm select").trigger("chosen:updated"); 
    			}
            },
            complete: function (XMLHttpRequest, textStatus) {
            }
        });
    }
    
    //保存
    function saveMenu(){
    	if(initValidate("菜单名称", $("#name").val())){
    		var saveMenuUrl = roadPath + '/family/menu/save';
        	save(saveMenuUrl, 'menuForm', function(){
        		parent[1].parent[0].refreshTableAndTree();
        		parent[1].parent[0].closeDialog(menuId);
        	});
    	}
    }
    
    //关闭图标选择
    function iconDialogClose(iconPath){
    	iconChoose(iconPath);
    	iconDialog.close();
    }
    
    //菜单图标选择
    function iconChoose(iconPath){
        $("#icon").val(iconPath);
        $("#iconImg").removeClass().addClass("fa").addClass(iconPath);
    }
    
    //清除图标
    function clearIcon(){
    	$("#icon").val("");
    	$("#iconImg").removeClass().addClass("fa");
    }