/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 var $ = jQuery;
module.exports = new (function(){
	var me = this;
	var isOldWin =
			(navigator.appVersion.indexOf("Windows NT 6.1")!=-1) || //Win7
			(navigator.appVersion.indexOf("Windows NT 6.0")!=-1) || //Vista
			(navigator.appVersion.indexOf("Windows NT 5.1")!=-1) || //XP
			(navigator.appVersion.indexOf("Windows NT 5.0")!=-1);   //Win2000
	var isIE9 = $('html').hasClass('ie9');
	var isIE10 = $('html').hasClass('ie10');
	var isIE11 = $('html').hasClass('ie11');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isMobile = $('html').hasClass('mobile');
	var factor = (function(){
		if(isIE9 || isIE10 || (isIE11 && isOldWin)){
			return 0;
		}else if(isIE11){
			return -0.15;
		}else if(isPoorBrowser){
			return 0;
		}else{
			return -0.25;
		}
	})();
	this.force3D = isMobile ? false : true;
	this.parallaxMargin = function(script, secInd, viewOffsetFromWindowTop){
		var viewOffsetFromNavPoint = (viewOffsetFromWindowTop - (secInd === 0 ? 0 : script.topNav.state2H));
		return Math.round(factor * viewOffsetFromNavPoint);
	};
})();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 var $ = jQuery;
module.exports = function(){
	var appShare = __webpack_require__(0);
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var fadeTime = 4000;
	var moveTime = 12000;
	var st0 = {scale: 1};
	var st1 = {scale: 1.1};
	var rules = [
		[st0, st1],
		[st1, st0]
	];
	var origins = [
		{or: 'left top', xr: 0, yr: 0},
		{or: 'left center', xr: 0, yr: 1},
		{or: 'right top', xr: 2, yr: 0},
		{or: 'right center', xr: 2, yr: 1}
	]
	var lastRule = rules.length -1;
	var lastOrigin = origins.length -1;
	var fadeEase = TWEEN.Easing.Quartic.InOut;//Power4.easeInOut;
	var moveEase = TWEEN.Easing.Linear.None;//Linear.easeNone;
	this.run = function($slides) {
		if(isPoorBrowser) return;
		var lastI = $slides.length - 1;
		show(lastI, true);
		function show(i, isFirstRun) {
			var slide = $slides.get(i);
			var $slide = $(slide);
			var cfg = $slide.data();
			var ri = Math.round(Math.random() * lastRule);
			var ori = Math.round(Math.random() * lastOrigin);
			var rule = rules[ri];
			cfg.ssScale = rule[0]['scale'];
			cfg.ssOrig = origins[ori];
			cfg.ssOpacity = (i === lastI && !isFirstRun) ? 0 : 1;
			if (i === lastI && !isFirstRun) {
				new TWEEN.Tween(cfg)
					.to({ssOpacity: 1}, fadeTime)
					.easing(fadeEase)
					.onComplete(function(){
						$slides.each(function(){
							$(this).data().ssOpacity = 1;
						});
					})
					.start();
			}
			new TWEEN.Tween(cfg)
				.to({ssScale: rule[1]['scale']}, moveTime)
				.easing(moveEase)
				.start();
			if (i > 0) {
				new TWEEN.Tween({ssOpacity: 1})
					.to({ssOpacity: 0}, fadeTime)
					.onUpdate(function(){
						cfg.ssOpacity = this.ssOpacity;
					})
					.easing(fadeEase)
					.delay(moveTime - fadeTime)
					.onStart(function(){
						show(i - 1);
					})
					.start();
			}else{
				new TWEEN.Tween(cfg)
					.to({}, 0)
					.easing(fadeEase)
					.delay(moveTime - fadeTime)
					.onStart(function(){
						show(lastI);
					})
					.start();
			}
		}
	};
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = new (function(){
	var me = this;
	this.options = {
		'angie': {style: 'theme-angie', bgSync: ['**/*.txt', '**/*'], videoSync: []},
		'lynda': {style: 'theme-lynda', bgSync: ['**/*.txt', '**/*'], videoSync: []},
		'alice': {style: 'theme-alice', bgSync: ['**/*.txt', '**/*'], videoSync: []},
		'lucy': {style: 'theme-lucy', bgSync: ['**/*.txt', '**/*'], videoSync: []},
		'mary': {style: 'theme-alice', bgSync: ['**/*.txt', '**/*'], videoSync: []},
		'suzi': {style: 'theme-suzi', bgSync: ['**/*.txt', '**/*'], videoSync: []},
		'viki': {style: 'theme-viki', bgSync: ['**/*.txt', '**/*'], videoSync: []},
		'luiza': {style: 'theme-luiza', bgSync: ['**/*.txt', '**/*'], videoSync: []}
	};
	this.names = {
	};
	this.colors = 8;
	this.colorClasses = (function(){
		var res = '';
		for(var i=0; i<me.colors; i++){
			var sep = i === 0 ? '' : ' ';
			res += sep + 'colors-'+String.fromCharCode(65+i).toLowerCase();
		}
		return res;
	})();
})();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 var $ = jQuery;
module.exports = new (function(){
	var appShare = __webpack_require__(0);
	var themes = __webpack_require__(2);
	var SlideShow = __webpack_require__(1);
	var slideShow = new SlideShow();
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isMobile = $('html').hasClass('mobile');
	var skewH = 60;
	var $bord = $('#top-nav, .page-border, #dot-scroll');
	var $topNav = $('#top-nav');
	var state1Colors = $topNav.data('state1-colors');
	var state2Colors = $topNav.data('state2-colors');
	var $body = $('body');
	var $views = $('.view');
	var $bacgrounds;
	this.prepare = function(callback){
		if(window.location.protocol === 'file:' && !$('body').hasClass('example-page')){
			$('<div class="file-protocol-alert alert colors-d background-80 heading fade in">	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button> Upload files to web server and open template from web server. If template is opened from local file system, some links, functions and examples may work incorrectly.</div>')
					.appendTo('body');
		}
		if(appShare.force3D === true){
			$('html').addClass('force3d');
		}
		if(isPoorBrowser){
			var $bodyBg = $('body>.bg');
			$bodyBg.each(function(i){
				if(i === ($bodyBg.length - 1)){
					$(this).css('display', 'block');
				}else{
					$(this).remove();
				}
			});
			$('.view').each(function(){
				var $viewBg = $(this).children('.bg');
				$viewBg.each(function(i){
					if(i === ($viewBg.length - 1)){
						$(this).css('display', 'block');
					}else{
						$(this).remove();
					}
				});
			});
		}
		if(isMobile){
			var $bodyImg = $('body>img.bg');
			var $defImgSet = $bodyImg.length>0 ? $bodyImg : $('.view>img.bg');
			if($defImgSet.length > 0){
				var $defImg = $($defImgSet[0]);
				$('.view').each(function(){
					var $sec = $(this);
					var $bg = $sec.children('img.bg');
					if($bg.length<1){
						$defImg.clone().prependTo($sec);
					}
				});
			}
			$('body>img.bg').remove();
		}
		$bacgrounds = $('.bg');
		callback();
	};
	this.setup = function(callback){
		var goodColor = function($el){
			var bg = $el.css('background-color');
			return (
					bg.match(/#/i) ||
					bg.match(/rgb\(/i) ||
					bg.match(/rgba.*,0\)/i)
			);
		};
		$('.view.section-header').each(function(){
			var $this = $(this);
			var $next = $this.nextAll('.view').first().children('.content');
			if($next.length>0 && goodColor($next)){
				$this.children('.content').addClass('skew-bottom-right');
			}
		});
		$('.view.section-footer').each(function(){
			var $this = $(this);
			var $prev = $this.prevAll('.view').first().children('.content');
			if($prev.length>0 && goodColor($prev)){
				$this.children('.content').addClass('skew-top-right');
			}
		});
		$views.find('.content').filter('.skew-top-right, .skew-top-left, .skew-bottom-left, .skew-bottom-right').each(function(){
			var $content = $(this);
			var $view = $content.parent();
			if($content.hasClass('skew-top-right') || $content.hasClass('skew-top-left')){
				var $prev = $view.prevAll('.view').first().children('.content');
				if($prev.length>0 && goodColor($prev)){
					var type = $content.hasClass('skew-top-right') ? 1 : 2;
					$('<div class="skew skew-top-'+(type === 1 ? 'right' : 'left')+'"></div>').appendTo($content).css({
						position: "absolute",
						top: "0px",
						width: "0px",
						height: "0px",
						"border-top-width": type === 2 ? (skewH+"px") : "0px",
						"border-right-width": "2880px",
						"border-bottom-width": type === 1 ? (skewH+"px") : "0px",
						"border-left-width": "0px",
						"border-style": "solid solid solid dashed",
						"border-bottom-color": "transparent",
						"border-left-color":  "transparent"
					}).addClass(getColorClass($prev));
				}
			}
			if($content.hasClass('skew-bottom-left') || $content.hasClass('skew-bottom-right')){
				var $next = $view.nextAll('.view').first().children('.content');
				if($next.length>0 && goodColor($next)){
					var type = $content.hasClass('skew-bottom-left') ? 1 : 2;
					$('<div class="skew skew-bottom-'+(type === 1 ? 'left' : 'right')+'"></div>').appendTo($content).css({
						position: "absolute",
						bottom: "0px",
						width: "0px",
						height: "0px",
						"border-top-width": type === 1 ? (skewH+"px") : "0px",
						"border-right-width": "0px",
						"border-bottom-width": type === 2 ? (skewH+"px") : "0px",
						"border-left-width": "2880px",
						"border-style": "solid dashed solid solid",
						"border-top-color": "transparent",
						"border-right-color": "transparent"
					}).addClass(getColorClass($next));
				}
			}
		});
		callback();
		function getColorClass($el){
			for(var i=0; i<themes.colors; i++){
				var colorClass = 'colors-'+String.fromCharCode(65+i).toLowerCase();
				if($el.hasClass(colorClass)){
					return colorClass;
				}
			}
		}
	};
	this.ungated = function(){
		$('body, .view').each(function(){
			var $bg = $(this).children('.bg');
			if($bg.length > 1) slideShow.run($bg);
		});
	}
	this.tick = function(){
		$bacgrounds.each(function(){
			var $this = $(this);
			var cfg = $this.data();
			var opa, xr, yr, or;
			if(cfg.ssOpacity !== undefined){
				opa = cfg.ssOpacity;
				xr = cfg.ssOrig.xr;
				yr = cfg.ssOrig.yr;
				or = cfg.ssOrig.or;
			}else{
				opa = 1;
				xr = 1;
				yr = 1;
				or = 'center center';
			}
			var x = cfg.normalX + (cfg.zoomXDelta * xr);
			var y = cfg.normalY + (cfg.zoomYDelta * yr) + (cfg.parallaxY !== undefined ? cfg.parallaxY : 0);
			var sc = cfg.normalScale * (cfg.ssScale !== undefined ? cfg.ssScale : 1);
			if(Modernizr.csstransforms3d && appShare.force3D){
				$this.css({transform: 'translate3d('+x+'px, '+y+'px, 0px) scale('+sc+', '+sc+')', opacity: opa, 'transform-origin': or+' 0px'});
			}else{
				$this.css({transform: 'translate('+x+'px, '+y+'px) scale('+sc+', '+sc+')', opacity: opa, 'transform-origin': or});
			}
		});
	}
	this.buildSizes = function(script){
		var $window = $(window);
		var wh = $window.height();
		var ww = $window.width();
		var $tnav = $('#top-nav:visible');
		var sh = wh - ($tnav.length > 0 ? script.topNav.state2H : 0);
		var $bbord = $('.page-border.bottom:visible');
		var borderH = $bbord.length > 0 ? $bbord.height() : 0;
		$('.full-size, .half-size, .one-third-size').each(function() {
			var $this = $(this);
			var minPaddingTop = parseInt($this.css({
				'padding-top': '',
			}).css('padding-top').replace('px', ''));
			var minPaddingBottom = parseInt($this.css({
				'padding-bottom': '',
			}).css('padding-bottom').replace('px', ''));
			var minFullH = sh - ($bbord.length > 0 ? borderH : 0);
			var minHalfH = Math.ceil(minFullH / 2);
			var min13H = Math.ceil(minFullH / 3);
			var min = $this.hasClass('full-size') ? minFullH : ($this.hasClass('half-size') ? minHalfH : min13H);
			$this.css({
				'padding-top': minPaddingTop + 'px',
				'padding-bottom': minPaddingBottom + 'px'
			});
			if($this.hasClass('stretch-height') || $this.hasClass('stretch-full-height')){
				$this.css({height: ''});
			}
			var thisH = $this.height();
			if (thisH < min) {
				var delta = min - thisH - minPaddingTop - minPaddingBottom;
				if(delta<0){
					delta=0;
				}
				var topPlus = Math.round(delta / 2);
				var bottomPlus = delta - topPlus;
				var newPaddingTop = minPaddingTop + topPlus;
				var newPaddingBottom = minPaddingBottom + bottomPlus;
				$this.css({
					'padding-top': newPaddingTop + 'px',
					'padding-bottom': newPaddingBottom + 'px'
				});
			}
		});
		$('.stretch-height').each(function(){
			var $this = $(this);
			var $par = $this.parent();
			var $strs = $par.find('.stretch-height');
			$strs.css('height', '');
			if($this.outerWidth()<$par.innerWidth()){
				$strs.css('height', $par.innerHeight()+'px');
			}
		});
		$('.stretch-full-height').each(function(){
			var $this = $(this);
			var $par = $this.parent();
			var $strs = $par.find('.stretch-full-height');
			$strs.css('height', '');
			if($this.outerWidth()<$par.innerWidth()){
				var parH = $par.innerHeight();
				var strsH = wh < parH ? parH : wh;
				$strs.css('height', strsH+'px');
			}
		});
		$views.each(function(i){
			var $view = $(this);
			var $content = $view.find('.content');
			var $skewTop = $content.find('.skew.skew-top-right, .skew.skew-top-left');
			var $skewBottom = $content.find('.skew.skew-bottom-left, .skew.skew-bottom-right');
			var contentWPx = $content.width()+"px";
			$skewBottom.css({
				"border-left-width": contentWPx
			});
			$skewTop.css({
				"border-right-width": contentWPx
			});
			var viewH = $view.height();
			var viewW = $view.width();
			var targetH = (function(){
				var viewOffset1 = -1 * viewH;
				var viewOffset2 = 0;
				var viewOffset3 = wh - viewH;
				var viewOffset4 = wh;
				var marg1 = appShare.parallaxMargin(script, i, viewOffset1);
				var marg2 = appShare.parallaxMargin(script, i, viewOffset2);
				var marg3 = appShare.parallaxMargin(script, i, viewOffset3);
				var marg4 = appShare.parallaxMargin(script, i, viewOffset4);
				var topDelta = function(viewOffset, marg){
					return marg + (viewOffset > 0 ? 0 : viewOffset);
				};
				var bottomDelta = function(viewOffset, marg){
					var bottomOffset = viewOffset + viewH;
					return -marg - (bottomOffset < wh ? 0 : bottomOffset - wh);
				};
				var delta = 0;
				var curDelta;
				curDelta = topDelta(viewOffset1, marg1); if(curDelta > delta) delta = curDelta;
				curDelta = topDelta(viewOffset2, marg2); if(curDelta > delta) delta = curDelta;
				curDelta = topDelta(viewOffset3, marg3); if(curDelta > delta) delta = curDelta;
				curDelta = topDelta(viewOffset4, marg4); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset1, marg1); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset2, marg2); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset3, marg3); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset4, marg4); if(curDelta > delta) delta = curDelta;
				return viewH + (2 * delta);
			})();
			$view.children('img.bg').each(function(){ 
				bgSize($(this), targetH, viewW, viewH);
			});
			$view.data('position', $view.offset().top);
		});
		$('section').each(function(){
			var $this = $(this);
			$this.data('position', $this.offset().top);
		});
		$('body').children('img.bg').each(function(){ 
			bgSize($(this), wh, ww, wh);
		});
		function bgSize($bg, targetH, viewW, viewH){
			var nat = natSize($bg);
			var scale = (viewW/targetH > nat.w/nat.h) ? viewW / nat.w : targetH / nat.h;
			var newW = nat.w * scale;
			var newH = nat.h * scale;
			var zoomXDelta = (newW - nat.w)/2;
			var zoomYDelta = (newH - nat.h)/2;
			var x = Math.round((viewW - newW)/2);
			var y = Math.round((viewH - newH)/2);
			var cfg = $bg.data();
			cfg.normalScale = scale;
			cfg.normalX = x;
			cfg.normalY = y;
			cfg.zoomXDelta = zoomXDelta;
			cfg.zoomYDelta = zoomYDelta;
		}
	};
	this.changeSection = function(script, sectionHash){
		var $sect = $(sectionHash);
		var cls = $sect.data('border-colors');
		if(cls){
			$bord.removeClass(themes.colorClasses);
			$bord.addClass(cls);
		}else{
			if($body.hasClass('state2') && state2Colors){
				$bord.removeClass(themes.colorClasses);
				$bord.addClass(state2Colors);
			}else if(state1Colors){
				$bord.removeClass(themes.colorClasses);
				$bord.addClass(state1Colors);
			}
		}
	};
	function natSize($bg){
		var elem = $bg.get(0);
		var natW, natH;
		if(elem.tagName.toLowerCase() === 'img'){
			natW = elem.width;
			natH = elem.height;
		}else if(elem.naturalWidth){
			natW = elem.naturalWidth;
			natH = elem.naturalHeight;
		}else{
			var orig = $bg.width();
			$bg.css({width: '', height: ''});
			natW = $bg.width();
			natH = $bg.height();
			$bg.css({width: orig});
		}
		return {w: natW, h: natH};
	}
})();

/***/ })
/******/ ]);