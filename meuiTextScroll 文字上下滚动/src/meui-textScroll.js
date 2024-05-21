/*
* [meui文字上下滚动]
* Author: Mufeng
* Date: 2020.12.13
* Update: 2020.12.29
* 官网：https://github.com/yimobing/meuiTextScroll
*/
(function ($) {
    $.fn.extend({
        meuiTextScroll: function (opt, callback) {
            var selector = this.selector;
            if($(selector).length == 0){
                alert('选择器' + selector + '不存在，请检查');
                return;
            }
            var defaults = {
                source: {}, //数据源
                format: ["title", "description", "pubdate", "href"], //自定义数据源字段,数组格式(可选). 数组元素分别对应数据源字段：标题, 描述(可选), 发布时间(可选), 链接地址(可选)
                caption: '', //区块标题(可选)
                width: 340, //滚动区域宽(可选)
                height: 500, //滚动区域高(可选)
                line: 1, //每次滚动的行数(可选)
                speed: 500, //滚动速度(毫秒)(可选)
                timer: 2000, //滚动间隔时间(毫秒)(可选)
                direction: 'up', //滚动方向(可选). up 向上(默认), down 向下
                pageBtn: true, //是否显示上下翻页按钮,默认true(可选)
                up: "but_up", //向上按钮ID属性名称(可选)
                down: "but_down" //向下按钮ID属性名称(可选)
            }
            var settings = $.extend(true, {}, defaults, opt || {});
            var dSource = settings.source,
                dFormat = settings.format,
                dCaption = settings.caption,
                dWidth = settings.width.toString().replace(/px/g, ''),
                dHeight = settings.height.toString().replace(/px/g, ''),
                dLine = settings.line,
                dSpeed = settings.speed,
                dTimer = settings.timer,
                dDirection = settings.direction,
                dPageBtn = settings.pageBtn,
                dUp = settings.up,
                dDown = settings.down;
            if(dSource === '' || $.isEmptyObject(dSource)) return;
            if(typeof dSource != 'object') return;
            if(typeof dSource.data == 'undefined') return;
            //HTML
            var isGoOn = true;
            var allHtml = [
                dCaption == '' ? '' : '<div class="scrollCaption">' + dCaption + '</div>',
                '<div id="scrollDiv"></div>',
                '<div class="scroltit">',
                    '<div class="updown up" id="' + dUp + '">向上</div><div class="updown down" id="' + dDown + '">向下</div>',
                '</div>'
            ].join('\r\n');
            var listHtml = '<ul>';
            $.each(dSource.data, function(i, item){
                var _title = item[dFormat[0]],
                    _description = item[dFormat[1]],
                    _pubdate = item[dFormat[2]],
                    _href = item[dFormat[3]];
                if(typeof _title == 'undefined'){
                    alert('数据源不含' + dFormat[0] + '字段，请检查');
                    isGoOn = false;
                    return false;
                }
                if(typeof _description == 'undefined') _description = '';
                if(typeof _pubdate == 'undefined') _pubdate = '';
                if(typeof _href == 'undefined' || _href === '') _href = 'javascript:;';
                listHtml += [
                    '<li>',
                        '<h3><a href="' + _href + '" class="linktit">' + _title + '</a></h3>',
                        _pubdate == '' ? '' : '<span class="time">' + _pubdate + '</span>',
                        _description == '' ? '' : '<div>' + _description + '</div>',
                    '</li>'
                ].join('\r\n');
            })
            listHtml += '</ul>';
            if(!isGoOn) return;
            this.empty().append(allHtml).css({
                width: dWidth,
                backgroundColor: '#fff',
                padding: 0, 
                border: '1px solid #ddd', 
                borderRadius:'4px',
                overflow: 'hidden'
            });
            
            var father = this.find('#scrollDiv');
            father.empty().append(listHtml).css({'width': dWidth, 'height': dHeight}); //拼接并设置滚动区域宽高
            if(!dPageBtn) {
                father.css({
                    marginBottom: '15px'
                }).next().remove();
            }
            var $this = father.eq(0).find("ul:first");

            //参数初始化
            var vLineH = $this.find("li:first").height(), //获取行高
                vLine = dLine ? parseInt(dLine, 10) : parseInt(father.height() / vLineH, 10), //每次滚动的行数，默认为一屏，即父容器高度
                vSpeed = dSpeed ? parseInt(dSpeed, 10) : 500; //卷动速度，数值越大，速度越慢（毫秒）
                vTimer = dTimer; //?parseInt(dTimer,10):3000; //滚动的时间间隔（毫秒）
            if (vLine == 0) vLine = 1;
            var vUpHeight = 0 - vLine * vLineH;
            var timerID;
            var $btnUp = $("#" + dUp);//向上按钮
            var $btnDown = $("#" + dDown);//向下按钮
            
            //向上翻页函数
            var scrollUp = function () {
                $btnUp.unbind("click", scrollUp); //取消向上按钮的函数绑定
                $this.animate({
                    marginTop: vUpHeight
                }, vSpeed, function () {
                    for (i = 1; i <= vLine; i++) {
                        $this.find("li:first").appendTo($this);
                    }
                    $this.css({ marginTop: 0 });
                    $btnUp.bind("click", scrollUp); //绑定向上按钮的点击事件
                })
            }
            
            //向下翻页函数
            var scrollDown = function () {
                $btnDown.unbind("click", scrollDown);
                for (i = 1; i <= vLine; i++) {
                    $this.find("li:last").show().prependTo($this);
                }
                $this.css({ marginTop: vUpHeight });
                $this.animate({
                    marginTop: 0
                }, vSpeed, function () {
                    $btnDown.bind("click", scrollDown);
                });
            }
            //自动播放函数
            var autoPlay = function () {
                if (vTimer) timerID = window.setInterval(dDirection == 'down' ? scrollDown : scrollUp, vTimer);
            };
            var autoStop = function () {
                if (vTimer) window.clearInterval(timerID);
            };
            //鼠标事件绑定
            $this.hover(autoStop, autoPlay).mouseout();
            $btnUp.css("cursor", "pointer").click(scrollUp).hover(autoStop, autoPlay);//向上向下鼠标事件绑定
            $btnDown.css("cursor", "pointer").click(scrollDown).hover(autoStop, autoPlay);

        }
    })
})(jQuery);
