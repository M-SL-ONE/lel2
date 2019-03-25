    ;(function(doc, win) {
        var $html = $('html');
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function() {
                var clientWidth = $(window).width();
                // if (clientWidth > 640) {
                //     clientWidth = 640;
                // }
                if (!clientWidth) return;
                var remBase = clientWidth / 15;
                var fontSize = remBase;
                while(true){
                    var actualSize = parseInt( $html.css('font-size') );
                    $html.attr('style', 'font-size:' + fontSize + 'px');
                    if (actualSize > remBase && fontSize > 10) {
                        fontSize--;
                        $html.attr('style', 'font-size:' + fontSize + 'px!important');
                    } else {
                        break;
                    }
                }
 
            };
 
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
    /**
     * auth ccy
     * 微信悬浮窗效果
     */
    (function (global, factory) {
        if (typeof define === 'function' && (define.amd || define.cmd)) {
            define(factory);
        } else {
            global.WxLayerBall = factory();
        }
    }(this, function () {
        'use strict';
 
        function calcDistance(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2)* (x1 - x2) + (y1 - y2)*(y1 - y2))
        }
 
        var WxLayerBall = function (options) {
            var defaults = {
                // 是否自动贴边
                edge: true
            };
 
            var params = {};
            options = options || {};
            for (var key in defaults) {
                if (typeof options[key] !== 'undefined') {
                    params[key] = options[key];
                } else {
                    params[key] = defaults[key];
                }
            }
 
            var data = {
                distanceX: 0,
                distanceY: 0
            };
 
            var win = window;
 
            // 浏览器窗体尺寸
            var winWidth = win.innerWidth;
            var winHeight = win.innerHeight;
            var $layerDom = $('<div class="clearfix" style="position: absolute; top:0"><p href="javascript:;" id="__layer-ball" class="__layer-ball">扫描条码</p>\n' +
                '<div class="__layer-cancel-wrapper">\n' +
                '    <div class="__layer-outer">\n' +
                '    </div>\n' +
                '    <div class="__layer-inner">\n' +
                '    </div>\n' +
                '    <div class="__layer-line-left"></div>\n' +
                '    <div class="__layer-line-right"></div>\n' +
                '    <p  class="__layer-text">取消浮窗</p>\n' +
                '</div></div>');
 
            var wrapperRight = 6.8 / 16 * winWidth;
            var wrapperBottom = 6.8 / 16 * winWidth;
            var $styleSheet = $('<style>.__layer-ball {' +
                '            position: fixed;' +
                // '            line-height: ' + (0.8 / 16 * winWidth) + 'px;' +
                // '            width: ' + (1.6 / 16 * winWidth) + 'px;' +
                // '            height: ' + (1.6 / 16 * winWidth) + 'px;' +
                // '            padding: ' + (0.2 / 16 * winWidth) + 'px;' +
                '            text-align: center;' +
                '            border-radius: 50%;' +
                '            color: #fff;' +
                // '            font-size: 14px;' +
                '            z-index: 1001;' +
                // '            background-color: #777779;' +
                '            background-clip: padding-box;' +
                '            text-decoration: none;' +
                '            top: 1em;' +
                '        }' +
                '        .__layer-cancel-wrapper{' +
                '            position: fixed;' +
                '            width: ' + (13.6 / 16 * winWidth) + 'px;' +
                '            height: ' + (13.6 / 16 * winWidth) + 'px;' +
                '            right: -' + wrapperRight + 'px;' +
                '            bottom: -' + wrapperBottom + 'px;' +
                '            border-radius: 50%;' +
                '            display: none;'+
                '            z-index: 1000;'+
                '            background-color: #00abf1;' +
                // '            border: 12px solid red;' +
                '            font-size: 12px;' +
                '        }' +
                '        .__layer-outer{' +
                '            position: absolute;' +
                '            width: ' + (1.7 / 16 * winWidth) + 'px;' +
                '            height: ' + (1.7 / 16 * winWidth) + 'px;' +
                '            left: ' + (3.3 / 16 * winWidth) + 'px;' +
                '            top: ' + (2.3 / 16 * winWidth) + 'px;' +
                '            border-radius: 50%;' +
                '            border: 2px solid #e8e8e8;' +
                '        }' +
                '        .__layer-inner{' +
                '            position: absolute;' +
                '            width: ' + (1.2 / 16 * winWidth) + 'px;' +
                '            height: ' + (1.2 / 16 * winWidth) + 'px;' +
                '            left: ' + (3.55 / 16 * winWidth) + 'px;' +
                '            top: ' + (2.55 / 16 * winWidth) + 'px;' +
                '            border-radius: 50%;' +
                '            border: 2px solid #e8e8e8;' +
                '        }' +
                '        .__layer-line-left{' +
                '            position: absolute;' +
                '            height: ' + (2.2 / 16 * winWidth) + 'px;' +
                '            width: ' + (0.1 / 16 * winWidth) + 'px;' +
                '            left: ' + (4.1 / 16 * winWidth) + 'px;' +
                '            top: ' + (2.15 / 16 * winWidth) + 'px;' +
                '            background-color: #f5f5f5;' +
                '            color: #000;' +
                '            transform: rotate(-45deg);' +
                '        }' +
                '        .__layer-line-right{' +
                '            position: absolute;' +
                '            height: ' + (2.2 / 16 * winWidth) + 'px;' +
                '            width: ' + (0.1 / 16 * winWidth) + 'px;' +
                '            left: ' + (4.2 / 16 * winWidth) + 'px;' +
                '            top: ' + (2.15 / 16 * winWidth) + 'px;' +
                '            background-color: #e8e8e8;' +
                '            transform: rotate(-45deg);' +
                '        }' +
                '        .__layer-text{' +
                '            position: absolute;' +
                '            top: ' + (4.3 / 16 * winWidth) + 'px;' +
                '            left: ' + (3.2 / 16 * winWidth) + 'px;' +
                '            color: #000;' +
                '            opacity: .5;' +
                '        }</style>');
            var $layerWrapper = $layerDom.find('.__layer-cancel-wrapper');
            var $layerOuterCircle = $layerDom.find('.__layer-outer');
            $('head').append($styleSheet);
            $('body').append($layerDom);
            var ele = document.getElementById('__layer-ball');
            var ballRemoved = false;
            // 设置transform坐标等方法
            var fnTranslate = function (x, y) {
                x = Math.round(1000 * x) / 1000;
                y = Math.round(1000 * y) / 1000;
 
                ele.style.webkitTransform = 'translate(' + [x + 'px', y + 'px'].join(',') + ')';
                ele.style.transform = 'translate3d(' + [x + 'px', y + 'px', 0].join(',') + ')';
            };
 
            var strStoreDistance = '';
            if (ele.id && win.localStorage && (strStoreDistance = localStorage['WxLayerBall_' + ele.id])) {
                var arrStoreDistance = strStoreDistance.split(',');
                ele.distanceX = +arrStoreDistance[0];
                ele.distanceY = +arrStoreDistance[1];
                fnTranslate(ele.distanceX, ele.distanceY);
            }
 
            // 显示拖拽元素
            ele.style.visibility = 'visible';
 
            // 如果元素在屏幕之外，位置使用初始值
            var initBound = ele.getBoundingClientRect();
 
            if (initBound.left < -0.5 * initBound.width ||
                initBound.top < -0.5 * initBound.height ||
                initBound.right > winWidth + 0.5 * initBound.width ||
                initBound.bottom > winHeight + 0.5 * initBound.height
            ) {
                ele.distanceX = 0;
                ele.distanceY = 0;
                fnTranslate(0, 0);
            }
 
            ele.addEventListener('touchstart', function (event) {
                if (data.inertiaing) {
                    return;
                }
                // $layerWrapper.slideDown();
 
                var events = event.touches[0] || event;
 
                data.posX = events.pageX;
                data.posY = events.pageY;
 
                data.touching = true;
 
                if (ele.distanceX) {
                    data.distanceX = ele.distanceX;
                }
                if (ele.distanceY) {
                    data.distanceY = ele.distanceY;
                }
 
                // 元素的位置数据
                data.bound = ele.getBoundingClientRect();
 
                data.timerready = true;
            });
 
            // easeOutBounce算法
            /*
            * t: current time（当前时间）；
             * b: beginning value（初始值）；
             * c: change in value（变化量）；
             * d: duration（持续时间）。
            **/
            var easeOutBounce = function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
                }
            };
 
            document.addEventListener('touchmove', function (event) {
                if (data.touching !== true) {
                    return;
                }
 
                // 当移动开始的时候开始记录时间
                if (data.timerready == true) {
                    data.timerstart = +new Date();
                    data.timerready = false;
                }
 
                event.preventDefault();
 
                var events = event.touches[0] || event;
 
                data.nowX = events.pageX;
                data.nowY = events.pageY;
 
                var distanceX = data.nowX - data.posX,
                    distanceY = data.nowY - data.posY;
 
                // 此时元素的位置
                var absLeft = data.bound.left + distanceX,
                    absTop = data.bound.top + distanceY,
                    absRight = absLeft + data.bound.width,
                    absBottom = absTop + data.bound.height;
                // console.log(absRight, absBottom);
                var distance = calcDistance(absLeft,absTop,winWidth,winHeight);
 
                if(distance < wrapperBottom){
                    $layerOuterCircle.css({transform:"scale(1.1)"})
                    $layerWrapper.css({'border':"4px solid #e8e8e8"})
                    ballRemoved = true
                }else{
                    $layerOuterCircle.css({transform:"scale(1)"})
                    $layerWrapper.css({border:"none"})
                    ballRemoved = false
                }
 
                // 边缘检测
                if (absLeft < 0) {
                    distanceX = distanceX - absLeft;
                }
                if (absTop < 0) {
                    distanceY = distanceY - absTop;
                }
                if (absRight > winWidth) {
                    distanceX = distanceX - (absRight - winWidth);
                }
                if (absBottom > winHeight) {
                    distanceY = distanceY - (absBottom - winHeight);
                }
 
                // 元素位置跟随
                var x = data.distanceX + distanceX, y = data.distanceY + distanceY;
                fnTranslate(x, y);
 
                // 缓存移动位置
                ele.distanceX = x;
                ele.distanceY = y;
            }, { // fix #3 #5
                passive: false
            });
 
            document.addEventListener('touchend', function () {
                if (data.touching === false) {
                    // fix iOS fixed bug
                    return;
                }
                data.touching = false;
 
                // 计算速度
                data.timerend = +new Date();
 
                if (!data.nowX || !data.nowY) {
                    return;
                }
                // 移动的水平和垂直距离
                var distanceX = data.nowX - data.posX,
                    distanceY = data.nowY - data.posY;
 
                if (Math.abs(distanceX) < 5 && Math.abs(distanceY) < 5) {
                    return;
                }
                // 开始惯性缓动
                data.inertiaing = true;
                var edge = function () {
                    // 时间
                    var start = 0, during = 25;
                    // 初始值和变化量
                    var init = ele.distanceX, y = ele.distanceY, change = 0;
                    // 判断元素现在在哪个半区
                    var bound = ele.getBoundingClientRect();
                    if (bound.left + bound.width / 2 < winWidth / 2) {
                        change = -1 * bound.left;
                    } else {
                        change = winWidth - bound.right;
                    }
 
                    var run = function () {
                        // 如果用户触摸元素，停止继续动画
                        if (data.touching == true) {
                            data.inertiaing = false;
                            return;
                        }
 
                        start++;
                        var x = easeOutBounce(start, init, change, during);
                        fnTranslate(x, y);
 
                        if (start < during) {
                            requestAnimationFrame(run);
                        } else {
                            ele.distanceX = x;
                            ele.distanceY = y;
 
                            data.inertiaing = false;
                            if (win.localStorage && !ballRemoved) {
                                localStorage['WxLayerBall_' + ele.id] = [x, y].join();
                            }
                        }
                    };
                    run();
                };
                if (params.edge) {
                    edge();
                }
                if(ballRemoved){
                    $(ele).remove()
                }
                $layerWrapper.slideUp()
            });
        };
        new WxLayerBall();
    }));