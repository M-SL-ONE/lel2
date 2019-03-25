
$(function(){
    // var scrollHeight = $('#list-info').prop("scrollHeight");
    
	$('.config-list').css('height',$(window).height() - $('.header').height()- $('.config-target').outerHeight(true))
	$('.list-info').css('height',$(window).height() - $('.header').height()- $('.list-edit').outerHeight(true)- $('.footer').height());
	$('.type-list').css('height',$(window).height());
	$('.wrap').css('height',$(window).height());

	var now = new Date();
	var time = now.getFullYear() + "-" +((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();

	$('.xqrq').attr('value',time)

	$('.nowState').attr('value','未审核');
    sheet_no = GetQueryString("sheet_no");
    if (sheet_no!='') {
    	$('#item_no').attr('value',sheet_no)
        getDj(sheet_no);
    } 
    if(sheet_no==null) {
        $('.nowState').attr('value','未审核')
        $('.xqrq').attr('value',time)    	
    }
	// 返回上一页
	$('.return').click(function(){
		window.history.back(-1);
	})
	$('.topClass').click(function(){
		$(this).parent().parent().parent().slideUp();
	})
	$('.first').click(function(){
		$(this).parent().parent().parent().slideUp();
		$('#__layer-ball').fadeIn();
	})
	// 新建
	$('#new').click(function(){
		window.location.href="list.html?port="+GetQueryString('port')+"&mobile="+GetQueryString('mobile')+"&user="+GetQueryString('user')+"&pass="+GetQueryString('pass');
	    $('.xqrq').removeAttr('disabled')
	    $('#ck').removeAttr('disabled')
	    $('.gysIpt').removeAttr('disabled')
	    $('.tm').removeAttr('disabled')

	})
	// 保存
	
	// $('.save').click(function(){
	// 	if ($('.nowState').val()!="已审核") {
	// 	    $('.nowState').attr('value','未审核');
	// 	} 
	// })
	// 审核
	$('.sh').click(function(){
		if ($('.nowState').val()=="已审核") {
		    alert("该单据已审核过")
		} else {
			
			changeFlag(sheet_no)    
		}
	})	
	// 删单
	$('.reviewed').click(function(){
		if ($('.nowState').val()=="已审核") {
		    alert("已审核过的单据不能删除")
		} else {
			var str = "delete from t_pm_sheet_master where sheet_no='"+$('#item_no').val()+"' ";
			str = encodeURI(str);
			var url = 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=exec';
			$.ajax({
		        url : url,
		        type : "post",
		        data : JSON.stringify({    
		            'comsql':str,
					'headsql':'',
					'detailsql':''
			    }),
		        async : false,
		        success : function(data) { 
					if (data.success=='true') {	
						alert($('#item_no').val()+"删除成功")
						window.location.href="list.html"						
					} 
		        }				
			})				    
		}	
	})
	// 保存单据
	$('.save').click(function(){
		// alert(1)
	    var myDate = new Date;
	    var year = myDate.getFullYear(); //获取当前年
	    var mon = myDate.getMonth() + 1; //获取当前月
	    var date = myDate.getDate()+7; //获取当前日
	    var h = myDate.getHours();//获取当前小时数(0-23)
	    var m = myDate.getMinutes();//获取当前分钟数(0-59)
	    var s = myDate.getSeconds();//获取当前秒

	    if ($('.nowState').attr('value')=='已审核') {
	        alert("已经保存过了")
	    } else {
			if ($('#list-info').children('.listInfo').length!=0) {
				var head='';
				var detail="declare @sheet_no varchar(14) select @sheet_no=DBO.f_get_flowno('1001','PO')";
				var brand_no = $('#ck').find('option:selected').attr('branch_no');
				// var supcust_no = $('#gysIpt').('no');
				var gys_no = $('.gysIpt').attr('no');
				var flag=0;
				if ($('.nowState').val()=='已审核') {
				    flag=1;
				} else if($('.nowState').val()=='未审核'){
					flag=0;
				}
				// alert(gys_no)
				var totalMoney = parseFloat($('.totalMoney').find('span').text());
				var totalNum = parseFloat($('.totalNum').find('span').text());
				if( $('.gysIpt').attr('value')==''){
					alert("请先选择供应商")
				}else{
					// alert(branch_no)
					if ($('#item_no').val()!='') {
						var str = "delete from t_pm_sheet_master where sheet_no='"+$('#item_no').val()+"' ";
						str = encodeURI(str);
						var url = 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=exec';
						$.ajax({
					        url : url,
					        type : "post",
					        data : JSON.stringify({    
					            'comsql':str,
								'headsql':'',
								'detailsql':''
						    }),
					        async : false,
					        success : function(data) { 
								if (data.success=='true') {	
									alert($('#item_no').val()+"删除成功")
									window.location.href="list.html"						
								} 
					        }				
						})
					}
					head = "declare @sheet_no varchar(14) select @sheet_no=DBO.f_get_flowno('1001','PO') insert into t_pm_sheet_master (sheet_no,trans_no,db_no,branch_no,supcust_no,coin_no,approve_flag,oper_date,work_date,valid_date,order_amt,order_status,order_man,oper_id,confirm_man,sale_way,direct_flag,sheet_amt,com_flag,first_cx,mp_flag) values ( @sheet_no  ,'PO','+','"+brand_no+"','"+gys_no+"','RMB','0',getDate(),getDate(),getDate()+7,'0','0','1001','1001','','A','0',"+totalMoney+",'0','1','0') "
					// head = "declare @sheet_no varchar(14) select @sheet_no=DBO.f_get_flowno('1001','PO') insert into t_pm_sheet_master (sheet_no,trans_no,db_no,branch_no,supcust_no,coin_no,approve_flag,oper_date,work_date,valid_date,order_amt,order_status,order_man,oper_id,confirm_man,sale_way,direct_flag,sheet_amt,com_flag,first_cx,mp_flag) values ( @sheet_no  ,'PO','+',1,'1','RMB','0',getDate(),getDate(),getDate()+7,'0','0','1001','1001','','A','0','1','0','1','0') "
					// head = "declare @sheet_no varchar(14) select @sheet_no=DBO.f_get_flowno('1001','PO') insert into t_pm_sheet_master (sheet_no,trans_no,db_no,branch_no,supcust_no,coin_no,approve_flag,oper_date,work_date,valid_date,order_amt,order_status,order_man,oper_id,confirm_man,sale_way,direct_flag,sheet_amt,com_flag,first_cx,mp_flag) values (  @sheet_no  ,'PO','+',1,'"+gys_no+"','RMB','0',getDate(),getDate(),getDate()+7,'0','0','1001','1001','','A','0',"+totalMoney+",'0','1','0') "
					detail='';
                    $('.listInfo').each(function(i,elem){
						// 条码
						var item_no = $('.listInfo').eq(i).find('.left').children('p').eq(1).find('.tm').find('span').text();							
						// 下订单数量
						var real_qty = $('.listInfo').eq(i).find('.left').children('p').eq(2).find('.num').find('input').val();
						// console.log(real_qty)
						// 下订单数量
						var large_qty = $('.listInfo').eq(i).find('.left').children('p').eq(2).find('.num').find('input').val();
						// // 进价
						var orgi_price = $('.listInfo').eq(i).find('.left').children('p').eq(2).find('.price').find('input').val();
						// var orgi_price = $.trim($(elem).find('.listInfo').find('.left').children('p').eq(1).find('.tm').find('span').text());
						// // 有效价
						var valid_price = $('.listInfo').eq(i).find('.left').children('p').eq(2).find('.price').find('input').val();
						// // 金额
							var sub_amt = $('.listInfo').eq(i).find('.left').children('p').eq(2).find('.money').find('input').val();
						// // 税
						// var tax = ;
						// var date = '12';
						detail += " insert into t_pm_sheet_detail (sheet_no,item_no,order_qty,real_qty,large_qty,orgi_price,valid_price,sub_amt,tax,valid_date) values (@sheet_no,'"+item_no+"', 0, "+real_qty+", "+large_qty+", "+orgi_price+", "+valid_price+", "+sub_amt+", 0, getDate()+7 )  ";
					})
head=head+detail;//+' select @sheet_no as sheet_no ';
var aaa="select  DBO.f_get_flowno('1001','PO') as sheet_no, CONVERT(varchar(10),GETDATE(),23) as rq";

					head= encodeURI(head);
					detail='';// encodeURI(detail);
					var url='http://'+port+"/buy.ashx?oper=1&mobile="+mobile+"&user="+user+"&pass="+pass+"&cmd=table"
					$.ajax({
				        url : url,
				        type : "post",
				        data : JSON.stringify({    
				            'comsql':aaa,
							'headsql':head,
							'detailsql':detail
					    }),
				        async : false,
				        success : function(data) { 
 
 
							if (data.success=='true') {
 $('.xqrq').attr('value',data.comm[0].rq);	
                                                             document.getElementById("item_no").value=data.comm[0].sheet_no;
                                                             $('.xqrq').attr('value',data.comm[0].rq);
                                                           //  $('.xqrq').val(data.comm[0].rq);

								alert("保存成功")
 
						
							} 
				        }				
					})								
					// 	ajax('POST','http://yunnan.hcpos.com:30003/buy.ashx?oper=1&mobile=18186106240&user=1001&pass=1001&cmd=exec',JSON.stringify({                    
					//         'comsql':detail,
					// 		'headsql':head,
					// 		'detailsql':''
					//     }),
					// 	function(data) {
					// 		// alert(data)
					// 		data = JSON.parse(data);
					// 		if (data.success=='true') {
					// 		    alert("插入成功")
					// 		} 
					// 	})											
				}
			} else {
			    alert("请先添加订单")
			}
	    }
	})	
	// 删除
	$('.deleteGoods').click(function(){
		if ($('.nowState').val()=="已审核") {
			alert("已审核过的不能删除")
		} else{
			$('.right').find('.fa-check-square-o').each(function(i,elem){
				num.splice($(elem).parent().parent().index(),1);
				slmoney.splice($(elem).parent().parent().index(),1);
				$(elem).parent().parent().remove();
			})
			$('.totalNum').find('span').text(calNum());
			$('.totalMoney').find('span').text(calMoney());
			sortGoods();
		}
	})    
	$('.more').click(function(){
		if ($(this).attr('on')=='true') {
			$('.moreList').slideDown();
			$(this).attr('on','false');
		} else {
			$('.moreList').slideUp();
			$(this).attr('on','true');
		}
	})
	// 获取仓库和供应商
	getCk();

	// 显示供应商列表
	$('.gysIpt').click(function(){
		$('.gysList').fadeIn();
		$('#__layer-ball').fadeOut();
	})

	// 选择供应商
	$(document).on('click','.gys',function(){
		var gys = $(this).children('p').eq(0).find('span').find('strong').text()
		$('.gysList').fadeOut();
		$('.gysIpt').attr('value',gys)
		$('.gysIpt').attr('no',$(this).children('p').eq(0).find('span').find('i').text())
		$('#__layer-ball').fadeIn();
	})	

	// 搜索供应商	
	$('#searchGys').focus(function(){
		sxGys('')
	})	
	$('.searchGysBtn').click(function(){
		text = $('#searchGys').val();//获取文本框输入
		if ($.trim(text) != "") {
			sxGys($.trim(text));
		} else {
			alert("请先输入供应商名称/编号")
		}
	})

	// 展开和收缩
	var on = true;
	$('.fold').find('i').click(function(){
		$('#list-info').animate({scrollTop:0},200)
		if (on) {
		    $(this).parent().prev().children('p').hide();
		    $(this).parent().prev().children('p:last').show();
			$(this).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
			$('.list-info').css('top','5.5rem');
			$('.list-btn').css('top','4.5rem');
			on = false;
		} else {
			$(this).parent().prev().children('p').show()
			$(this).removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
			$('.list-info').css('top','13rem');
			$('.list-btn').css('top','12rem');
		    on = true;
		}
		$('.list-info').css('height',$(window).height() - $('.header').height()- $('.list-edit').outerHeight(true)- $('.footer').height())
	})

	// 搜索条码
	$('.searchbtn').click(function(){
		if ($('.nowState').val()!="已审核") {
			if ($('.tm').val()=='') {
				alert("请输入条码");
			} else {
				addGoods($('.tm').val());
			    var scrollHeight = $('#list-info').prop("scrollHeight");
			    $('#list-info').scrollTop(scrollHeight,100);			
			}			
		}
	})

	// 扫码添加商品
	$('#__layer-ball').click(function(){	
		if ($('.nowState').val()=="已审核") {
		    alert("该单据已审核，不能再扫码添加产品")
		} else {
			addGoods("6921168504015");
			$('.totalNum').find('span').text(calNum());	 
		    var scrollHeight = $('#list-info').prop("scrollHeight");
		    $('#list-info').scrollTop(scrollHeight,100);

		}	
	})


	// 添加商品
	$('.add').click(function(){
		if ($('.nowState').val()=='已审核') {
		    alert("审核过的不能再添加")
		} else{
			$('.wrap').slideDown();
			$('#__layer-ball').fadeOut();
		}
	})
	all();
	// 根据类别显示商品
	$("#lb").on('click','li',function(){
		if ($("#lb").children('.'+$(this).attr('mid')).length==0) {
		    $(this).siblings().removeClass('nowType');
			$(this).addClass('nowType');
		} else {
			$(this).siblings().removeClass('nowType');
			$("#lb").children('li').hide();
			$('.'+$(this).attr('mid')).show(); 
			$('.'+$(this).attr('mid')).removeClass('sl')
			$('.'+$(this).attr('mid')).addClass('sl')

			if ($('#lb').children('.show').eq('0').attr('mid').length!=2) {
			    $('.goodsList').find('.top').fadeIn();
			} else{
				$('.goodsList').find('.top').fadeOut();
			}			   
		}
		syGoods($(this).attr('mid'));
	})
	//搜索商品
	$('#searchGoods').click(function(){
		text = $('#search').val();//获取文本框输入
		if($.trim(text) != ""){
			sx(text);
		}
	})
	// 选择商品
	$(document).on('click','.goods',function(){
		$(this).find('.goodsInfo').find('.goodsName').find('.fa').toggleClass('fa-square-o').toggleClass('fa-check-square-o')
	})

	// 返回上一级
	$('.top').click(function(){
		var cls =$('.goods').eq(0).attr('class').split(" ");
		
		// 类别
		var pcls = $('#lb').children('.sl').eq('0').attr('class').split(" ")[0];
		$('#lb').children('li').hide();
		$('#lb').children('li').removeClass('nowType');

		syGoods(pcls);

		$('.'+$('#lb').find("li[mid='"+pcls+"']").attr('class')).show();
		$('#lb').find("li[mid='"+pcls+"']").addClass('nowType');
		if (pcls.length!=2) {
		    $('.goodsList').find('.top').fadeIn();
		} else{
			$('.goodsList').find('.top').fadeOut();
		}
		$('#lb').children('li').removeClass('sl')
	})

	// 显示商品
	$('.showImg').click(function(){
		if ($(this).text()=="显示图片") {
			$('.goodsLeft').fadeOut();
			$('.goods').find('img').fadeIn();
			$(this).text("隐藏图片");
			$('.top').css('left','0rem');
			$('.switchGoods').css('left','0rem');
			$('.switchGoods').attr('on','false');
		} else {
			$('.goodsLeft').fadeIn();
			$('.goods').find('img').fadeOut();
			$(this).text("显示图片");
			$('.top').css('left','4rem');
			$('.switchGoods').css('left','4rem');
			$('.switchGoods').attr('on','true');
		}
	})
	$('.qxw').click(function(){
		$('.goodsInfo').each(function(i,elem){
			$(elem).find('.goodsName').find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');	
		})
	})
	$('.qbxw').click(function(){
		$('.goodsInfo').each(function(i,elem){
			$(elem).find('.goodsName').find('.fa').removeClass('fa-check-square-o').addClass('fa-square-o');	
		})
	})
	// 图片切换
	$('.switchGoods').click(function(){
		$('.goodsLeft').fadeToggle();
		$('.goods').find('img').fadeToggle();
		if ($(this).attr('on')=='true') {
		    $(this).attr('on','false')
		    $('.top').css('left','0rem');
		    $(this).css('left','0rem');
		    $('.showImg').text("隐藏图片");
		} else {
		    $(this).attr('on','true')
		    $('.top').css('left','4rem');
		    $(this).css('left','4rem');
		    $('.showImg').text("显示图片");
		}
	})	

    var numGoods=0;
	$('.preGoods').click(function(){
		if (numGoods==0) {
			numGoods=item.length-1;
		} else{
			numGoods--;
		}
		$('.add-good').find('.goods-form').children('.goods').hide();
		$('.add-good').find('.goods-form').children('.goods').eq(numGoods).show();
	})
	$('.nextGoods').click(function(){
		if (numGoods==item.length-1) {
			numGoods=0;
		} else{
			numGoods++;
		}
		$('.add-good').find('.goods-form').children('.goods').hide();
		$('.add-good').find('.goods-form').children('.goods').eq(numGoods).show();
	})

	// 修改数量
	$(document).on('blur','.sl',function(){
		goods[$(this).parent().parent().parent().parent().parent().index()].sl = $(this).val();
		
		$(this).attr('value',$(this).val());
		$('.je').eq($(this).parent().parent().parent().parent().parent().index()).attr('value',$('.zkdj').eq($(this).parent().parent().parent().parent().parent().index()).val()*$(this).val())
	})
	// 修改单位
	$(document).on('click','.unit',function(){
		$(this).siblings().removeClass('nowUnit');
		$(this).addClass('nowUnit');
	})

	// 修改单价
	$(document).on('blur','.dj',function(){
		goods[$(this).parent().parent().parent().parent().parent().index()].sale_price = $(this).val();
		// console.log(goods)
		$(this).attr('value',$(this).val());
		var zkdj = $('.zk').eq($(this).parent().parent().parent().parent().parent().index()).val()*$(this).val();
		var num  = $('.sl').eq($(this).parent().parent().parent().parent().parent().index()).val();
		$('.je').eq($(this).parent().parent().parent().parent().parent().index()).attr('value',num*zkdj);
		$('.choosePrice').find("option:selected").text('请选择单价')
	})

	// 修改折扣
	$(document).on('blur','.zk',function(){
		if ($(this).val()>=2) {
		    alert("折扣不能大于2")
		    $(this).val('1')
		} else if($(this).val()<1){
		    alert("折扣不能小于1")
		    $(this).val('1')
		} else{
			$(this).attr('value',$(this).val());
			$('.zkdj').eq($(this).parent().parent().parent().parent().parent().index()).attr('value',$('.dj').eq($(this).parent().parent().parent().parent().parent().index()).val()*$(this).val())
			$('.je').eq($(this).parent().parent().parent().parent().parent().index()).attr('value',$('.zkdj').eq($(this).parent().parent().parent().parent().parent().index()).val()*$('.sl').eq($(this).parent().parent().parent().parent().parent().index()).val())
		}
	})

	// 选择单价
	$('.choosePrice').each(function(i,elem){
		$(elem).change(function(){
			if ($(this).find("option:selected").text().indexOf("：")>0 ){
				var selectedPrice = $(this).find("option:selected").text().substring($(this).find("option:selected").text().indexOf("：")+1,$(this).find("option:selected").text().length);
				// alert(selectedPrice)
				$('.dj').eq(i).val(selectedPrice);
				$('.zkdj').eq(i).attr('value',selectedPrice*$('.zk').eq(i).val())
				$('.je').eq(i).attr('value',$('.zkdj').eq(i).val()*$('.sl').eq(i).val())
			} 
		})
	})
	// 添加商品
	$(document).on('click','.addGoods',function(){
		$('.add-good').fadeOut();
		$('.wrap').fadeOut();
		$('#__layer-ball').fadeIn();

		var sp='';
		for (var i = 0; i < goods.length; i++) {
			sp += '<div class="listInfo">'+
					'<div class="left">'+
						'<p class="area">'+
							'<i class="queue">'+toTwo((parseFloat($('.queue').length)+i+1))+'</i>'+
							'<span class="name">'+goods[i].item_name+'</span>'+
						'</p>'+
						'<p>'+
							'<strong class="tm">条码：<span>'+goods[i].item_no+'</span></strong>'+
							'<strong class="zbm">自编码：<span>'+goods[i].item_subno+'</span></strong>'+
							'<strong class="ls">零售价：<span>'+goods[i].sale_price+'</span>元</strong>'+
						'</p>'+
						'<p>'+
							'<strong class="kc">库存(盒):<span>'+goods[i].kc+'</span></strong>'+
							'<strong class="num">数量(盒):<input type="number" value="'+goods[i].sl+'" class="numIpt"></strong>'+
							'<strong class="price">单价(元):<input type="number" value="'+goods[i].sale_price+'" class="priceIpt"></strong>'+
							'<strong class="money">金额(元):<input type="number" value="'+goods[i].sale_price*goods[i].sl+'"></strong>'+
						'</p>	'+			
					'</div>'+
					'<div class="right">'+
						'<span class="fa fa-square-o xz" on="true"></span>'+
						'<span class="delete fa fa-trash"></span>'+
					'</div>'+
				'</div>';
				num.push(goods[i].sl);
				slmoney.push(goods[i].sale_price*goods[i].sl);
		}
		$('#list-info').append(sp);
		$('.totalNum').find('span').text(calNum());
		$('.totalMoney').find('span').text(calMoney());
		goods=[];
		item=[];
		$('.add-good').find('#tk').text('')
		var scrollHeight = $('#list-info').prop("scrollHeight");
		$('#list-info').scrollTop(scrollHeight,100);
	})
	$('.determain').click(function(){
		item=[];
		if ($('.fa-check-square-o').length>0) {		
			$('.add-good').slideDown()
			$('.fa-check-square-o').each(function(i,elem){
				item.push({"no":$.trim($(elem).parent().next().find('span').text())})
			})
		    if (item.length>1) {
		    	$('.goods-btn').show()
		    } else{
		    	$('.goods-btn').hide()
		    }	
			for (var i = 0; i < item.length; i++) {
				GetInfo(item[i].no)
			}
			$('.add-good').find('.goods-form').children('.goods').eq(0).show()			
		} else {
			alert("至少选择一个商品")
		}
	})

	// 保存商品信息
	// $('.saveGoods').click(function(){
	// 	$('.add-good').fadeOut();
	// })	
	
	// 修改数量
	$(document).on('change','.numIpt',function(){
		$(this).attr('value',$(this).val());
		$(this).parent().parent().find('.money').find('input').attr('value',$(this).val() * $(this).parent().parent().find('.price').find('input').val())
		num[$(this).parent().parent().parent().parent().index()]=$(this).val();
		$('.totalNum').find('span').text(calNum());
		slmoney[$(this).parent().parent().parent().parent().index()]=parseFloat($(this).parent().parent().find('.money').find('input').val());
		$('.totalMoney').find('span').text(calMoney())
	})
	// 修改单价
	$(document).on('change','.priceIpt',function(){
		$(this).attr('value',$(this).val());
		$(this).parent().parent().find('.money').find('input').attr('value',$(this).val() * $(this).parent().parent().find('.num').find('input').val())
		slmoney[$(this).parent().parent().parent().parent().index()]=parseFloat($(this).parent().parent().find('.money').find('input').val());
		$('.totalMoney').find('span').text(calMoney())
	})

	var aim;
	// 点击修改
	$(document).on('click','.area',function(){
		if ($('.nowState').val()=='已审核') {
		    // if body...
		} else {
			aim=[];
			aim.push({
				"no":$(this).parent().parent().index(),
				"price":$(this).next().next().find('.price').find('input').val(),
				"num":$(this).next().next().find('.num').find('input').val()
			})
			$('#__layer-ball').fadeOut();
			$('.update-good').show();
			$('.update-good').find('.goods').show()
		    var str = "select item_no,item_name,item_subno,item_clsno,item_brand,product_area,price,base_price,sale_price,vip_price,trans_price,purchase_tax,sale_tax,main_supcust,(select sup_name from t_bd_supcust_info where t_bd_supcust_info.supcust_no=t_bd_item_info.main_supcust) as sup_name ,dbo.f_get_stock_qty(item_no) as kc from t_bd_item_info  where item_no='"+$(this).next().find('.tm').find('span').text()+"'";
			var url = 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table';
			$.ajax({
		        url : url,
		        type : "post",
		        data : JSON.stringify({    
		            'comsql':'',
					'headsql':'',
					'detailsql':str
			    }),
		        async : false,
		        success : function(data) { 
					if (data.success=='true') {
						var spList = document.getElementById('xg');		
						var sp="";			
						sp='<div class="goods" style="display:block">'+
							'<form action="">'+
								'<div class="goods-head clearfix">'+
									'<img src="images/1.jpg" alt="">'+
									'<div>'+
										'<p>'+data.detail[0].item_name+'</p>'+
										'<p>条码：<span>'+data.detail[0].item_no+'</span></p>'+
										'<p>字编码：<span>'+data.detail[0].item_subno+'</span></p>'+
									'</div>'+
								'</div>'+
								'<div class="head-body">'+
									'<div>'+
										'<p><label for="">数量</label><input type="number" class="changesl" value="'+aim[0].num+'"></p>'+

										'<p>'+
											'<label for="">单位</label>'+
											'<span class="nowUnit unit">盒</span>'+
											'<span class="unit">箱</span>'+
										'</p>'+
									'</div>'+
									'<div>'+
										'<p><label for="">进价</label><input type="number" value="'+data.detail[0].price+'"></p>'+
										'<p>'+
											'<select name="" id="" class="choosePrice">'+
												'<option value="">最近进价</option>'+
												'<option value="">批发价：40</option>'+
												'<option value="">批发价：0</option>'+
												'<option value="">批发价：20</option>'+
												'<option value="">批发价：10</option>'+
											'</select>'+
										'</p>'+
									'</div>'+
									'<div>'+
										'<p><label for="">零售价</label><input type="number" class="changedj" value="'+aim[0].price+'"></p>'+
										'<p><label for="">会员价</label><input type="number" value="'+data.detail[0].vip_price+'"></p>'+
									'</div>'+
									'<div>'+
										'<p><label for="">配送价</label><input type="number" value="'+data.detail[0].base_price+'"></p>'+
										'<p><label for="">批发价</label><input type="number" value="'+data.detail[0].trans_price+'"></p>'+
									'</div>'+
									'<div>'+
										'<p><label for="">折扣</label><input type="number" class="zk" value="1"></p>'+
										'<p><label for="">折后单价</label><input type="number" class="zkdj" value="'+data.detail[0].sale_price+'"></p>'+
									'</div>'+
									'<div>'+
										'<p><label for="">金额</label><input type="number" class="changeje" value="'+aim[0].price*aim[0].num+'"></p>'+
									'</div>'+
									'<div>'+
										'<p><label for="">规格</label><input type="text" placeholder="460g" disabled></p>'+
										'<p><label for="">产地</label><input type="text" value="'+ data.detail[0].product_area+'" disabled></p>'+
									'</div>'+
									'<div>'+
										'<p><label for="">供应商编号</label><input type="text" value="'+data.detail[0].main_supcust+'" disabled></p>'+
									'</div>'+
									'<div>'+
										'<p class="gysWrap"><label for="">供应商名称</label><input type="text" value="'+data.detail[0].sup_name+'" disabled></p>'+
									'</div>'+
									'<div>'+
										'<p><label for="">备注</label><input type="text" placeholder="备注"></p>'+
									'</div>'+
								'</div>'+
							'</form>'+
						'</div>';
						spList.innerHTML += sp;			
					} 
		        }
		    });			    
		}	
	})
	// 修改数量
	$(document).on('blur','.changesl',function(){
		aim[0].num = $(this).val();
		
		$(this).attr('value',$(this).val());
		$('.changeje').attr('value',$(this).val()*aim[0].price)
	})


	// 修改单价
	$(document).on('blur','.changedj',function(){
		aim[0].price = $(this).val();
		$(this).attr('value',$(this).val());
		
		$('.changeje').attr('value',$(this).val()*aim[0].num)
	})

	// 保存商品信息
	$('.saveGoods').click(function(){
		$('#__layer-ball').fadeIn();
		$('.update-good').fadeOut();
		$('.listInfo').eq(aim[0].no).find('.left').children('p').eq(2).find('.num').find('input').attr('value',aim[0].num)
		num[aim[0].no]=aim[0].num;
		$('.totalNum').find('span').text(calNum());
		$('.listInfo').eq(aim[0].no).find('.left').children('p').eq(2).find('.price').find('input').attr('value',aim[0].price)
		$('.listInfo').eq(aim[0].no).find('.left').children('p').eq(2).find('.money').find('input').attr('value',aim[0].price*aim[0].num)
		slmoney[aim[0].no]=aim[0].price*aim[0].num;
		$('.totalMoney').find('span').text(calMoney());		
	})	
})