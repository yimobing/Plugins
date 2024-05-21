/**
* [neui后台管理系统]
* Version: v1.0.0
* Author: ChenMufeng
* Date: 2019.11.15
* Update: 2022.08.29
*/

(function($){

	/*-------------------------------------------------------*/
	function NeuiBackStage(ele, options){

		//判断是用函数创建的还是用new创建的。这样我们就可以通过ABC() 或 new ABC()来使用这个控件了
		if(!(this instanceof NeuiBackStage)) return new NeuiBackStage(ele, options);

 		var defaults = {
			system: { // 系统信息(可选)
				webtitle: "neui后台管理系统", // 主标题
				subtitle: "版本V1.0.0", // 副标题
				logo: "img/logo.png", //LOGO图片地址(相对)(可选,此时系统调用默认内置默认LOGO)
				userDropSource: {}, //用户信息下拉数据源
                homePage: "html/welcome.html" //默认首页(可选)
			},
			userInfo: { // 用户信息(可选)
				// 字段：
				// avatar: "img/avatar-male.jpg", // 头像
				// username: "刘备", // 用户名
				// duty: "左将军领豫州牧" // 用户头衔（如职称、工龄等）
			},

			isShowTopBar: true, //是否显示顶部菜单栏(可选). 默认true
			menuSource: {}, //顶部菜单栏数据源
            menuFormat: ["title", "icon", "name", "display"], //自定义顶部菜单栏数据源字段格式(可选)(待开发)
            searchBox: "", //顶部搜索框HTML(可选)

			navSource: {}, // 左侧导航栏数据源
            navFormat: ["id", "title", "url", "icon"], // 自定义左侧导航栏数据源字段格式(可选)(待开发)
			sidebar: { // 侧栏
				isFixed: true, // 是否固定侧栏(可选)。默认true
				width: 260, // 自定义侧栏宽度(可选)。默认260px
				unfoldAll: false, // 是否默认展开所有菜单(可选)。默认false
				defaultStretch: true, // 是否默认展开侧栏(可选)。默认true。 false时侧栏将缩起来 add 20220829-1
				enableStretch: true, // 是否允许侧栏伸缩
				enableDefaultIcon: true, // 菜单图标为空时，是否使用系统默认的图标。默认true
				isShowMenuIcon: true, // 是否显示菜单图标(可选)。默认true
				menuIconDefault: "desktop", // 菜单图标为空时的默认菜单图标(font-awesome图标或图片URL)
				menuIconLocate: "right", // 菜单图标位置(可选)。right 右侧（默认），left 左侧
				isShowTreeLine: true, // 是否显示菜单树级线(可选)。默认true
				isShowTreeIcon: true, //是否显示树级图标(可选)。默认true
				isShowAvatar: true, //是否显示用户头像(可选). 默认true
				isShowArrowIcon: true, //是否显示箭头图标(可选)。默认true
				callback: function(e){ // 点击菜单项时的回调函数. 参数e格式{id:"", title:"", url:""} 其中：id 菜单编号，title 菜单名称, url 菜单url
                   //console.log('e：', e);
				}
    		},
    		scrollBar:{ // 侧栏滚动条
				enableBeautify: true, // 是否美化滚动条样式，只适用于webkit内核的浏览器（如谷歌、360极速模式、Safary）(可选)。默认true
				scrollColor: "purple", // 滚动条颜色。 purple 紫色(默认），blue 天蓝色，lightblue 浅蓝， red 红色，lightred 浅红，green 绿色，lightgreen 浅绿， yellow 黄色，lightyellow 浅黄
				scrollWidth: 10 // 滚动条宽度(可选)。 值：10，5，3，2，1，0。默认10px
    		},
			// 回调 add 20220829-1
			onResize: function(e){ } // 窗口变化时的回调函数. e参数： {fullscreen: "窗口是否全屏化. true or false"}
    	}
    	var settings = $.extend(true, {}, defaults, options || {});

    	this.ele = ele;
		this.options = options;
		this.settings = settings;
		this.init();

	}

	 


	/*-------------------------------------------------------*/
	NeuiBackStage.prototype = {

		// edit 20220829-1
		init: function(){
			var self = this;
			this.initLayer();
			this.topSlideEvent();
			this.navSlideEvent();
			// 窗口变化事件
			if(self.settings.onResize){
				$(window).on('resize', function(){
					self.resize(0);
					var result = self.isFullscreen();
					self.settings.onResize({"fullscreen": result});
				})
			}
		},

		initLayer: function(){
			var self = this;

			// ::::::::::::::::::顶部菜单栏::::::::::::::::::
			// ===顶部菜单栏HTML
			var menu_html = '';
			var menuSource = self.settings.menuSource;
			if(!$.isEmptyObject(menuSource)){
				if(typeof menuSource.data != 'undefined'){
					for(var i = 0; i < menuSource.data.length; i++){
						var row = menuSource.data[i];
						var title = typeof row["title"] == 'undefined' ? '' : row["title"],
							name = typeof row["name"] == 'undefined' ? (i + 1) : (row["name"] == '' ? i + 1　: row["name"]),
							icon = typeof row["icon"] == 'undefined' ? '' : row["icon"],
							display = typeof row["display"] == 'undefined' ? 'image' : row["display"];
						var color = 'red';
						if(i == 1) color = 'yellow';
						if(i == 2) color = 'green';
						if(i == 3) color = 'green';
						var _txtStr = '';
						if(display == 'text') _txtStr = '<span class="flex flex-align-center">' + title + '</span>';
						if(display == 'submit') _txtStr = '<input type="submit" name="' + name + '" id="' + name + '" value="' + title + '">';
						var _imgStr = '';
						if(display == 'image'){
							var awesomeIco = icon == '' ? 'desktop' : icon.toString().replace(/fa-/g, '');
							_imgStr = checkIsImage(icon) ?  '<img src="' + icon + '" class="icon" alt="' + title + '">' : 
															'<i class="icon fa fa-' + awesomeIco + '"></i>';
							_imgStr += '<i class="dot dot-' + color + '"></i>';
						}

						var _idStr = display == 'submit' ? '' : ' id="btn-' + name + '"';
						menu_html += '<div class="nav-menu-box operate nav-menu-box-' + name + '"' + _idStr + '>'+
										'<div class="menu-box_link flex flex-align-center" title="' + title + '">'+
											_txtStr+
											_imgStr+
										'</div>'+
									'</div><!--/.nav-menu-box-->';
					}
				}
			}

			// ===顶部搜索框HTML
			var search_html = this.settings.searchBox;

			// ===顶部菜单栏外层HTML
			var top_html = [
				'<nav class="navDiv">',
		            '<div class="nav-brand" title="' + self.settings.system.webtitle + '">',
		                '<div class="logo">',
		                	'<img src="" alt="' + self.settings.system.webtitle + '">',
		                	'<p><span> ' + self.settings.system.webtitle + '</span><em>' + self.settings.system.subtitle + '</em></p>',
		                	'<a href="' + window.location.href + '"></a>',
		                '</div>',
		            '</div><!--/.nav-brand-->',
		            '<div class="nav-menu">',
		                '<div class="nav-menu-l">',
		                 	search_html,
		                '</div><!--/.nav-menu-l-->',
		                '<div class="nav-menu-r">',
		                    '<div class="nav-menu-box">',
								(
									(function(){
										var tmpHtml = '';
										if(self.settings.userInfo && !$.isEmptyObject(self.settings.userInfo)){
											tmpHtml += [
												'<div class="menu-box_user">',
													'<div class="menu-box_user_img"><img src="' + self.settings.userInfo.avatar + '" alt="' + self.settings.userInfo.username + '"></div>',
													'<div class="menu-box_user_text">' + self.settings.userInfo.username + '</div>',
												'</div><!--/.menu-user-->'
											].join('\r\n')
										}
										return tmpHtml;
									})()
								),
		                        '<div class="menu-box_dropdown" style="display:none">',
		                            '<ul>',
		                            '</ul>',
		                        '</div><!--/.menu-box_dropdown-->',
							'</div><!--/.nav-menu-box-->',
							'<div class="nav-menu-box operate nav-menu-box-full-screen">',
								'<div class="menu-box_link"><i class="icon icon-full-screen" title="全屏"></i></div>',
							'</div><!--/.nav-menu-box-->',
							menu_html,
		                '</div><!--/.nav-menu-r->',
		            '</div><!--/.nav-menu-->',
		        '</nav><!--/.nav-->'
			].join('\r\n');
			$(self.ele).append(top_html);

			if(!self.settings.isShowTopBar) $('.navDiv').hide();
			
			// ===用户信息下拉选项节点拼接
			var userDropSource = self.settings.system.userDropSource;
			var logoPNG = typeof self.settings.system.logo == 'undefined' ? '' : self.settings.system.logo;
			$('.nav-brand img').attr({'src':logoPNG});
			if(logoPNG === '') $('.nav-brand img').addClass('default-logo');
			if(userDropSource && !$.isEmptyObject(userDropSource)){
				if(typeof userDropSource.data != 'undefined'){
					var tempHtml = self.getUserInfoDropHtml(userDropSource.data);
					$('.menu-box_dropdown>ul').append(tempHtml);
				}
			}
			if($('.menu-box_dropdown>ul').children().length == 0) $('.menu-box_user_text').addClass('arrow-right');



			// ::::::::::::::::::左侧导航栏::::::::::::::::::
			// ===左侧导航栏外层HTML edit 20220829-1
			var topH = $('.navDiv').is(':visible') ? ( checkIeVersion() <= 9 ? $('.navDiv').outerHeight() : $('.navDiv').outerHeight(true) ) : 0; //顶部高
			var _barClass = self.settings.sidebar.isFixed ? ' sidebar-fixed' : '',
				_barWidth = 'width:' + parseFloat(self.settings.sidebar.width) + 'px;',
				_barDisplay = self.settings.sidebar.defaultStretch !== false ? '' : 'display: none;';
			var _barStyle = ' style="' + _barWidth + _barDisplay + '"';

			var _scrollClass = self.settings.scrollBar.enableBeautify ? ' scrollbar-skin' : '',
				_scrollColor = ' scrollbar-color-' + self.settings.scrollBar.scrollColor,
				_scrollWidth = ' scrollbar-width-' + parseInt(self.settings.scrollBar.scrollWidth);
			
			var stretLeft = parseFloat(self.settings.sidebar.width);
			var _stretchIClass = self.settings.sidebar.defaultStretch !== false ? '' : ' class="arrow"';
			var _stretchLeftStr = self.settings.sidebar.defaultStretch !== false ?  (stretLeft + 2)  : 0;
			var _stretchStyle = ' style="left:' + _stretchLeftStr + 'px;"';
			

			var all_html = [
				'<main class="mainDiv" style="margin-top:' + topH + 'px">',
				'	<div class="mainbody">',
            			'<iframe name="cms-frame-name" scrolling="yes" frameborder="0" id="cms-frame-body" src="' +  self.settings.system.homePage + '"></iframe>',
           			'</div><!--/.main-body-->',
					'<aside class="sidebar' + _barClass + _scrollClass + _scrollColor + _scrollWidth + '" ' + _barStyle + '>',
						(
							(function(){
								var tmpHtml = '';
								if(self.settings.userInfo && !$.isEmptyObject(self.settings.userInfo)){
									tmpHtml +=[
										'<div class="sidebar-avatar">',
											'<div class="sidebar-avatar-img"><img src="' + self.settings.userInfo.avatar + '" alt=""></div>',
											'<div class="sidebar-avatar-text"><span>' + self.settings.userInfo.username + '</span><span>' + self.settings.userInfo.duty + '</span></div>',
										'</div><!--/.sidebar-avatar-->'
									].join('\r\n')
								}
								return tmpHtml;
							})()
						),
		                '<div class="sidebar-nav">',
		                '</div><!--/.sidebar-nav-->',
		            '</aside><!--/sidebar-->',
		            '<div class="panel-stretch"' + _stretchStyle + '><i' + _stretchIClass + '></i></div>',
		        '</main>'
			].join('\r\n');
			$(self.ele).append(all_html);
			if(!self.settings.sidebar.isShowAvatar) $('.sidebar-avatar').hide();

			var navJson = self.settings.navSource;
			var navFormat = self.settings.navFormat;
			if(!navJson || $.isEmptyObject(navJson)) return;
			if(typeof navJson.data == 'undefined') return;
			if(navJson.data.length == 0) return;
			
			// ===循环获取菜单内层HTML
			// 一级html
			var html1 = self.getNavHtml(1, navJson.data, navFormat);
			$('.sidebar-nav').append(html1);
			// 其它级html
			for(var i2 = 0; i2 < navJson.data.length; i2++){ // 二级
				var row2 = navJson.data[i2];
				if(typeof row2.data != 'undefined'){
					if(row2.data.length > 0){
						var $eq2 = $('.sidebar-nav-ul.father-nav').children('li').eq(i2);
						var html2 = self.getNavHtml(2, row2.data, navFormat);
						$eq2.append(html2);
						for(var i3 = 0; i3 < row2.data.length; i3++){ // 三级
							var row3 = row2.data[i3];
							if(typeof row3.data != 'undefined'){
								if(row3.data.length > 0){
									var $eq3 = $eq2.find('ul').children('li').eq(i3);
									var html3 = self.getNavHtml(3, row3.data, navFormat);
									$eq3.append(html3);
									for(var i4 = 0; i4 < row3.data.length; i4++){ // 四级
										var row4 = row3.data[i4];
										if(typeof row4.data != 'undefined'){
											if(row4.data.length > 0){
												var $eq4 = $eq3.find('ul').children('li').eq(i4);
												var html4 = self.getNavHtml(4, row4.data, navFormat);
												$eq4.append(html4);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		},



		/**
		 * 获取顶部用户区域下拉选项HTML
		 * @param {*} dataArr 下拉选项组成的数组
		 */
		getUserInfoDropHtml: function(itemArr){
			var tempHtml = '';
			for(var i = 0; i < itemArr.length; i++){
				var row = itemArr[i];
				var _title = typeof row["title"] == 'undefined' ? '下拉选项' : row["title"],
					_type = typeof row["type"] == 'undefined' ? 'link' : row["type"],
                    _url = typeof row["url"] == 'undefined' ? '' : (row["url"] == '' ? '' : row["url"]),
                    _name = typeof row["name"] == 'undefined' ? '' : row["name"],
					_icon = typeof row["icon"] == 'undefined' ? '' :  row["icon"];

				_icon =  _icon.indexOf('fa-') >= 0 ? _icon.toString().replace(/fa-/g, '') : (_icon == '' ? 'desktop' : _icon);
				var _iStr = _icon == '' ? '' : '<i class="fa fa-' + _icon + '"></i>';
				var _imageStr = checkIsImage(_icon) == false ?  _iStr : '<img src="' + _icon + '">';

				var _hrefStr = _url == '' ? '' : ' href="' + _url + '"';
				var _idStr = _name == '' ? '' : ' id="' + _name + '"';
				var _idNameStr = _name == '' ? '' : ' name="' + _name + '" id="' + _name + '"';
				var _btnStr = '';
				if(_type == 'button') _btnStr = '<button type="button"' + _idStr + '>' + _title + '</button>';
				if(_type == 'submit') _btnStr = '<input type="submit"' + _idNameStr + ' value="' + _title + '">';
				var _linkStr = _type != 'link' ? '' : '<span>' + _title + '</span><a' + _hrefStr + ' target="cms-frame-name"></a>';
				tempHtml += '<li class="menu-box_dropdown_item">'+
								_imageStr+
								_linkStr+
								_btnStr+
							'</li>';
			}
			return tempHtml;
		},


		/**
		* 获取左侧菜单HTML
		* @param {int} level 菜单级别，1-4级
		* @param {array} dataArr 该级别菜单对应的数组（即菜单项组成的数组）
		* @param {array} formatArr 自定义json字段
		* @return {string} 返回html
		*/
		getNavHtml: function(level, dataArr, formatArr){
			var self = this;
			var navClass = '';
			if(level == 1) navClass = ' father-nav';
			if(level == 2) navClass = ' sub-nav';
			if(level == 3) navClass = ' child-nav';
			if(level == 4) navClass = ' grand-nav';
			var lineClass = self.settings.sidebar.isShowTreeLine ? ' has-line' : '';
			var symbolClass = self.settings.sidebar.isShowTreeIcon ? ' has-symbol' : '';
			var ulHtml = [
				'<ul class="sidebar-nav-ul' + navClass + lineClass + symbolClass + '">',
            	'</ul><!--/.sidebar-nav-ul-->'
			].join('\r\n');
			var foldStyle = self.settings.sidebar.unfoldAll ? '' : ' style="display:none"';
			var foldHtml = [
				'<div class="nav-item-collapse"' + foldStyle + '>',
				'</div>'
			].join('\r\n');
			// console.log('dataArr:',dataArr);

			var linkClass = self.settings.sidebar.menuIconLocate == 'left' ?  ' at-left' : ''; // 菜单位置

			// 单个菜单html
			var emClass = self.settings.sidebar.unfoldAll ? ' is-collapse' : ' is-expand';
			var iClass = self.settings.sidebar.unfoldAll ? ' is-up' : ' is-down';
			var tempHtml = '';
			var cusId = formatArr[0],
				cusTitle = formatArr[1],
				cusUrl = formatArr[2],
				cusIco = formatArr[3];
			

			$.each(dataArr, function(i, item){
				var _id = item[cusId] == 'undefined' ? '' : item[cusId],
					_title = typeof item[cusTitle] == 'undefined' ? level + '级菜单' + (i + 1) : item[cusTitle],
					_url = typeof item[cusUrl] == 'undefined' ? '' : (item[cusUrl] == '' ? '' : item[cusUrl]),
					_icon = typeof item[cusIco] == 'undefined' ? '' :  item[cusIco];
				_icon = _icon == '' ? (self.settings.sidebar.enableDefaultIcon ? self.settings.sidebar.menuIconDefault : '' ) : _icon; 
				var _urlStr = _url == '' ? '' : ' href="' + _url + '"';
				var _dataIdStr = _id == '' ? '' : ' data-bh="' + _id + '"';
				var _imgStr = '';
				if(self.settings.sidebar.isShowMenuIcon && _icon != ''){
					if(checkIsImage(_icon))
						_imgStr = '<img class="item-link_menuIcon" src="' + _icon + '" alt="' + _title + '">';
					else
						_imgStr = '<i class="item-link_menuIcon fa fa-' +  _icon.toString().replace(/fa-/g, '') + '"></i>';
				}
				
				var _emStr = self.settings.sidebar.isShowTreeIcon ? '<em class="item-link_symbolsIcon' + emClass + '"></em>' : '';
				var _iStr = self.settings.sidebar.isShowArrowIcon ? '<i class="item-link_directionIcon' + iClass + '"></i>' : '';

				tempHtml += '<li class="sidebar-nav-item">' +
	                			'<a' + _urlStr + ' target="cms-frame-name" class="nav-item-link' + linkClass + '"' + _dataIdStr + ' title="' + _title + '">' +
	                				_emStr + 
	                				_imgStr + 
	                				'<span class="item-link_title">' + _title + '</span>' +
	                				_iStr +
	                			'</a><!--/.nav-item-link-->' +
	                		'</li><!--/.sidebar-nav-item-->';
			})
			// 拼接html
			var ulArr = ulHtml.split('\r\n'); // 字符串转数组
			ulArr.splice(1, 0, tempHtml); // 数组追加元素
			var html = ulArr.join('\r\n');
			if(level > 1){
				var foldArr = foldHtml.split('\r\n'); // 字符串转数组
				foldArr.splice(1, 0, html); // 数组追加元素
				html = foldArr.join('\r\n');
			}
			return html;

		},


		/**
		 * 顶部栏系列事件
		 */
		topSlideEvent: function(){
			var self = this;
			//显示[用户信息下拉选项]
			$('.menu-box_user').on('click', function(){
				var dropEle = $('.menu-box_dropdown');
				if(dropEle.is(':visible')) dropEle.hide();
				else dropEle.slideDown('fast');
			})
			//点击某一个下拉选项时，收起整个下拉
			$('.menu-box_dropdown_item').on('click', function(e){
				e.stopPropagation();
				$(this).parent().parent().hide();
			})
			//点击其它地方关闭[用户信息下拉选项]
			$(document).on('click', function(e){
				var selector = $(e.target).closest('.nav-menu-box');
				if(selector.length == 0){
					$('.menu-box_dropdown').hide();
				}
			})
			
			//开启全屏或退出全屏
			$('.nav-menu-box-full-screen').on('click', function(){
				var onFullClass = 'is-now-full';
				if($(this).hasClass(onFullClass)) {
					$(this).removeClass(onFullClass);
					quitFullScreen();
					setTimeout(function(){
						self.resize(0);
					}, 100)
				}else {
					$(this).addClass(onFullClass);
					enterFullScreen();
					setTimeout(function(){
						self.resize(1);
					}, 100)
					
				}
			})
		},

		/**
		* 侧栏系列事件
		*/
		navSlideEvent: function(){
			var self = this;
			// 移除某些元素
			if(!self.settings.sidebar.enableStretch) $('.panel-stretch').remove();
			$('.nav-item-link').each(function(){ // 循环a标签，无子菜单的去掉向下的箭头及加减图标
				var _this = $(this);
				if(_this.next().length == 0) _this.children('i').removeClass('is-up is-down');
				if(_this.next().length == 0) _this.children('em').removeClass('is-collapse is-expand');
			})

			// 点击菜单项a标签
			$('.nav-item-link').off('click').on('click',function(){
				var _this = $(this),
					_$parent = _this.parent(),
					_$em = _this.children('em');
					_$i = _this.children('i');
				// 当前菜单高亮
				_$parent.parents('.sidebar-nav').find('.sidebar-nav-item').removeClass('on');
				_$parent.addClass('on');
				// 菜单展开与收起
				if(_this.next().length > 0){
					if(_$i.hasClass('is-up')) _$i.removeClass('is-up').addClass('is-down');
					else _$i.removeClass('is-down').addClass('is-up');
					if(_$em.hasClass('is-collapse')) _$em.removeClass('is-collapse').addClass('is-expand');
					else _$em.removeClass('is-expand').addClass('is-collapse');
					_this.next().slideToggle('fast');
				}
			})

			self.resize(0);


			// 点击菜单项Li标签
			var isBreak = false;
			$('.sidebar-nav-item').off('click').on('click',function(e){
				e.stopPropagation();
				var _this = $(this);
				var _bh = _this.children('a').attr('data-bh');
				var _url = _this.children('a').attr('href');
				var _text = _this.children('a').children('span').text();
				_url = typeof _url == 'undefined' ? '' : _url;
				if(_url.indexOf('javascript') < 0 ){ // iframe添加链接（实际上当a标签指定target值为iframe的name属性值，这里就没必要了
					$('#cms-frame-body').attr('src', _url);	
				}
				if(self.settings.sidebar.callback) self.settings.sidebar.callback({"id":_bh, "title":_text, "url":_url});

				// 当浏览器出现垂直滚动条时(待完善)
				var _pageH = $(document.body).height(); // 页面高度
				var _scrollT = $(window).scrollTop(); // 滚动条top
				var _aa = _pageH - $(window).height() - _scrollT;
				var _browserW = 20; // 浏览器滚动条宽度，一般14-20px
				var _mainW = $('.mainbody').outerWidth(true),
					_mainH = $('.mainbody').outerHeight(true); 
				//console.log('_scrollT:',_scrollT, ' _aa:', _aa);
				if(_aa > 0) {
					$('.mainbody').css({'height': _mainH + _scrollT});
					$('#cms-frame-body').css({'height': _mainH + _scrollT});
					if(!isBreak){ // 只有第1个出现浏览器滚动条时才需要调整宽度
						$('.mainbody').css({'width': _mainW - _browserW});
					}
					isBreak = true;
				}
			})


			
		},


		/**
		 * 调整各区域大小
		 * @param {*} ps_isFullScreen 是否全屏。 0 否(默认)， 1 是
		 */
		resize: function(ps_isFullScreen){
			var self = this;
			var booleans = typeof ps_isFullScreen == 'undefined' ? 0 : parseInt(ps_isFullScreen);
			// 各区域宽高值
			var screenW = window.screen.width,
				screenH = window.screen.height;
			var winW = booleans ? screenW : parseFloat($(window).width()),
				winH = booleans ? screenH: parseFloat($(window).height()),
        		navH = parseFloat($('.navDiv').is(':visible') ? $('.navDiv').height() : 0),
        		fleXW = parseFloat($('.panel-stretch').outerWidth(true)),	
        		barW = parseFloat($('.sidebar').outerWidth(true)), // edit 20220829-1
        		barWForIe = parseFloat($('.sidebar').outerWidth()), //ie
        		barH = parseFloat($('.sidebar').outerHeight(true)),
        		barHForIe = parseFloat($('.sidebar').outerHeight()); //ie
        	if(checkIsIE()){ //当是IE浏览器时（一般是IE浏览器没更新到IE11时），有时outerWidth(true)返回的值是错误的,故需修正
        		if(barW >= winW) barW = barWForIe;
        		if(barH >= winH) barH = barHForIe;
        	}


        	var mainW = winW - ($('.sidebar').is(':visible') ? barW : 0) - fleXW; // edit 20220829-1
			var mainH = winH - navH + 0;

        	// 设定区域宽高
        	$('.sidebar-fixed').css({'height': winH - navH, 'top': navH}); //侧栏高
        	if(checkIeVersion() <= 11){ //IE版本<=11时,
        		mainW -= 8;  //减去一定距离
        		$('.panel-stretch').css({'height': winH - navH, 'top': navH}); //伸缩区域高
       	 	}

        	$('.mainbody').css({'width': mainW, 'height': mainH}); //主体区域高度
        	$('#cms-frame-body').css('height', mainH); //框架高
        	if(!self.settings.sidebar.isFixed && self.settings.sidebar.unfoldAll){ // 当左侧菜单不固定且默认全部展开时
        		if(barH + navH > winH) $('.mainbody,#cms-frame-body').css({'height': barH});
        	}
			// 菜单左右伸缩
			$('.panel-stretch').on('click',function(){
				// $(this).children('i').toggleClass('arrow');
				// if($(this).children('i').hasClass('arrow')){
				// 	$(this).css('left', 0);
				// 	$('.sidebar').hide();
				// 	$('.mainbody').addClass('ml-o-ie').css('width', winW - fleXW);
				// }else{
				// 	$(this).css('left', barW);
				// 	$('.sidebar').show();
				// 	$('.mainbody').removeClass('ml-o-ie').css('width', mainW);
				// }

				if($(this).children('i').hasClass('arrow')){
					$(this).css('left', barW);
					$('.sidebar').show();
					$('.mainbody').removeClass('ml-o-ie').css('width', mainW);
				}else{
					$(this).css('left', 0);
					$('.sidebar').hide();
					$('.mainbody').addClass('ml-o-ie').css('width', winW - fleXW);
				}
				$(this).children('i').toggleClass('arrow');
			})
		},


		/**
		 * 判断当前页面是否处于全屏模式 add 20220829-1
		 * @returns {string} 返回是否全屏. true 全屏, false 非全屏
		 */
		isFullscreen: function(){
			var explorer = window.navigator.userAgent.toLowerCase();
			if(explorer.indexOf('chrome') > 0){ // webkit
				// alert('scrollHeight:' + document.body.scrollHeight + '\nheight:' + window.screen.height + '\nscrollWidth:' + document.body.scrollWidth + '\nwidth:' + window.screen.width);
				if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
					// alert("全屏了");
					return true; // "fullscreen";
					// alert("全屏");
				} else {
					// alert("不全屏");
					return false; // "notfullscreen";
				}
			}else{ // IE 9+  fireFox
				if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
					// alert("全屏");
					return true; // "fullscreen";	
				} else {
					// alert("不全屏");
					return false; // "notfullscreen";
				}
			}
		}
		

	};




	/*-------------------------------------------------------*/
	/**
	 * 进入浏览器全屏状态
	 */
	function enterFullScreen(){
		var elem = document.body;
		if(elem.webkitRequestFullScreen)
			elem.webkitRequestFullScreen();
		else if(elem.mozRequestFullScreen)
			elem.mozRequestFullScreen();
		else if(elem.msRequestFullscreen)
			elem.msRequestFullscreen();
		else if(elem.requestFullscreen)
			elem.requestFullscreen();
		else{
			/*if(window.Notification && Notification.permission !== "denied") { //浏览器通知功能
				Notification.requestPermission(function(status) {
					if(status === 'granted'){
						var n = new Notification('通知标题', { body: '这里是通知内容！' }); 
						//console.log('title:',n.title, '\nbody:',n.body);
						//n.onshow = function(){ console.log('title:',n.title, '\nbody:',n.body);}
					}else{
						alert('用户禁止了通知功能');
					}
				})
			}*/
			alert('对不起，该浏览器不支持全屏API或已被禁用');
		}
	}

	/**
	 * 退出浏览器全屏状态
	 */
	function quitFullScreen(){
		var elem = document;
		if(elem.webkitCancelFullScreen)
			elem.webkitCancelFullScreen();
		else if(elem.mozCancelFullScreen)
			elem.mozCancelFullScreen();
		else if(elem.cancelFullScreen)
			elem.cancelFullScreen();
		else if(elem.exitFullscreen)
			elem.exitFullscreen();
		else
			alert('对不起，该浏览器不支持退出全屏API或已被禁用');
	}


	/**
	* 检测IE版本号
	* @returns {Number|null} 返回值：若是ie浏览器则返回对应版本号(整数), 否则返回null
	*/
	function checkIeVersion(){
		if(navigator.appName.toLocaleLowerCase() == 'microsoft internet explorer'){ //ie5-ie10
			var version = parseInt(navigator.appVersion.split(';')[1].toString().replace(/[ ]/g, '').replace(/MSIE/g, ''));
			return version;
		}else{
			if(navigator.userAgent.toLocaleLowerCase().search(/trident/i)) return 11; //ie11
			else return null;
		}
	}


	/**
	* 检测是否IE浏览器
	* @returns {Booleans} 返回值：true 是ie, false 非ie
	*/
	function checkIsIE(){
		var bools = false;
		if(navigator.appName.toLocaleLowerCase() == 'microsoft internet explorer' || navigator.userAgent.toLocaleLowerCase().search(/trident/i))
			bools = true;
		return bools;
	}



	/**
	* 检测是否图片
	*/
	function checkIsImage(str){
		var reg = /\.(png|gif|png|jpeg|webp)$/;
		return reg.test(str);
	}




	/*-------------------------------------------------------*/
	// 对外暴露接口
	if(typeof module != 'undefined' && module.exports){
		module.exports = {
			NeuiBackStage: NeuiBackStage
		}
	}else if(typeof define == 'function' && define.amd){
		define(function(){
			return NeuiBackStage;
		});
	}else{
		window.NeuiBackStage = NeuiBackStage;
	}



})(jQuery);