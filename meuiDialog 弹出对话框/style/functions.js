/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//===objcetAttr对象用于获取元素属性
var objectAttr = {
	getClassID:function(element){ //======获取元素class值,含jq调用的点
		var selector = '';
		if(typeof(element)=='object')//==eg. element为$(this)
			//selector = typeof(element.attr('id'))=='undefined' ?  '.'+element[0].className : '#'+element.attr('id');
			selector = element;
		else 
			selector = typeof($(element).attr('id'))=='undefined' ?  '.'+$(element)[0].className.trim() : '#'+$(element).attr('id');
		return selector;
	},
	getNodeType:function(element){//======获取元素类型好决定是用val还是text进行赋值:input、select或div、span等标签
		//element的值eg1. element = '.classname' ; eg2. element = '#id';
		var selector = this.getClassID(element);
		var obj = typeof(selector)=='object' ? selector : $(selector); //结果:$(this)或 $('#ID')
		var type = obj[0].tagName.toLocaleLowerCase(); //绑定元素的类型（即标签名称):input 、 span 、div 、 select
		//注:$('#selector')[0].tagName.toLocaleLowerCase(); 用于获取元素名称，如input span div等
		return type;
	}
}



/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//===js验证、检验对象
var checker = {
	checkJsonHasData:function($json){//=====判断json对象中的data数组是否有数据(数组或单个数据),有 返回 true; 无 返回 false
		 var flag = true;
		 if(typeof($json)!='object') flag = false; //不是json对象
		 if(typeof($json)=='object' && typeof($json.data)=='undefined') flag = false; //是json对象,但不存在数组
		 if(typeof($json)=='object' && typeof($json.data)!='undefined' && $json.data.length<=0) flag = false; //是json对象，也存在数组，但数组长度为0(没数据)
		 return flag;
	},
};


/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
/******************************
*aui对象
***************************/
var aui = {
	showAnimate:function(){ //=====显示转圈圈特效
		var html = '<div id="animateLoader"><span class="loadtxt">加载中</span></div>';
		if($('#animateLoader').length==0){//创建转圈圈节点(只一个)
			$('body').append(html); 
			//var style = {'position':'fixed','z-index':'100','width':'32px', 'height':'32px', 'top':'40%','left':'40%'};
			//$('#animateLoader').css(style);
		}
		if($('#animateLoader').length>0) {
			var str = '<i class="loadimg"></i>';
			if($('#animateLoader .loadimg').length==0) $('#animateLoader').append(str);
		}
	},
	
	destroyAnimate:function(){ //====销毁转圈圈特效
		$('#animateLoader').empty(); //销毁转圈特效
		$('#animateLoader').remove(); //移除转圈圈节点
	},
	
	
};




