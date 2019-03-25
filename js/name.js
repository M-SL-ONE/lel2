var mobile ='';  //手机号
var port=''; //门店网址
var user = '';  //用户名
var pass = '';  //密码
var tzm = ''; //账套码

$(function(){
	mobile = GetQueryString('mobile');
    port = GetQueryString('port');
    user = GetQueryString('user');
    pass = GetQueryString('pass');
	// $("#mdSelect option:first").prop("selected",'selected');
	
})
//获取客户端url的search参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
// 默认选中第一项
function resetValue (obj) {
    obj.each(function (i, elem) {
        $(elem).find("option:selected").attr("selected", false);
        $(elem).find("option").first().attr("selected", true);
    })
}

