$(function(){
    /* Option Demo */
    $('.demo-option-default').score();

    $('.demo-option-number').score({
        number: 10
    });
    
    $('.demo-option-size').score({
        size: 32
    });
    
    $('.demo-option-color').score({
        color: '#08C'
    });
    
    $('.demo-option-score').score({
        score: 3
    });
    
    $('.demo-option-vertical').score({
        vertical: true
    });
    
    $('.demo-option-hints').score({
        hints: ['bad', 'poor', 'regular', 'good', 'gorgeous']
    });
    
    $('.demo-option-click').score({
        click: function(score, event){
            alert('Class Name: '+this.className+'\n' + 'Score: '+score+'\n' + 'Event Type: '+event.type+'\n');
        }
    });
    
    $('.demo-option-mouseover').score({
        mouseover: function(score, event){
            alert('Class Name: '+this.className+'\n' + 'Score: '+score+'\n' + 'Event Type: '+event.type+'\n');
        }
    });
    
    $('.demo-option-mouseout').score({
        mouseout: function(score, event){
            alert('Class Name: '+this.className+'\n' + 'Score: '+score+'\n' + 'Event Type: '+event.type+'\n');
        }
    });
    
    $('.demo-option-readOnly').score({
        readOnly: true,
        score: 3
    });
    
    $('.demo-option-fontAwesome').score({
        fontAwesome: true
    });
    
    /* Live Demo */
    function doScorejs(){
        $('.demo-live-application').score({
            number      : 10,
            size        : 32,
            color       : '#08C',
            score       : 4,
            vertical    : false,
            hints       : ['bad', 'poor', 'regular', 'good', 'gorgeous'],
            click       : function(score, event){
                alert('Class Name: '+this.className+'\n' + 'Score: '+score+'\n' + 'Event Type: '+event.type+'\n');
            },
            readOnly    : false,
            fontAwesome : true,
            debug       : true
        });
    }
    doScorejs();
    function objectToText(obj, tab, isArray){
        var text = '';
        if (!tab){
            tab = 0;
        }
        var _t = '';
        for (var i=0; i < tab; i++){
            _t += '\t';
        }
        $.each(obj, function(i,n){
            if (jQuery.isPlainObject(n)){
                n = '{\n' + objectToText(n, ++tab) + _t + '}';
            }
            if (jQuery.isArray(n)){
                n = '[' + objectToText(n, ++tab, true) + ']';
            }
            
            if (jQuery.isArray(obj)){
                if (i != obj.length-1){
                    text += n + ',';
                }else{
                    text += n;
                }
            }else{
                text += _t + i + ': ' + n + ',\n';  // 末尾逗号问题待解决
            }
        });
        return text;
    }
    $('.api-score-set').click(function(){
        $('.demo-live-application').score('score', $('.api-score-input').val());
    });
    $('.api-score-get').click(function(){
        alert($('.demo-live-application').score('score'));
    });
    $('.api-option-set').click(function(){
        var command = "$('.demo-live-application').score('option', "+$('.api-option-input').val()+");"
        eval(command); // 这样做不要求option的格式为Json字符串，因为不需要解析，直接作为语句执行了
    });
    $('.api-option-get').click(function(){
        var optionText = '';
        $.each($('.demo-live-application').score('option'),function(i,n){
            optionText += i + ': ' + n + ';\n';
        });
        alert(optionText);
    });
    $('.api-readOnly-true').click(function(){
        $('.demo-live-application').score('readOnly',true);
    });
    $('.api-readOnly-true-5s').click(function(){
        setTimeout("$('.demo-live-application').score('readOnly',true)", 5000);
    });
    $('.api-readOnly-false').click(function(){
        $('.demo-live-application').score('readOnly',false);
    });
    $('.api-cancel').click(function(){
        $('.demo-live-application').score('cancel');
    });
    $('.api-destroy').click(function(){
        $('.demo-live-application').score('destroy');
    });
    $('.live-application-create').click(function(){
        doScorejs();
    });
});
