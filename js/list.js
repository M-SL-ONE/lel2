var dl;
var listInfo=[];
var saveStr='';
var uid=[];
var nowNum = 0;
var totalNum =0;
var totalMoney =0;



var sup_name;
var branch_name;
$(function(){



	$('.totalNum').find('span').text(calNum());
	

	// setInterval(function(){
	// 	text = $('#searchGys').val();//获取文本框输入
	// 	if($.trim(text) != ""){
	// 		$('.serach-list').find("ul").hide().filter(":contains('"+text+"')").show();
	// 	}
	// },100);	


	//初始化日期插件	
	// $('.xqrq').date();	

	






	$('.tm').focus(function(){
		$(this).attr('value','');
	})
	$('.tm').blur(function(){
		$(this).attr('value',$(this).val())
	})



	$('.save').click(function(){
		if ($('.nowState').val()!="已审核") {
		    $('.nowState').attr('value','未审核');
		} 
	})
	// $('.sh').click(function(){
	// 	if ($('.nowState').val()=="已审核") {
	// 	    alert("该单据已审核过")
	// 	} else {
	// 		changeFlag(sheet_no)	    
	// 	}
	// })
	// 商品排序
	sortGoods();

	// 单独选
	$(document).on('click','.xz',function(){
		$(this).toggleClass('fa-square-o').toggleClass('fa-check-square-o');
	});

	// 单独删除
	$(document).on('click','.delete',function(){
		if ($('.nowState').val()=="已审核") {
			alert("审核过的不能删除")
		} else {
			if (delete_goods_confirm($(this).parent().prev().children('p').eq(0).find('span').text())) {
				// 数量
				num.splice($(this).parent().parent().index(),1);
				$('.totalNum').find('span').text(calNum());
				slmoney.splice($(this).parent().parent().index(),1);
				$('.totalMoney').find('span').text(calMoney());
			    $(this).parent().parent().remove();
				sortGoods();	
			}
		} 
	});	




	
	// 全选
	$(document).on('click','.qxGoods',function(){
		$('.xz').removeClass('fa-square-o').addClass('fa-check-square-o');	
	});
	// 全不选
	$(document).on('click','.qbxGoods',function(){
		$('.xz').removeClass('fa-check-square-o').addClass('fa-square-o');	
	});


	// 设置商品序号
	for (var i = 0; i < $('.goods-list').length; i++) {
		$('.goods-list').eq(i).children('dl').each(function(j,elem){
			$(elem).attr('on','false');
			$(elem).find('div').find('dt').find('i').text(j+1);
		})
	}
	// 选择商品
	$('.goods-list').children('dl').each(function(i,elem){
		
		$(elem).click(function(){
			$(this).siblings().find('div').find('dt').find('span').removeClass('fa-check-square-o').addClass('fa-square-o');
			$(this).siblings().attr('on','false');
			if ($(elem).attr('on')=='true') {
				$(this).find('div').find('dt').find('span').removeClass('fa-check-square-o').addClass('fa-square-o');
				$(elem).attr('on','false');
			} else {
				$(this).find('div').find('dt').find('span').removeClass('fa-square-o').addClass('fa-check-square-o');
				$(elem).attr('on','true');
			}
		})
	})	

	// 确定商品
	for (var i = 0; i < $('.goods').length; i++) {
		$('.goods').eq(i).attr('on','false');
	}



	var text = "";
	var n=-1;

	var queue=1;

	$('.goods').each(function(i,elem){
		$(elem).click(function(){
			// alert($(this).index()+''+$(this).parent().index())
			$(this).find('.goodsInfo').find('.goodsName').find('.fa').toggleClass('fa-square-o').toggleClass('fa-check-square-o')
		})
	})
})














