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
            animationSpeed: 800,     // the time for animations, in milliseconds 
            hoverPause: false,       // slide pause when hover
            controlBar: true,        // show controlbar
        },options)

        return this.each(function(){

            // Local Variables
            var $this = $(this),

                // slider components 
                $slideBox = $("<div class='slideBox'></div>").prependTo($this),
                $navList = $this.children('ul'),
                $navList,
                $controlBar,

                prevIdx = -1,
                slidesLength = settings.beginIndex,
                outerHeight = $slideBox.height(),
                outerWidth = $slideBox.width(),

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

                slideToggle = function(event){
                    console.log("i am here")

                    var curIdx = $(event.target).data('i')

                    // same idx, no changes
                    if(curIdx == prevIdx)
                        return

                    // new slide
                    var slide = document.createElement("img")


                    // init
                    if (prevIdx + 1){
                        slide.src = settings.hrefPrefix + 
                                        (++prevIdx) + 
                                        settings.imgType 

                        $slideBox.append(slide)
                    }
                    else{
                        slide.src = settings.hrefPrefix + 
                                        (curIdx) + 
                                        settings.imgType 

                        slide.style.display = "none"
                        $slideBox.append(slide)
                        
                        animateTo($slideBox.eq(0), $(slide))                
                        prevIdx = curIdx
                    }
                    
                     
                };

                $(document).on('click','#slideNav a',slideToggle)

                //create order for navList
                $('a',$this).each(function(){
                    $(this).data('i',slidesLength++)
                })
        })
    }
  
})(jQuery);
