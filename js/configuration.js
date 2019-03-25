var mobile;
var time;
var str;
var serverName=[];
var bb;
// var port = "http://yunnan.hcpos.com:"+30003;

$(function(){
	// mobile = 18186106240;
	time = new Date().getTime();

	// 初始化门店列表高度
	$('.config-list').css('height',$(window).height() - $('.header').height()- $('.config-target').outerHeight(true) -$('.configCode').height())
	
	// 返回上一页
	$('.return').click(function(){
		window.history.back(-1);
	})

	// 取消添加或修改
	$('.cancel').click(function(){
		$(this).parent().parent().parent().slideUp()
	})

	// 二维码
    var qrcode = new QRCode(document.getElementById("qrcode"), {});
    function makeCode(txt) {
        if (txt!='') {
            qrcode.makeCode(txt);
        } 
    }
    // makeCode('http://lyl.hcpos.com/freedom/attention.html?gzmobile=18186106240&tzm=8XWAWW&mobile=18907134660');
    setTimeout(function(){
    	$('.configCode').css('opacity','1');
    },1000)

	// 软件版本初始化
	ajax('get','http://lyl.hcpos.com/freedom/lelcom.ashx?oper=5','',function(data) {	
		var data = JSON.parse( data );

		// 编辑
		var edit = document.getElementById('editSoftware');
		// 修改
		var change = document.getElementById('changeSoftware');

		if (data.success=='true') {
		    var editHtml = '';
		    var changeHtml = '';
			for (var i=0; i<data.data.length; i++) {
				editHtml += '<option site="'+ data.data[i].softver +'">'+data.data[i].softname+'</option>';
				changeHtml += '<option site="'+ data.data[i].softver +'">'+data.data[i].softname+'</option>';

			}
			edit.innerHTML = editHtml;
			change.innerHTML = changeHtml;
			// 版本网址
			bb = $('#editSoftware').find('option:selected').attr('site');
		} else {
		    alert(data.errorMessage)
		}	
	});	


	// 删除门店
	$(document).on('click','.deleteServer',function(){	
		if ($(this).parent().prev().find('p').find('.serverPhone').find('i').text()==mobile) {
		    alert("这是您自己的店，不能删除！")
		} else {
			if (delete_server_confirm($(this).parent().prev().find('p').find('.serverName').find('i').text())) {
				if ($(this).parent().parent().hasClass('target')) {
					$(this).parent().parent().removeClass('target');
					if ($(this).parent().parent().index()==$(this).parent().parent().parent().children('.wrap').length-1&&$(this).parent().parent().parent().children('.wrap').length!=1) {
						$(this).parent().parent().prev().addClass('target');
					} else {
						$(this).parent().parent().next().addClass('target');
					}
					if ($(this).parent().parent().children('tr').length==1) {
						$('.nowSite').val('');
					}
				}
				$(this).parent().parent().remove();
			}		    
		}

	})

	// 切换门店
	$(document).on('click','.serverInfo',function(){		
		$(this).parent().siblings().removeClass('target');
		$(this).parent().addClass('target');
		$('.config-target').find('p').css('opacity','0')
		// $('.testInfo').parent().css('opacity','1')
		$('.config-target').find('div').css('visibility','visible')
		$('.config-list').css('height',$(window).height() - $('.header').height()- $('.config-target').outerHeight(true) -$('.configCode').height())
		// 获取门店微信人员列表
		$('#userList').text('');
		var data;
		var tzm = $('.serverCode').eq($(this).parent().index()).find('i').text();
		ajax('get','http://lyl.hcpos.com/freedom/lelcom.ashx?oper=2&tzm='+tzm,'',function(data) {	
			data = JSON.parse( data );
			var oUl = document.getElementById('userList');
			if (data.success=='true') {
				var html = '';
				if (data.data.length!=0) {
					for (var i=0; i<data.data.length; i++) {
						html += '<tr>'+
									'<td>'+data.data[i].mobile+'</td>'+
									'<td>'+$.trim(data.data[i].nickname)+'</td>'+
									'<td class="fa fa-trash deleteUser"></td>'+
								'</tr>';
					}
					oUl.innerHTML = html;
				} 
				makeCode('http://lyl.hcpos.com/freedom/attention.html?gzmobile=18186106240&tzm='+tzm+'&mobile='+mobile);
			}
		});		
	})

	// 删除门店微信人员
	$(document).on('click','.deleteUser',function(){
		var mobile = parseFloat($('.target').find('.serverInfo').children('p').eq(1).find('.serverPhone').find('i').text());
		if (mobile==parseFloat($(this).parent().children('td').eq(0).text())) {
			ajax('get','http://lyl.hcpos.com/freedom/lelcom.ashx?oper=3&tzm='+$('.target').find('.serverInfo').children('p').eq(1).find('.serverCode').find('i').text()+'&mobile='+$('.target').find('.serverInfo').children('p').eq(1).find('.serverPhone').find('i').text(),'',function(data) {	
				var data = JSON.parse( data );
				if (data.success=='true') {
				    $(this).parent().remove();
				} else {
				    alert(data.errorMessage)
				}
			});	
		} 
	})

	// 测试门店
	$('.testServer').click(function(){
		if ($('.target').length==1) {
			var site = $('.target').find('.serverInfo').attr('site');
			$('.testInfo').parent().css('opacity','1')
			var url = 'http://'+site+'/test.ashx?oper=test&mobile='+mobile+'&user='+'&pass='+'&'+time;
			ajax('get',url,'',function(data) {
				var data = JSON.parse( data );
				if (data.success=='true') {
					$('.testInfo').parent().css('background','#10c55b');
					$('.testInfo').attr('value',data.result);
					$('.config-list').css('height',$(window).height() - $('.header').height()- $('.config-target').outerHeight(true) - $('.configCode').height())
				} 
			});
				
		} else {
		    alert("请选择测试的门店")
		}
	})

	// 清除门店
	$('.clearServer').click(function(){
		$('.editName').val('');
		$('.editSoftware').val('');		
	})

	// 添加门店
	$('.addServer').click(function(){
		$('.editName').val('');
		$('.serverEdit').slideDown();
		var data;
		ajax('get','http://lyl.hcpos.com/freedom/lelcom.ashx?oper=4&mobile='+mobile,'',function(data) {	
			data = JSON.parse( data );
			var oUl = document.getElementById('userList');
			if (data.success=='true') {
				$('.editSite').attr('disabled','disabled')
				$('.editDls').val(data.item_no)
				$('.editDls').attr('disabled','disabled')
			}
		});			
	})
	$('.changeName').change(function(){
		$('.changeName').attr('value',$('.changeName').val());
	})
	$('.changeName').focus(function(){
		$('.changeName').attr('value','');
	})
	$('.editName').blur(function(){
		if ($('.editName').val()=='') {
		    $('.editName').attr('value','门店名称');
		} 
	})
	$('.editName').change(function(){
		if ($('.editName').val()=='') {
		    $('.editName').attr('value','门店名称');
		} 
	})
	$('#editSoftware').change(function(){
		bb = $(this).find('option:selected').attr('site');
	})
	// 保存门店设置
	$('.saveServer').click(function(){
		// var data;
		$.ajax({
			url : 'http://lyl.hcpos.com/freedom/lelcom.ashx?oper=6&mobile='+mobile+'&shopname='+$('.editName').val()+'&agent='+$('.editDls').val()+'&softver='+bb,
	        type : "get",
	        data : "",
	        async : false,
	        success : function(data){
	        	data = JSON.parse(data)
	        	var tr = '';
	        	var option = '';
	        	if (data.success=='true') {
	        		if (confirmServer) {
		        		$('.serverEdit').hide();
						tr='<div class="clearfix wrap">'+
								'<div class="fl serverInfo">'+
									'<p>'+
										'<span class="serverName fl">门店名称:<i>'+$('.editName').val()+'</i></span>'+
										'<span class="serverBb fr">软件版本:<i>'+$('.editSoftware').val()+'</i></span>'+
									'</p>'+
									'<p>'+
										'<span class="serverPhone fl">手机号:<i>'+$('.editSite').val()+'</i></span>'+
										'<span class="serverCode fr">账套码:<i></i></span>'+
									'</p>'+
								'</div>'+
								'<div class="fr serverAction">'+
									'<span class="fa fa-trash deleteServer"></span>'+
								'</div>'+
							'</div>';
						option = '<option site="">'+$('.editName').val()+'</option>';
						$('#server').append(tr);
						$('#mdSelect').append(option);	
						alert("门店添加成功")	 
						
						var scrollHeight = $('#server').prop("scrollHeight");
						$('#server').scrollTop(scrollHeight,100);						       			
	        		} 
	        	}
	        }
		})
	});

	// 修改门店
	$('.modifyServer').click(function(){
		if ($('.target').length==0) {
		    alert("请选择您要修改的内容");
		} else {
			if ($('.target').find('.serverPhone').find('i').text()==mobile) {
				var data;
				ajax('get','http://lyl.hcpos.com/freedom/lelcom.ashx?oper=4&mobile='+$('.target').find('.serverInfo').children('p').eq(1).find('.serverPhone').find('i').text(),'',function(data) {	
					data = JSON.parse( data );
					var oUl = document.getElementById('userList');
					if (data.success=='true') {
						$('.changeDls').val(data.item_no)
						$('.changeDls').attr('disabled','disabled')
					}
				});	
				$('.changeName').val($('.target').find('.serverInfo').children('p').eq(0).find('.serverName').find('i').text());
				$('.changeSite').val($('.target').find('.serverInfo').children('p').eq(1).find('.serverPhone').find('i').text());
				$('.changePort').val($('.target').find('.serverInfo').children('p').eq(1).find('.serverCode').find('i').text());
				$('.changeSoftware').val($('.target').find('.serverInfo').children('p').eq(0).find('.serverBb').find('i').text());		
				$('.serverChange').slideDown();	
			} else{				
				alert("您只能修改您自己的店")
			}  
		}
	})	
	var str1='';
	// 修改门店
	$('.changeServer').click(function(){
		if (changeServer()) {
			var data;
			ajax('get','http://lyl.hcpos.com/freedom/lelcom.ashx?oper=7&mobile='+$('.changeSite').val()+'&tzm='+$('.changePort').val()+'&shopname='+$('.changeName').val()+'&softver='+$('.changeSoftware').val(),'',function(data) {	
				data = JSON.parse( data );
				var oUl = document.getElementById('userList');
				if (data.success=='true') {
					$('.target').find('.serverInfo').find('p').eq(0).find('.serverName').find('i').text($('.changeName').val());
				    $('.target').find('.serverInfo').find('p').eq(0).find('.serverBb').find('i').text($('.changeSoftware').val());
				    $('.serverChange').hide();
				    alert(data.errorMessage);
				}
			});
		} else {
		    alert("请完善信息")
		}
	})
	// 清除门店
	$('.clearServer2').click(function(){
		$('.changeName').val('');
		$('.changeSoftware').val('');			
	})

	$('.save').click(function(){
		window.history.back(-1);
	})

})

// 当前门店地址
function server_site(){
	if ($('.target').length==1) {
	    return true;
	} else {
	    return false;
	}
}
// 删除门店
function delete_server_confirm(name){
	var r = confirm("是否删除 "+name);
	if (r==true) {
	    return true;
	} else {
	    return false;
	}
}

// 添加门店
function confirmServer(){
	str = '';
	if ($('.editName').val()=='门店名称'||$('.editName').val()=='') {
	    str+='门店名称不能为空';
	}     
	
	if (str=='') {
	    return true;
	} else {
	    return false;
	}
}

// 修改门店
function changeServer(){
	str1 = '';
	if (!$('.changeName').val()) {
	    str1 += '门店名称不能为空';
	}
	if(!$('.changeSoftware').val()){
		str1 += '软件版本不能为空';
	}    
	
	if (str1=='') {
	    return true;
	} else {
	    return false;
	}
}