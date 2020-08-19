$.util = {
	basePath:'',
	toastr:{
		success:function(title,content){

			toastr.options = {
			  "closeButton": true,
			  "debug": false,
			  "progressBar": true,
			  "positionClass": "toast-bottom-right",
			  "onclick": null,
			  "showDuration": "400",
			  "hideDuration": "1000",
			  "timeOut": "3000",
			  "extendedTimeOut": "1000",
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			}
			var $toast = toastr['success'](content, title);
			if ($toast.find("#okBtn").length) {
				$toast.delegate("#okBtn", "click",
				function() {
					alert("you clicked me. i was toast #" + toastIndex + ". goodbye!");
					$toast.remove()
				})
			}
			if ($toast.find("#surpriseBtn").length) {
				$toast.delegate("#surpriseBtn", "click",
				function() {
					alert("Surprise! you clicked me. i was toast #" + toastIndex + ". You could perform an action here.")
				})
			}
			
		}
	},
	//验证header
	rsa:function (obj) {
        var PUBLIC_KEY ='MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCM6x0Lukj2FBhZ+FDMne1+xfU7kIihiLHdEtXwYiKE+WevhD+LCkBMfJuFqNNt3G2cTCK6QEAt0ZR39PzJPq7yOdHaNChbqOF6WIzviZH8CQ3LuTAs0s50S6OeDnfX1PT2Q3PWf3+pq4xXX6FvB2f3D2m5Lt2p18UwHKB9Q6n5zQIDAQAB';
        var encrypt = new JSEncrypt();
        //encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');
        encrypt.setPublicKey(PUBLIC_KEY);
        var encrypted = encrypt.encrypt(obj);
        return encrypted;
    },
	// 验证是否为空
	isNull : function(obj) {
		if (obj == null || obj == '' || typeof (obj) == "undefined" ||obj=='null' ||obj=='undefined'
				) {
			return true;
		}
		return false;
	},
	// AJAX提交
	ajax : function(options) {
		
		new myAjax(options);
		function myAjax(options){
			var loginUrl = $.util.basePath+'/login';
			var opts = $.extend({}, $.util.ajaxParam, options);// 获取参数

			$.ajax({
				type : opts.type,
				url : opts.url,
				data : opts.contentType === 'application/json'?JSON.stringify(opts.data) : opts.data, 
				cache : opts.cache,
				async : opts.async,
				dataType : "json",
				success : function(data) {

					// 验证 用户身份信息是否正确
					var code = data.code;
					var message = data.message;
					if (code == 200) {
						// 验证 用户请求是否d正确
						var result = data.result;
						var retCode = result.retCode;
						var retMsg = result.retMsg;
						// 返回数据
						if (0 == retCode) {
							opts.success(data.data);
							//return data.data;
						} else {
							swal("操作失败", retMsg, "error");
						}

					} else {
						// 需要重新登录
						var username = $.cookie('userunick');
						if ($.util.isNull(username)) {
							//alert(loginUrl)
							//跳转登陆界面
							location.href = loginUrl;
						} else {
							//打开登陆窗口进行登录
							top.window.parent.openLoginDialog();
							return ;
						}
					}

				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					// 验证 用户身份信息是否正确
					var data = JSON.parse(XMLHttpRequest.responseText); //可以将json字符串转换成json对象 
					
					// 验证 用户身份信息是否正确
					var code = data.code;
					var message = data.message;
					if (code == 200) {
						// 验证 用户请求是否d正确
						var result = data.result;
						var retCode = result.retCode;
						var retMsg = result.retMsg;
						// 返回数据
						if (0 == retCode) {
							opts.success(data.data);
							//return data.data;
						} else {
							swal("操作失败", retMsg, "error");
						}

					} else {
						// 需要重新登录
						var username = $.cookie('userunick');
						if ($.util.isNull(username)) {
							//alert(loginUrl)
							//跳转登陆界面
							location.href = loginUrl;
						} else {
							//打开登陆窗口进行登录
							top.window.parent.openLoginDialog();
							return ;
						}
					}
				}
			});

		}
	},
	getUrlParam : function(name){
		 var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if (r != null) return decodeURI(r[2]); return null;

	},
	// ajax参数
	ajaxParam : {
		type : "POST",// 类型
		dataType : "json",// 返回值类型
		data : {},// 参数
		url : "",
		contentType : 'application/json',
		cache : false, // 是否缓存
		async : true, // 是否同步
		success : function(data) {// 成功
		},
		error : function() {// 失败
		}
	}

};

