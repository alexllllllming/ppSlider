/**
 * pptSlide.js by AlexTseng 
 * 2014-07-28
 */
(function($){
    'use strict';

    $.fn.ppSlider = function(options){
        // Default settings
        var settings= $.extend({
            imgType: '.jpg',         // default image type
            hrefPrefix: 'slide-',    // prefix for img src
            autoPlay: true,          // autoPlay: true or false
            beginIndex: 0,           // first index of your slides
            playSpeed: 5000,         // the time between two slides, in milliseconds
            animationSpeed: 1000,    // the time for animations, in milliseconds 
            hoverPause: false,       // slide pause when hover
            controlBar: true,        // show controlbar
            navFold: false,           // default not fold the navList
            classPrefix: 'pSlider-'
        },options)

        return this.each(function(){

            // Local Variables
            var $this = $(this),

                // slider components 
                $slideBox,
                $navList = $this.children('div'),
                $linkList = $('a',$this),
                $controlBar,

                prevIdx = settings.beginIndex,      // first slide
                slidesLength = 0,
                outerHeight,                        // the height of a slide
                outerWidth,                         // the width of a slide
                classPrefix = settings.classPrefix, // css class prefix
                isAutoPlay = settings.autoPlay,     // boolean flag for autoPlay
                navFold = settings.navFold,      // boolean flag for navList folding
                // animation effects
                effects = ['flyUp', 'flyRight', 'flyDown', 'flyLeft',
                        'fadeIn'
                  ],
                
                autoPlayHandler,                     // handler for auto play

                fullscreenMap = [
                        // no prefixes
                        [
                            'fullscreenEnabled',
                            'requestFullscreen',
                            'fullscreenElement',
                            'exitFullscreen',
                            'fullscreenchange',
                            'fullscreenerror'
                        ],
                        // webkit
                        [
                            'webkitFullscreenEnabled',
                            'webkitRequestFullscreen',
                            'webkitFullscreenElement',
                            'webkitExitFullscreen',
                            'webkitfullscreenchange',
                            'webkitfullscreenerror'
                        ],
                        // moz, capital Screen
                        [
                            'mozFullScreenEnabled',
                            'mozRequestFullScreen',
                            'mozFullScreenElement',
                            'mozCancelFullScreen',
                            'mozfullscreenchange',
                            'mozfullscreenerror'
                        ],
                        // ie
                        [
                            'msFullscreenEnabled',
                            'msRequestFullscreen',
                            'msFullscreenElement',
                            'msExitFullscreen',
                            'MSFullscreenChange',
                            'MSFullscreenError'
                        ]

                    ],
                
                fullscreen = {'support': false},                     // object for fullscreen attribute and function

                fullscreenDetect = (function(){                      // detect valid fullscreen attribute and function
                    var i,
                        length,
                        keys = fullscreenMap[0],
                        values

                    for (i = 0, length = fullscreenMap.length; i < length; i+=1){

                        // valid functions
                        var values = fullscreenMap[i]

                        if(document[values[0]]){
                            
                            fullscreen.support = true

                            for (i = 0, length = keys.length; i < length; i+=1){
                                fullscreen[keys[i]] = values[i]
                            }
                            break;
                        }           
                    }
                })(),

                fullscreenToggle = function(element){               // toggle switch depend on the fullscreenElement
                    if (document[fullscreen.fullscreenElement]){
                        document[fullscreen.exitFullscreen]()
                    }
                    else{
                        element[fullscreen.requestFullscreen]()
                    }
                },

                animateTo = function($prev, $next){                 // create animation betwwen prev and next

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
                    
                    var beginIndex = settings.beginIndex
                    // same idx, no changes
                    if(curIdx == prevIdx)
                        return

                    $linkList
                        .eq(curIdx - beginIndex)
                        .addClass('active')

                    $linkList
                        .eq(prevIdx - beginIndex)
                        .removeClass('active')

                    // animation between to slide
                    animateTo($('img',$slideBox).eq(0), $(createSlide(curIdx)))                

                    // change the previous index to current index
                    prevIdx = curIdx
                    
                     
                },
                // 
                autoPlay = function (target) {

                    // switch button
                    if (target){
                        target.src = "img/pause.png"
                    }
                    // set timer
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
                   
                    return true;
                },

                stopPlay = function(target){
                    clearInterval(autoPlayHandler)
                    // switch button
                    target.src = "img/play.png"

                    return false;
                },

                playSwitch = function(event){
                    var target = event.target

                    isAutoPlay = isAutoPlay ? stopPlay(target) : autoPlay(target);
                },

                foldNav = function(event){
                    var target = event.target
                                           
                    navFold = !navFold

                    if (navFold){
                        target.innerText = "展开列表"
                        target
                            .nextSibling
                            .src = "img/left-arrow.png"
                        
                        $navList
                            .hide()
                        $slideBox.animate({width:"100%"})
                    }
                    else{
                        target.innerText = "收起列表"
                        target
                            .nextSibling
                            .src = "img/right-arrow.png"
                        
                        $slideBox.animate({width:"80%"},function(){
                            $navList
                                .show()
                                .css({'display':'inline-block'})
                        })
                    }




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

                    
                    //create order for navList and get slidesLengtho
                    $linkList.each(function(){
                        $(this).data('i',i++)
                        slidesLength++
                    })    

                    // display the first slide
                    $slideBox.append(createSlide(prevIdx))

                    // if controlBar enabled, default: true
                    if (settings.controlBar){
                        var playButton = isAutoPlay ? "img/pause.png" : "img/play.png"
                            
                        $controlBar = $("<div class='"+classPrefix+"progress'></div>"+
                                    "<div class='"+classPrefix+"control'>"+          
                                    "<div class='"+classPrefix+"left-control'>"+
                                    "<img src='"+playButton+"'></div>"+
                                    // if fullscreen is supported 
                                    (fullscreen.support ? "<img src='img/full-screen.png'>" : "")+  
                                    "<div class='"+classPrefix+"right-control'>"+
                                    "<span>收起列表</span><img src='img/right-arrow.png'></div>"+
                                    "</div>"
                                    )
                                .appendTo($this)

                        // controlBar click event
                        navFold ? $('span',$controlBar)
                                     .on('click',foldNav)
                                     .trigger('click')
                                : $('span',$controlBar)
                                     .on('click',foldNav)

                        $('.'+classPrefix+"left-control").on('click', playSwitch)
                            
                    }
                    
                    // add event handler if fullscreen api support
                    if (fullscreen.support){

                        // fullscreen change event
                        document.addEventListener(fullscreen.fullscreenchange,function(){
                        })

                        // fullscreen error event
                        document.addEventListener(fullscreen.fullscreenerror,function(){
                        })
                        
                        // click event on fullscreen button
                        $('.'+classPrefix+'control>img')
                            .on('click',function(){
                                fullscreenToggle($this[0])
                            })
                    
                    }

                    // add event handler
                    $('.pSlider-nav a',$this).on('click',navClick)

                    // if autoPlay enable, default: true
                    if (settings.autoPlay){
                        autoPlay()
                    }
                    


                })();

                
        })
    }
  
})(jQuery);
