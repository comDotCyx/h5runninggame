define([],function(){var e=function(e){var t={},n={};return{touchStart:function(n){n.preventDefault();var r=n.targetTouches[0];t={x:r.clientX,y:r.clientY},e.canTouch=!0},touchMove:function(r){r.preventDefault();var i=r.targetTouches[0];n={x:i.clientX-t.x,y:i.clientY-t.y};if(e.canTouch&&e.canTouchAgain){if(n.y<-10){e.canTouch=!1,e.canTouchAgain=!1,e.jumping=!0;return}n.x>10&&(e.canTouch=!1,e.side=Math.min(e.side+1,1),e.toAngle=10),n.x<-10&&(e.canTouch=!1,e.side=Math.max(e.side-1,-1),e.toAngle=-10)}},touchEnd:function(t){t.preventDefault(),e.canTouch=!1,e.toAngle=0}}};return e});