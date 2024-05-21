/**
* MEUI对话框插件
* Author:ChenMufeng
* Date: 2018.8.30
* Update:2018.8.30
*/
//(function($){
//	$.fn.extend({
	var meuiDialog = {
		
		/**-----------------
		* MEUI弹出窗
		------------------*/
		alert:function(options){
			var defaults = {
				//后台自用参数
				mask:'#'+meui.generateMaskNode()+'_'+meui.generateRandChar(), //遮罩节点
				//前台可用参数
				nodeID:'', //自定义弹出窗口根节点ID(可缺省),默认空
				animate:false, //是否开启转圈特效.是|true,否|false,默认true
				loadTxt:'', //转圈文字(animate=true时有效).默认空
				loadDelay:100, //转圈延迟时间(animate=true时有效).默认100（单位：毫秒）
				popup:true, //是否允许弹出窗口. 是|true,否|false,默认true
				bubbleRet:1, //popup=false时,指定默认执行第几个按钮事件(默认值1). eg. popup=false,bubbleRet=2,表示不弹出窗口,但默认执行第2个按钮里的事件
				caption:'提示', //标题.默认"提示"
				message:'欢迎使用MEUI对话框插件！', //提示信息.默认"欢迎使用MEUI对话框插件！"
				buttons:['确定','取消'], //按钮名称.默认['确定','取消']
				theme:'', //插件主题(可缺省). 蓝色|blue,黑色|black,绿色|green,红色|red,橙色|orange,紫色|purple.默认空''
				btnColor:['','black'], //按钮颜色.蓝色|blue,黑色|black,绿色|green,红色|red,橙色|orange,紫色|purple.默认绿色
				btnFont:{size:'',bold:false}, //按钮字体. size|文字大小(默认16号), bold|文字是否加粗(默认false)
				btnDirection:'horizontal', //按钮方向	.水平|horizontal,垂直|vertical,默认水平.
				showCross:false, //是否显示右上角打叉图标(关闭按钮). 显示|true,不显示|false,默认不显示
				closeWindow:true, //是否一点击按钮就关闭窗口,默认true
				closeAll:false, //是否关闭所有弹出窗口。true 是， false 否（默认）。当短时间内弹出多个窗口时，点击按钮是否一键关闭所有窗口。该参数特别有用，特别是在on('input',function(){})事件里就可能出现多个窗口。
				callBack:null //回调函数(可缺省)
				
			}
			var settings = $.extend({},defaults,options);
			
			//...初始定义
			var shade = settings.mask,
					nodeID = settings.nodeID,
					animate = settings.animate,
					loadTxt = settings.loadTxt,
					loadDelay = settings.loadDelay,
					popup = settings.popup,
					bubbleRet = settings.bubbleRet>settings.buttons.length ? 1 : settings.bubbleRet,
					caption = settings.caption,
					message = settings.message,
					theme = settings.theme,
					buttons = settings.buttons,
					btnColor = settings.btnColor,
					btnSize = settings.btnFont.size,
					btnBold = settings.btnFont.bold,
					btnDirection = settings.btnDirection,
					showCross = settings.showCross;
			
			//...插件根节点及Class、ID
			var weuiParent = '.section-meuiDialog-alert',
					IdClass = weuiParent.replace(/[\#\.]/g,''),
					eleId = '#' + IdClass + '_' + meui.generateRandChar();
			var parentId = nodeID == '' ? eleId : nodeID;
			var nodeStr = ' id="' + parentId.replace(/[\#\.]/g,'') + '"';
			//...HTML
			var themeClass = theme=='' ? '' : ' theme '+theme,			
					btnClass = btnDirection=='vertical' ? ' vertical' : '',
					crossStyle = showCross==true ? '' : ' style="display:none"';
			var _html = '<div class="' + IdClass + '"' + nodeStr + ' data-maskId="'+shade+'">'+
									'	<div class="alert-layout'+themeClass+'">'+
									'		<div class="alert-close meui-close"'+crossStyle+'></div>'+
									'		<div class="alert-caption">'+caption+'</div><!--/alert-caption-->'+
									'		<div class="alert-content">'+message+'</div><!--/alert-content-->'+
									'		<div class="alert-button-group'+btnClass+'">';
							for(var i=0;i<buttons.length;i++){
								var colorClass = btnColor[i]=='' || typeof(btnColor[i])=='undefined' ? '' : ' '+btnColor[i],
										sizeStyle = btnSize=='' || typeof(btnSize)=='undefined' ? '' : 'font-size:'+btnSize+'px;',
										boldStyle = btnBold!=true || typeof(btnBold)=='undefined' ? '' :　' font-weight:bold;';
								
								var widthStyle = btnClass=='' ? ( checkIfIE8() ? ' width:'+ 100/buttons.length + '%'+';' : '') : '';
								var style = (sizeStyle=='' && boldStyle=='' && !checkIfIE8()) ? '' :  ' style="'+sizeStyle+boldStyle+widthStyle+'"';
								_html+='<button type="button" class="alert-btn alert-btn-'+i+colorClass+'"'+style+'>'+buttons[i]+'</button>';
							}
							_html+='	</div><!--/alert-button-group-->'+
									'	</div>'+
									'</div><!--/section-meui-alert-->';
			
			//...创建插件
			if(popup){ //...允许弹窗
				if(animate){ //有转圈
					meui.showAnimate(loadTxt); //显示转圈
					setTimeout(function(){
						openAlert();
						meui.destroyAnimate(); //销毁转圈
					},loadDelay)
				}else{
					openAlert();
				} //IF(animate)
			}else{ //...不许弹窗
				var ret = bubbleRet; //默认执行哪个按钮里的事件
				settings.callBack(ret);
			} //IF(popup)
			
			
			//...按钮点击事件
			$(document).off('click', parentId + ' .alert-button-group>.alert-btn').on('click', parentId + ' .alert-button-group>.alert-btn',function(){
				var $this = $(this);
				var ret = $(this).index()+1;
				if(settings.callBack){
					settings.callBack(ret);
				}
				if(settings.closeWindow) closeAlert($this);	
				if(settings.closeAll){
					$(weuiParent).remove();
					$('.meui_mask').remove();
				}
			})
				
			//...关闭按钮事件
			$(document).off('click', parentId + ' .alert-close').on('click', parentId + ' .alert-close',function(){
				closeAlert($(this));
			});
			
			
			/*函数：打开对话框*/
			function openAlert(){
				$('body').append(_html); //创建HTML
				meui.openMask(shade); //打开遮罩
				
			}
			
			/*函数：关闭对话框 @param obj 当前点击的对象*/
			function closeAlert(obj){
				var mask_id = $(obj).parents(weuiParent).attr('data-maskId');
				if(mask_id.replace(/[\#\.]/g,'')!='') $(mask_id).remove();
				else $(obj).parents(weuiParent).next(shade).remove();
				$(obj).parents(weuiParent).remove();
				$('html,body').removeAttr('style'); //解除禁止滚动(pc端)
				if(meui.checkIsMobile()){
					$('html,body').off('touchmove,touchstart'); //解除禁止滚动(手机端)1//$(window).off('touchmove,touchstart');
					window.removeEventListener('touchmove',meui.winScroll,{passive:false}); 	//解除禁止滚动(手机端)2(解除window绑定的touchmove事件)
				}
			}
			
			/*检测是否IE8及以下版本的浏览器*/
			function checkIfIE8(){
				var val = false;
				//是ie8
				if(navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<9){
					val = true;
				}
				return val;
			}
			
		}, //END function alert();
		
		
		
		
		/**-----------------
		* MEUI输入框
		-------------------*/
		feedback:function(options){
			var self = this;
			var defaults = {
				//后台自用参数
				mask:'#'+meui.generateMaskNode()+'_'+meui.generateRandChar(), //遮罩节点
				//前台可用参数
				animate:true, //是否显示转圈.默认true
				loadTxt:'', //转圈文字(animate=true时有效).默认空
				loadDelay:100, //转圈延迟时间(animate=true时有效).默认100（单位：秒）
				popup:true, //是否允许弹出窗口. 是|true,否|false,默认true
				bubbleRet:1, //popup=false时,指定默认执行第几个按钮事件(默认值1). eg. popup=false,bubbleRet=2,表示不弹出窗口,但默认执行第2个按钮里的事件
				caption:'', //左侧标题.默认空
				textAlign:'left', //左侧标题文字水平位置, left 居左(默认), center 居中, right 居右
				value:'', //输入框初始化值,默认空
				tips:'', //输入框提示文字,默认空
				notes:'', //输入框右侧内容,默认空
				type:'input', //输入框类型.input|单行文本,textarea|多行文本,默认input
				buttons:['确定'], //按钮(数组类型),默认['确定']
				btnWidth:'', //按钮大小(默认80px左右). 值：100% 按钮宽度100%, 100px 按钮宽度100px, 其它值...
				btnAlign:'', //按钮水平位置(默认居右). left 居左, center 居中, right 居右
				keyboard:false, //是否启用数字键盘,默认false
				numcNode:null, //当参数html不等于空时,自定义要调用"数字键盘控件"的节点（值为数组形式 eg.['#ID1','#ID2']）,默认null.
				html:'', //自定义输入框内容（自定义HTML）.默认空,插件调用默认html来填充;非空时将使用自定义的html来填充，此时caption/content/tips/notes/type参数将自动失效.
				conMargin:'15px auto', //中间内容margin值 (可缺省),默认15px auto
				conPadding:'', //中间内容padding (可缺省),默认空
				minWidth:-1, //窗口最小宽度(必须为正整数)(可缺省)
				maxWidth:-1, //窗口最大宽度(必须为正整数)(可缺省)
				showButton:true, //是否显示按钮,默认true
				showCross:true, //是否显示右上角打叉图标(关闭按钮). 显示|true,不显示|false,默认显示
				closeWindow:false, //是否禁用按钮(是否一点击按钮就关闭窗口,默认true)
				callBack:null //回调函数(可缺省)
			}
			var settings = $.extend({},defaults,options);
			
			//...初始定义
			var shade = settings.mask,
					animate = settings.animate,
					loadTxt = settings.loadTxt,
					loadDelay = settings.loadDelay,
					popup = settings.popup,
					caption = settings.caption,
					textAlign = settings.textAlign,
					value = settings.value,
					tips = settings.tips,
					notes = settings.notes
					type = settings.type,
					buttons = settings.buttons,
					btnWidth = settings.btnWidth,
					btnAlign = settings.btnAlign,
					keyboard = settings.keyboard,
					numcNode = settings.numcNode,
					html = settings.html,
					conMargin = settings.conMargin,
					conPadding = settings.conPadding,
					minWidth = settings.minWidth,
					maxWidth = settings.maxWidth,
					showCross = settings.showCross,
					showButton = settings.showButton;

			//...插件根节点及Class、ID
			var weuiParent = '.section-meuiDialog-feedback',
					IdClass = weuiParent.replace(/[\#\.]/g,'');
			var parentId = '#' + IdClass + '_' + meui.generateRandChar();
			//...HTML
			var _tips = _content = _notes = '';
			var crossStyle = showCross==true ? '' : ' style="display:none"';
			var _btnWStr = btnWidth=='' ? '' : ' style="width:'+btnWidth+'"';
			var _btnAStr = btnAlign=='' ? '' : ' '+btnAlign;
			
			if(html){
				_content = html;
			}else{
				if(tips!='') _tips = ' placeholder="'+tips+'" onfocus="this.placeholder=\'\'" onblur="this.placeholder=\''+tips+'\'"';
				if(type=='input') _content = '<input type="text" class="feedback-input numeric-txt" value="'+value+'"'+_tips+'>';
				if(type=='textarea') _content = '<textarea class="feedback-textarea numeric-txt"'+_tips+'>'+value+'</textarea>';
				_notes = notes =='' ? '' : '<span class="feedback-notes">'+notes+'</span>';
			}

			//按钮
			var _btnHtml = '';
			if(showButton){
				_btnHtml = '<div class="feedback-button-group'+_btnAStr+'">';
						for(var i=0;i<buttons.length;i++){
							_btnHtml+='	<button type="button" class="feedback-btn feedback-btn-'+i+'"'+_btnWStr+'>'+buttons[i]+'</button>';
						}
						_btnHtml+='</div>';
			}
			//标题
			var _capClass = ' ' + textAlign;
			//内容
			var _cmarginStr = '', _cpaddingStr = '';
			if(conMargin!='') _cmarginStr = 'margin:' + conMargin + ';';
			if(conPadding!='') _cpaddingStr = 'padding:' + conPadding + ';';
			var _contentStyle = ' style="' + _cmarginStr + _cpaddingStr + '"';
			//窗口
			var _minWidthStr = _maxWidthStr = '';
			var regNumc = /^\d+$/; //正则验证数字
			if(minWidth!='' && regNumc.test(minWidth)) _minWidthStr = 'min-width:' + minWidth + 'px;';
			if(maxWidth!='' && regNumc.test(maxWidth)) _maxWidthStr = 'max-width:' + maxWidth + 'px';
			var _layStyle = (_minWidthStr == '' && _maxWidthStr == '') ? '' : ' style="' + _minWidthStr + _maxWidthStr + '"';
			//html
			var _html = '<div class="'+IdClass+'" id="' + parentId.replace(/[\#\.]/g,'') + '" data-maskId="' + shade + '">'+
									'	<div class="feedback-layout"' + _layStyle + '>'+
									'		<div class="feedback-close meui-close"'+crossStyle+'></div>'+
									'		<div class="feedback-caption' + _capClass + '">'+caption+'</div>'+
									'		<div class="feedback-content"' + _contentStyle + '>'+_content+_notes+'</span></div>'+ _btnHtml +
									'	</div>'+
									'</div>';
					
			
			
			//...创建插件
			if(popup){ //...允许弹窗
				if(animate){ //有转圈
					meui.showAnimate(loadTxt); //显示转圈
					setTimeout(function(){
						openFeedback();
						meui.destroyAnimate(); //销毁转圈
					},loadDelay)
				}else{
					openFeedback();
				} //IF(animate)
				
			}else{ //...不许弹窗
				var ret = bubbleRet; //默认执行哪个按钮里的事件
				settings.callBack(ret);
			} //IF(popup)
			

			//...调用数字键盘
			setTimeout(function(){
				if(keyboard){
					if(html==''){ //==1.输入框内容为默认
						var $numeric = $('.numeric-txt');
						if(typeof($numeric.meuiKeyboard)==='function'){
							$numeric.meuiKeyboard(); //输入框采用数字键盘
							$numeric.on('focus',function(){
								$(this).blur(); //或this.blur(); //禁止调用手机输入法
								//$(this).attr('readOnly','true'); //输入框只读
								//$(this).attr('disabled','disabled'); //输入框不可编辑
							})
						}
					}else{ //==2.输入框内容为自定义HTML
						if(numcNode != null){
							if(typeof(numcNode)=='object'){ //是object(数组),eg.['.back-input','.back-note']
								for(var i=0;i<numcNode.length;i++){
									if(typeof($(numcNode[i]).meuiKeyboard)==='function'){//如果函数存在
										$(numcNode[i]).meuiKeyboard();
										
										$(numcNode[i]).on('focus',function(){
											$(this).blur();
										})
									}
								}
							}else{ //是string(字符串),eg.'.back-input'
								if(typeof($(numcNode).meuiKeyboard)==='function'){//如果函数存在
									$(numcNode).meuiKeyboard();
									$(numcNode).on('focus',function(){
										$(this).blur();
									})
								}
							}
							}
					}  //IF(html)
				} //IF(meuiKeyboard&numcNode)
			},100);
			
			
			//...按钮点击事件
			$(document).off('click',parentId + ' .feedback-button-group>.feedback-btn').on('click',parentId + ' .feedback-button-group>.feedback-btn',function(){
				var $this = $(this);
				var ret = $(this).index()+1;
				if(settings.callBack){
					settings.callBack(ret);
				}
				if(settings.closeWindow) closeFeedback($this); //关闭窗口
			})
		 
			//...关闭按钮事件
			$(document).off('click',parentId + ' .feedback-close').on('click',parentId + ' .feedback-close',function(){
				closeFeedback($(this));
			});
			
			
			/*函数：打开输入框*/
			function openFeedback(){
				$('body').append(_html); //创建HTML
				meui.openMask(shade); //打开遮罩
				var zIndex = parseInt(document.getElementById(shade.replace(/[\#\.]/g,'')).style.zIndex) + 1;
				//var box = document.getElementsByClassName('section-meuiDialog-alert')[0];
				var box = self.getByClass('section-meuiDialog-alert')[0];
				var winW = $(window).width(),
						winH = $(window).height(),
						capH = $(parentId).find('.feedback-caption').outerHeight(true),
						btnH = $(parentId).find('.feedback-button-group').outerHeight(true),
						objW = $(parentId).children().outerWidth(true),
						objH = $(parentId).children().outerHeight(true),
						left = (winW - objW)/2,
						top =  (winH - objH) /4;
				//内容超过一屏高度时
				if(top < 0){
					objH = winH * 0.8;
					top = (winH - objH) / 4;
					contentH = objH - capH - btnH - 130;
					$(parentId).find('.feedback-content').css('height', contentH);
					$(parentId).find('.feedback-content').children().css({'height':'100%', 'overflow':'auto', '-webkit-overflow-scrolling':'touch'});
					$(parentId).find('.feedback-button-group').css('margin-top',12);
				}
				$(parentId).css({'z-index':zIndex, 'left':left,'top':top, 'right':left});
			}
			
			/*函数：关闭输入框 @param obj 当前点击的对象*/
			function closeFeedback(obj){
				var mask_id = $(obj).parents(weuiParent).attr('data-maskId');
				if(mask_id.replace(/[\#\.]/g,'')!='') $(mask_id).remove();
				else $(obj).parents(weuiParent).next(shade).remove();
				$(obj).parents(weuiParent).remove();
				$('html,body').removeAttr('style'); //解除禁止滚动(pc端)
				if(meui.checkIsMobile()){
					$('html,body').off('touchmove,touchstart'); //解除禁止滚动(手机端)1//$(window).off('touchmove,touchstart');
					window.removeEventListener('touchmove',meui.winScroll,{passive:false}); 	//解除禁止滚动(手机端)2(解除window绑定的touchmove事件)
				}
			}
			
			
			
		}, //end function feedback();
		
	
		/**
		 * getElementsByClassName 兼容IE8(含)以下浏览器
		 * @param {*} name 
		 */
		getByClass:function(name){
			//如果浏览器支持会得到一个函数体
			if(document.getElementsByClassName){
				return document.getElementsByClassName(name);
			}
			//把所有的元素获取到
			var allItems = document.getElementsByTagName('*');
			var newArr = [];
			//查找每一个元素的className 看其中含不启name
			for(var i = 0; i < allItems.length; i++){
				var classNames = allItems[i].className; //"test test111"
				var arrClass = classNames.split(" ");
				for(var j = 0; j < arrClass.length; j++){
					if(arrClass[j] == name){
						newArr.push(allItems[i]);
					}
				}
			}
			return newArr;
		},

		/*关闭所有输入框窗口,供外部调用*/
		closeFeedWindow:function(){
			$('.section-meuiDialog-feedback').next('.meui_mask').remove();
			$('.section-meuiDialog-feedback').remove();
			$('html,body').removeAttr('style'); //解除禁止滚动(pc端)
			if(meui.checkIsMobile()){
				$('html,body').off('touchmove,touchstart'); //解除禁止滚动(手机端)1//$(window).off('touchmove,touchstart');
				window.removeEventListener('touchmove',meui.winScroll,{passive:false}); 	//解除禁止滚动(手机端)2(解除window绑定的touchmove事件)
			}
		}
	
		
		
	}
	
	
	
		
		
		
	//});
//})(jQuery);