/************************
**Meui框架内容管理系统 CSS
* Author: ChenMufeng
* Date: 2018.11.27
* QQ: 1614644937
*
************************/

/**
* 函数：创建左侧菜单
*/
function createNavList(json){
	var node = '.nav-list';
	var _html = '';
	$(node).empty();
	if(typeof(json.data)!='undefined'){ //一级菜单
		$.each(json.data,function(i,items){
			var url = typeof(items.url)=='undefined' || items.url=='' ? 'javascript:void(0);' : items.url;
			var _arrowStr = typeof(items.url)=='undefined' || items.url=='' ? '<b class="fa fa-angle-down"></b>' : '';
			_html+='<li>'+
					'	<a href="'+url+'" target="contentFrameName">'+
					'		<i class="fa fa-desktop"></i>'+
					'		<span class="nav-text">'+items.menu+'</span>'+_arrowStr+
					'	</a>';								
			if(typeof(items.data)!='undefined'){ //二级菜单
				_html+='<ul class="submenu sonmenu">';
				$.each(items.data,function(j,row){
					var url = typeof(row.url)=='undefined' || row.url=='' ? 'javascript:void(0);' : row.url;
					var _arrowStr = typeof(row.url)=='undefined' || row.url=='' ? '<b class="fa fa-angle-down"></b>' : '';		
					_html+=	'<li>'+
							'	<a href="'+url+'" target="contentFrameName">'+
							'		<i class="fa fa-angle-double-right"></i>'+
							'		<span class="nav-text">'+row.menu+'</span>'+_arrowStr+
							'	</a>';
					if(typeof(row.data)!='undefined'){ //三级菜单
						_html+='<ul class="submenu childmenu">';
						$.each(row.data,function(k,one){
							var url = typeof(one.url)=='undefined' || one.url=='' ? 'javascript:void(0);' : one.url;
							_html+=	'<li>'+
									'	<a href="'+url+'" target="contentFrameName"><i class="fa fa-leaf"></i><span>'+one.menu+'</span></a>'+
									'</li>';
						})
						_html+='</ul>';
					} //if one
					_html+='</li>';
				})
				_html+='</ul>';
			} //if row				
			_html+='</li>';				
		})
	} //if items

	if($(node).length>0) $(node).append(_html);

} //END FUNCTION createNavList


/**
* 函数：设置右侧主体区域宽度
*/
function setMainWidth(){
	//$('.nav-list').find('a').attr('target','contentFrameName');
	var btnID = '#btn_fullScreen';
	var screenW = window.screen.width, //屏幕宽度(分辨率),全屏时的宽度
		screenH = window.screen.height, //屏幕高度(分辨率),全屏时的高度
		winW = $(window).width(), //网页可视区域宽度
		winH = $(window).height(); //网页可视区域高度

	if(typeof($(btnID).attr('data-winWidth'))=='undefined') $(btnID).attr('data-winWidth',winW); //临时存储网页可视区域宽度(且只存储一次);
	if(typeof($(btnID).attr('data-winHeight'))=='undefined') $(btnID).attr('data-winHeight',winH); //临时存储网页可视区域高度(且只存储一次);
	var tempW = $(btnID).attr('data-winWidth');
	var tempH = $(btnID).attr('data-winHeight');
	tempW = typeof(tempW)=='undefined' ? winW : tempW;
	tempH = typeof(tempH)=='undefined' ? winH : tempH;

	var boolean = parseInt($(btnID).attr('data-fullscreen')); //当前是否全屏状态. 1 是; 0 否
	var winW = boolean ==1 ? screenW : tempW;
	var winH = boolean ==1 ? screenH : tempH;
	//console.log('是否全屏boolean:',boolean,'winW:',winW,'screenW:',screenW);
	
	var	sidebarW = $('#meui-sidebar').outerWidth(true),
		headH =  $('#meui-header').outerHeight(true),
		breadH = $('.panel-bread').outerHeight(true);
	var mainW = winW - sidebarW,
		frameW = '100%',
		frameH = winH - headH - breadH;
	$('#meui-main').css('width',mainW);
	$('#contentFrameID').css({'height':frameH,'width':frameW});

} //END FUNCTION setMainWidth

