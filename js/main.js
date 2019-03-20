// smooth-scroll
$.smoothScroll({
    //滑动到的位置的偏移量
    offset: 0,
    //滑动的方向，可取 'top' 或 'left'
    direction: 'top',
    // 只有当你想重写默认行为的时候才会用到
    scrollTarget: null,
    // 滑动开始前的回调函数。`this` 代表正在被滚动的元素
    beforeScroll: function () { },
    //滑动完成后的回调函数。 `this` 代表触发滑动的元素
    afterScroll: function () { },
    //缓动效果
    easing: 'swing',
    //滑动的速度
    speed: 700,
    // "自动" 加速的系数
    autoCoefficent: 2
});


// Bind the hashchange event listener
$(window).bind('hashchange', function (event) {
    $.smoothScroll({
        // Replace '#/' with '#' to go to the correct target
        offset: $("body").attr("data-offset")? -$("body").attr("data-offset"):0 ,
        // offset: -30,
        scrollTarget: decodeURI(location.hash.replace(/^\#\/?/, '#'))
        
      });
});

// $(".smooth-scroll").on('click', "a", function() {
$('a[href*="#"]')
    .bind('click', function (event) {    
    // Remove '#' from the hash.
    var hash = this.hash.replace(/^#/, '')
    if (this.pathname === location.pathname && hash) {
        event.preventDefault();
        // Change '#' (removed above) to '#/' so it doesn't jump without the smooth scrolling
        location.hash = '#/' + hash;
    }
});

// Trigger hashchange event on page load if there is a hash in the URL.
if (location.hash) {
    $(window).trigger('hashchange');
}

// // $('[data-spy="scroll"]').each(function () {
// //     var $spy = $(this).scrollspy('refresh')
// //   })

// $('[data-spy="scroll"]').on('activate.bs.scrollspy', function () {
//     // do something…
//     var offset = $('[data-spy="scroll"]').attr("data-offset")
//   })
function ajax_post(params,success,fail){
    $.ajax({
        type: "POST",
        url: global_config.commentUrl,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(params),
        dataType: "json",
        success: function (resp) {
          console.log(resp);
          success(resp);
        },
        error: function (resp) {
            console.log(resp);
            fail(resp);
        }
    });
}


function submit_comments_btn_click(){
    var name = $("#names").val();
    var content = $("#comments").val();
    var data =  {
        "post_id": parseInt(global_config.postId),
        "author": global_config.author,
        "name": name,
        "content": content
    };
    ajax_post(data,function(){
        init_comments(-1);
    },function(){});
}


function init_comments(pid){
    $.get(global_config.commentUrl, { "author": global_config.author, "postId": global_config.postId,"pid": pid},function(data){
        console.log("Data Loaded: " , data);
        var comments_list = $("#comments-list");
        comments_list.html('');
        if(data.size){
            var tpl = document.getElementById('tpl').innerHTML;
            var htmlResult = juicer(tpl, data);
            //console.log(htmlResult);
            comments_list.html(htmlResult);
            rebind_frm_event();
            rebing_reply_comment();
        }
    });
}

function rebing_reply_comment(){
    $(".reply-comment").click(function(){
        var that = $(this);
        var reply = that.parent().children(".reply");
        console.log(that);
        if(reply.hasClass("visable")){
            reply.removeClass("visable")
            that.children("a").html("收起回复");
        }else{
            reply.addClass("visable")
            that.children("a").html("回复评论");
        }
    });
}

function rebind_frm_event(){
    $(".lookup").click(function(){
        console.log($(this));
        var that = $(this);
        if(that.children("a").hasClass("expand")){
            that.parent().children("p").addClass("content");
            that.children("a").removeClass("expand");
            that.children("a").html("查看");
        }else{
            that.parent().children("p").removeClass("content");
            that.children("a").addClass("expand");
            that.children("a").html("收起");
        }
        
    });
}

function reply_user_topic(owner,pid){
    var data = {
        "pid":pid,
        "author": global_config.author,
        "post_id": global_config.postId
    };
    $(owner).parent().children("[name]").each(function(index,ele){
        data[$(ele).attr("name")] = $(ele).val();
    });
    console.log(data);
    ajax_post(data,function(){
        init_comments(-1);
    },function(){});
}

function index_sum(i){
    return parseInt(i) + 1;
}