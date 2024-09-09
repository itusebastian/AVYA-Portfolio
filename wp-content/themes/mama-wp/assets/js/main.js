
jQuery(document).ready(function($){
	//change this value if you want to change the speed of the scale effect
	var	scaleSpeed = 0.3,
	//change this value if you want to set a different initial opacity for the .cd-half-block
		boxShadowOpacityInitialValue = 0.7,
		animating = false; 
	
	//check the media query 
	var MQ = window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	$(window).on('resize', function(){
		MQ = window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	});

	//bind the animation to the window scroll event
	triggerAnimation();
	$(window).on('scroll', function(){
		triggerAnimation();
	});

	//move to next/previous section
    $('.cd-vertical-nav .cd-prev').on('click', function(){
    	prevSection();
    });
    $('.cd-vertical-nav .cd-next').on('click', function(){
    	nextSection();
    });
    $(document).keydown(function(event){
		if( event.which=='38' ) {
			prevSection();
			event.preventDefault();
		} else if( event.which=='40' ) {
			nextSection();
			event.preventDefault();
		}
	});

	function triggerAnimation(){
		if(MQ == 'desktop') {
			//if on desktop screen - animate sections
			(!window.requestAnimationFrame) ? animateSection() : window.requestAnimationFrame(animateSection);
		} else {
			//on mobile - remove the style added by jQuery 
			$('.cd-section').find('.cd-block').removeAttr('style').find('.cd-half-block').removeAttr('style');
		}
		//update navigation arrows visibility
		checkNavigation();
	}
	
	function animateSection () {
		var scrollTop = $(window).scrollTop(),
			windowHeight = $(window).height(),
			windowWidth = $(window).width();
		
		$('.cd-section').each(function(){
			var actualBlock = $(this),
				offset = scrollTop - actualBlock.offset().top,
				scale = 1,
				translate = windowWidth/2+'px',
				opacity,
				boxShadowOpacity;

			if( offset >= -windowHeight && offset <= 0 ) {
				//move the two .cd-half-block toward the center - no scale/opacity effect
				scale = 1,
				opacity = 1,
				translate = (windowWidth * 0.5 * (- offset/windowHeight)).toFixed(0)+'px';

			} else if( offset > 0 && offset <= windowHeight ) {
				//the two .cd-half-block are in the center - scale the .cd-block element and reduce the opacity
				translate = 0+'px',
				scale = (1 - ( offset * scaleSpeed/windowHeight)).toFixed(5),
				opacity = ( 1 - ( offset/windowHeight) ).toFixed(5);

			} else if( offset < -windowHeight ) {
				//section not yet visible
				scale = 1,
				translate = windowWidth/2+'px',
				opacity = 1;

			} else {
				//section not visible anymore
				opacity = 0;
			}
			
			boxShadowOpacity = parseInt(translate.replace('px', ''))*boxShadowOpacityInitialValue/20;
			
			//translate/scale section blocks
			scaleBlock(actualBlock.find('.cd-block'), scale, opacity);

			var directionFirstChild = ( actualBlock.is(':nth-of-type(even)') ) ? '-': '+';
			var directionSecondChild = ( actualBlock.is(':nth-of-type(even)') ) ? '+': '-';
			if(actualBlock.find('.cd-half-block')) {
				translateBlock(actualBlock.find('.cd-half-block').eq(0), directionFirstChild+translate, boxShadowOpacity);
				translateBlock(actualBlock.find('.cd-half-block').eq(1), directionSecondChild+translate, boxShadowOpacity);	
			}
			//this is used to navigate through the sections
			( offset >= 0 && offset < windowHeight ) ? actualBlock.addClass('is-visible') : actualBlock.removeClass('is-visible');		
		});
	}

	function translateBlock(elem, value, shadow) {
		var position = Math.ceil(Math.abs(value.replace('px', '')));
		
		if( position >= $(window).width()/2 ) {
			shadow = 0;	
		} else if ( position > 20 ) {
			shadow = boxShadowOpacityInitialValue;
		}

		elem.css({
		    '-moz-transform': 'translateX(' + value + ')',
		    '-webkit-transform': 'translateX(' + value + ')',
			'-ms-transform': 'translateX(' + value + ')',
			'-o-transform': 'translateX(' + value + ')',
			'transform': 'translateX(' + value + ')',
			'box-shadow' : '0px 0px 40px rgba(0,0,0,'+shadow+')'
		});
	}

	function scaleBlock(elem, value, opac) {
		elem.css({
		    '-moz-transform': 'scale(' + value + ')',
		    '-webkit-transform': 'scale(' + value + ')',
			'-ms-transform': 'scale(' + value + ')',
			'-o-transform': 'scale(' + value + ')',
			'transform': 'scale(' + value + ')',
			'opacity': opac
		});
	}

	function nextSection() {
		if (!animating) {
			if ($('.cd-section.is-visible').next().length > 0) smoothScroll($('.cd-section.is-visible').next());
		}
	}

	function prevSection() {
		if (!animating) {
			var prevSection = $('.cd-section.is-visible');
			if(prevSection.length > 0 && $(window).scrollTop() != prevSection.offset().top) {
				smoothScroll(prevSection);
			} else if(prevSection.prev().length > 0 && $(window).scrollTop() == prevSection.offset().top) {
				smoothScroll(prevSection.prev('.cd-section'));
			}
		}
	}

function checkNavigation() {
	//( $(window).scrollTop() < $(window).height()/2 ) ? $('.cd-vertical-nav .cd-prev').addClass('inactive') : $('.cd-vertical-nav .cd-prev').removeClass('inactive');
	//( $(window).scrollTop() > $(document).height() - 3*$(window).height()/2 ) ? $('.cd-vertical-nav .cd-next').addClass('inactive') : $('.cd-vertical-nav .cd-next').removeClass('inactive');
	( $(window).scrollTop() < $(window).height()/2 ) ? $('.cd-vertical-nav .cd-prev').addClass('inactive') : $('.cd-vertical-nav .cd-prev').removeClass('inactive');
	( $(window).scrollTop() < $(window).height()/2 ) ? $('.cd-vertical-nav .cd-next').addClass('inactive1') : $('.cd-vertical-nav .cd-next').removeClass('inactive1');
	( $(window).scrollTop() > $(document).height() - 3*$(window).height()/2 ) ? $('.cd-vertical-nav .cd-next').addClass('inactive') : $('.cd-vertical-nav .cd-next').removeClass('inactive');
}

	function smoothScroll(target) {
		animating = true;
        $('body,html').animate({'scrollTop': target.offset().top}, 500, function(){ animating = false; });
	}


	//Check IE11
    function IEVersion() {
      if (!!navigator.userAgent.match(/Trident\/7\./)) {
        return 11;
      }
    }

    if (IEVersion() != 11) 
    {
      $('html').niceScroll({
        cursorcolor: "#1A212C",
        zindex: '99999',
        cursorminheight: 60,
        scrollspeed: 80,
        cursorwidth: 7,
        autohidemode: true,
        background: "#aaa",
        cursorborder: 'none',
        cursoropacitymax: .7,
        cursorborderradius: 0,
        horizrailenabled: false
      });
    }

/*----------- Animated Headlines --------------*/

	//set animation timing
	var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect 
		revealDuration = 600,
		revealAnimationDelay = 1500;
		
		initHeadline();
		

		function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function(){
			var word = $(this),
			letters = word.text().split(''),
			selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
			var newLetters = letters.join('');
			word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function(){
			var headline = $(this);
			
			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
				newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
				width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
					if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);
		
		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');	
			setTimeout(function(){ 
				parentSpan.removeClass('selected'); 
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);
			
		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.cd-headline').hasClass('loading-bar')){
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){ 
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay); 
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');
		
		if(!$letter.is(':last-child')) {
			setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);  
		} else if($bool) { 
			setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		} 
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');
		
		if(!$letter.is(':last-child')) { 
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration); 
		} else { 
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
}

function takeNext($word) {
	return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
}

function takePrev($word) {
	return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
}

function switchWord($oldWord, $newWord) {
	$oldWord.removeClass('is-visible').addClass('is-hidden');
	$newWord.removeClass('is-hidden').addClass('is-visible');
}





/*-------------------------- Portfolio Item Filter -----------------------*/

var $portfolio = $('#portfolio-item'),
colWidth = function () {
  var w = $portfolio.width(), 
  columnNum = 1,
  columnWidth = 0;
  if (w > 960) {
    columnNum  = 4;
  } 
  else if (w > 768) {
    columnNum  = 3;
  }   
  else if (w > 640) {
    columnNum  = 2;
  } 
  else if (w > 480) {
    columnNum  = 1;
  }  
  else if (w > 360) {
    columnNum  = 1;
  } 
  columnWidth = Math.floor(w/columnNum);
  $portfolio.find('.item').each(function() {
    var $item = $(this),
    multiplier_w = $item.attr('class').match(/item-w(\d)/),
    multiplier_h = $item.attr('class').match(/item-h(\d)/),
    width = multiplier_w ? columnWidth*multiplier_w[1] : columnWidth,
    height = multiplier_h ? columnWidth*multiplier_h[1]*0.7-10 : columnWidth*0.686-10;
    $item.css({
      width: width,
      height: height
    });
  });
  return columnWidth;
},
isotope = function () {
  $portfolio.isotope({
    resizable: true,
    itemSelector: '.item',
    masonry: {
      columnWidth: colWidth(),
      gutterWidth: 10
    }
  });
};
isotope();
$(window).smartresize(isotope);

$('.portfolioFilter a').click(function(){
  $('.portfolioFilter .current').removeClass('current');
  $(this).addClass('current');

  var selector = $(this).attr('data-filter');
  $portfolio.isotope({
    filter: selector,
    animationOptions: {
      duration: 750,
      easing: 'linear',
      queue: false
    }
  });
  return false;
}); 


});