/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
/****************************
*newCalendar对象
*日历控件
*注：jeCalendar()方法需用到jquery.jedate.js
eg.
$('#startDate').val(newCalendar.getNowtime()); //当天
$('#startDate').val(newCalendar.getMonthFirstDay()); //当月第1天
$('#startDate').val(newCalendar.getMonthLastDay()); //当月最后一天
$('#startDate').val(newCalendar.getYear()+'-'+newCalendar.getMonth()+'-05'); //当月5号
$('#startDate').val(newCalendar.getQuarterStartDay()); //本季度开始日期第1天
$('#startDate').val(newCalendar.getQuarterEndDay()); //本季度结束日期最后1天
$('#startDate').val(newCalendar.getYearFirstDay()); //本年第1天
$('#startDate').val(newCalendar.getYearLastDay()); //本年最后1天
***************************/
var newCalendar = {
	/*
		*jeDate日历控件写成插件方便调用（需用到jquery.jedate.js)
		* @param element 要加载日期的元素id或class ; 
		* @param boolean 第2个参数可缺省，如不传或boolean=true，则元素默认日期为当天日期,如第2个参数为false,则日期为空
		* eg1. $("#panel-search .search-date").each(function(){ newCalendar.jeCalendar($(this),false);});
		* eg2. $("#panel-search .search-date").each(function(){ newCalendar.jeCalendar($(this));});
	*/
	jeCalendar:function(element){ 
			var selector = objectAttr.getClassID(element);
			var obj = typeof(selector)=='object' ? selector : $(selector);
			var boolean = (arguments[1]!=false && (arguments[1]=='' || typeof(arguments[1])=='undefined')) ? true : arguments[1];
			//if(typeof(showCursor)=='function') showCursor(obj); //添加假光标
			obj.jeDate({
			//$(selector).jeDate({
			 format: 'YYYY-MM-DD', //日期格式format: 'YYYY-MM-DD hh:mm:ss', //日期格式
			 isinitVal:boolean, //是否填充日期为初始化日期 true 是; false 否
			 initDate:[{hh:10,mm:00,ss:00},false], //初始化日期-默认日期initDate 必须配合 isinitVal 且 isinitVal 为 true，才有作用
			 multiPane:true, //true单面板展示  false多面板展示
			 minDate:'1644-06-16 10:20:25', //最小时间值
			 maxDate:'3085-06-16 18:30:35', //最大时间值
			 onClose:false, //选中后是否立即关闭 false 马上关闭 true点击确定才关闭
			 okfun:function(obj){ //回调函数
			 	//console.log(obj.elem); //当前输入框id
				//console.log(obj.val); //日期生成的值，如2018-04-06
				//if(typeof(removeCursor)=='function') removeCursor(obj); //移除当前节点以外的所有假光标
	
			 }
		});
	},
	
	getNowtime:function(){ //====生成当前日期.格式:2017-09-05
		var mydate = new Date();
		var Y = mydate.getFullYear(),
				M = mydate.getMonth()+1,
				D = mydate.getDate(),
				h = mydate.getHours(),
				m = mydate.getMinutes(),
				s = mydate.getSeconds();
		var boolean = (arguments[0]=='false' || arguments[0]==false) ? false : true;
		if(boolean){//小于10的月分及天数前面是否补0(默认补0，如果函数传递参数false则不补0)
			if(M<10) M = "0"+M;
			if(D<10) D = "0"+D;
		}
		var nowtime = Y+'-'+M+'-'+D;
		return nowtime;
	},

	getYear:function(){ //===生成当前年份(本年)
		var mydate = new Date();
		var Y = mydate.getFullYear();
		return Y;
	},

	getMonth:function(){ //===生成当前月份(本月)
		var mydate = new Date();
		var M = typeof(arguments[1])=='undefined' ? mydate.getMonth()+1 : arguments[1]; //当前月份或第2个参数(传递过来的月份) edit 20180421-1
		var boolean = (arguments[0]=='false' || arguments[0]==false) ? false : true;
		if(boolean){ //小于10的月份前面是否补0(默认补0，如果函数传递参数false则不补0)
			if(M<10) M = "0"+M;
		}
		return M;
	},

	getDay:function(){ //===生成当前日(本日)
		var mydate = new Date();
		var D = mydate.getDate();
		var boolean = (arguments[0]=='false' || arguments[0]==false) ? false : true;
		if(boolean){//小于10的天数前面是否补0(默认补0，如果函数传递参数false则不补0)
			if(D<10) D = "0"+D;
		}
		return D;
	},

	getMonthFirstDay:function(){ //===获取当前月份的第1天
			var boolean = (arguments[0]=='false' || arguments[0]==false) ? false : true;
			var day = '-01';
			if(!boolean){//小于10的天数前面是否补0(默认补0，如果函数传递参数false则不补0)
					day = "-1";
			}
			var valDay = this.getYear() + '-' + this.getMonth(boolean) + day;
			return valDay;
	},
	
	getMonthLastDay:function(){ //===获取当前月份的最后一天 eg.getMonthLastDay(false);//获取当前月分的最后一天. eg2.getMonthLastDay(false,10);//获取10月的最后一天
			var boolean = (arguments[0]=='false' || arguments[0]==false) ? false : true;
			var year = this.getYear();//当前年
			//var month = parseInt(this.getMonth('false')); //当前月份
			
			var month = typeof(arguments[1])=='undefined' ? parseInt(this.getMonth('false')) : arguments[1]; //当前月份 或 传递过来的第2个参数作为月份 edit 20180421-1
			
			var day = '30';
			if(month==1||month==3||month==5||month==7||month==8||month==10||month==12) day = '31'; //1,3,5,7,8,10,12月为大月
			//if(month==4||month==6||month==9||month==11) day = '30'; //4,6,9,11月为小月
			if(month==2){
					if(year%4==0) day = '29'; //闰年2月共有29天
					else day = '28'; //平年2月只有28天
			}
			//var montLastDay = year + '-' + this.getMonth(boolean) + '-' + day;
			var montLastDay = year + '-' + this.getMonth(boolean,month) + '-' + day; //edit 20180421-1
			return montLastDay;
	},
	
	
	getQuarterStartDay:function(){ //===获取当前季度的开始日期eg.2018-7-1

		//1,2,3为第1季度; 4,5,6为第2季度; 7,8,9为第3季度; 10,11,12为第4季度
		var month = this.getMonth('false'); //当前月份
		var startMonth = month; //季度开始月份
		var day = '1';
		//..当前是1、4、7、10月
		//if(month%3==1) startMonth = month;
		//..当前是2,5,8,11月
		if((parseInt(month)+1)%3==0) startMonth = parseInt(month)-1;
		
		//..当前是3,6,9,12月
		if(parseInt(month)%3==0) startMonth = parseInt(month)-2;
		
		var boolean = (arguments[0]=='false' || arguments[0]==false)? false : true;
		if(boolean){ 
			day = '01';
			if(startMonth<10) startMonth = '0' + startMonth; //月份小于10月时补0
		}
		var startDay = this.getYear()+'-'+startMonth+'-'+day;
		return startDay;

	},
	
	getQuarterEndDay:function(){ //===获取当前季度的结束日期日期eg.第1季度的最后一天为2018-03-31，第2季度的最后一天为 2018-06-30
			var boolean = (arguments[0]=='false' || arguments[0]==false)? false : true;
			//1,2,3为第1季度; 4,5,6为第2季度; 7,8,9为第3季度; 10,11,12为第4季度
			//每个季度的最后一个月分别为：3月,6月,9月,12月（其中3月、12月为大月有31天，6月、9月为小月只有30天）
			var month = this.getMonth('false'); //当前月份
			var endMonth = month; //季度结束月份
			var day = '30';
			//..当前是1、4、7、10月
			if(month%3==1) endMonth = parseInt(month)+2;//3、6、9,12
			
			//..当前是2,5,8,11月
			if((parseInt(month)+1)%3==0) endMonth = parseInt(month)+1;//3,6,9,12
			
			//..当前是3,6,9,12月
			if(parseInt(month)%3==0) endMonth = parseInt(month);//3,6,9,12
			
			if(endMonth==3 || endMonth==12) day = '31'; //如果该季度的最扣一个月为大月（3月、12月）
			//else //如果该季度的最扣一个月为小月（6月，9月）
			
			
			if(boolean){ 
				if(endMonth<10) endMonth = '0' + endMonth; //月份小于10月时补0
			}
			var endDay = this.getYear()+'-'+endMonth+'-'+day;
			return endDay;

	},
	
	getYearFirstDay:function(){ //===获取年度第1天
			var boolean = (arguments[0]=='false' || arguments[0]==false)? false : true;
			var monthDay = '-01-01';
			if(!boolean) monthDay = '-1-1';
			var valDay = this.getYear() + monthDay;
			return valDay;
	},
	
	getYearLastDay:function(){ //=====获取年度最后一天
			var valDay = this.getYear()+'-12-31';
			return valDay;
	},
	
	getPrevNDay:function(numc){ //=====获取当前日期前N天的日期(一般n小于30) add 20180421-1
		var numc = typeof(numc)=='undefined' ? 0 : numc;
		var nowDay = this.getDay(); //当日(如7号,10号)
		var nowMonth = this.getMonth(); //当前月
		var lastMonth = nowMonth -1; //上一个月
		var lastMonthLastDay = this.getMonthLastDay(true,lastMonth); //上个月的最后一天(格式:年-月-日,如2018-4-30)
		var	lastDay = lastMonthLastDay.substring(lastMonthLastDay.lastIndexOf('-')+1); //上个月最后一天(格式:日,如30号)
		var nDay = 0; //前n天的日期(如前n天是13号)
		var prevNDay = '';
		
		if(numc!=0){
			var result = nowDay-numc+1;
			if(result>0){ //前n天还是当前月
				nDay = nowDay-numc+1;
				prevNDay = this.getYear() + '-' + this.getMonth() + '-' + nDay;
			}else{ //前n天是上个月
				nDay = parseInt(lastDay) + parseInt(result);
				prevNDay = this.getYear() + '-' + lastMonth + '-' + nDay;
			}
		}
		return prevNDay;
	}
	
};
