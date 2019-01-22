define(function(){
	var touchEventsListeners = function(player){
		var startPos={},deltaPos={};//触屏事件工具
		return {
			touchStart: function (e) {
				e.preventDefault();
				var touch=e.targetTouches[0];
				startPos={x:touch.clientX,y:touch.clientY};
				player.canTouch=true;
			},
			touchMove: function (e) {
				e.preventDefault();
				var touch=e.targetTouches[0];
				deltaPos={x:touch.clientX-startPos.x, y:touch.clientY-startPos.y};
				if(player.canTouch && player.canTouchAgain)
				{
					if(deltaPos.y<-10)
					{
						player.canTouch=false;
						player.canTouchAgain=false;
						player.jumping=true;
						return;
					}
					if(deltaPos.x>10)
					{
						player.canTouch=false;
						player.side = Math.min(player.side+1, 1);
						player.toAngle=10;
					}
					if(deltaPos.x<-10)
					{
						player.canTouch=false;
						player.side = Math.max(player.side-1, -1);
						player.toAngle=-10;
					}
				}
			},
			touchEnd: function (e) {
				e.preventDefault();
				player.canTouch=false;
				player.toAngle=0;
			}
		}
	};

	return touchEventsListeners;
});