/*** ★★★★★★★★★★★★
 **JQuery数字键盘插件
 * 作者: 陈海瑞
 * 时间：2017.11.28 00:53
★★★★★★★★★★★★ */

/*+--------------------------------------------------------------------------------------------+*/
(function($) {
	$.fn.extend({
	 checkNum: function(options) {
		 
		 var defaults = {
			 object:null, //当前调用数字键盘的元素对象(返回给前台页面,方便调用) 前台调用方法eg1. this.object[0].id; //当前元素的ID  eg2.this.object[0].className; //当前元素class
			 title:'数字键盘',
			 hasPoint:true, //是否有小数点(可缺省),默认true
			 minimum:null, //输入最小值(可缺省)
			 maximum:null, //输入最大值(可缺省)
			 keyCallBack:null, //点击数字键盘按键时的回调函数
			 eleCallBack:null, //点击元素时的回调函数(元素指调用本插件的元素)
			 closeCallBack:null  //关闭数字键盘时的回调函数
		 }
			var settings = $.extend({},defaults,options);
			var classPoint = settings.hasPoint==true ? '' : ' style="display:none;"';
			
			this.each(function() {
				 var $this = $(this);
				 settings.object = $this; //当前元素对象
				 $this.parent().css('position','relative'); //添加relative属性，不然假光标可能太长！//add 201809
				 var classname = $this[0].className; //当前选择器class
				 var id = $this.attr('id'); //当前选择器ID
				 var selector = '.' + classname;
				 if (classname == '') var selector = '#' + id;
				
						 $this.on('click input', function(event) {
		
							 	$('.layer-content').remove(); //关闭数字键盘(必须!)
							 
								 //生成数字键盘节点
								 var html = '<div class="layer-content">';
								 html	+= '<div class="form_title">'+settings.title+'</div>';
								 html += '<div class="form_edit clearfix"><div class="num">1</div><div class="num">2</div><div class="num">3</div><div class="num">4</div><div class="num">5</div><div class="num">6</div><div class="num">7</div><div class="num">8</div><div class="num">9</div><div class="num"'+classPoint+'>.</div><div class="num">0</div><div id="remove">删除</div></div>';
									html += '<div class="form_complete">完成</div>';
									html += '</div>';		 
								 if($('.layer-content').length==0){
									 $('body').append(html);
								 }
								 
								 
								
								 //======如果元素被数字键盘遮盖住 ，则元素向上滚动，摆脱被遮住
								 var winH = $(window).height(); 			//视窗高度
								 var scrollT = $(window).scrollTop(); //滚动条滚动的距离
								 var docH = $(document).height(); //整个文档的高度，body的高度. 关系：scrollHeight = winH + scrollT
								 var height = $this.get(0).offsetHeight; //当前元素的高度
								 var topH = $this.offset().top - scrollT; //当前元素距离顶部的距离
								 var botH = winH - topH - height; //当前元素距离底部的距离
								 var numH = $('.layer-content').get(0).offsetHeight; //数字键盘高度
								 var scrollH = scrollT + (numH - botH) + 20; //要滚动的距离(至少保证当前元素不被数字键盘遮盖住：numH - botH)
								 //console.log('视窗高度',winH,'\n滚动条滚动的距离：',scrollT,'\n文档的高度：',docH,'\n当前元素的高度：',height,'\n前元素距离顶部的距离：',topH,'\n当前元素距离底部的距离：',botH,'\n数字键盘高度：',numH,'\n要滚动的距离：'+scrollH);
							
								 var bodyPadding = function(){
									 var paddingH = winH+scrollH - docH;
									 $('body').css('padding-bottom',paddingH);
								 }

									//如果当前元素距离底部的距离<=数字键盘的高度(即当前元素被数字键盘遮挡住了)
								 if(botH<=numH){
									 //alert('当前元素被数字键盘遮挡住了');
									 if(winH+scrollT<docH){ //===①如果滚动条还能上拉
										 if(winH+scrollH>docH){ //case1：如果滚着滚着滚到底了，不能再滚动了，此时只能通过设置padding了
											 //alert('111');
											 bodyPadding();
										 }else{ //case2:怎么滚都滚不到底,不用设置padding
												//alert('222'); 
										 }
										 $('html,body').animate({scrollTop:scrollH},200);
										 
									 }else{//===②滚动条无法上拉(页面已经滚动到底部了,当前元素还是被遮挡住了,此时只能通过设置padding了)
											//alert('333');
											bodyPadding();
											$('html,body').animate({scrollTop:scrollH},200);
									 }	 
								 }


									event.stopPropagation(); //阻止冒泡(必须!)
									
									if(settings.eleCallBack) settings.eleCallBack(); //点击元素时的回调函数
									
									if(typeof(keyboardUi.showCursor)=='function' && typeof(keyboardUi.removeCursor)=='function') {
										keyboardUi.removeCursor($this);//移除所有假光标 add 20180507-1
										keyboardUi.showCursor($this); //添加假光标 
									}

								 //======点击数字键盘及当前点击的元素以外的区域时隐藏/删除数字键盘
								 $(document).on('click', function(e) {
										if ($(e.target).closest(selector).length != 0) return; //e.target.closest(selector).length==0 说明点击的不是元素selector区域,反之则是
										isInputLegal($this);//检验输入是否合法 add 20181126
										$('body').removeAttr('style'); //移除html,body设置的style样式 add 20171220-1
									 	//$('.layer-content').remove();
									 	$('.layer-content').slideUp(500,function(){
											$(this).remove();
											if(settings.closeCallBack) settings.closeCallBack(); //关闭数字键盘时的回调函数
									 	})
										
										if(typeof(keyboardUi.removeCursor)=='function') keyboardUi.removeCursor($this); //移除当前节点以外的所有假光标
										//e.stopPropagation(); //这句不能加，不然会影响其它控件
								 })

								 //======数字键事件
								 $('.form_edit .num').on('click', function(e) {
										 e.preventDefault(); //防止手机端输入时屏幕移动
										 var type = $this[0].tagName.toLocaleLowerCase(); //绑定元素的类型（即标签名称):input span div select 
										 //console.log('点击数字键，当前点击的元素类型为：',type);
										 if(type!='input'){ //div,span等元素时
											 var html = $this.html();
											 html += this.innerHTML;
											 $this.html(html);
										 }else{ //input元素时
											 var value = $this.val();
											 value += this.innerHTML;
											 $this.val(value);
										 }
		
										 if(typeof(keyboardUi.removeCursor)=='function') keyboardUi.removeCursor($this); //移除当前节点以外的所有假光标
										 
										if(settings.keyCallBack) settings.keyCallBack(); //点击数字键盘按键时的回调函数
										
				
										e.stopPropagation(); //阻止冒泡(让点击数字键盘以外的区域隐藏/删除数字键盘事件不生效)
										
										
								 });

								 //======删除事件
								 $('#remove').on('click', function(e) {
										 e.preventDefault(); //防止手机端输入时屏幕移动
										 var type = $this[0].tagName.toLocaleLowerCase(); //绑定元素的类型（即标签名称):input span div select 
										 //console.log('点击删除键，当前点击的元素类型为：',type);
										 if(type!='input'){	//input输入框时
											 var oDivHtml = $this.html();
											 $this.html(oDivHtml.substring(0, oDivHtml.length - 1));
										 }else{	//div,span等元素时
											 var oDivValue = $this.val();
											 $this.val(oDivValue.substring(0, oDivValue.length - 1));
										 }									 
					
										 if(typeof(keyboardUi.removeCursor)=='function') keyboardUi.removeCursor($this); //移除当前节点以外的所有假光标
										 if(settings.keyCallBack) settings.keyCallBack(); //点击数字键盘按键时的回调函数
										 e.stopPropagation();
										 
								 });
								 
								 
								 //======完成输入事件
								 $('.form_complete').on('click', function(e) {
									 	$('body').removeAttr('style'); //移除html,body设置的style样式add 20171220-1
										 //$('.layer-content').remove();
										$('.layer-content').slideUp(500,function(){
											 $(this).remove();
										});	
										
										if(settings.closeCallBack) settings.closeCallBack(); //关闭数字键盘时的回调函数
										
										/*
										if(settings.minimum!=null || settings.maximum!=null){ //检查输入值是否合法
											var value = parseFloat(keyboardUi.getEleValue($this));
											if(value<settings.minimum || value > settings.maximum){
												keyboardUi.alert(settings.minimum,settings.maximum); 
											}
											$(document).on('click','#confirm_alert',function(){
												if(value<settings.minimum) keyboardUi.giveEleValue($this,settings.minimum);
												if(value>settings.maximum) keyboardUi.giveEleValue($this,settings.maximum);
												$(this).parent().remove();
												$('.keyboard_mask').remove();
											})
										}
										*/
										
										isInputLegal($this);//检验输入是否合法 edit 20181126
										
										
										
										if(typeof(keyboardUi.removeCursor)=='function') keyboardUi.removeCursor($this); //移除当前节点以外的所有假光标	 
									 	e.stopPropagation();
										
								 });
								 
						 }) //end this.on('click')
						 
						 
						 
						 /**
						 *检查输入值是否合法(介于最大值与最小值之间)
						 *@param inputObject 当前输入框对象
						 * add 20181126
						 */
						 function isInputLegal(inputObject){
								if(settings.minimum!=null || settings.maximum!=null){
									var value = parseFloat(keyboardUi.getEleValue(inputObject));
									var smaller = 'data-smaller',
											larger = 'data-larger';		
									if(Array.isArray(settings.minimum)){
										for(var i=0;i<settings.minimum.length;i++){
											var id = settings.minimum[i].id.replace('#','').replace('.','');
											if(inputObject[0].id==id || inputObject[0].className==id){
												if(value<settings.minimum[i].value){
													inputObject.attr(smaller,settings.minimum[i].value);
													var end = '';
													if(Array.isArray(settings.maximum)){
														if(settings.maximum[i].id.replace('#','').replace('.','')==id)
														end = settings.maximum[i].value;
													}
													keyboardUi.alert(settings.minimum[i].value,end); 
												}
											}
											
										}
									}else{
										if(value<settings.minimum) keyboardUi.alert(settings.minimum,''); 
									}							
									if(Array.isArray(settings.maximum)){
										for(var i=0;i<settings.maximum.length;i++){
											var id = settings.maximum[i].id.replace('#','').replace('.','');
											if(inputObject[0].id==id || inputObject[0].className==id){
												if(value>settings.maximum[i].value){
													inputObject.attr(larger,settings.maximum[i].value);
													var start = '';
													if(Array.isArray(settings.minimum)){
														if(settings.minimum[i].id.replace('#','').replace('.','')==id)
														start = settings.minimum[i].value;
													}
													keyboardUi.alert(start,settings.maximum[i].value); 
												}
											}
										}
									}else{
										if(value>settings.maximum) keyboardUi.alert('',settings.maximum); 
									}
									
									$(document).on('click','#confirm_alert',function(){ //关闭确认窗口时
										if(Array.isArray(settings.minimum)){
											var s_value = typeof(inputObject.attr(smaller))=='undefined' ? '' : inputObject.attr(smaller);
											if(s_value!='') keyboardUi.giveEleValue(inputObject,s_value);
										}else{
											if(value<settings.minimum) keyboardUi.giveEleValue(inputObject,settings.minimum);
										}
										
										if(Array.isArray(settings.maximum)){
											var l_value = typeof(inputObject.attr(larger))=='undefined' ? '' :　inputObject.attr(larger);
											if(l_value!='') keyboardUi.giveEleValue(inputObject,l_value);
										}else{
											if(value>settings.maximum) keyboardUi.giveEleValue(inputObject,settings.maximum);
										}
	
										$(this).parent().remove();
										$('.keyboard_mask').remove();
									})	
								}
								
						 } //END OF FUNCTION isInputLegal
						 

				 }) //end $this.each
		 }
 });


})(jQuery);