/*
* 函数：进入全屏
*/
function enterFullScreen() {
    var elem = document.body;
    if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.requestFullScreen) {
        elem.requestFullscreen();
    } else {
        notice.notice_show("浏览器不支持全屏API或已被禁用", null, null, null, true, true);
    }

} //END FUNCTION enterFullScreen

/*
* 函数：退出全屏
*/
function exitFullScreen() {
    var elem = document;
    if (elem.webkitCancelFullScreen) {
        elem.webkitCancelFullScreen();
    } else if (elem.mozCancelFullScreen) {
        elem.mozCancelFullScreen();
    } else if (elem.cancelFullScreen) {
        elem.cancelFullScreen();
    } else if (elem.exitFullscreen) {
        elem.exitFullscreen();
    } else {
        notice.notice_show("浏览器不支持全屏API或已被禁用", null, null, null, true, true);
    }

} //END FUNCTION exitFullScreen



/**
* 函数：前端系列事件集合
*/
function MeuiCmsWebFrontFunc(){

	/*+-------------------------+*/
	//=====设置右侧主体区域宽度
	setMainWidth();


	/*+-------------------------+*/
	//=====顶部账号下拉事件
	$('.meui-user').mouseenter(function(){
		$('.meui-dropdown').slideDown('fast');
		$(this).find('.inner i').removeClass('fa-angle-down').addClass('fa-angle-up');
	}).mouseleave(function(){
		$('.meui-dropdown').slideUp('fast');
		$(this).find('.inner i').removeClass('fa-angle-up').addClass('fa-angle-down');
	});
	//=====点击收起
	$('.meui-dropdown>ul>li').on('click',function(){
		$(this).parent().parent().slideUp('fast');
	});

	/*+-------------------------+*/
	//=====开启全屏事件/退出全屏事件
	$('#btn_fullScreen').on('click',function(){
		var $this = $(this);
		var isFullScreen = parseInt($this.attr('data-fullscreen')); // 0 当前非全屏状态, 1 当前全屏状态
		if(isFullScreen!=1){ 
			$this.text('退出全屏').attr('data-fullscreen',1);
			enterFullScreen();		
		}
		else{
			$this.text('开启全屏').attr('data-fullscreen',0);
			exitFullScreen();	
		}
		setMainWidth();
	})




	/*+-------------------------+*/
	//=====左侧一级、二级菜单展开事件
	$(".nav-list>li>a,.nav-list>li>ul.submenu>li>a").on("click",function(e){
		var $this = $(this);
		var $parent = $this.parent();
		var $i = $this.children('i');
		var $b = $this.children('b');
		var active = 'active',
			down = 'fa-angle-down',
			up = 'fa-angle-up';

		var url = $this.attr('href');
		//$('#contentFrame').attr('src',url);

		$parent.siblings().removeClass(active).children('.submenu').slideUp('fast').prev('a').children('b').removeClass(up).addClass(down); //同级收起
		if(url.indexOf('javascript')<0){ //是有效的url
			$parent.siblings().find('.submenu').find('li').removeClass(active); //移除二级节点兄弟节点所有子节点高亮
			$parent.parent().parent().siblings().find('.submenu').slideUp('fast').find('li').removeClass(active).find('b').removeClass(up).addClass(down); //移除一级节点下所有子孙节点高亮
		}

		if($parent.hasClass(active)){ //收起
			$parent.removeClass(active);
			$this.next('.submenu').slideUp('fast');
			$b.removeClass(up).addClass(down);
			//alert(1)
		}else{ //展开
			$parent.addClass('active');
			$this.next('.submenu').slideDown('fast');
			$b.removeClass(down).addClass(up);
			//alert(2)
		}

		//面包屑导航
		var _menuStr = '';
		var menu = $this.find('span').text();
		if($(e.target).closest('.submenu').length>0){
			var oneMenu = $this.parents('.submenu').prev().find('span').text(); //一级菜单
			 _menuStr+='<i class="fa fa-angle-right"></i><span>'+oneMenu+'</span>';
		}
		_menuStr+='<i class="fa fa-angle-right"></i><span>'+menu+'</span>';
		$('.bread-now').empty().append(_menuStr);

	});


	
	/*+-------------------------+*/
	//=====三级菜单点击事件
	$(".nav-list>li>ul.submenu>li>ul.submenu>li>a").on("click",function(e){
		var $this = $(this);
		var $parent = $this.parent();
		var active = 'active';

		var url = $this.attr('href');
		//$('#contentFrame').attr('src',url);

		$parent.addClass(active).siblings().removeClass(active);
		if(url.indexOf('javascript')<0){ //是有效的url
			$parent.parent().parent().siblings().find('.submenu').find('li').removeClass(active); //移除父节点及祖父节点的所有兄弟节点下所有子孙节点高亮
		}

		//面包屑导航
		var oneMenu = $this.parents('.sonmenu').prev().find('span').text(); //一级
		var twoMenu = $this.parents('.childmenu').prev().find('span').text(); //二级菜单
		var threeMenu = $this.find('span').text(); //三级菜单
		var _menuStr='<i class="fa fa-angle-right"></i><span>'+oneMenu+'</span>'+
				  '<i class="fa fa-angle-right"></i><span>'+twoMenu+'</span>'+
				  '<i class="fa fa-angle-right"></i><span>'+threeMenu+'</span>';
		$('.bread-now').empty().append(_menuStr);
	});




	/*+-------------------------+*/
	//=====左右伸缩按钮
	$(".aside-stretch").on("click",function(){
		var $this = $(this);
		var $i = $this.find('i');
		var left = 'fa-angle-double-left',
			right = 'fa-angle-double-right',
			mini = 'mini';
		$('aside,nav,nav>ul').toggleClass(mini);
		setMainWidth();

		if($i.hasClass(left)){ //向左缩进
			$i.removeClass(left).addClass(right);
		}else{ //向右展开
			$i.removeClass(right).addClass(left);
			$(".nav-list li").each(function(){
				$(this).find("a>span").show();
				if($(this).hasClass('active')) $(this).children('.submenu').show();
			})
		}
	});


	/*+-------------------------+*/
	//=====缩进后的一级菜单鼠标悬浮到上面事件
	$(".nav-list.mini>li>a").live("mouseenter",function(e){
		$(this).find("span").show();
		$(this).parent().siblings().children('a').find('span').hide();
		$(this).next('.submenu').show();
		$(this).parent().siblings().children('.submenu').hide();
		
	});

	/*+-------------------------+*/
	//=====缩进后的一级菜单鼠标离开事件1
	$(".nav-list.mini>li>a").live("mouseleave",function(e){
		//e.stopPropagation();
		var len1 = $(e.target).closest('.submenu').length;
		var len2 = $(e.target).closest('span').length;
		//console.log('len1:',len1,' len2:',len2);
		if(len1<=0 && len2>0){
			
		}else{
			$(this).next('.submenu').hide();	
			$(this).find("span").hide();
		}
	});

	/*+-------------------------+*/
	//=====缩进后的一级菜单鼠标离开事件2
	$(".nav-list.mini>li>a>span").live("mouseleave",function(e){
		var ev = e || window.event;
		var tagname = ev.relatedTarget.tagName;
		if(tagname.toLowerCase()=='iframe'){
			$(this).hide();
			$(this).parent().next('.submenu').hide();
		}
		//console.log('2-鼠标离开时的指针进入的那个节点：',ev.relatedTarget.tagName);

	});

	/*+-------------------------+*/
	//=====缩进后的二级菜单鼠标离开事件
	$(".nav-list.mini>li>.submenu").live("mouseleave",function(e){
		var ev = e || window.event;
		var tagname = ev.relatedTarget.tagName;
		if(tagname.toLowerCase()=='iframe'){
			$(this).prev('a').find('span').hide();
			$(this).hide();
		}
		//console.log('3-鼠标离开时的指针进入的那个节点：',ev.relatedTarget.tagName);
		
	});



} //END FUNCTION MeuiCmsWebFrontFunc


