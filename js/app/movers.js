/*
 *Once upon a time, created by Miaomiaomiao~
 */

function Movers(config)//config必须包含picSource,initW,initD,side,sednInterval
{	
	this.datas = [];
	this.picSource = ("string" === typeof config.picSource) ? [config.picSource] : config.picSource;
	this.initW = config.initW;//初始横向可偏移宽度
	this.initD = config.initD;//初始纵向距离，一般比视距稍大
	this.deadD = config.deadD || 330;	//默认死亡距离330
	this.side = config.side;//偏移方向，左、中、右，或者随机
	this.sendInterval = config.sendInterval;//物体生成的间隔
	this.initScale = config.initScale || 1.0;//物体初始缩放比例，用这个参数来调整图片绘制的初始大小
	this.initCtx = config.ctx;
	

	this.initSpd;//initSpd也一样，根据加速度和initD来计算

	this.sendTimer;//物体生成的控制器
	
}
	

Movers.prototype.init=function()
{
	this.initSpd=Movers.primeSpd*(this.initD/Movers.perspective);
	this.sendTimer=0;
}

Movers.prototype.update = function(){
	this.initSpd=Movers.primeSpd*(this.initD/Movers.perspective);
}

Movers.prototype.draw=function()
{
	for(var i=0;i<this.datas.length;i++)
	{
		if(this.datas[i].alive)
		{
			//活着的就画出来
			var pic = this.datas[i].pic;
			var scale = this.datas[i].scale;
			var x = this.datas[i].x;
			var y = this.datas[i].y;
			var w=scale*this.datas[i].pic.width;
			var h=scale*this.datas[i].pic.height;
			this.datas[i].ctx.drawImage(pic, x-0.5*w,this.datas[i].y-h,w,h);
		}

		//并且在这里更新下一帧信息
		this.datas[i].spdY = this.initSpd*(y/Movers.perspective);
		this.datas[i].y = y - this.datas[i].spdY*deltaTime;
		this.datas[i].x = y*this.datas[i].offsetRatio;
		this.datas[i].scale = (y/Movers.perspective)*this.initScale;
	}
}

Movers.prototype.born=function(picType)
{
	var self = this;
	var img = new Image();
	img.src = self.picSource[picType];
	var side = (self.side !== "ran") ? self.side : Math.floor(Math.random()*3)%3-1;
	var data = {
		offsetRatio: self.initW*0.5/self.initD*side,
		y: self.initD,
		x: this.y*this.offsetRatio,
		scale: this.y/Movers.perspective*this.initScale,
		ctx: self.initCtx,
		pic: img,
		picType: picType,
		alive: true
	}
	
	self.datas.push(data);
}

Movers.prototype.dead=function(i)
{
	var idx = i || 0;
	this.datas.splice(idx, 1);
}

Movers.prototype.deadAll = function(){
	this.datas = [];
	Movers.primeSpd = 0.5;
	this.initSpd=Movers.primeSpd*(this.initD/Movers.perspective);
	Movers.decrecedInterval = 0;
}

Movers.prototype.sendMover=function()
{
	
	var picType=Math.floor(Math.random()*this.picSource.length);//随机使用一张图片
	this.born(picType);
			
}

Movers.prototype.Monitor=function()
{
	this.sendTimer += deltaTime;
	var intv = this.sendInterval - Movers.decrecedInterval;
	if(this.sendTimer > intv)
	{
		this.sendTimer%=intv;
		this.sendMover();
		return;
	}

	for(var i=0;i<this.datas.length;i++)
	{
		if(this.datas[i].y<this.deadD)
		{
			this.dead(i);
		}
	}
}

Movers.perspective = 1080;
Movers.primeSpd = 0.5;	//perspective位置初速度
Movers.decrecedInterval = 0;	//