/*+--------------------------------------------------------------------------------------------+*/
/* keyboardVisualLength()函数
* Jquery获取文本长度（单位:px) add 2018.4.17
* 思路：直接在String的原型中添加获取文字宽度的函数
* 主要思路是添加一个隐藏的标签(eleLenRuler)，每次对该标签赋值后，通过获取该标签的长度来获取文字宽度。需要注意的是，只有已经被添加到DOM中的标签才能获取长度。 
* eg. var len = $('#input').val().keyboardVisualLength();
*/
String.prototype.keyboardVisualLength = function() {
	//根据屏幕分辨率判断当前网页字体大小 add 20180509-1
	var size = '16px';
	var w = $(window).width();
	if(w<=360&&w>=320) size='12px';
	if(w>360&&w<400) size='14px';
	if(w>=400) size='14.93333px';
	if(w>=414) size='14.70px';
	if(w>=480) size='17.92px';
	
	var node = 'eleLenRuler';
	var _str = '<span id="'+node+'" style="visibility: hidden;white-space:nowrap;font-size:'+size+'"></span>'; //font-size大小也会影响文字宽度(一般网页默认字体大小为16px) edit 20180509-1
	$('body').append(_str);
	var ruler = $('#'+node);
	ruler.text(this);
	return ruler[0].offsetWidth;
}




