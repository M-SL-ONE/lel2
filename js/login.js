// var mobile = 18186106240;
// var luer = "http://yunnan.hcpos.com:"+30003;
// var luer='0'
// var site = '';

var errorStr ='';

$(function(){
	// 用户名
	$('#user').focus(function(){
		$('#user').attr('value','');
	})
	$('#user').blur(function(){
		if ($('#user').val()!='') {
			$('#user').attr('value',$('#user').val());
		} 
	})
	// 密码
	$('.eye').click(function(){
		if ($('#pwd').attr('type')=='password') {
			$('#pwd').attr('type','text');
			$(this).removeClass('fa-eye-slash').addClass('fa-eye')
		} else {
			$(this).removeClass('fa-eye').addClass('fa-eye-slash')
			$('#pwd').attr('type','password');
		}
	})	
	$('#pwd').focus(function(){
		$('#pwd').attr('value','');
	})
	$('#pwd').blur(function(){
		if ($('#pwd').val()!='') {
			$('#pwd').attr('value',$('#pwd').val());
		} 
	})

	// 初始化门店列表	
    $.ajax({
		url:'http://lyl.hcpos.com/freedom/lelcom.ashx?oper=1&mobile='+mobile,
        type : "get",
        data : "",
        async : false,
        success : function(data) { 
        	// data = $.parseJSON(data)
        	data= JSON.parse(data)
        	// console.log(data)
        	// alert(typeof(data))
			var oUl = document.getElementById('mdSelect');
			var server = document.getElementById('server');
			if (data.success=='true') {
				if (data.data.length>0) {
					var html = '';
					var serverHtml = '';
					for (var i=0; i<data.data.length; i++) {
						html += '<option site="'+ data.data[i].Column1 +'" tzm="'+ data.data[i].tzm +'">'+$.trim(data.data[i].shopname)+'</option>';

						serverHtml += '<div class="clearfix wrap">'+
									'<div class="fl serverInfo" site="'+data.data[i].Column1+'">'+
										'<p>'+
											'<span class="serverName fl">门店名称:<i>'+$.trim(data.data[i].shopname)+'</i></span>'+
											'<span class="serverBb fr">软件版本:<i>'+data.data[i].softver+'</i></span>'+
										'</p>'+
										'<p>'+
											'<span class="serverPhone fl">手机号:<i>'+data.data[i].mobile+'</i></span>'+
											'<span class="serverCode fr">账套码:<i>'+data.data[i].tzm+'</i></span>'+
										'</p>'+
									'</div>'+
									'<div class="fr serverAction">'+
										'<span class="fa fa-trash deleteServer"></span>'+
									'</div>'+
								'</div>';
					}
					oUl.innerHTML = html;
					server.innerHTML = serverHtml;
					$('.config-target').slideDown();
					resetValue($('#mdSelect'));
					port = $('#mdSelect').find('option:selected').attr('site');
					tzm = $('#mdSelect').find('option:selected').attr('tzm');
				} else {
				    $('.tip').slideDown();
				}
			}
        }    	
    })


	// 登录
	$('.login').click(function(){
		port = $('#mdSelect').find('option:selected').attr('site');
		user = $('#user').val();
		pass = $('#pwd').val();

		if (user!=''&&pass!='') {
			setTimeout(function(){
				$.ajax({
					url : 'http://'+port+'/login.ashx?oper=1&mobile='+mobile+'&user='+ user +'&pass=' + pass,
			        type : "get",
			        data : "",
			        async : false,
			        success : function(data) {       
						if (data.success=='true') {
							login_confirm(port,mobile,user,pass);
						} else{
							alert(data.result);
						}
			        }
			    });	
			},100)	
		} else {
		    if (user=='') {
		    	alert("工号不能为空")
		    }
		    if (pass=='') {
		    	alert("密码不能为空")
		    }
		}			
	})

	$('.configuration').click(function(){
		$('#configuration').slideDown();
	})

	$('.attention').click(function(){
		// alert(tzm)
		$(this).attr('href',$(this).attr('href')+'gzmobile=18186106240&tzm='+tzm+'&mobile='+mobile)
	})
})		
function login_confirm(port,mobile,user,pass){
	var r = confirm("是否登录");
	if (r==true) {
	    window.location.href='platform.html?port='+port+'&mobile='+mobile+'&user='+user+'&pass='+pass;
	} else {
	    $('form').attr('action','');
	}
}