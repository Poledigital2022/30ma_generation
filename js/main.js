(function ($) {

    var browserVersion = navigator.userAgent.split(';')[1].trim().split(' ');
    browserVersion[0] == 'MSIE' ? $('html').addClass( 'browser-ie browser-ie--' + parseInt(browserVersion[1]) ) : null ;
    navigator.userAgent.indexOf('rv:11') + 1 ? $('html').addClass( 'browser-ie browser-ie--11' ) : navigator.userAgent.indexOf('Edge') + 1 ? $('html').addClass( 'browser-ie browser-ie--edge' ) : null ;

    function SiteCookie(){
        if(Cookies.get('agree') ){
            $('.cookie-block').remove();
        }else{
            $('.cookie-block .cookie-link').on('click', function(){
                Cookies.set('agree','1');
                $('.cookie-block').addClass('is-hidden');
                setTimeout(function(){
                    $('.cookie-block').remove();
                },1000);
                return false;
            });
        }
    }

    function formPosition(scrollTop, formTop,formHeight){
        if( $(window).width() > 1023 ){
            if( scrollTop >= formTop ){
                $('.form-block').addClass('fixed');
                if( scrollTop + formHeight >= $('.section--content').outerHeight() + $('.section--content').offset().top ){
                    $('.form-block').addClass('fixed--bottom');
                }else{
                    $('.form-block').removeClass('fixed--bottom');
                }
            }else{
                $('.form-block').removeClass('fixed');
            }
        }
    }

    //carousel custom
    function carousel(block,slides){
        var block = $(block),
            items = block.find('>*').length,
            slides = slides;
        block.find('>*').addClass('slide');
        block.attr('data-slides', slides);
        block.find('.slide').each(function(){
            var slide = $(this);
            slide.index() === parseInt(slides/2) && slide.addClass('slide-center');
            slide.index() < parseInt(slides/2) ? slide.addClass('to-left') : slide.index() > parseInt(slides/2) && slide.addClass('to-right');
        });
        for( var i = 0; i < parseInt(slides/2); i++){
            block.find('.slide').eq(i).attr('data-index', parseInt(slides/2) - i);
            block.find('.slide').eq(slides - 1 - i).attr('data-index', parseInt(slides/2) - i);
        }
        block.wrapInner('<div class="slider-wrapper"></div>');
        block.append('<div class="slider-nav"><button class="slider-btn slide-prev"><span class="icon icon-arrow-back"></span></button><button class="slider-btn slide-next"><span class="icon icon-arrow-next"></span></button></div>');

        function changeSlide(index){
            block.find('.slide').removeClass('slide-center to-left to-right');
            block.find('.slide').attr('data-index','');
            block.find('.slide:eq('+index+')').addClass('slide-center');
            for( var i = 1; i < parseInt(slides/2) + 1; i++){
                var a,b;
                i + index >= items ? a = (i + index ) - items : a = i + index;
                 index - i < 0 ? b = items + (index - i) : b = index - i;
                block.find('.slide').eq(a).attr('data-index', i).addClass('to-right');
                block.find('.slide').eq(b).attr('data-index', i).addClass('to-left');
            }
            $('.info-visible').removeClass('info-visible');
            $('.js-to-valide-block').removeClass('is-visible');
            $('.js-valide-link').removeClass('is-visited');
        }

        $('.slide-next').on('click', function(){
            var nextSlide;
            block.find('.slide-center').index() + 1 == items ? nextSlide = 0 : nextSlide = block.find('.slide-center').index() + 1;
            changeSlide(nextSlide);
        });
        $('.slide-prev').on('click', function(){
            var prevSlide;
            block.find('.slide-center').index() - 1 === 0 ? prevSlide = items - 1 : prevSlide = block.find('.slide-center').index() - 1;
            changeSlide(prevSlide);
        });

        $('.slide').on('click', function(){
            if( !$(this).hasClass('slide-center') ){
                var slideIndex = $(this).index();
                changeSlide(slideIndex);
            }
        });

    }

    function carouselRemove(block){
        $(block).find('.slide').unwrap();
        $(block).find('.slide').removeClass('slide to-right to-left slide-center').removeAttr('data-index');
        $(block).removeAttr('data-slides');
        $(block).find('.slider-nav').remove();
        $('.info-block .is-visible, .info-visible').removeClass('is-visible info-visible');
    }


    function quizInfoHover(){
        if( $(window).width() > 1279 ){
            $('.js-info-btn').hover(function(){
                var toID = $(this).attr('data-info');
                $('#'+toID).addClass('is-visible');
            },function(){
                $('.info-block .is-visible').removeClass('is-visible');
            });
        }else{
            $('.js-info-btn').on('click',function(){
                if( $(this).hasClass('is-hover') ){
                    $('.info-block .is-visible').removeClass('is-visible');
                    $(this).removeClass('is-hover');
                }else{
                    $('.js-info-btn').removeClass('is-hover');
                    $(this).addClass('is-hover');
                    var toID = $(this).attr('data-info');
                    $('#'+toID).addClass('is-visible');
                }
            });
        }
    }


    $(document).ready(function () {

        var url = document.location.origin;

        SiteCookie();
        //custom donate value
        if( $('.front-page').length ){
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.has('one') && Cookies.set('paramOne', searchParams.get('one'));
            searchParams.has('two') && Cookies.set('paramTwo', searchParams.get('two'));
            searchParams.has('three') && Cookies.set('paramThree', searchParams.get('three'));
        }

       Cookies.get('paramOne') && $('#to-one').attr('data-value',Cookies.get('paramOne'));
       Cookies.get('paramTwo') && $('#to-two').attr('data-value',Cookies.get('paramTwo'));
       Cookies.get('paramThree') && $('#to-three').attr('data-value',Cookies.get('paramThree'));

        if( $('#donation-list').length ){
            var oneValue = Cookies.get('paramOne') || $('#to-one').attr('data-value');
            $('#donation-list li').each(function(){
                var then = $(this),
                    link = oneValue < 50 ? then.find('a').attr('data-href-default') : then.find('a').attr('data-href');
                if( then.find('a').attr('data-value')){
                    var value = then.find('a').attr('data-value');
                    oneValue < 50 ? then.find('a').attr('href',link + '?amount=' + value ) : then.find('a').attr('href',link + oneValue + '/?amount=' + value);
                    then.find('.num span').text(value);
                    then.find('.tax').text((value * 0.34).toFixed(2));
                }else{
                    oneValue < 50 ? then.find('a').attr('href',link) : then.find('a').attr('href',link + oneValue);
                }
            });
        }



        ////

        $('.js-header-don,.js-front-don,.js-quiz-don').on('click', function(e){
            if( $('.section--donation').length ){
                if( $(window).width > 767 ){
                    if( !$('.section--donation').hasClass('mobile-visible')){
                        e.preventDefault();
                        $('html, body').animate({scrollTop: $('.section--donation').offset().top},500);
                    }
                }else{
                    e.preventDefault();
                    $('html, body').animate({scrollTop: $('.section--donation').offset().top},500);
                }
            }
        });

        $('header .center-block .icon').on('click', function(e){
            e.preventDefault();
            $('html, body').animate({scrollTop: $('.section--exprimez').offset().top},500);
        });

        $('.section-choice .don-link').on('click', function(e){
            e.preventDefault();
            $('html, body').animate({scrollTop: $('.section--donation').offset().top},500);
        });

        if( $(window).width() > 767 ){
            if( $(window).width() > 1359 ){
                carousel('.slider',9);
            }else if( $(window).width() > 1023 ){
                carousel('.slider',7);
            }else{
                carousel('.slider',3);
            }
        }

        if( $('.quiz-page').length ){
            var theme = window.location.href.split('theme=')[1];
            theme && $('#theme').val(theme);
        }

        $('.choice-block .js-info-link').on('click', function(){
            $(this).closest('.choice-block').addClass('info-visible');
        });

        $('.quiz-block input').on('change', function(){
            !$('.next-step--block').hasClass('is-visible') && $('.next-step--block').addClass('is-visible');
            $(this).closest('.quiz-block').addClass('mobile-next');
        });

        if( $('.quiz-block').length ){
            var steps = parseInt($('.quiz-block').length) + 1;
            $('.next-btn .steps').text(steps);
            $('.quiz-block').each(function(){
                $(this).find('.count').text($(this).index()+2 +'/'+ steps)
            });
        }

        $('.next-btn').on('click', function(e){
            var active = $('.quiz-block.active');
            active.addClass('to-next');
            $('.next-step--block').removeClass('is-visible');
            setTimeout(function(){
                active.removeClass('active').next().addClass('active');
                var step = parseInt($('.quiz-block.active').attr('data-target'));
                step ==  $('.quiz-block').length ? $('.next-step--block').addClass('is-finish') : $('.next-btn .step-now').text(step+1);
            },500);
            e.preventDefault();
        });

        quizInfoHover();

        $('.js-valide-link').on('click', function(e){
            if( $(window).width() > 767 ){
                var to = $(this).attr('data-target');
                $('.js-valide-link').addClass('is-visited');
                $('.js-to-valide-block').addClass('is-visible').find('a').attr('href', to);
            }else{
                if( $(this).hasClass('js-valide-link-01') ){
                    $(this).closest('.choice-block').addClass('mc-visible');
                }
                if( $(this).hasClass('js-valide-link-02') ){
                    $(this).closest('.choice-block').addClass('mc-visible-02');
                }
            }
        });

        $('.mobile-choice-block .js-close-btn,.mobile-choice-block-02 .js-close-btn').on('click', function(e){
            $(this).closest('.choice-block').removeClass('mc-visible mc-visible-02');
            //window.location.href = url; // for prod
            //window.location.href = url + '/2019/quiz-30ma/'; // for test dev2
            //window.location.href = url + '/quiz-30ma/'; // for test loc
            e.preventDefault();
        });
        $('.js-info-close').on('click', function(e){
            $(this).closest('.choice-block').removeClass('info-visible');
            e.preventDefault();
        });


        $('.js-info-mobile-btn').on('click', function(e){
            $(this).closest('.quiz-block').addClass('is-info');
            e.preventDefault();
        });

        $('.info-block .info-close').on('click', function(e){
            $(this).closest('.quiz-block').removeClass('is-info');
        });

        if( $('.quiz-block').length ){
            if( $(window).width() < 768 ){
                $('.info-block ul').mCustomScrollbar();
            }else{
                $('.info-block ul').mCustomScrollbar("disable",true);
            }
        }

        $('.js-mobile-next-block').on('click', function(){
            var to = $(this).closest('.quiz-block').next().offset().top;
            $('html, body').animate({scrollTop: to},500);
        });


        $('#form-quiz .action-btn').on('click', function(){
            $('#form-quiz .quiz-block').each(function(){
                if(!$(this).find('input:checked').length){
                    $(this).addClass('error');
                    $('.js-error-message').addClass('is-visible');
                }
            });
        });
        $('#form-quiz input').on('change', function(){
            $(this).closest('.quiz-block').removeClass('error');
            !$('#form-quiz .quiz-block.error').length && $('.js-error-message').removeClass('is-visible');
        });
        $('#form-quiz').on('submit', function(e) {
            e.preventDefault();
            var $form = $(this);
            $.ajax({
                type: 'POST',
                cache: false,
                url: 'actions/submit.php',
                dataType: 'json',
                data: $form.serialize()
            }).complete(function(response) {
                if (response.success) {
                    window.location.href = document.location.origin + '/merci.html'; // for prod
                    //window.location.href = document.location.origin + '/2019/quiz-30ma/merci.html'; // for test dev2
                    //window.location.href = document.location.origin + '/quiz-30ma/merci.html'; // for test loc
                }else{
                }
            });

        });

        $('.merci-page').length && $('html, body').animate({scrollTop: $('.section--donation').offset().top}, 500);
        $('.quiz-page').length && $('html, body').animate({scrollTop: $('.section--quiz').offset().top}, 500);


    });

    $(window).resize(function(){
        if( $(window).width() < 768 && $('.slider .slide').length){
            carouselRemove('.slider');
        }

        if( $(window).width() > 767 ){
            if( $(window).width() > 1359 && $('.slider').attr('data-slides') != 9 ){
                carouselRemove('.slider');
                carousel('.slider',9);
            }else if( $(window).width() >= 1024 && $(window).width() < 1360 && $('.slider').attr('data-slides') != 7 ){
                carouselRemove('.slider');
                carousel('.slider',7);
            }else if( $(window).width() < 1024 && $('.slider').attr('data-slides') != 3 ) {
                carouselRemove('.slider');
                carousel('.slider', 3);
            }
        }
    });

    $(document).on('scroll', function(){
       var headPos = $('header').offset().top,
           scroollTop = $(document).scrollTop();
        scroollTop >= headPos - 1 ? !$('header').hasClass('fixed') && $('header').addClass('fixed') : $('header').hasClass('fixed') && $('header').removeClass('fixed');
    });


})(jQuery);