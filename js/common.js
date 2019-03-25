var num=[]; //商品数量
var slmoney=[];  //商品金额
var sheet_no;  //单据编号
var goods=[];
var item=[];

// 获取仓库
// 获取供应商
function getCk(){
	var str ="select branch_no,branch_name from t_bd_branch_info  where LEN(branch_no)=4 and  left(branch_no,2)=( SELECT sys_var_value FROM	t_sys_system  WHERE Upper(LTRIM(RTRIM(sys_var_id))) = Upper(LTRIM(RTRIM('g_branch_no')))) ";
	var str2 =" select supcust_no,isnull(sup_name,'') as sup_name,isnull(mobile,'0') as mobile,sale_way,isnull(check_out_day,'0') as check_out_day,isnull(sup_tel,'') as sup_tel,isnull(sup_man,'') as sup_man  from t_bd_supcust_info  where supcust_flag='S' AND (sale_way='A' or sale_way='B' or sale_way='F')";
	str = encodeURI(str);
	str2 = encodeURI(str2);
	var url = 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table';
	// alert(url)
	ajax('POST',url,JSON.stringify({                    
      	'comsql':str,
		'headsql':str2,
		'detailsql':''
    }),function(data) {
		var dj = '';
		var gys = '';
		var ck = document.getElementById('ck');
		var gysList = document.getElementById('gys');
		data = data.replace(/\\|\//g,'');
		data = JSON.parse(data);
		if (data.success) {
		    for (var i = 0; i < data.comm.length; i++) {
		    	dj+='<option branch_no='+data.comm[i].branch_no+'>'+data.comm[i].branch_name+'</option>'
		    }
		    ck.innerHTML = dj;

		    for (var i = 0; i < data.head.length; i++) {
		    	if (data.head[i].sale_way='A') {
		    	    data.head[i].sale_way="购销";
		    	} else if(data.head[i].sale_way='B') {
		    	    data.head[i].sale_way="代销";
		    	} else if(data.head[i].sale_way='C') {
		    	    data.head[i].sale_way="联营";
		    	} else if(data.head[i].sale_way='D') {
		    	    data.head[i].sale_way="租赁";
		    	} else if(data.head[i].sale_way='E') {
		    	    data.head[i].sale_way="自产";
		    	} else if(data.head[i].sale_way='F') {
		    	    data.head[i].sale_way="扣率代销";
		    	}
		    	gys+='<div class="gys">'+
		    			'<p class="title"><span><i>'+data.head[i].supcust_no+'</i><strong>'+data.head[i].sup_name+'</strong></span></p>'+
						'<p><span class="fl">经营方式:<i>'+data.head[i].sale_way+'</i></span><span class="fr">结算周期:<i>'+data.head[i].check_out_day+'</i></span></p>'+
						'<p><span>联系人:<i>'+data.head[i].sup_man+'&nbsp;&nbsp;'+data.head[i].sup_tel+'&nbsp;&nbsp;'+data.head[i].mobile+'</i></span></p>'+
					'</div>';
		    }
		    gysList.innerHTML = gys;
		} 
	})
}

// 搜索供应商
function sxGys(text){
	var str2 ="select supcust_no,isnull(sup_name,'') as sup_name,isnull(mobile,'0') as mobile,sale_way,isnull(check_out_day,'0') as check_out_day,isnull(sup_tel,'') as sup_tel,isnull(sup_man,'') as sup_man  from t_bd_supcust_info  where supcust_flag='S' AND (sale_way='A' or sale_way='B' or sale_way='F')  AND (supcust_no like '%"+text+"%') OR (sup_name like '%"+text+"%')";
	var url = 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table';
	ajax('POST',url,JSON.stringify({                    
      	'comsql':'',
		'headsql':str2,
		'detailsql':''
    }),function(data) {
		var gys = '';
		var gysList = document.getElementById('gys');
		data = data.replace(/\\|\//g,'');
		data = JSON.parse(data);
		if (data.success) {
		    if (data.head.length==0) {
		    	alert("无此供应商")
		    }else{
			    for (var i = 0; i < data.head.length; i++) {
			    	if (data.head[i].sale_way='A') {
			    	    data.head[i].sale_way="购销";
			    	} else if(data.head[i].sale_way='B') {
			    	    data.head[i].sale_way="代销";
			    	} else if(data.head[i].sale_way='C') {
			    	    data.head[i].sale_way="联营";
			    	} else if(data.head[i].sale_way='D') {
			    	    data.head[i].sale_way="租赁";
			    	} else if(data.head[i].sale_way='E') {
			    	    data.head[i].sale_way="自产";
			    	} else if(data.head[i].sale_way='F') {
			    	    data.head[i].sale_way="扣率代销";
			    	}
			    	gys+='<div class="gys">'+
			    			'<p class="title"><span><i>'+data.head[i].supcust_no+'</i><strong>'+data.head[i].sup_name+'</strong></span></p>'+
							'<p><span class="fl">经营方式:<i>'+data.head[i].sale_way+'</i></span><span class="fr">结算周期:<i>'+data.head[i].check_out_day+'</i></span></p>'+
							'<p><span>联系人:<i>'+data.head[i].sup_man+'&nbsp;&nbsp;'+data.head[i].sup_tel+'&nbsp;&nbsp;'+data.head[i].mobile+'</i></span></p>'+
						'</div>';
			    }
			    gysList.innerHTML = gys;		    	
		    }
		} 
	})
}

// 审核单据
function changeFlag(sheet_no){
    var url ='http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table';
    var master="update  t_pm_sheet_master set approve_flag='1',work_date=getdate(),confirm_man='"+user+"' where sheet_no='"+sheet_no+"'";

    $.ajax({
		url : url,
        type : "post",
        data : JSON.stringify({    
            'comsql':master,
			'headsql':'',
			'detailsql':''
	    }),
        async : false,
        success : function(data) {  
        	// data = JSON.stringify(data)   
        	$('.nowState').attr('value',"已审核")
        }    	
    })				
}

function getDj(sheet_no){
    var url ='http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table';
    var master="select CONVERT(varchar(100),oper_date,23) as oper_date ,(case approve_flag when '0' then '未审核'  when '1' then '已审核' else '其他' end ) as approve_flag,a.sheet_amt, a.sheet_no,a.supcust_no ,b.sup_name,a.branch_no,c.branch_name   from  t_pm_sheet_master a,t_bd_supcust_info  b,t_bd_branch_info c where a.supcust_no=b.supcust_no and a.branch_no=c.branch_no and a.sheet_no='"+sheet_no+"'";
    var detail="select dbo.f_get_stock_qty(b.item_no) as kc, a.real_qty, a.sheet_no,b.item_subno,b.price, b.sale_price, a.item_no, b.item_name ,a.real_qty  from  t_pm_sheet_detail a ,t_bd_item_info b where a.item_no=b.item_no and a.sheet_no='"+sheet_no+"'";
    $.ajax({
		url : url,
        type : "post",
        data : JSON.stringify({    
            'comsql':'',
			'headsql':master,
			'detailsql':detail
	    }),
        async : false,
        success : function(data) { 
        	data = JSON.stringify(data)
        	alert(data)
        	data=JSON.parse(data)
        	// 表头
        	if (data.head.length==1) {
        		// alert(data.head[0].approve_flag)
        		// alert(data.head[0].oper_date)
        		$('#item_no').attr('value',data.head[0].sheet_no).attr('disabled','disabled')
        	    $('.xqrq').attr('value',data.head[0].oper_date).attr('disabled','disabled')
        	    $('#ck').attr('value',data.head[0].branch_name).attr('disabled','disabled')
        	    $('.nowState').attr('value',data.head[0].approve_flag).attr('disabled','disabled')
        	    $('.gysIpt').attr('value',data.head[0].sup_name).attr('disabled','disabled')
        	    $('.tm').attr('disabled','disabled')
        	} else {
        		$('.xqrq').attr('value','')
        	}

        	// 表体
			var sp = '';
			for (var i = 0; i < data.detail.length; i++) {
				if ($('.nowState').attr('value')=='已审核') {
					sp += '<div class="listInfo">'+
							'<div class="left">'+
								'<p class="area">'+
									'<i class="queue">'+toTwo((parseFloat($('.queue').length)+1))+'</i>'+
									'<span class="name">'+data.detail[i].item_name+'</span>'+
								'</p>'+
								'<p>'+
									'<strong class="tm">条码：<span>'+data.detail[i].item_no+'</span></strong>'+
									'<strong class="zbm">自编码：<span>'+data.detail[i].item_subno+'</span></strong>'+
									'<strong class="ls">零售价：<span>'+data.detail[i].sale_price+'</span>元</strong>'+
								'</p>'+
								'<p>'+
									'<strong class="kc">库存(盒):<span>'+data.detail[i].kc+'</span></strong>'+
									'<strong class="num">数量(盒):<input type="number" disabled="disabled" value="'+data.detail[i].real_qty+'" class="numIpt"></strong>'+
									'<strong class="price">单价(元):<input type="number" disabled="disabled" value="'+data.detail[i].price+'" class="priceIpt"></strong>'+
									'<strong class="money">金额(元):<input type="number" disabled="disabled" value="'+data.detail[i].price*data.detail[i].real_qty+'"></strong>'+
								'</p>	'+			
							'</div>'+
							'<div class="right">'+
								'<span class="fa fa-square-o xz" on="true"></span>'+
								'<span class="delete fa fa-trash"></span>'+
							'</div>'+
						'</div>';
				} else {
					sp += '<div class="listInfo">'+
							'<div class="left">'+
								'<p class="area">'+
									'<i class="queue">'+toTwo((parseFloat($('.queue').length)+1))+'</i>'+
									'<span class="name">'+data.detail[i].item_name+'</span>'+
								'</p>'+
								'<p>'+
									'<strong class="tm">条码：<span>'+data.detail[i].item_no+'</span></strong>'+
									'<strong class="zbm">自编码：<span>'+data.detail[i].item_subno+'</span></strong>'+
									'<strong class="ls">零售价：<span>'+data.detail[i].sale_price+'</span>元</strong>'+
								'</p>'+
								'<p>'+
									'<strong class="kc">库存(盒):<span>'+data.detail[i].kc+'</span></strong>'+
									'<strong class="num">数量(盒):<input type="number" value="'+data.detail[i].real_qty+'" class="numIpt"></strong>'+
									'<strong class="price">单价(元):<input type="number" value="'+data.detail[i].price+'" class="priceIpt"></strong>'+
									'<strong class="money">金额(元):<input type="number" disabled="disabled" value="'+data.detail[i].price*data.detail[i].real_qty+'"></strong>'+
								'</p>	'+			
							'</div>'+
							'<div class="right">'+
								'<span class="fa fa-square-o xz" on="true"></span>'+
								'<span class="delete fa fa-trash"></span>'+
							'</div>'+
						'</div>';				    
				}

					num.push(data.detail[i].real_qty);
					slmoney.push(data.detail[i].price*data.detail[i].real_qty);
			}
			$('#list-info').append(sp);
			// if (data.detail.length==0) {
			// 	alert("无此商品")
			// }
			$('.totalNum').find('span').text(calNum());
			$('.totalMoney').find('span').text(calMoney());
        }    	
    })				
}





/**********************************************************************/
// 添加商品（根据编号）（可删除）
function addGoods(tm){
	var str="select item_no,item_name,item_subno,item_clsno,item_brand,product_area,price,base_price,sale_price,vip_price,purchase_tax,sale_tax,main_supcust ,dbo.f_get_stock_qty(item_no) as kc from t_bd_item_info where item_no='"+tm+"' ";
	str = encodeURI(str);;
	var url= 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table';
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
			var ck = document.getElementById('list-info');
			var sp = '';
			var money = 0;
			for (var i = 0; i < data.detail.length; i++) {
				sp += '<div class="listInfo">'+
						'<div class="left">'+
							'<p class="area">'+
								'<i class="queue">'+toTwo((parseFloat($('.queue').length)+1))+'</i>'+
								'<span class="name">'+data.detail[i].item_name+'</span>'+
							'</p>'+
							'<p>'+
								'<strong class="tm">条码：<span>'+data.detail[i].item_no+'</span></strong>'+
								'<strong class="zbm">自编码：<span>'+data.detail[i].item_subno+'</span></strong>'+
								'<strong class="ls">零售价：<span>'+data.detail[i].sale_price+'</span>元</strong>'+
							'</p>'+
							'<p>'+
								'<strong class="kc">库存(盒):<span>'+data.detail[i].kc+'</span></strong>'+
								'<strong class="num">数量(盒):<input type="number" value="1" class="numIpt"></strong>'+
								'<strong class="price">单价(元):<input type="number" value="'+data.detail[i].price+'" class="priceIpt"></strong>'+
								'<strong class="money">金额(元):<input type="number" value="'+data.detail[i].price+'"></strong>'+
							'</p>	'+			
						'</div>'+
						'<div class="right">'+
							'<span class="fa fa-square-o xz" on="true"></span>'+
							'<span class="delete fa fa-trash"></span>'+
						'</div>'+
					'</div>';
					num.push('1');
					slmoney.push(data.detail[i].price);
			}
			ck.innerHTML += sp;
			if (data.detail.length==0) {
				alert("无此商品")
			}
			$('.totalNum').find('span').text(calNum());
			$('.totalMoney').find('span').text(calMoney());
	    }
	 });	
}

