var dialogSet = {};
//打开弹出窗
function openDialog(id,url,width,height,title){
	if($.util.isNull(id)){
		id = new Date().getTime(); 
	}
	var param = 'menuId='+id+'&';
	if(url.indexOf("?") >= 0){
		url += "&"+param ;
	}else{
		url += "?"+param ;
	}
	var dialogId = 'dialog_'+id;
	dialogSet[id] = dialogId;
	$.dialog({
		'id':dialogId,
		'content':'url:'+url,
		'width':width,
		'height':height,
		'title':title,
		'lock':true
	});
}

//关闭弹出窗
function closeDialog(id,closeAfter){
	$.dialog({id:dialogSet[id]}).close();
	
	closeAfter; 
}

//保存
function save(url, formId, saveAfter, param){
	if($("#"+formId).valid()){
		var json = $('#'+formId).serializeJSON(); 
		var jsonNew;
		if($.util.isNull(param)){
			jsonNew = json;
		}else{
			jsonNew = $.extend({},json,param);
		}
		var submitUrl = url;
		$.ajax({
	        type: 'POST',
	        async: false,
	        url: submitUrl,
	        contentType: 'application/json',
	        data: JSON.stringify(jsonNew),
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	//debugger;
	        },
	        success: function (data) {
				if(data.retCode == 0){
					parent[1].parent[0].$.util.toastr.success('保存成功');
					optionCookie(data.authorToke);
					saveAfter(data);
				}else{
					swal({
			            title: data.retMsg,
			            type: "warning",
			            showConfirmButton: false,
			            showCancelButton: false,
			            height: 10,
			            timer:1000
			        });
				}
	        },
	        complete: function (XMLHttpRequest, textStatus) {
	        }
	    });
	}
}

//删除
function del(url, tableId, idField, deleteAfter){
	
	if($.util.isNull(idField)){
		swal("请选择需要删除行", "", "warning");
	}
	//删除提示
	swal({   
		title: "确认是否删除?",
		text: "删除后的数据将无法查看",
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "删除",   
		cancelButtonText:"取消",
		closeOnConfirm: false }, 
		function(){   
			/*$.util.ajax({
				url:url,
				data:{'id' : idField},
	            async : false, // 是否同步
				success:function(data){
					$.util.toastr.success('删除成功');
					deleteAfter();
					swal({
						title : "",
						timer : 0
					});
				}
			});*/
			$.ajax({
		        type: 'POST',
		        async: false,
		        url: url,
		        contentType: 'application/json',
		        data: JSON.stringify({"id":idField}),
		        error: function (XMLHttpRequest, textStatus, errorThrown) {
		        	//debugger;
		        },
		        success: function (data) {
					if(data.retCode == 0){
						$.util.toastr.success('删除成功');
						optionCookie(data.authorToke);
						deleteAfter();
						swal({
							title : "",
							timer : 0
						});
					}
		        },
		        complete: function (XMLHttpRequest, textStatus) {
		        }
		    });
		}
	);
}

//绑定数据
function bindData(formId,data){
	$('#'+formId).setForm(data);
	$("select").trigger("chosen:updated"); 
}

//绑定详情界面
function bindShowData(data){
	$(".show-data").each(function(index,ele){
		var eleName = $(this).attr("data-name");
		var eleData  = [];
		if(!$.util.isNull(data) && !$.util.isNull(eleName)){
			var nameArray = eleName.split(".");
			getShowData(data,nameArray,0,eleData)
		}
		$(this).html(eleData.join(','));
	})
}

function getShowData(data,nameArray,nameIndex,value){
	//验证是否为集合
	if(!$.util.isNull(data)){
		//验证是否为集合
		if(typeof(data) == 'object' && data.length > 0 ){
			for(var i = 0 ; i < data.length ; i++){
				getShowData(data[i],nameArray,nameIndex,value);
			}
		}else{
			var name = nameArray[nameIndex]; 
			var dataItem = data[name];
			
			if((nameIndex+1) >= nameArray.length ){
				if(!$.util.isNull(dataItem)){
					value.push(dataItem);
				}
			}else{
				getShowData(dataItem,nameArray,nameIndex+1,value);
			}
		}
	}
}

//设置form只读
function setReadonly(formId){
	$('#'+formId).find('input,textarea,select').not('').attr('readonly',true);
}

//初始化数据校验
function initValidate(name, value){
	if($.util.isNull(value)){
		swal({
            title: name + "为必填项!",
            type: "warning",
            showConfirmButton: false,
            showCancelButton: false,
            height: 10,
            timer:1000
        });
		return false;
	}
	return true;
}

//charts 数据视图的table拼接
function getTableCharts(opt, typeName){
    var axisData = opt.xAxis[0].data;//获取图形的data数组
    var series = opt.series;//获取series
    var num = 0;//记录序号
    var sum = new Array();//获取合计数组（根据对应的系数生成相应数量的sum）
    for(var i=0; i<series.length; i++){
        sum[i] = 0;
    }
    var table = '<table class="bordered"><thead><tr>'
        + '<th>'+typeName+'</th>';
    for(var i=0; i<series.length;i++){
        table += '<th>'+series[i].name+'</th>'
    }
    table += '</tr></thead><tbody>';
    for (var i = 0, l = axisData.length; i < l; i++) {
        num += 1;
        for(var n=0;n<series.length;n++){
            if(series[n].data[i]){
                sum[n] += Number(series[n].data[i]);
            }else{
                sum[n] += Number(0);
            }

        }
        table += '<tr><td>' + axisData[i] + '</td>';
        for(var j = 0; j < series.length; j++){
            if(series[j].data[i]){
                table += '<td>' + series[j].data[i] + '</td>';
            }else{
                table += '<td>' + 0 + '</td>';
            }

        }
        table += '</tr>';
    }
    //最后一行加上合计
    table += '<tr><td>合计</td>';
    for(var n = 0;n < series.length; n++){
        if(String(sum[n]).indexOf(".")>-1)
            table += '<td>' + (Number(sum[n])).toFixed(2)  + '</td>';
        else
            table += '<td>' + Number(sum[n])  + '</td>';
    }
    table += '</tbody></table>';
    return table;
}
//得到uuid字符串
function getUuid() {
    var len = 32;//32长度
    var radix = 16;//16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if(len) {
      for(i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for(i = 0; i < 36; i++) {
        if(!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }
