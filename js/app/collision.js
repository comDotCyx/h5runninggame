/*
 *Once upon a time
 */
function obstaclesCollision(obstacles, player, callback)
{
	for(var i=0;i<obstacles.datas.length;i++)
	{
		var x = obstacles.datas[i].x;
		var y = obstacles.datas[i].y;
		var pic = obstacles.datas[i].pic;
		var picType = obstacles.datas[i].picType;
		var scale = obstacles.datas[i].scale;
		var disX=Math.abs(x-player.x);
		var disY=Math.abs(y-player.y);

		var wX=(pic.width*scale+player.pics[i].width*player.initScale)*0.5;
		var hY=pic.height*scale;

		if(disX<wX && disY<hY)
		{	
			if(y>player.initD)
			{	
				if(disX<wX*0.75 && disY<hY*0.8)
				{
					obstacles.dead(i);

					if(picType == 0)
					{
						callback(0)
					}
					else if(picType == 1)
					{
						callback(1)
					}
				}	
			}	
		}
		if(y<player.initD)
		{
			obstacles.datas[i].ctx=ctx3;
		}
	}
	// if(noCollision)
	// {

	// 	playerFirst=false;
	// }
}


//碰撞检测思路：
//检测条件：disX<wX && disY<hY;
//obstacles.y[i]>player.initD,则在同一画布先画player,否则把obstacles移动到更低层的画布绘画