(function ($) {
	//ztree下拉
	$.fn.downZtree = function(){
		var ele = this;
		var eleId = $(ele).attr("id");
		var divWidth = $(ele).find("input").width();
		$(ele).find(".selTree").width(divWidth+24);
		$(ele).find("input").click(function(){
			$(ele).find(".selTree").removeClass("hd");
		});
		
		$("body").bind("mousedown", function(event){
			if (!(event.target.id == eleId || $(event.target).parents("#"+eleId).length>0)) {
				$(ele).find(".selTree").addClass("hd");
			}
		});
	};
	
	//json绑定form
	$.fn.setForm = function(jsonValue){
		  var obj = this;
		  $.each(jsonValue,function(name,ival){
		    var $oinput = obj.find("input[name="+name+"]");
		    if($oinput.attr("type")=="checkbox"){
		      if(ival !== null){
		        var checkboxObj = $("[name="+name+"]");
		        var checkArray = ival.split(";");
		        for(var i=0;i<checkboxObj.length;i++){
		          for(var j=0;j<checkArray.length;j++){
		            if(checkboxObj[i].value == checkArray[j]){
		              checkboxObj[i].click();
		              $(checkboxObj[i]).iCheck('check');
		            }
		          }
		        }
		      }
		    }
		    else if($oinput.attr("type")=="radio"){
		      $oinput.each(function(){
		        var radioObj = $("[name="+name+"]");
		        for(var i=0;i<radioObj.length;i++){
		          if(radioObj[i].value == ival){
		            radioObj[i].click();
		          }
		        }
		      });
		    }
		    else if($oinput.attr("type")=="textarea"){
		      obj.find("[name="+name+"]").html(ival);
		    }
		    else{
		      obj.find("[name="+name+"]").val(ival);
		    }
		  })
		}
	
	// 定义插件
	//可关闭的标签页
	$.fn.closableTag = function(options){
		
		opts = $.extend({}, $.fn.closableTag_defaultsOptions, options);
		var timestamp = new Date().getTime();
		var contentPrefix = "CLOSABLETAG_CONTENT_"+timestamp;
		//内容ID前缀
		//标签ID前缀
		var barPrefix = "CLOSABLETAG_BAR_"+timestamp;
		
		//展示内容元素
		var contentEle = $("#"+opts.contentEle);
		
		var tags = {
				//初始化
				opts: opts,
				tagBar:this,
				contentEle:contentEle,
				contentPrefix:contentPrefix,
				barPrefix:barPrefix,
				colose:function(id){
					
				},//根据ID关闭
				coloseAll:function(){
					
				},//关闭全部
				add:function(tagItems){
					//添加参数
					
					addItem(this,tagItems);
				}//添加
		}
		
		//初始化 开始
		function init(){
			//TODO 执行事件
			
			//是否存在标签
			var tagItems = opts.tabItem;
			if(!$.util.isNull(tagItems)){
				addItems(tags,tags.tagBar,tagItems);
			}
			
			//给标签添加事件
//			$(this).on("","",function(){
//				
//			});
		}
		init();
		
		//添加
		function addItems(tags,tagBarPraent,tagItems){
			var tagBar = tagBarPraent;
			if($.util.isNull(tagBar)){
				tagBar = tags.tagBar;
			}
			var tagContent = tags.contentEle;
			 //拼接列表数据
	        var barhtml = [];
	        var contenthtml = [];
	        
	        //内容ID前缀
			var contentPrefix = tags.contentPrefix;
			//标签ID前缀
			var barPrefix = tags.barPrefix;
			
	        getAddItemsHtml(barhtml,contenthtml,tagItems,contentPrefix,barPrefix);
	        
	        $(tagBar).append(barhtml.join(''));
	        $(tagContent).append(contenthtml.join(''));
		}
		
		function getAddItemsHtml(barhtml,contenthtml,tagItems,contentPrefix,barPrefix){
			if(!$.util.isNull(tagItems)){
				//遍历添加标签页
				$.each(tagItems, function (i, tagItem) {
					var addOpts = $.extend({}, $.fn.closableTag_add_defaultsOptions, tagItems);
					//验证 是否下级
					var childrenItems = tagItem.children;
					if(!$.util.isNull(childrenItems) && childrenItems.length > 0){
						var itemBarParentId = barPrefix+tagItem.id
						if(!$('#'+itemBarParentId)[0]){
							//含有下级
							barhtml.push(' <li class="dropdown" data-id="tagItem.id"> ');
							barhtml.push(' 	<a href="#" id="'+itemBarParentId+'" class="dropdown-toggle"  ');
							barhtml.push(' 	   data-toggle="dropdown">'+tagItem.name);
							barhtml.push(' 		<b class="caret"></b> ');
							barhtml.push(' 	</a> ');
							barhtml.push(' 	<ul class="dropdown-menu" role="menu" aria-labelledby="'+itemBarParentId+'" > ');
							
							getAddItemsHtml(barhtml,contenthtml,tagItem.children,contentPrefix,barPrefix)
							
							barhtml.push(' 	</ul> ');
							barhtml.push(' </li> ');
							
						}
					}else{
						//不包含下级
						addItemHtml(barhtml,contenthtml,tagItem,contentPrefix,barPrefix)
					}
				});
			}
		}
		
		function addItemHtml(barhtml,contenthtml,tagItem,contentPrefix,barPrefix){
			//执行事件
			var itemBarId = barPrefix+tagItem.id
			var itemContentId = contentPrefix+tagItem.id
			
			if(!$('#'+itemBarId)[0]){
				barhtml.push(' 		<li id="'+itemBarId+'"><a href="#'+itemContentId+'" data-id="tagItem.id" data-toggle="tab">'+tagItem.name+'</a></li> ');
				if(!$('#'+itemContentId)[0]){
					//内容
					contenthtml.push(' <div data-id="tagItem.id" class="tab-pane fade" id="'+itemContentId+'"> ');
					
					if(!$.util.isNull(tagItem.url)){
						var ifarmeId = itemContentId+'_IFRAME ';
						//如果为路径，则ifarme 嵌套
						contenthtml.push(' <iframe src="'+tagItem.url+'" id="tab_frame_2" frameborder="0" ');
						contenthtml.push(' 		style="overflow-x: hidden; overflow-y: hidden;width:100%;height: 100%" '); 
						contenthtml.push(' 		onload="closableTag.frameLoad(this)"></iframe> ');
					}else{
						//内容
						contenthtml.push(tagItem.content);
					}
					
					contenthtml.push(' </div> ');
				}
			}
			
		}
		
		function addItem(tags,tagBarPraent,tagItem){
			 //拼接列表数据
			var tagBar = tagBarPraent;
			if($.util.isNull(tagBar)){
				tagBar = tags.tagBar;
			}
			var tagContent = tags.contentEle;
			 //拼接列表数据
	        var barhtml = [];
	        var contenthtml = [];
	        
	        //内容ID前缀
			var contentPrefix = tags.contentPrefix;
			//标签ID前缀
			var barPrefix = tags.barPrefix;
			
			addItemHtml(barhtml,contenthtml,tagItem,contentPrefix,barPrefix);
	        
	        $(tagBar).append(barhtml.join(''));
	        $(tagContent).append(contenthtml.join(''));
		}
		
		return tags;
	}
	
	//可关闭的标签页默认配置
	$.fn.closableTag_defaultsOptions = {
		contentEle:'',//显示内容元素
//		openBefore:function(){},//打开前执行
//		openAfter:function(){},//打开后执行
//		closeBefore:function(){},//关闭前执行
//		closeAfter:function(){},//关闭后执行
//		onClick:function(){},//点击时执行
		tabItem:[]
	};
	$.fn.closableTag_add_defaultsOptions = {
		id:'',//标签唯一标志ID
		name:'',//标签名称
		url:'',//地址
		content:'',//内容
		closable:true,//是否可以关闭
		children:[],//子集
//		openBefore:function(){},//打开前执行
//		openAfter:function(){},//打开后执行
//		closeBefore:function(){},//关闭前执行
//		closeAfter:function(){},//关闭后执行
//		onClick:function(){}//点击时执行
	};

	
	
	
    // 闭包结束    
})(jQuery);

