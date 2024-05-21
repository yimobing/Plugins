/**-------------------------------
* 讯地图自定义坐标信息(二次开发)
* Author：ChenMufeng
* Update: 2020.02.26
* -------------------------------
*/

//////////////////////////////工具推荐/////////////////////////////////////////
/* 工具推荐：
*腾讯地图坐标拾取工具:https://lbs.qq.com/tool/getpoint/
*/

//////////////////////////////地图对象/////////////////////////////////////////
//普通对象(全局)
var Marker = qq.maps.Marker; //覆盖物对象
var LatLng = qq.maps.LatLng; //经纬度对象
var Point = qq.maps.Point; //标注点对象
var Event = qq.maps.event; //事件对象
//聚合类对象(全局)
var MarkerCluster = qq.maps.MarkerCluster;
var Cluster = qq.maps.Cluster;
var MVCArray = qq.maps.MVCArray;
var markers = new MVCArray(); //聚合标注点
var markerCluster;


////////////////////////////////////系列函数///////////////////////////////////
/**-----------------------
* 函数：创建标注点信息窗
* @param json 参数 {"center":center,"map":map}
* center 地图中心点对象, map  信息窗所属的地图对象, contents 信息窗内容
* @return 返回信息窗对象
* edit 20200226-1
* -----------------------
*/
function createInfoWindow(json){
	var loop = json.loop,
		mapObject = json.map,
		centerObject = json.center,
		contents = json.contents,
		infoIcon = json.infoIcon;
		
	var info = new qq.maps.InfoWindow({
        map: mapObject
    });
    info.open();
   	info.setContent('<div class="bubbleInfo bubbleInfo-' + loop + '">'+contents+'</div>');
   	info.setPosition(centerObject);
   	//$('.bubbleInfo').parent().parent().css({'border':'1px solid blue'});
	 if(!infoIcon){
	   	setTimeout(function(){ //隐藏信息窗的关闭按钮(打叉图标)
			$('.bubbleInfo-' + loop).parent().parent().next().hide();
		},100)
	 }
   	return info;
} //END_FUNCTION



/**-----------------------
* 函数：创建地图坐标点
* @param json json对象(object类型)
* -----------------------
*/
function createLocationList(json){

	/*
	//清除覆盖物（点聚合) 不起作用
	if(markerCluster){
		console.log('markerCluster:',markerCluster);
			markerCluster.clearMarkers();
		}
		*/

	$.each(json.data,function(i,items){
		var location = items.location.split(','),
			longitude = location[0],
			latitude = location[1],
			title = typeof(items.title)=='undefined' ? '' : items.title,
			details = typeof(items.details)=='undefined' ? '' : items.details,
			isShowAtonce = parseInt(items.isShowAtonce),
			isShowInfoClose = (typeof items.isShowInfoClose == 'undefined') ? true : (items.isShowInfoClose === false ? false : true); //add 20200407-1
		var color = typeof(items.color)=='undefined' ? '#fff' : items.color,
			bgcolor = typeof(items.bgcolor)=='undefined' ? '#f25824' : items.bgcolor;
		var canDrag = typeof(items.draggable)=='undefined' ? false : items.draggable;
		var canAnimate = typeof(items.animation)=='undefined' ? false : items.animation;

		var style = title=='' ? '' : {"color":color,"backgroundColor":bgcolor,"padding":"8px 12px","border":"1px solid #ddd","borderRadius":"4px","boxShadow":"0 2px 8px rgba(0,0,0,.35)"}

		//=====创建经纬度
		var locationObject = new LatLng(longitude,latitude);

	    //=====创建标注点(创建覆盖物)  edit 20200226-1
		var markerOptions = {
	    	position:locationObject,
	    	map:map,
	    	//animation: qq.maps.MarkerAnimation.BOUNCE, //标注点动画(跳动的标记). BOUNCE 反复弹跳, DROP 从天而降，DOWN 落下, UP 升起
	    	draggable: canDrag //标注点是否可拖拽/移动 
	    }
	    if(canAnimate == 'BOUNCE') markerOptions["animation"] =  qq.maps.MarkerAnimation.BOUNCE;
	    if(canAnimate == 'DROP') markerOptions["animation"] =  qq.maps.MarkerAnimation.DROP;
	    if(canAnimate == 'DOWN') markerOptions["animation"] =  qq.maps.MarkerAnimation.DOWN;
	    if(canAnimate == 'UP') markerOptions["animation"] =  qq.maps.MarkerAnimation.UP;
	    var marker = new Marker(markerOptions);


	    

	    //=====标注点添加文本
	    var label = new qq.maps.Label({
	    	position:locationObject,
	    	map:map,
	    	content:title,
	    	offset:new qq.maps.Size(5,5),
	    	style:style

	    });
	    //=====标注点自定义图标
		var anchor = new Point(15, 25),
	         size = new qq.maps.Size(30, 30),
	         origin = new Point(0, 0);
	    var markerIcon = new qq.maps.MarkerImage(
		     "img/icon_locate_green.png",
		     size,
		     origin,
		     anchor
	   	);
	   	marker.setIcon(markerIcon);

	   	//=====标注点信息窗(标注点点击事件/hover事件)  edit 20200226-1
		var infoWin = new qq.maps.InfoWindow(); //var infoWin = '';
	   	if(details!=''){
		    if(isShowAtonce){
		    	infoWin = createInfoWindow({"loop":i+1, "map":map,"center":locationObject,"contents":details, "infoIcon":isShowInfoClose});
		    }
		   //点击标记或鼠标移动到标记上面时显示信息窗
		   //var pointclickListener = Event.addListener(marker,'mouseover',function(){
		   var pointclickListener = Event.addListener(marker,'click',function(){
		   		infoWin = createInfoWindow({"loop":i+1, "map":map,"center":locationObject,"contents":details, "infoIcon":isShowInfoClose});
		   })
		}

		//拖拽或移动标记点时 add 20200226-1
	   	var pointDragListener = Event.addListener(marker,'dragend',function(){ //test
	   		var weizhi = marker.getPosition(); //获取当前位置（经度,纬度)
	   		//alert('当前位置：'+weizhi);
			map.setCenter(weizhi); //重置地图中心点
    		var arr = weizhi.toString().split(',');
			var	jingdu = arr[0], 
				weidu = arr[1];
			var newPosition = new LatLng(jingdu,weidu);
			label.setPosition(newPosition); //更新文本标记位置
			infoWin.setPosition(newPosition); //更新信息窗位置:方法1
			/*更新信息窗位置:方法2
			infoWin.close(); //关闭旧信息窗
			infoWin = createInfoWindow({"loop":i+1, "map":map, "center":newPosition, "contents":details, "infoIcon":isShowInfoClose}); //创建新信息窗
			*/
		});

	    //=====点聚合
	    markers.push(marker);

	}); //$.each


	markerCluster = new MarkerCluster({
        map:map,
        minimumClusterSize:2, //最小多少个点才会产生聚合,默认2
        markers:markers,	 //聚合标注点
        zoomOnClick:true, //是否允许点击聚合点,默认为true
        gridSize:30, //默认60
        averageCenter:true, //默认false
        maxZoom:18, //默认18 (4-18)
    });


	/*
    Event.addListener(markerCluster, 'clusterclick', function (evt) {
        // writeLog("mouse event", eventType);
        var ss =  evt;
        alert('点击了聚合点');
    });
    */




} //END_FUNCTION
