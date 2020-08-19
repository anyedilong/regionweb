var isLogin = true;
//var roadPath = "http://demo.sdboletong.com:8098/region";
var roadPath = "http://10.2.0.36:8180/region";

//在IE11下不支持localStorage的缓存清理操作，所以需要验证cookie
var locationurl = window.location.href;
if(locationurl.substr(locationurl.length-1) == '/' || locationurl.indexOf("loginHome") > 0){
	clearCookie("author");
	window.parent.location.href = "../../../loginHome.html";
}else if (localStorage.getItem("author") == null || getCookie("author") == "") {
    isLogin = false;
    if(locationurl.indexOf("index") == -1 && locationurl.indexOf("daping") == -1){
    	window.parent.location.href = "../../../index.html";
    }
}

//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";path=/;" + expires;
}

//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
//清除cookie  
function clearCookie(name) {
    setCookie(name, "", -1);
}

//操作cookie
function optionCookie(authorToke){
	if(authorToke != null && authorToke != '' && authorToke != undefined){
		clearCookie("author");
	    setCookie("author", authorToke, '1');
	}
}
