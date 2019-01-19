/*
 *图片预加载--what they said "img-preloading", yoyoyo~
 *extend Zepto and i'm telling you this because i love "DuangDuangDuang"~
 */
if('undefined' != typeof Zepto){
	(function($) {
		function Preload(imgs, options) {
			this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
			this.opts = $.extend({}, Preload.DEFAULTS, options);
			this._unordered();//只在内部调用的无序加载的方法
		}
		Preload.DEFAULTS = {
			each: null, //每一张图片加载完毕后执行
			all: null //所有图片加载完毕后执行
		};
		//无序加载
		Preload.prototype._unordered = function(){
			var imgs = this.imgs,
				opts = this.opts,
				count = 0,
				len = imgs.length;
			$.each(imgs, function(i, src){
				if(typeof src != 'string') return;

				var imgObj = new Image();

				$(imgObj).on('load error', function(){
					opts.each && opts.each(count);

					if(count >= len-1){
						opts.all && opts.all();
					}
					count++;
				});
				imgObj.src = src;
			});
		};
		$.extend($,{
			preloadImg: function(imgs, opts){
				new Preload(imgs, opts);
			}
		});
	})(Zepto);
}