// 修改商品（根据编号）
function changeGoods(tm,ob){
	var str="select item_no,item_name,item_subno,item_clsno,item_brand,product_area,price,base_price,sale_price,vip_price,purchase_tax,sale_tax,main_supcust ,dbo.f_get_stock_qty(item_no) as kc from t_bd_item_info where item_no='"+tm+"' ";
	str = encodeURI(str);;
	var url= 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table';
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
			var ck = document.getElementById('list-info');
			var sp = '';
			var money = 0;
			for (var i = 0; i < data.detail.length; i++) {
				sp += '<div class="listInfo">'+
						'<div class="left">'+
							'<p class="area">'+
								'<i class="queue">'+toTwo((parseFloat($('.queue').length)+1))+'</i>'+
								'<span class="name">'+data.detail[i].item_name+'</span>'+
							'</p>'+
							'<p>'+
								'<strong class="tm">条码：<span>'+data.detail[i].item_no+'</span></strong>'+
								'<strong class="zbm">自编码：<span>'+data.detail[i].item_subno+'</span></strong>'+
								'<strong class="ls">零售价：<span>'+data.detail[i].sale_price+'</span>元</strong>'+
							'</p>'+
							'<p>'+
								'<strong class="kc">库存(盒):<span>'+data.detail[i].kc+'</span></strong>'+
								'<strong class="num">数量(盒):<input type="number" value="1" class="numIpt"></strong>'+
								'<strong class="price">单价(元):<input type="number" value="'+data.detail[i].price+'" class="priceIpt"></strong>'+
								'<strong class="money">金额(元):<input type="number" value="'+data.detail[i].price+'"></strong>'+
							'</p>	'+			
						'</div>'+
						'<div class="right">'+
							'<span class="fa fa-square-o xz" on="true"></span>'+
							'<span class="delete fa fa-trash"></span>'+
						'</div>'+
					'</div>';
					num.push('1');
					slmoney.push(data.detail[i].price);
			}
			ck.innerHTML += sp;
			if (data.detail.length==0) {
				alert("无此商品")
			}
			$('.totalNum').find('span').text(calNum());
			$('.totalMoney').find('span').text(calMoney());
	    }
	 });	
}