/*+--------------------------------------------------------------------------------------------+*/
/***************
*keyboardUi对象
****************/
var keyboardUi = {
	
	/*
	*函数:添加假光标
	*/
	showCursor:function(obj){
		/*
		var value = pickUp.getEleValue(obj);
		var width = 25 + (value.length * 16); //文字宽度(大概值)
		*/
		var width = 0;
		var prevW = 0; 		//当前元素前面所有元素的宽度总和 add 20180427-1
		var iconLen = 10; //input|span标签一般都有padding左右值10px左右
		if($(obj).length>0) {
			if($(obj)[0].className.indexOf('icon')>=0) iconLen = 28; //元素内左侧icon图标宽度
			prevW = typeof($(obj).prevAll().outerWidth())=='undefined' ? 0 : $(obj).prevAll().outerWidth()+12; //当前元素前面的节点
			width = iconLen + prevW +keyboardUi.getEleValue(obj).keyboardVisualLength();
		}
		if(obj.siblings('.icon-cursor').length==0)	obj.after('<i class="icon-cursor" style="left:'+width+'px"></i>');
		obj.parent().css('postion','relative'); //父级元素相对定位
	},
	
	
	/*
	*移除假光标
	*/
	removeCursor:function(obj){
			//点当前元素以外的区域时,删除假光标
		 $('body').on('click', function(e) {  
				if ($(e.target).closest(obj).length != 0) return; //e.target.closest(selector).length==0 说明点击的不是元素selector区域,反之则是
				obj.parents().find('.icon-cursor').remove();
		 })
		obj.parents().find('.icon-cursor').remove(); //移除当前以外的所有假光标
		keyboardUi.showCursor(obj);
	},
	
	
	/*
	* 函数：获取元素的值
	@param obj 元素id或class   eg.obj='#locate'
	* 元素类型可能是 input|textarea|span|div 
	* input、textarea取值 $(obj).val();
		div、span取值 $(obj).text()或$(obj).html()
	*/
	getEleValue:function(obj){ 
		if($(obj).length>0){
			var value = '';
			var result = $(obj)[0].tagName.toLocaleLowerCase();
			if(result=='input' || result=='textarea') value = $(obj).val();
			else value = $(obj).html();
			return value;
		}
	},
	
	
	/*
	* 函数：给元素赋值
	* @param obj 元素id或class   eg.obj='#locate'
	* @param value 要赋的值
	* 元素类型可能是 input|textarea|span|div 
	* input、textarea取值 $(obj).val();
		div、span取值 $(obj).text()或$(obj).html()
	*/
	giveEleValue:function(obj,value){ 
		if($(obj).length>0){
			var result = $(obj)[0].tagName.toLocaleLowerCase();
			if(result=='input' || result=='textarea') $(obj).val(value);
			else $(obj).html(value);
		}
	},
	
	
	
	/*
	*函数：数字键盘弹出框
	*/
	alert:function(minimum,maximum){
		var node = '.keyboard_alert';
		var txt = '值只能介于：'+minimum+' - '+maximum;
		if(maximum=='') txt = '请输入大于等于'+minimum+'的数！';
		if(minimum=='') txt = '请输入小于等于'+maximum+'的数！';
		var _html = '<div class="'+node.replace('.','').replace('#','')+'">'+
								'	<div class="t">提示</div>'+
								'	<div class="c">'+txt+'</div>'+
								'	<div class="f" id="confirm_alert">确定</div>'+
								'</div>';					
		if($(node).length==0) $('body').append(_html);
		keyboardUi.mask();
	},
	
	
	/*
	*函数：数字键盘遮罩
	*/
	mask:function(){
		var node = '.keyboard_mask';
		var _html = '<div class="'+node.replace('.','').replace('#','')+'"></div>';
		if($(node).length==0) $('body').append(_html);
	}

}; //END keyboardUi


