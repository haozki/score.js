/*!
 * Score.js - jQuery Star Rating Plugin
 * Version: 0.0.1-beta
 * Copyright 2013 Haozki
 */

(function($, window, undefined) {
    /* Note:
        1.API方法中的this通通指向jQuery对象，回调函数以及私有方法中的this指向DOM对象
        2.设置操作对所有选中的jQuery对象有效，获取操作只对jQuery对象集合中的第一个元素有效
    */
    var methods = {
        /* 初始化插件 */
        init: function(option){
            return this.each(function(){
                var _this = this,
                    $this = $(this);
                option = this.option = $.extend({}, $.fn.score.defaults, $this.data(), option); // 在改变this.option时应该同步$(this).data('option')

                // 保留一份原DOM对象的副本
                this.raw = $(this).clone()[0];
                
                var itemType = this.tagName === 'UL' ? 'li' : 'span';
                var items = '';
                for (var i=0; i < option.number; i++)
                {
                    var hint = option.number - i;
                    if (option.hints){
                        hint = option.hints[hint-1] ? option.hints[hint-1] : hint;
                    }
                    items += '<'+ itemType + ' class="score-item" title="' + hint + '"></' +itemType + '>';
                }
                $this.addClass('scorejs').html(items).data('option',option)
                    .css({
                        'font-size': option.size+'px',
                        'color': option.color
                    });

                // 读取格式化为浏览器DOM Style对象中的格式
                this.initStyle = {
                    fontSize: $this.css('font-size'),
                    color: $this.css('color')
                };

                /** 输出调试信息 **/
                debug.call(_this, $this, 'Initialization OptionData: ', option); // 此处DOM上才有option属性，否则debug通过this读取不到debug配置项的值

                if (option.readOnly){
                    methods.readOnly.call($this, true);
                }else{
                    methods._binds.call(_this);
                }

                if (option.fontAwesome){
                    $this.addClass('fontawesome');
                }

                if (option.vertical){
                    $this.addClass('score-vertical');
                }

                if (typeof Number(option.score) === 'number'){
                    methods.score.call($this, Number(option.score));
                }
            });
        },
        /* 设置/返回分数 */
        score: function(score){
            if (score){
                return this.each(function(){
                    var option = this.option;
                    score = score > option.number ? option.number : score;
                    var index = option.number - score;
                    $(this)
                        .children()
                        .removeClass('active')
                        .eq(index)
                        .addClass('active')
                        .nextAll()
                        .addClass('active')
                        .end()
                        .parent('.scorejs')
                        .data({
                            'index': index,
                            'score': score
                        });

                    /** 输出调试信息 **/
                    debug.call(this, $(this), 'Score Set: ', score);
                });
            }else{
                return this.data('score');  // 注意：API方法中的this统一指向jQuery对象
            }
        },
        /* 设置/返回配置项 */
        option: function(option){
            if (option){
                return this.each(function(){
                    var oriOption = this.option;
                    var newOption = $.extend({}, oriOption, option);

                    methods.destroy.call($(this));
                    methods.init.call($(this), newOption);

                    /** 输出调试信息 **/
                    debug.call(this, $(this), 'Option Set: ', option, 'Original Option: ', oriOption, 'New Option: ', newOption);
                });
            }else{
                return this.data('option');  // 注意：API方法中的this统一指向jQuery对象
            }
        },
        /* 设置为只读 */
        readOnly: function(readOnly){
            return this.each(function(){
                if (readOnly){
                    // 解绑后要还原之前的分数，做完mouseout该做的事，避免在hover过程中解绑了mouseout事件后鼠标再离开不能恢复之前的分数的问题
                    $(this)
                        .addClass('read-only')
                        .off('.scorejs')
                        .children()
                        .removeClass('score-item')
                        .addClass('score-item-static')
                        .eq($(this).data('index'))
                        .addClass('active')
                        .nextAll()
                        .addClass('active');
                }else{
                    if ($(this).hasClass('read-only')){
                        $(this)
                            .removeClass('read-only')
                            .children()
                            .removeClass('score-item-static')
                            .addClass('score-item')

                        methods._binds.call(this);
                    }
                }

                /** 输出调试信息 **/
                debug.call(this, $(this), 'readOnly:', readOnly);
            });
        },
        /* 取消当前的评分 */
        cancel: function(){
            return this.each(function(){
                $(this).removeData('index score').children().removeClass('active');

                /** 输出调试信息 **/
                debug.call(this, $(this), 'Canceled');
            });
        },
        /* 销毁插件实例 */
        destroy: function(){
            return this.each(function(){
                // !? 考虑是否需要还原style属性
                $(this).off('.scorejs').empty().removeClass('scorejs read-only fontawesome score-vertical').removeData('index score option');
                
                // 如果当前style属性值与配置项不同，说明是初始化后在其他地方手动修改的，无需还原，否则要还原成初始化前已经设置的值
                if (this.style.fontSize === this.initStyle.fontSize){
                    this.style.fontSize = this.raw.style.fontSize;
                }
                if (this.style.color === this.initStyle.color){
                    this.style.color = this.raw.style.color;
                }
                if ($(this).attr('style') === ''){
                    $(this).removeAttr('style');
                }
                
                /** 输出调试信息 **/
                debug.call(this, $(this), 'Destroyed'); // 要在delete this.option;之前输出调试，否则debug函数获取不到option
                
                delete this.option;
            });
        },
        /* 绑定插件事件 */
        _binds: function(){
            var _this = this,
                $this = $(this),
                option = this.option;
            /* 注意: on事件绑定的函数中的this指向事件触发的DOM对象 */
            $this.on({
                'click.scorejs': function(event){
                    var score = option.number - $(this).index();
                    methods.score.call($this, score);

                    // 触发回调函数
                    setCallback.call(_this, event.type, score, event);
                },
                'mouseover.scorejs': function(event){
                    var score = option.number - $(this).index();
                    $this.children().removeClass('active');

                    // 触发回调函数
                    setCallback.call(_this, event.type, score, event);
                },
                'mouseout.scorejs': function(event){
                    var score = methods.score.call($this);
                    $this.children()
                        .eq($(this).parent().data('index'))
                        .addClass('active')
                        .nextAll()
                        .addClass('active');

                    // 触发回调函数
                    setCallback.call(_this, event.type, score, event);
                }
            }, '.score-item');
        }
    };

    // 回调函数控制（this -> DOM）
    function setCallback(callback){
        var callbackReference;
        if (typeof this.option[callback] === 'function'){
            callbackReference = this.option[callback];
            this.option[callback].apply(this, Array.prototype.slice.call(arguments, 1));
        }else{
            callbackReference = 'No callback function set';
        }

        /** 输出调试 */
        debug.call(this, 'Callback Triggered: [',callback,'|',callbackReference,']');
    }

    // 调试函数（this -> DOM）
    function debug(){
        if (this.option.debug){
            var logger = window.console['debug'];
            if (typeof logger === 'function'){
                logger.apply(window.console, arguments);
            }
        }
    }

    $.fn.score = function (option) {
        if (methods[option]) {
            return methods[option].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if (typeof option === "object" || !option) {
            return methods.init.apply(this, arguments);
        }
        return false;
    }

    // 默认配置项
    $.fn.score.defaults = {
        number      : 5,              // 评分范围
        size        : 26,             // 图标大小
        color       : 'black',        // 图标颜色
        score       : undefined,      // 初始化时要设置的分数
        vertical    : false,          // 垂直模式
        hints       : undefined,      // 替换评分条目提示，例: ['bad', 'poor', 'regular', 'good', 'gorgeous']（默认是从1开始的阿拉伯数字）
        click       : undefined,      // Callback executed on click.
        mouseover   : undefined,      // Callback executed on mouseover.
        mouseout    : undefined,      // Callback executed on mouseout.
        readOnly    : false,          // 只读不能评分
        fontAwesome : false,          // 使用FontAwesome
        custom      : false,          // 自定义模式【预留，第二版中实现】
        debug       : false           // 打开开发者调试
    }
})(jQuery, window);