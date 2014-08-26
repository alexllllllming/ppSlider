/**
 * pptSlide.js by AlexTseng 
 * 2014-07-28
 */
(function($){
    'use strict';

    $.fn.pptSlider = function(options){
        // Default settings
        var settings= $.extend({
            imgType: '.jpg',         // default image type
            hrefPrefix: 'slide-',    // prefix for img src
            autoPlay: true,          // autoPlay: true or false
            beginIndex: 0,           // first index of your slides
            playSpeed: 5000,         // the time between two slides, in milliseconds
            animationSpeed: 1000,     // the time for animations, in milliseconds 
            hoverPause: false,       // slide pause when hover
            controlBar: true,        // show controlbar
            classPrefix: 'pSlider-'
        },options)

        return this.each(function(){

            // Local Variables
            var $this = $(this),

                // slider components 
                $slideBox,
                $navList = $this.children('ul'),
                $linkList = $('a',$this),
                $controlBar,

                prevIdx = settings.beginIndex,      // first slide
                slidesLength = 0,
                outerHeight,                        // the height of a slide
                outerWidth,                         // the width of a slide

                // animation effects
                effects = ['flyUp', 'flyRight', 'flyDown', 'flyLeft',
                        'fadeIn'
                  ],


                // handler
                autoPlayHandler,

                animateTo = function($prev, $next){

                    var effect = effects[~~(Math.random() * effects.length)],
                        speed = settings.animationSpeed
                    switch(effect){
                        case 'flyUp':
                            $next
                                .css({'left':0, 'top': outerHeight})
                                .appendTo($slideBox)
                                .animate({'top': 0}, speed)
                            $prev
                                .animate({'top': '-'+ outerHeight +'px'}, speed)
                            break
                        case 'flyLeft':
                            $next
                                .css({'left':outerWidth, 'top':0})
                                .appendTo($slideBox)
                                .animate({'left': 0}, speed)
                            $prev
                                .animate({'left':'-'+outerWidth+'px'}, speed)
                            break
                        case 'flyDown':
                            $next
                                .css({'left':0, 'top':'-'+outerHeight+'px'})
                                .appendTo($slideBox)
                                .animate({'top': 0}, speed)
                            $prev
                                .animate({'top':outerHeight}, speed)
                            break
                        case 'flyRight':
                            $next
                                .css({'left':'-'+outerWidth+'px','top':0})
                                .appendTo($slideBox)
                                .animate({'left': 0}, speed)
                            $prev
                                .animate({'left':outerWidth}, speed)
                            break
                        case 'fadeIn':
                            $next
                                .css({'left': 0, 'top': 0, 'display': 'none'})
                                .appendTo($slideBox)
                                .fadeIn(speed)
                            break
                    }

                    // remove pre img
                    setTimeout(function(){
                        $prev.remove()
                    },speed)

                },
                // navList click envent handler
                navClick = function(event){
                    var $target = $(event.target),
                        curIdx = $target.data('i')
                    
                    slideToggle(curIdx)
                },

                createSlide = function(curIdx){
                    // create new slide
                    var slide = document.createElement("img")
                    // slide setting
                    slide.src = settings.hrefPrefix + 
                              (curIdx) + 
                              settings.imgType 

                    return slide
                },   
                // slide change acoording to index num when click happen
                slideToggle = function(curIdx){

                    // same idx, no changes
                    if(curIdx == prevIdx)
                        return

                    $linkList
                        .eq(curIdx)
                        .addClass('active')

                    $linkList
                        .eq(prevIdx)
                        .removeClass('active')

                    // animation between to slide
                    animateTo($('img',$slideBox).eq(0), $(createSlide(curIdx)))                

                    // change the previous index to current index
                    prevIdx = curIdx
                    
                     
                },
                // 
                autoPlay = function () {
                    autoPlayHandler = setInterval(function(){
                        var beginIndex = settings.beginIndex,
                            curIdx = prevIdx < beginIndex + slidesLength - 1    
                                    ? prevIdx + 1 : beginIndex  

                        // slide exchange
                        slideToggle(curIdx)

                         // activate progress bar
                        $("."+settings.classPrefix+"progress")
                            .animate({width: '100%'},settings.playSpeed,function(){
                                $(this).css({width: '0px'})
                        })
                    },settings.playSpeed)
                   
                },

                // immediate function 
                init = (function(){
                    // start with the first slide
                    var i = prevIdx,
                        $firstSlide = $(createSlide(prevIdx))
                                            .appendTo($slideBox);

                    outerHeight = $this.height()
                    outerWidth = $this.width()             

                    $slideBox = $("<div class='"+settings.classPrefix+"box'></div>")
                            .prependTo($this)

                    // add event handler
                    $(document).on('click','.pSlider-nav a',navClick)
                    
                    //create order for navList and get slidesLengtho
                    $linkList.each(function(){
                        $(this).data('i',i++)
                        slidesLength++
                    })    

                    // display the first slide
                    $slideBox.append(createSlide(prevIdx))

                    // if controlBar enabled, default: true
                    if (settings.controlBar){
                        $controlBar = $("<div class='"+settings.classPrefix+"progress'></div>"+
                                    "<div class='"+settings.classPrefix+"control'>"+          
                                    "<div class='"+settings.classPrefix+"left-control'>"+
                                    "<img src='img/play.png'></div>"+
                                    "<img src='img/full-screen.png'>"+
                                    "<div class='"+settings.classPrefix+"right-control'>"+
                                    "<span>收起列表</span><img src='img/right-arrow.png'></div>"+
                                    "</div>"
                                    )
                                .appendTo($this)
                    }
                    // if autoPlay enable, default: true
                    if (settings.autoPlay){
                        autoPlay()
                    }
                    


                })();

                
        })
    }
  
})(jQuery);