(function() {
	var triggerBttn = document.getElementById( 'trigger-overlay' ),
		overlay = document.querySelector( 'div.overlay' ),
		closeBttn = overlay.querySelector( 'button.overlay-close' );
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = { transitions : Modernizr.csstransitions };
		s = Snap( overlay.querySelector( 'svg' ) ), 
		path = s.select( 'path' ),
		steps = overlay.getAttribute( 'data-steps' ).split(';'),
		stepsTotal = steps.length;

	function toggleOverlay() {
		if( classie.has( overlay, 'open' ) ) {
			var pos = stepsTotal-1;
			classie.remove( overlay, 'open' );
			classie.add( overlay, 'close' );
			
			var onEndTransitionFn = function( ev ) {
					classie.remove( overlay, 'close' );
				},
				nextStep = function( pos ) {
					pos--;
					if( pos < 0 ) return;
					path.animate( { 'path' : steps[pos] }, 60, mina.linear, function() { 
						if( pos === 0 ) {
							onEndTransitionFn();
						}
						nextStep(pos);
					} );
				};

			nextStep(pos);
		}
		else if( !classie.has( overlay, 'close' ) ) {
			var pos = 0;
			classie.add( overlay, 'open' );
			
			var nextStep = function( pos ) {
				pos++;
				if( pos > stepsTotal - 1 ) return;
				path.animate( { 'path' : steps[pos] }, 60, mina.linear, function() { nextStep(pos); } );
			};

			nextStep(pos);
		}
	}

	triggerBttn.addEventListener( 'click', toggleOverlay );
	closeBttn.addEventListener( 'click', toggleOverlay );
})();


	jQuery('#homelink').click(function() {
		jQuery(".overlay").removeClass('open');
		jQuery('html,body').animate({scrollTop: jQuery('#home-section').offset().top - 0}, 750);
	});

	jQuery('#aboutlink').click(function() {
		jQuery(".overlay").removeClass('open');
		jQuery('html,body').animate({scrollTop: jQuery('#about').offset().top - 0}, 750);
	});

	jQuery('#serviceslink').click(function() {
		jQuery(".overlay").removeClass('open');
		jQuery('html,body').animate({scrollTop: jQuery('#service').offset().top - 0}, 750);
	});

	jQuery('#teamlink').click(function() {
		jQuery(".overlay").removeClass('open');
		jQuery('html,body').animate({scrollTop: jQuery('#team').offset().top - 0}, 750);
	});
	
	jQuery('#portfoliolink').click(function() {
		jQuery(".overlay").removeClass('open');
		jQuery('html,body').animate({scrollTop: jQuery('#portfolio').offset().top - 0}, 750);
	});

	jQuery('#bloglink').click(function() {
		jQuery(".overlay").removeClass('open');
		jQuery('html,body').animate({scrollTop: jQuery('#blog').offset().top - 0}, 750);
	});

	jQuery('#contactlink').click(function() {
		jQuery(".overlay").removeClass('open');
		jQuery('html,body').animate({scrollTop: jQuery('#contact').offset().top - 0}, 750);
	});




	