// 全部
function all(){
	var str="SELECT item_clsno,item_clsname ,cls_parent FROM [t_bd_item_cls]";
	var goods = "select top 10 item_no,item_name,item_subno,item_clsno,item_brand,product_area,price,base_price,sale_price,vip_price,trans_price,purchase_tax,sale_tax,main_supcust,(select sup_name from t_bd_supcust_info where t_bd_supcust_info.supcust_no=t_bd_item_info.main_supcust) as sup_name ,dbo.f_get_stock_qty(item_no) as kc from t_bd_item_info";
	ajax('POST','http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table',JSON.stringify({                    
        'comsql':str,
		'headsql':goods,
		'detailsql':''
    }),
	function(data) {
		var lb = document.getElementById('lb');
		var spList = document.getElementById('sp');

		var dj = "";
		var sp="";
		data = JSON.parse(data);

		for (var i = 0; i < data.comm.length; i++) {

			if ($.trim(data.comm[i].cls_parent).length=='1'||$.trim(data.comm[i].cls_parent).length=='0') {
				if ($.trim(data.comm[i].cls_parent)==' ') {
				   cls = 'pa';
				} else {
				   cls = $.trim(data.comm[i].cls_parent);
				}
			    dj+='<li mid="'+$.trim(data.comm[i].item_clsno)+'" class="pa">'+data.comm[i].item_clsname+'</li>';
			} else{
				dj+='<li mid="'+$.trim(data.comm[i].item_clsno)+'" class="'+$.trim(data.comm[i].cls_parent)+' show">'+data.comm[i].item_clsname+'</li>';
			}					
		}
		for (var i = 0; i < data.head.length; i++) {
			sp+='<div class="goods clearfix '+$.trim(data.head[i].item_clsno)+'">'+
			'<img src="images/1.jpg">'+
			'<div class="goodsInfo">'+
				'<p class="goodsName"><span class="fl">'+data.head[i].item_name+'</span><span class="fa fa-square-o fr"></span></p>'+

				'<p class="goodsTm">条码：<span>'+data.head[i].item_no+'</span></p>'+
				'<p class="goodsZbm">字编码：<span>'+data.head[i].item_subno+'</span></p>'+

				'<p class="goodsJj">进价:<span>'+data.head[i].price+'</span>元</p>'+
				'<p class="goodsLs">零售价：<span>'+data.head[i].sale_price+'</span>元</p>'+
				'<p class="goodsHy">会员价：<span>'+data.head[i].vip_price+'</span>元</p>'+

				'<p class="goodsPf">批发价:<span>'+data.head[i].base_price+'</span>元</p>'+
				'<p class="goodsPs">配送价：<span>'+data.head[i].trans_price+'</span>元</p>'+
				'<p class="goodsKc">库存：<span>'+data.head[i].kc+'</span>个</p>'+

				'<p class="goodsBh">供应商编号：<span>'+data.head[i].main_supcust+'</span></p>'+
				'<p class="goodsMc">供应商名称：<span>'+data.head[i].sup_name+'</span></p>'+				
			'</div>'+
		'</div>';
		}	
		lb.innerHTML = dj;
		spList.innerHTML = sp;
	})		
}
// 根据类型显示商品
function syGoods(lb){
	var goods="select top 10 item_no,item_name,item_subno,item_clsno,item_brand,product_area,price,base_price,sale_price,vip_price,trans_price,purchase_tax,sale_tax,main_supcust,(select sup_name from t_bd_supcust_info where t_bd_supcust_info.supcust_no=t_bd_item_info.main_supcust) as sup_name ,dbo.f_get_stock_qty(item_no) as kc from t_bd_item_info  where item_clsno like '"+lb+"%'";
	ajax('POST','http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table',JSON.stringify({                    
        'comsql':'',
		'headsql':goods,
		'detailsql':''
    }),
	function(data) {
		var spList = document.getElementById('sp');		
		var sp="";
		data = JSON.parse(data);
		for (var i = 0; i < data.head.length; i++) {
			sp+='<div class="goods clearfix '+$.trim(data.head[i].item_clsno)+'">'+
			'<img src="images/1.jpg">'+
			'<div class="goodsInfo">'+
				'<p class="goodsName"><span class="fl">'+data.head[i].item_name+'</span><span class="fa fa-square-o fr"></span></p>'+

				'<p class="goodsTm">条码：<span>'+data.head[i].item_no+'</span></p>'+
				'<p class="goodsZbm">字编码：<span>'+data.head[i].item_subno+'</span></p>'+

				'<p class="goodsJj">进价:<span>'+data.head[i].price+'</span>元</p>'+
				'<p class="goodsLs">零售价：<span>'+data.head[i].sale_price+'</span>元</p>'+
				'<p class="goodsHy">会员价：<span>'+data.head[i].vip_price+'</span>元</p>'+

				'<p class="goodsPf">批发价:<span>'+data.head[i].base_price+'</span>元</p>'+
				'<p class="goodsPs">配送价：<span>'+data.head[i].trans_price+'</span>元</p>'+
				'<p class="goodsKc">库存：<span>'+data.head[i].kc+'</span>个</p>'+

				'<p class="goodsBh">供应商编号：<span>'+data.head[i].main_supcust+'</span></p>'+
				'<p class="goodsMc">供应商名称：<span>'+data.head[i].sup_name+'</span></p>'+				
			'</div>'+
		'</div>';
		}
		spList.innerHTML = sp;
	})	
}

