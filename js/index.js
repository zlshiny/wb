/**
 * @author ZHANGL
 * @copyright 2012
 * @Project http://www.yinbeiwang.com
*/
var keybord_global_num = 0;//
var keybord_key_word = 0;//判断提示框是否显示
var keybord_keydown_start = 1;//弹出列表后键盘下按键计数器
var keybord_textarea_class = $('.keybord_input_blur'); //输入框class
var keybord_textarea_downlist_class = $('.keybord_list');//提示框列表外层
var keybord_testarea_downlist_tabkey_class = $('.keybord_list');//提示框列表外层ul
var keybord_textarea_downlist_tab_class = $('.keybord_list_user');//提示框列表外层li
var keybord_input_value = '';//定义输入框内容全局变量
var keybord_keydown_total; //遍历列表中信息总量
var text_input_num = 0;
var sub_string = '';//输入框字符串清空
var key_textarea_pos = ''//提示框弹出定位
var key_textarea_length = '';
var key_textarea_click_length = '';
var key_textarea_key_up_length = '';
var key_down_num = 0;
//后去光标位置函数
$(document).ready(function(){
    $.fn.selection = function(){
        var s,e,range,stored_range;
        if(this[0].selectionStart == undefined){
            var selection=document.selection;
            if (this[0].tagName.toLowerCase() != "textarea") {
                var val = this.val();
                range = selection.createRange().duplicate();
                range.moveEnd("character", val.length);
                s = (range.text == "" ? val.length:val.lastIndexOf(range.text));
                range = selection.createRange().duplicate();
                range.moveStart("character", -val.length);
                e = range.text.length;
            }else {
                range = selection.createRange(),
                stored_range = range.duplicate();
                stored_range.moveToElementText(this[0]);
                stored_range.setEndPoint('EndToEnd', range);
                s = stored_range.text.length - range.text.length;
                e = s + range.text.length;
            }
        }else{
            s=this[0].selectionStart,
            e=this[0].selectionEnd;
        }
        var te=this[0].value.substring(s,e);
        return {start:s,end:e,text:te}
    };
})
$('body').live('click',function(){
    $('.keybord_list').hide();
    keybord_key_word = 0;
})
//遍历出弹出框列表数量,判断键盘上下按键是够到底,可用常量替换
    keybord_keydown_total = 7;
