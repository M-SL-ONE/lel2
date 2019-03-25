var colorList = ['#fe2c4f','#fe7d00','#ff8105','#fd9a15','#dfad1c','#6bc211','#3cc71e','#51b2ef'];
$(function(){
	for (var i = 0; i < $('.shop-list').children('dl').length; i++) {		
		for (var j = 0; j < $('.shop-list').children('dl').eq(i).children('dd').length; j++) {
			$('.shop-list').children('dl').eq(i).children('dd').eq(j).find('a').find('i').css('color',colorList[j%colorList.length])
		}
	}	

	$(document).on('click','.pf',function(){
		$(this).attr('href',$(this).attr('href')+window.location.search)
	})
})