// 搜索商品
function sx(text){
	var goods = "select item_no,item_name,item_subno,item_clsno,item_brand,product_area,price,base_price,sale_price,vip_price,purchase_tax,sale_tax,main_supcust  from t_bd_item_info where item_no like '%"+text+"%' or item_name like '%"+text+"%'";
	ajax('POST','http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+user+'&pass='+pass+'&cmd=table',JSON.stringify({                    
        'comsql':'',
		'headsql':goods,
		'detailsql':''
    }),
	function(data) {
		var spList = document.getElementById('sp');		
		var sp="";
		data = JSON.parse(data);
		for (var i = 0; i < data.head.length; i++) {
			sp+='<div class="goods clearfix '+$.trim(data.head[i].item_clsno)+'">'+
			'<img src="images/1.jpg">'+
			'<div class="goodsInfo">'+
				'<p class="goodsName"><span class="fl">'+data.head[i].item_name+'</span><span class="fa fa-square-o fr"></span></p>'+

				'<p class="goodsTm">条码：<span>'+data.head[i].item_no+'</span></p>'+
				'<p class="goodsZbm">字编码：<span>'+data.head[i].item_subno+'</span></p>'+

				'<p class="goodsJj">进价:<span>'+data.head[i].base_price+'</span>元</p>'+
				'<p class="goodsLs">零售价：<span>'+data.head[i].sale_price+'</span>元</p>'+
				'<p class="goodsHy">会员价：<span>'+data.head[i].vip_price+'</span>元</p>'+

				'<p class="goodsPf">批发价:<span>'+data.head[i].base_price+'</span>元</p>'+
				'<p class="goodsPs">配送价：<span>'+data.head[i].base_price+'</span>元</p>'+
				'<p class="goodsKc">库存：<span>'+data.head[i].main_supcust+'</span>个</p>'+

				'<p class="goodsBh">供应商编号：<span>'+data.head[i].main_supcust+'</span></p>'+
				'<p class="goodsMc">供应商名称：<span>'+data.head[i].sup_name+'</span></p>'+				
			'</div>'+
		'</div>';
		}
		spList.innerHTML = sp;
	})
}