//输入框点击事件
$('.keybord_input_blur').live('click',function(){
    key_textarea_length = $(".keybord_input_blur").selection().start; //*获取光标所在位置前面字符串的长度
    key_textarea_click_length = key_textarea_length;
    var $key_this = $(this).next();
    key_textarea_position($key_this,key_textarea_length);
    if(keybord_global_num > 0){
        return false;
    }
    var that = $(this);
    keydown(that);
    keyup(that);
    keybord_global_num++;//判断点击
})
//当点击输入框后输入@事件
var keydown = function(that){ 
    $(that).keyup(function(event){ 
        key_textarea_key_up_length = $(".keybord_input_blur").selection().start; //*获取光标所在位置前面字符串的长度
        var $key_this = $(this).next();
        key_textarea_click_length = key_textarea_key_up_length;
        key_textarea_position($key_this,key_textarea_key_up_length);
        text_input_news(event);
    })
}  
//弹出框定位
var key_textarea_position = function($key_this,key_str_length){
    sub_string = '';
    $('.keybord_input_hidden_val').html('<span class="keybord_input_hidden_pos"></span>');
    for(var l = 0 ;  l < key_str_length ; l++){
        if($('.keybord_input_blur').val().substring(l,l+1) == ' '){
            sub_string += '<span class="keybord_input_hidden_span">&nbsp;</span>';
        }else{
            sub_string += '<span class="keybord_input_hidden_span">'+$('.keybord_input_blur').val().substring(l,l+1)+'</span>';                       
        }
    }  
    $('.keybord_input_hidden_val').prepend(sub_string);
    key_textarea_pos = $('.keybord_input_hidden_pos').position();
    if($('.keybord_input_hidden_span:last').html() == '@'){
        key_down_num = 0;
        $key_this.show();
        $key_this.css({'left':key_textarea_pos.left+15,'top':key_textarea_pos.top+35});
        $key_this.children().show(); 
        $('.text_blur').blur();
    } 
}
//输入@后弹出列表点击事件
$('.keybord_list_user').live('click',function(){
    $(this).parent().hide();
    if($(this).hasClass('keybord_list_user')){
        var key_select_value = $(this).html();
        keybord_input_length(key_select_value,key_textarea_click_length);
        keybord_key_word = 0;           
    }
})
var keyup = function(that){
      //绑定键盘下方向键
    $(document).keydown(function(event){
        if(event.keyCode== 40){
            //$('.keybord_input_blur').blur();
            if(keybord_keydown_start > keybord_keydown_total){//判断是否到最顶端.到最顶端的时候,终止
                return false;
            }else{
                $('.keybord_list').children().removeClass('keybord_list_user_hover').attr('type','0').eq(keybord_keydown_start).addClass('keybord_list_user_hover').attr('type','1');//按方向键停留项增加参数
                keybord_keydown_start++;
            }
            return false;
        }
    })
    //绑定键盘上方向键
    $(document).keydown(function(event){
        var keyup_start = keybord_keydown_start-1;
        if(event.keyCode== 38){
            //$('.keybord_input_blur').blur();
            if(keyup_start < 2){//判断是否到最底部,到最底部的时候,终止
                return false;
            }else{
                keyup_start-- ;
                keybord_keydown_start--;
                $('.keybord_list').children().removeClass('keybord_list_user_hover').attr('type','0').eq(keyup_start).addClass('keybord_list_user_hover').attr('type','1');
            }
            return false;
        }
    })
    //绑定键盘上空格键
    $(that).keydown(function(event){
        if(event.keyCode== 32){
            $('.keybord_list').hide();
            keybord_key_word = 0;
            key_down_num = 1;
        }
    })
    //绑定键盘回车键
    $(document).keydown(function(event){
        var key_textarea_enter_length = $(".keybord_input_blur").selection().start; //*获取光标所在位置前面字符串的长度
        var keyup_start = keybord_keydown_start-1;
        if(event.keyCode== 13){
            if(!$('.keybord_list_user').is(":visible")){//按下回车键的时候如果提示框未显示,终止!
                return false;
            }
            $('.keybord_input_blur').blur();//焦点返回输入框
            $('.keybord_list_user').each(function(i){//遍历列表判断所选择项
                if($(this).attr('type') == 1){
                    keybord_input_value = $(this).html();
                }
            })
            $('.keybord_list').hide();
            keybord_input_length(keybord_input_value,key_textarea_enter_length);
            keybord_key_word = 0;
            return false;
        }
    })  
}

//动态改变提示框内容
var text_input_news = function(event){
    var new_keybord_cut_value = $('.keybord_input_blur').val().substring(0,key_textarea_key_up_length);//光标前半段字符串
    var new_keybord_input_last_value = new_keybord_cut_value.split('@');//光标前半段字符串先按@分割
    var new_keybord_input_news_value = new_keybord_input_last_value[new_keybord_input_last_value.length-1].length;//光标前半段字符串再按空格分割
    var new_keybord_cur_value_last = new_keybord_cut_value.substring(new_keybord_cut_value.length - new_keybord_input_news_value,new_keybord_cut_value.length);
    $('.test').html(new_keybord_cur_value_last);
    if((event.shiftKey) && (event.keyCode== 50)){
        return false;
    }
    if(new_keybord_cur_value_last == ''){
        return false;
    }
    if(key_down_num == 0){
        $.get('https://api.weibo.com/2/search/suggestions/at_users.json',{
            'access_token' : $('.user_num').val(),
            'q' : new_keybord_cur_value_last,
            'type' : '1',
        },function(json){
    
        })
        text_input_num++;
    }
    return false;
}
//用选择后的全称替换输入的部分内容
var keybord_input_length = function(key_select_value,key_textarea_length){
    var new_keybord_cut_value = $('.keybord_input_blur').val().substring(0,key_textarea_key_up_length);//光标前半段字符串
    var new_keybord_input_last_value = new_keybord_cut_value.split('@');//光标前半段字符串先按@分割
    var new_keybord_input_news_value = new_keybord_input_last_value[new_keybord_input_last_value.length-1].length;//光标前半段字符串再按空格分割
    var new_keybord_cur_value_last = new_keybord_cut_value.substring(0,new_keybord_cut_value.length - new_keybord_input_news_value);
    var keybord_cur_value_last = $('.keybord_input_blur').val().substring(key_textarea_length,$('.keybord_input_blur').val().length);
    var keybord_finish_value = new_keybord_cur_value_last+key_select_value+' '+keybord_cur_value_last;
    return  $('.keybord_input_blur').val(keybord_finish_value).focus();
}