// Place this file inside the theme directory (I use a sub-directory with the name "js")

// jQuery(document).ready(function($) {
// 	$('#contactbutton').click(function() {
// 		$('#contact-msg').html('<img src="http://mailgun.github.io/validator-demo/loading.gif" alt="Loading...">');
// 		var message = $('#message').val();
// 		var name = $('#name').val();
// 		var email = $('#email').val();
// 		if (!message || !name || !email) {
// 			$('#contact-msg').html('At least one of the form fields is empty.');
// 			return false;
// 		} else {
// 			$.ajax({
// 				type: "GET",
// 				url: 'https://api.mailgun.net/v2/address/validate?callback=?',
// 				data: { address: email, api_key: '>>> ADD HERE YOUR MAILGUN PUBLIC API KEY <<<' },
// 				dataType: "jsonp",
// 				crossDomain: true,
// 				success: function(data, status_text) {
// 					if (data['is_valid']) {
// 						$.ajax({
// 							type: 'POST',
// 							url: ajax_object.ajax_url,
// 							data: $('#contactform').serialize(),
// 							dataType: 'json',
// 							success: function(response) {
// 								if (response.status == 'success') {
// 									$('#contactform')[0].reset();
// 								}
// 								$('#contact-msg').html(response.errmessage);
// 							}
// 						});
// 					} else {
// 						if (data['did_you_mean']) {
// 							$('#contact-msg').html('Error, did you mean <em>' +  data['did_you_mean'] + '</em>?');
// 						} else {
// 							$('#contact-msg').html('The entered mail address is invalid.');
// 						}
// 						return false;
// 					}
// 				},
// 				error: function(request, status_text, error) {
// 					$('#contact-msg').html('Error occurred, unable to validate your email address.');
// 					return false;
// 				}
// 			});
// 		}
// 	});
// });