//各对象的资源和配置
var getGameConfig = function () {
	var can1,can2,can3,can4,ctx1,ctx2,ctx3,ctx4;//画布

	can1=document.getElementById("canvas1");//固定背景
	ctx1=can1 && can1.getContext("2d");

	can2=document.getElementById("canvas2");//人物、障碍
	ctx2=can2 && can2.getContext("2d");

	can3=document.getElementById("canvas3");//移动背景
	ctx3=can3 && can3.getContext("2d");

	can4=document.getElementById("canvas4");//两根线
	ctx4=can4 && can4.getContext("2d");

	return {
		"canvas": //各个画布
		{
			"noPics": true,
			"can1": 
			{
				"el": can1,
				"ctx": ctx1
			},
			"can2": 
			{
				"el": can2,
				"ctx": ctx2
			},
			"can3": 
			{
				"el": can3,
				"ctx": ctx3
			},
			"can4": 
			{
				"el": can4,
				"ctx": ctx4
			}
		},

		"moveObjects" : //把石头放在树的前面，按顺序绘制，树就可以挡住石头
		[
			{
				"name" : "leftStone",
				"config" : 
				{
					"num" : 10,
					"picSource" : 
					[
						"../images/stone-left.png"
					],
					"initW" : 1400,
					"initD" : 1300,
					"deadD" : 250,
					"side" : -1,
					"sendInterval" : 750,
					"initScale" : 2.0,
					"ctx" : ctx3
	 			}
			},
			{
				"name" : "leftTree",
				"config" : 
				{
					"num" : 10,
					"picSource" : 
					[
						"../images/tree-left.png"
					],
					"initW" : 1800,
					"initD" : 1300,
					"deadD" : 255,
					"side" : -1,
					"sendInterval" : 750,
					"initScale" : 2.0,
					"ctx" : ctx3
	 			}
			},
			{
				"name" : "rightStone",
				"config" : 
				{
					"num" : 10,
					"picSource" : 
					[
						"../images/stone-right.png"
					],
					"initW" : 1400,
					"initD" : 1300,
					"deadD" : 250,
					"side" : 1,
					"sendInterval" : 750,
					"initScale" : 2.0,
					"ctx" : ctx3
	 			}
			},
			{
				"name" : "rightTree",
				"config" : 
				{
					"num" : 10,
					"picSource" : 
					[
						"../images/tree-right.png"
					],
					"initW" : 1800,
					"initD" : 1300,
					"deadD" : 255,
					"side" : 1,
					"sendInterval" : 750,
					"initScale" : 2.0,
					"ctx" : ctx3
	 			}
			},
			{
				"name" : "leftLine",
				"config" : 
				{
					"num" : 10,
					"picSource" : 
					[
						"../images/line-left.png"
					],
					"initW" : 300,
					"initD" : 1400,
					"deadD" : 230,
					"side" : -1,
					"sendInterval" : 900,
					"ctx": ctx4
	 			}
			},
			{
				"name" : "rightLine",
				"config" : 
				{
					"num" : 10,
					"picSource" : 
					[
						"../images/line-right.png"
					],
					"initW" : 300,
					"initD" : 1400,
					"deadD" : 230,
					"side" : 1,
					"sendInterval" : 900,
					"ctx" : ctx4
	 			}
			},
			{
				"name" : "obstacles",
				"config" : 
				{
					"num" : 10,
					"picSource" : 
					[
						"../images/obstacle-1.png",
						"../images/obstacle-2.png"
					],
					"initW" : 700,
					"initD" : 1400,
					"deadD" : 250,
					"side" : "ran",
					"sendInterval" : 1500,
					"ctx" : ctx2
	 			}
			}
		],

		"playerObject" : 
		[
			{
				"name" : "",
				"config" : 
				{
					"picSource" : 
					[
						"../images/player-1.png",
						"../images/player-2.png",
						"../images/player-3.png",
						"../images/player-4.png",
						"../images/player-5.png",
						"../images/player-6.png"
					],
					"offsetRatio" : 7/26,
					"initD" : 420,
					"initScale" : 0.6
				}		
			}
		],

		"background" : 
		[
			{
				"name" : "",
				"config" : 
				{
					"picSource" : 
					[
						"../images/bg-1.png",
						"../images/bg-2.png"
					]
				}
				
			}
		],

		"supports":
		[
			{
				"name": "countDown",
				"config":
				{
					"picSource":
					[
						"../images/time-1.png",
						"../images/time-2.png",
						"../images/time-3.png",
						"../images/time-go.png"
					]
				}
			}
		],

		//获取所有需要预加载的图片,picSource必须是字符串或者成员值为字符串的数组
		getAllPics: function(target){
			var obj = (typeof target === "undefined") ? this : target;
			var allPics = [];
			for (var k in obj){
				var kType = Object.prototype.toString.call(obj[k]);
				if(/Object|Array/.test(kType) && (obj[k]["noPics"] !== true)){	//用（typeof obj[k] === "object"）的就是猪
					if(k === "picSource") {
						allPics = allPics.concat(obj[k]);
					}else{
						allPics = allPics.concat(this.getAllPics(obj[k]));
					}
				}else if(k === "picSource"){
					allPics.push(obj[k]);
				}
			}
			return allPics;
		}
	};
};
