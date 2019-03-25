var now = new Date();
var time1 = now.getFullYear() + "-" +((now.getMonth())<10?"0":"")+(now.getMonth())+"-"+(now.getDate()<10?"0":"")+now.getDate();
var time2 = now.getFullYear() + "-" +((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();
$(function(){
	// var port = 
	$('.add').click(function(){
		$(this).attr('href',$(this).attr('href')+window.location.search)
	})

	// 返回上一页
	$('.return').click(function(){
		window.history.back(-1);
	})

	$('.start-date').val(time1)
	$('.end-date').val(time2)

	$('.start-date').change(function(){
		time1  = $(this).val();
		var index = $('.nowSh').index();
		// alert(index)
		if (index==1) {
		    shList('',time1,time2,djbh);
		} else {
		    shList(index-2,time1,time2,djbh);
		}
	})

	function compareTime(time1,time2){
		if (time1>time2) {
		    return false;
		} else {
		    return true;
		}
	}

	$('.end-date').change(function(){
		time2  = $(this).val();
		var index = $('.nowSh').index();
		// alert(index)
		if (index==1) {
		    shList('',time1,time2,djbh);
		} else {
		    shList(index-2,time1,time2,djbh);
		}
	})

	var djbh = $('#djbh').attr('value');

	$('#djbh').blur(function(){
		$('#djbh').attr('value',$('#djbh').val())
		djbh = $('#djbh').attr('value');

		time1 = $('.start-date').val();
		time2 = $('.end-date').val();  

		var index = $('.nowSh').index();
		// alert(index)
		if (index==1) {
		    shList('',time1,time2,djbh);
		} else {
		    shList(index-2,time1,time2,djbh);
		}
	})


	$('.cd').click(function(){

		time1 = $('.start-date').val();
		time2 = $('.end-date').val(); 

		var index = $('.nowSh').index();
		// alert(index)
		if (index==1) {
		    shList('',time1,time2,djbh);
		} else {
		    shList(index-2,time1,time2,djbh);
		}
	})


	// 单据列表初始化
	shList('',time1,time2,djbh);

	// 全部
	$('.allSh').click(function(){
		time1 = $('.start-date').val();
		time2 = $('.end-date').val();
		shList('',time1,time2,djbh);
	})
	// 已审核
	$('.yiSh').click(function(){
		time1 = $('.start-date').val();
		time2 = $('.end-date').val();
		shList('1',time1,time2,djbh);
	})

	// 未审核
	$('.weiSh').click(function(){
		time1 = $('.start-date').val();
		time2 = $('.end-date').val();
		shList('0',time1,time2,djbh);
	})	
	

	$('.dj').each(function(i,elem){
		$(elem).find('.djInfo').find('a').children('p').eq(0).find('.queue').text(i+1);
	})
	$('.qxdj').click(function(){
		$('.djCheck').each(function(i,elem){
			$(elem).find('span').removeClass('fa-square-o').addClass('fa-check-square-o');
		})
	})
	$('.qbxdj').click(function(){
		$('.djCheck').each(function(i,elem){
			$(elem).find('span').removeClass('fa-check-square-o').addClass('fa-square-o');
		})
	})
	$('.sddj').click(function(){
		var okNum = 0;
		var str = '';
		$('.fa-check-square-o').each(function(i,elem){
			str +=" " + "delete t_pm_sheet_master where sheet_no='"+ $(elem).parent().parent().find('.djInfo').find('a').children('p').eq('0').find('.bh').find('i').text() +"'";
			if ($(elem).parent().parent().find('.djInfo').find('a').children('p').eq(1).children('span').eq(2).text()=="已审核") {
			    okNum++;
			}
		})
		str = encodeURI(str);
		if ($('.fa-check-square-o').length==0) {
			alert("请选择要删除的数据")
		}else{
			if (okNum==0&&$('.fa-check-square-o').length!=0) {
				// alert(2)
				var str = '';
				var flag = 0;
				$('.fa-check-square-o').each(function(i,elem){
					var bh = $(elem).parent().parent().find('.djInfo').find('a').children('p').eq(0).find('.bh').find('i').text();
					str+="delete t_pm_sheet_master where sheet_no='"+ bh +"'"+" ";
				})
				
				str = encodeURI(str);
				var url = 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=exec';

				ajax('POST', url ,
					JSON.stringify({                    
			            'comsql':str
			        }),
					function(data) {
						data = JSON.parse(data);
						if (data.success) {
							if (delete_dj_confirm()) {
								$('.fa-check-square-o').parent().parent().remove();
								$('.dj').each(function(i,elem){
									$(elem).find('.djInfo').find('a').children('p').eq(0).find('.queue').text(i+1);
								})
								alert("删除成功")
							} 
						}
					})			

			} else {
				alert("您选择的单据中有审核过的，请重新选择")
				var index = $('.nowSh').index();
				if (index==1) {
				    shList('',time1,time2,djbh);
				} else {
				    shList(index-2,time1,time2,djbh);
				}	    
			}
		}
			
	})
	$(document).on('click','.djDelete',function(){

		var bh = $(this).parent().find('.djInfo').find('a').children('p').eq(0).find('.bh').find('i').text();
		var zt = $(this).parent().find('.djInfo').find('a').children('p').eq(1).children('span').eq(2).text();

		var flag = '';
		if (zt=="未审核") {
		    flag=0;
		} else {
		    flag=1;
		}
		var str ="delete t_pm_sheet_master where sheet_no='"+ bh+"'";
		str = encodeURI(str);
		var url = 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=exec';
		ajax('POST', url ,
			JSON.stringify({                    
	            'comsql':str,
				'headsql':'',
				'detailsql':''
	        }),
			function(data) {
				data = JSON.parse(data);
				if (data.success) {
					if (flag==0) {
						if (delete_dj_confirm()) {
							$(this).parent().remove();
							$('.dj').each(function(i,elem){
								$(elem).find('.djInfo').find('a').children('p').eq(0).find('.queue').text(i+1);
							})
							var index = $('.nowSh').index();
							if (index==1) {
							    shList('',time1,time2,djbh);
							} else {
							    shList(index-2,time1,time2,djbh);
							}
							alert("删除成功")
						} 
					} else {
					    alert("已经审核过的不能删除")
					}
				}
			})	 	
	})

	$(document).on('click','.djCheck',function(){
		$(this).find('span').toggleClass('fa-square-o').toggleClass('fa-check-square-o');
	})

	$('.sh').children('span').each(function(i,elem){
		$(elem).click(function(){
			$(this).siblings().removeClass('nowSh');
			$(this).addClass('nowSh');
		})
	})


})

// 删除门店
function delete_dj_confirm(){
	var r = confirm("是否删除");
	if (r==true) {
	    return true;
	} else {
	    return false;
	}
}

function shList(flag,time1,time2,djbh){
	var str ="select sheet_no,CONVERT(varchar(100), oper_date, 23) as rq,sheet_amt,(case approve_flag when '1' then '已审核'  when'0' then '未审核' else  '其他的' end) as bz, (select SUM(real_qty) from t_pm_sheet_detail B where a.sheet_no=b.sheet_no) as sl from  t_pm_sheet_master  A  where trans_no='PO' and approve_flag like '%"+flag + 
	"%' and (CONVERT(varchar(100), oper_date, 23) between '"+ time1 +"' and  '"+time2+"')"+"  and sheet_no like '%"+djbh+"%'";

	var url = 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table';
	ajax('POST', url, JSON.stringify({    
		'headsql':'',                
        'comsql':str,
		'datailsql':''
        }),
	function(data) {
		var dj = '';
		var oUl = document.getElementById('djList');
		// alert(data)
		data = JSON.parse(data);
		// alert(data.comm.length)
		if (data.success=='true') {
			for (var i = 0; i < data.comm.length; i++) {
				dj += '<div class="dj clearfix">'+
							'<div class="djInfo">'+
								'<a href="list.html'+window.location.search+'&sheet_no='+data.comm[i].sheet_no+'">'+
									'<p>'+
										'<span class="queue">'+ (i+1) +'</span>'+
										'<span class="bh">单据单号：<i>'+ data.comm[i].sheet_no +'</i></span>'+
									'</p>'+
									'<p>'+
										'<span class="date fl">'+ data.comm[i].rq +'</span>'+
										'<span class="state fr">已订购</span>'+
										'<span class="fr">'+ data.comm[i].bz +'</span>'+
										'<span class="fr">采购订单</span>'+
									'</p>'+
									'<p>'+
										'<span class="num fl">数量：'+ data.comm[i].sl +'</span>'+
										'<span class="money fr">金额：'+ data.comm[i].sheet_amt +'元</span>'+
									'</p>	'+			
								'</a>'+
							'</div>'+
							'<div class="djCheck">'+
								'<span class="fa fa-square-o" on="false"></span>'+
							'</div>'+
							'<div class="djDelete">'+
								'<span class="fa fa-trash" on="false"></span>'+
							'</div>'+
						'</div>';
			}
			oUl.innerHTML = dj;				
		}
	})
}