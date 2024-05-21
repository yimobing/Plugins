
/**
 * neuiTextScroll 演示
 */

 /**
* 获取列表数据
* returns {object} 返回JSON数组
*/
function get_data_message(){
    var json = {
        data:[
            {"title":"东海太禾广场13号楼1918室", "shuoming":"东海太禾广场13号楼1918室有最新询价消息<br>用户张三发起了询价，询价对象1918室，<br>价格135000元/月", "create_time":"2020-12-15 14:32:21"},
            {"title":"闻馨一品15号楼0908室", "shuoming":"闻馨一品15号楼0908室有最新询价消息<br>用户张三发起了询价，询价对象1918室，<br>价格135000元/月", "create_time":"2020-12-15 14:32:21"},
            {"title":"城东星光耀广场20号楼2021室", "shuoming":"城东星光耀广场20号楼2021室有最新询价消息<br>用户张三发起了询价，询价对象1918室，<br>价格135000元/月", "create_time":"2020-12-15 14:32:21"},
            {"title":"星湖雅苑6号楼1705室", "shuoming":"星湖雅苑6号楼1705室有最新询价消息<br>用户张三发起了询价，询价对象1918室，<br>价格135000元/月", "create_time":"2020-12-15 14:32:21"},
            {"title":"万科上悦城7号楼1205室", "shuoming":"万科上悦城7号楼1205室有最新询价消息<br>用户张三发起了询价，询价对象1918室，<br>价格135000元/月", "create_time":"2020-12-15 14:32:21"}
        ]
    }
    return json;
}


/**
 * 获取自定义html
 * @returns {string} 返回html字符串
 */
function getCustomHtml(){
    var html = [
        '<li class="lieven">',
            '<p><a href="#">5000000</a><a href="#" class="btn_lh">领号</a><em>获得</em></p>',
            '<p><a href="#" class="a_blue">jquery使用方法1</a><span>17:28:05</span></p>',
        '</li>',
        '<li>',
            '<p><a href="#">6000000</a><a href="#" class="btn_lh">领号</a><em>获得</em></p>',
            '<p><a href="#" class="a_blue">jquery使用方法1</a><span>17:28:05</span></p>',
        '</li>',
        '<li class="lieven">',
            '<p><a href="#">7000000</a><a href="#" class="btn_lh">领号</a><em>获得</em></p>',
            '<p><a href="#" class="a_blue">jquery使用方法1</a><span>17:28:05</span></p>',
        '</li>',
        '<li>',
            '<p><a href="#">8000000</a><a href="#" class="btn_lh">领号</a><em>获得</em></p>',
            '<p><a href="#" class="a_blue">jquery使用方法1</a><span>17:28:05</span></p>',
        '</li>',
        '<li class="lieven">',
            '<p><a href="#">9000000</a><a href="#" class="btn_lh">领号</a><em>获得</em></p>',
            '<p><a href="#" class="a_blue">jquery使用方法1</a><span>17:28:05</span></p>',
        '</li>',
        '<li>',
            '<p><a href="#">1000000</a><a href="#" class="btn_lh">领号</a><em>获得</em></p>',
            '<p><a href="#" class="a_blue">jquery使用方法1</a><span>17:28:05</span></p>',
        '</li>'
    ].join('\r\n')

    return html;
}




/*--------------------------------------------------------*/
//=====实例1：每隔N秒滚动一次
$("#scrollbox-1").neuiTextScroll({
    source: get_data_message(), //数据源
    format: ["title", "shuoming", "create_time", ""], //自定义数据源字段,数组格式(可选). 数组元素分别对应数据源字段：标题, 描述, 发布时间, 链接地址
    caption: '询价单最新消息（每隔2秒滚动）', //区块标题(可选)
    width: 340, //滚动区域宽(可选)
    height: 500, //滚动区域高(可选)
    line: 1, //每次滚动的行数(可选)
    speed: 500, //滚动速度(毫秒)(可选)
    timer: 2000, //滚动间隔时间(毫秒)(可选)
    direction: 'up', //滚动方向(可选). up 向上(默认), down 向下
    pageBtn: true, //是否显示上下翻页按钮,默认true(可选)
    up: "but_up", //向上按钮ID属性名称(可选)
    down: "but_down" //向下按钮ID属性名称(可选)
});





/*--------------------------------------------------------*/
//=====实例2：无缝滚动
$("#scrollbox-2").neuiTextScroll({
    source: get_data_message(), //数据源
    format: ["title", "shuoming", "create_time", ""],
    caption: '实时播报（无缝滚动）',
    width: 340, 
    height: 500, 
    line: 1,
    speed: 5000,
    timer: 100,
    direction: 'up',
    pageBtn: false
});




/*--------------------------------------------------------*/
//=====实例3：自定义滚动区域内容, 样式使用demo.css
$("#scrollbox-3").neuiTextScroll({
    content: getCustomHtml(), //自定义滚动区域内容,默认空(可选). 注意：每一行数据HTML代码只能用li标签包裹,不能用其它标签
    caption: '自定义滚动区域内容',
    width: 340, 
    height: 300, 
    line: 1,
    speed: 5000,
    timer: 100,
    direction: 'up',
    pageBtn: false
});