// 添加商品信息
function GetInfo(item_no){
    var str = "select item_no,item_name,item_subno,item_clsno,item_brand,product_area,price,base_price,sale_price,vip_price,trans_price,purchase_tax,sale_tax,main_supcust,(select sup_name from t_bd_supcust_info where t_bd_supcust_info.supcust_no=t_bd_item_info.main_supcust) as sup_name ,dbo.f_get_stock_qty(item_no) as kc from t_bd_item_info  where item_no='"+item_no+"'";
	var url = 'http://'+port+'/buy.ashx?oper=1&mobile='+mobile+'&user='+pass+'&pass='+pass+'&cmd=table';
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
        	data = JSON.stringify(data)
        	// console.log(data)
        	data = JSON.parse(data)
			if (data.success=='true') {
				var spList = document.getElementById('tk');		
				var sp="";			
				sp+='<div class="goods">'+
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
								'<p><label for="">数量</label><input type="number" class="sl" value="1"></p>'+

								'<p>'+
									'<label for="">单位</label>'+
									'<span class="nowUnit unit">盒</span>'+
									'<span class="unit">箱</span>'+
								'</p>'+
							'</div>'+
							'<div>'+
								'<p><label for="">进价</label><input type="number"  value="'+data.detail[0].price+'"></p>'+
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
								'<p><label for="">零售价</label><input type="number" class="dj" value="'+data.detail[0].sale_price+'"></p>'+
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
								'<p><label for="">金额</label><input type="number" class="je" value="'+data.detail[0].sale_price+'"></p>'+
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
				goods.push(
					{
						"item_name":data.detail[0].item_name,
						"item_no":data.detail[0].item_no,
						"item_subno":data.detail[0].item_subno,

						"price":data.detail[0].price,
						"sale_price":data.detail[0].sale_price,
						"vip_price":data.detail[0].vip_price,
						"base_price":data.detail[0].base_price,
						"trans_price":data.detail[0].trans_price,

						"sl":1,
						"zk":1,
						'kc':data.detail[0].kc
					}
				)				
			} 
			// console.log(goods)
        }
    });
}
// 删除商品验证
function delete_goods_confirm(name){
	var r = confirm("是否删除 "+name);
	if (r==true) {
	    return true;
	} else {
	    return false;
	}
}

// 商品排序
function sortGoods(){	
	$('.queue').each(function(i,elem){
		$(elem).text(toTwo(i+1))
	})
}

// 计算总数
function calNum(){
	var totalNum =0;
	for (var i = 0; i < num.length; i++) {
		totalNum+=parseFloat(num[i]);
	}
	return totalNum.toFixed(2);
}
// 计算总额
function calMoney(){
	var totalMoney =0;
	for (var i = 0; i < slmoney.length; i++) {
		totalMoney+=parseFloat(slmoney[i]);
	}
	return totalMoney.toFixed(2);
}
function toTwo(num){
	if (num<9) {
		return '0'+num;
	} else {
		return num;
	}
}
//获取客户端url的search参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}