/*
 *Once upon a time
 */
define(["lib/gameFunctions"], function(gamefuncs){
	
	function Player(config)
	{
		this.picSource = config.picSource;//必须是数组，最后一张是跨栏动作
		this.picNum = config.picSource.length;
		this.initD = config.initD;
		this.offsetRatio = config.offsetRatio;
		this.initScale = config.initScale;//调整图片大小

		//位置控制
		this.x;
		this.y;
		this.side;//左、中、右
		this.h;//起跳高度
		this.vy;//起跳时的纵向速度
		// this.spdY;
		this.g;//重力加速度
		this.jumpTimer;//起跳控制器
		this.angle;//倾斜角度
		this.toAngle;

		//图片控制
		this.picCount;
		this.picCountInterval;
		this.timer;
		this.pics=[];
	}

	Player.prototype.init=function()
	{
		this.x=0;
		this.y=this.initD;
		this.h=0;
		this.vy=0;
		// this.spdY=0;
		this.g=0.001;
		this.jumpTimer=0;
		this.picCount=0;
		this.picCountInterval=1;//图片切换的跨度为1，连贯动作，不使用自加运算，更方便调整
		this.side=0;
		this.angle=0;
		this.toAngle=0;
		this.timer=0;
		this.jumping=false;

		this.canTouch=false;
		this.canTouchAgain=true;

		for(var i=0;i<this.picSource.length;i++)
		{
			var pic = new Image();
			pic.src = this.picSource[i];
			this.pics.push(pic);
		}
	}

	Player.prototype.draw=function(ctx, intv, deltaTime)//intv:信息更新的间隔
	{
		if(this.jumping)
		{
			this.jump(deltaTime);
		}
		else
		{
			this.timer+=deltaTime;
			if(this.timer>=intv)
			{
				this.picCount+=this.picCountInterval;
				if(this.picCount>=this.picNum-2)//最后一张是跨栏动作，所以这里减2
				{	
					this.picCount=this.picNum-2;
					this.picCountInterval*=-1;
				}
				if(this.picCount<=0)
				{
					this.picCount=0;
					this.picCountInterval*=-1;
				}
				this.timer=0;
			}
			this.x=gamefuncs.lerpDistance(this.side*this.initD*this.offsetRatio,this.x,0.8);
			this.angle=gamefuncs.lerpAngle(this.toAngle*Math.PI/180,this.angle,0.7);
		}
		
		var thisPic=this.pics[this.picCount];
		var w=thisPic.width*this.initScale;
		var h=thisPic.height*this.initScale;

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.drawImage(thisPic,-0.5*w,-h,w,h);
		ctx.restore();
	}

	Player.prototype.jump=function(deltaTime)
	{
		this.picCount = this.picNum - 1;
		this.vy=0.5;
		this.jumpTimer+=deltaTime;
		this.h=this.vy*this.jumpTimer-0.5*this.g*this.jumpTimer*this.jumpTimer;
		this.y=this.initD-this.h;
		// this.spdY=this.vy-this.g*this.jumpTimer;
		if(this.h<=0)
		{
			this.y=this.initD;
			this.jumping=false;
			this.canTouch=true;
			this.canTouchAgain=true;
			this.jumpTimer=0;
			this.picCount=0;
			this.timer=0;
		}
	}
	return Player;
});