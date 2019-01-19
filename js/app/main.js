var gameLoaded = false;
var progressNum;//游戏图片预加载进度
var timeCount,timeImgs=[],timeImgEl;//游戏前倒计时
var reduceTime;	//游戏时计时、扣分
var updateTimer; //游戏难度升级进度

var can1,ctx1,can2,ctx2,can3,ctx3,can4,ctx4,canW,canH;//画布


var lastTime,deltaTime,totleTime,leftTime,timeBar,recuceTime,reduceTip,gogogo,primeTime = 60;//计时

var perspective;//视距和移动物体的初速
var distanceBar,stageDistance,totalDistance,cheerTip,cheerTexts,runnerSpd; //速度总距离信息及其UI数据

//要绘制的对象
var background;//canvas1
var player,obstacles;//canvas2
var moveObjs=[],moversNum;//canvas3

var touchHandles;	//用户操作事件

var gameConfig;	//游戏配置总信息
var gamePics;	//预加载图片，从gameConfig中提取

//把移动物和player对象的配置
var moversConfig;	//移动物配置
var playerConfig;	//人物配置
var punishs;	//两种惩罚


//BGM
var audio = new Audio();
audio.loop = true;
var audioPlayed = false;
var audioLoaded = false;
var audioSrc = "../media/bgm1.mp3";
var audioTimer = null;

//数据存储和展示
var dataUi,dataStorage,storageFuncs;
var endTipBg;
var recordPage = $("#record");
var cover = $("#cover");

//安排背景音乐
function bindBgm(btn){
	var btn = $(btn);
	audio.addEventListener("loadedmetadata", function() {
		loadedMetaData = true;
	});
	audio.addEventListener("error", function() {
		audioTimer && clearInterval(audioTimer);
	});

	btn.on("click", function(){
		if(audioPlayed === false){
			audio.play();
			audioPlayed = true;
			audio.src = audioSrc;
			
			audio.load();
			audioTimer = setInterval(function() {			
				if (/UCBrowser/.test(navigator.userAgent)) {
					loadedMetaData = true;
				}
				if (audio.readyState > 2 && loadedMetaData) {
					clearInterval(audioTimer);
					btn.addClass('paused');
					audio.play();
				}
			}, 500);
		}

		if(btn.hasClass('playing')){
			audio.pause();
			btn.addClass('paused').removeClass('playing');
		}else{
			btn.addClass('playing').removeClass('paused');
			audio.play();
		}
	})
}

//开启游戏
function enterTheGame()
{

	//提前绑定结果页按钮
	endTipBg = $("#endTipBg");
	
	endTipBg.on("click", ".closeTipBtn", function(){
		endTipBg.hide();
		endTipBg.find(".tipBox").addClass('hideBox');
		if($(this).hasClass('againBtn')){
			gameInit();
		}else if($(this).hasClass('recordBtn')){
			showRecordFrom("#game");
		}
	});

	//获取游戏配置
	gameConfig = getGameConfig();
	
	//加载游戏画面中的图片
	gamePics = gameConfig.getAllPics();
	preloadImg(gamePics);

	
}

//显示历史记录
function showRecordFrom(from){
	var updated = recordPage.attr("data-upted");
	if(!updated || updated !== "yes"){
		updateRecordPage();
	}

	$(from).hide();
	recordPage.show();
}

//更新历史记录页面
function updateRecordPage(){
	recordPage.find(".times").html(dataStorage.times);
	recordPage.find(".best").html(dataStorage.best);
	recordPage.find(".worst").html(dataStorage.worst);
	recordPage.find(".totalDistance").html(dataStorage.total);

	var topListStr = "";
	var topList = dataStorage.topList;
	for(var i=0; i<topList.length; i++){
		var date = makeTimeStr(new Date(topList[i].date*1));
		topListStr += "<li><div class=\"num\">" + (i+1) + "</div><div class=\"grade\">" + topList[i].grade + "m" + "</div><div class=\"date\">" + date + "</div></li>";
	}

	recordPage.find('.topList').html(topListStr);

	recordPage.attr("data-upted", "yes");
}

//图片预加载
function preloadImg(picArr)
{
	$.preloadImg([
		"../images/loading-1.gif",
		"../images/loading-2.gif",
		"../images/loading-3.gif"
		], {
		each : function(count1){},
		all : function (){
			var len=picArr.length;
			$.preloadImg(picArr, {
				each : function(count2)
				{
					var c=count2;		
					progressNum=(c/len*100).toFixed();
					if(progressNum>33 && progressNum<66)
					{
						$("#progressAnimPic").attr('src','../images/loading-2.gif')
					}
					else if(progressNum>66)
					{
						$("#progressAnimPic").attr('src','../images/loading-3.gif')
					}
					$("#progressAnimPic").css("left",progressNum+"%");
					$("#progressMsk").css("width", 100-progressNum+"%");
					$("#porgressNum").html("已加载"+progressNum+"%");
					// console.log("已加载图片数量"+c+"/"+progressNum+"%");
				},
				all : function ()
				{
					console.log("游戏图片加载完毕");
					$("#loadingPage").hide();
					$("#game").show();

					//初始化基本参数
					gameInit(true);
				}
			});
		}
	});
}


//游戏初始化
function gameInit(first)
{	
	// 初始化数据
	totleTime=0;
	updateTimer=0;
	leftTime=primeTime;
	lastTime=Date.now();
	reduceTime=0;
	totalDistance=0;
	stageDistance=0;
	runnerSpd = 5;
	timeCount=0;
	$(timeImgEl).attr("src", timeImgs[0]);
	gogogo = false;	//是否已经开始跑


	if(first === true){
		// UI相关
		timeBar=document.getElementById("countT");
		distanceBar=document.getElementById("distance");
		reduceTip=document.getElementById("reduce");
		cheerTip=document.getElementById("cheerTip");
		timeImgEl=document.getElementById("timeImg");

		//准备画布画笔
		var canvas = gameConfig.canvas;
		can1 = canvas.can1.el;
		ctx1 = canvas.can1.ctx;
		can2 = canvas.can2.el;
		ctx2 = canvas.can2.ctx;
		can3 = canvas.can3.el;
		ctx3 = canvas.can3.ctx;
		can4 = canvas.can4.el;
		ctx4 = canvas.can4.ctx;

		perspective=Movers.perspective;//透视焦距

		canW=can1.width;//画布宽
		canH=can1.height;//画布高
		canH4=can4.height;

		ctx2.translate(canW*0.5, canH-perspective);//把人物和移动物的绘制原点移动到视线焦点
		ctx3.translate(canW*0.5, canH-perspective);
		ctx4.translate(canW*0.5, canH4-perspective);

		//横幅标语
		cheerTexts = [
			"快快快，不要像个老太太！",
			"加油！加油！加油！",
			"喔，不错哦！",
			"你跑得像风一样快",
			"保持住！胜利就在眼前！"
		];
		cheerTip.innerHTML = cheerTexts[0];

		timeImgs = [
			"../images/time-3.png",
			"../images/time-2.png",
			"../images/time-1.png",
			"../images/time-go.png",
		];
		$(timeImgEl).attr("src", timeImgs[0]);

		//扣分设计
		punishs = [{tip: "-5s", reduceTime: 5000}, {tip: "-3s", reduceTime: 3000}];

		//一次性绘制背景
		drawBackground();

		//生成player
		playerConfig=gameConfig.playerObject[0].config
		player = new Player(playerConfig);
		player.init();

		//添加滑动动作
		touchHandles = touchEventsListeners(player);
		can2.addEventListener("touchstart", touchHandles.touchStart,true);
		can2.addEventListener("touchmove", touchHandles.touchMove,true);
		can2.addEventListener("touchend", touchHandles.touchEnd);

		//倒计时
		$("#guide").on("click",function(){
			$(this).find(".guideImg").hide();
			$(this).find(".timeCount").show();

			setTimeout(timeCounting,1000);
		})
	}else{
		moveObjs.forEach(function(o){
			o.deadAll();
		});
		obstacles.deadAll();

		$("#guide").show();
		$(this).find(".timeCount").show();
		setTimeout(timeCounting, 1000);
	}
	//人物站中间
	player.side = 0;

	// 时间、成绩初始
	timeBar.innerHTML=leftTime;
	distanceBar.innerHTML="0m";
	


	//生成背景移动物体
	moversConfig=gameConfig.moveObjects;
	moversNum = moversConfig.length;
	for(var i=0;i<moversNum-1;i++)
	{
		moveObjs[i] = new Movers(moversConfig[i].config);
		moveObjs[i].init();
	}
	
	//启动循环动画
	requestAnimFrame(gameLoop);
}

function gameLoop()
{
	var now=Date.now();
	deltaTime=now-lastTime;
	lastTime=now;

	if(deltaTime>40) deltaTime=40;


	//擦除画布
	ctx2.clearRect(-0.5*canW,perspective-canH,canW,canH);
	ctx3.clearRect(-0.5*canW,perspective-canH,canW,canH);
	ctx4.clearRect(-0.5*canW,perspective-canH4,canW,canH4);
	
	//监控、绘制移动物体
	for(var i=0;i<moversNum-1;i++)
	{
		moveObjs[i].Monitor();
		moveObjs[i].draw();
	}

	
	if(gogogo)	//游戏正在进行
	{
		//时间、已跑距离
		totleTime+=deltaTime;
		updateTimer+=deltaTime;
		leftTime=primeTime-Math.floor((totleTime+reduceTime)/1000);
		totalDistance=Number((stageDistance+updateTimer/1000*runnerSpd).toFixed(2));	//toFixed返回的结果是字符串，运算时要小心别和数字相加
		
		distanceBar.innerHTML=totalDistance+"m";
		
		if(leftTime<=0)
		{
			leftTime=0;
			timeBar.innerHTML="0";
			console.log("游戏结束");
			gameResultHandler();
			gogogo = false;
			return;	//终止gameLoop
		}else
		{
			timeBar.innerHTML=leftTime;

			//监控障碍物
			obstacles.Monitor();

			//检测碰撞
			obstaclesCollision(obstacles, player, function(typ){
				if(isNaN(Number(typ)) || typeof punishs[typ] === "undefined") return;
		
				reduceTime += punishs[typ].reduceTime;
				reduceTip.innerHTML = punishs[typ].tip;

				$(reduceTip).show();
				setTimeout(function(){
					$(reduceTip).hide()
				},1000);
				
				//下面这段代码放到githun在手机上浏览器会导致整个脚本无法运行，在pc端却可以
				// try{
				// 	punishs.forEach(function(v, i){
				// 		if(i == typ){
							/*碰撞的ui和数据处理代码*/
				// 			throw "collision";
				// 		}
				// 	})
				// }catch(){
				// 	$(reduceTip).show();
				// 	setTimeout(function(){
				// 		$(reduceTip).hide()
				// 	},1000);
				// }
			});

			//随时间提升游戏难度
			if(Movers.primeSpd<=1.2 && updateTimer>3000){
				stageDistance += updateTimer/1000*runnerSpd;
				runnerSpd++;
				updateTimer = 0;
				Movers.primeSpd += 0.07;
				Movers.decrecedInterval = Math.min(Movers.decrecedInterval + 60, 520);
				moveObjs.forEach(function(v){
					v.update();
				});
				obstacles.update();
			}

			//更新横幅标语
			var gameStage = Math.min(Math.floor(totleTime/10000), 4);
			cheerTip.innerHTML = cheerTexts[gameStage];
		}
	}

	//绘制人物
	player.draw(ctx2,40);

	// 把障碍物放到人物之后画		
	if(gogogo){
		obstacles.draw();
	}		

	//循环
	requestAnimationFrame(gameLoop);
	
}

//游戏结果数据处理
function gameResultHandler()
{
	$("#curGrade").html(totalDistance+"米");

	//更新数据
	recordPage.attr("data-upted", "no");

	var _listNum = dataStorage.topList.length;
	var _curListWorst = dataStorage.topList[_listNum-1];
	var _time = +new Date();
	var _total = dataStorage.total + totalDistance;
	var _times = dataStorage.times + 1;
	var _worst = dataStorage.worst;
	var _best = dataStorage.best;
	var insertPositon;

	if(_listNum < 10 || totalDistance>_curListWorst.grade){
		//先找出要插入top10的位置
		if(_listNum === 0) {
			insertPositon = 0;
		}else{
			for(var i=_listNum-1; i>=0; i--){
				if(totalDistance > dataStorage.topList[i].grade){
					if(i>0){
						continue;
					}
					insertPositon = 0;
				}else{
					insertPositon = i+1;
					break;
				}
			}
		}

		dataStorage.topList.splice(insertPositon, 0 , {
			date: _time,
			grade: totalDistance
		});
	}

	dataStorage.total = Number(_total.toFixed(2));
	dataStorage.times = _times;
	(!_worst || (totalDistance < _worst)) && (dataStorage.worst = totalDistance);
	totalDistance > _best && (dataStorage.best = totalDistance);
	dataStorage.topList.length > 10 && dataStorage.topList.splice(10);
	
	console.log(dataStorage);

	storageFuncs.setItem({
		key: "myH5RunningGame",
		value: dataStorage
	})

	//首页的查看记录按钮
	cover.find(".recordBtn").show();

	//显示弹框
	endTipBg.show();
	setTimeout(function(){
		endTipBg.find(".tipBox").removeClass('hideBox');
	}, 10);
}

//绘制不需要循环的游戏背景
function drawBackground()
{
	var bgPic1 = new Image(),
	    bgPic2 = new Image();

	bgPic1.onload=function()
	{
		ctx1.drawImage(bgPic1, 0, 0);
		bgPic2.src = gameConfig.background[0].config.picSource[1];
	}

	bgPic2.onload=function()
	{
		ctx1.drawImage(bgPic2, 0, 149);
	}

	bgPic1.src = gameConfig.background[0].config.picSource[0];
}



//倒计时
function timeCounting(){
	timeCount++;
	if(timeCount<4)
	{
		switch (timeCount)
		{
			case 1:
				timeImg="../images/time-2.png";
				break;
			case 2:
				timeImg="../images/time-1.png";
				break;
			case 3:
				timeImg="../images/time-go.png";
				break;
		}
		$(timeImgEl).attr("src",timeImgs[timeCount]);
		setTimeout(timeCounting, 1000);
	}
	else
	{
		gogogo=true;
		obstacles = new Movers(moversConfig[moversNum-1].config);
		obstacles.init();
		$("#guide").css("display","none");
	}
}

//日起对象转为时间字符格式
function makeTimeStr(t){
    var year = t.getFullYear();
    var month = t.getMonth() + 1;
    var date = t.getDate();
    var strT = "" + year + "/" + month + "/" + date + " ";
    var h = t.getHours();
    var m = t.getMinutes();
    m = m < 10 ? "0" + m : "" + m;
    var s = t.getSeconds();
    s = s < 10 ? "0" + s : "" + s;
    strT += h + ":" + m + ":" + s;
    return strT;
}

function openGame(){
	if(gameLoaded){
		$("#game").show();
		gameInit();
	}else{
		gameLoaded = true;
		$("#loadingPage").show();
		enterTheGame();
	}
}

$(function(){
	//游戏说明
	$("#guidTipsBtn").on("click", function(){
		$("#guidTipsBox").toggleClass('hideBox');
	})
	$(".closeTipBtn").on("click", function(){
		$(this).parent(".tipBoxBg").hide();
		$(this).parent(".tipBox").addClass('hideBox');
	})

	//背景音乐
	bindBgm("#bgmBtn");

	//绑定查看历史记录
	cover.on("click", ".recordBtn", function(){
		cover.find(".tipBox").addClass('hideBox');
		showRecordFrom("#cover");
	});

	//获取历史记录
	storageFuncs = myLocalStorage();
	if(storageFuncs.isSupportLs){	//支持本地存储
		dataStorage = storageFuncs.getItem("myH5RunningGame");
		if(dataStorage){
			cover.find(".recordBtn").show();
		}else{
			dataStorage = {
				topList: [],
				total: 0,
				times: 0,
				best: 0,
				worst: 0
			}
		}
		console.log(dataStorage);
	}
	

	//开始游戏
	cover.on("click", ".runningBtn", function(){
		cover.hide();
		cover.find('.tipBox').addClass('hideBox');
		openGame()
	});

	recordPage.on("click", ".goPlay", function(){
		recordPage.hide();
		openGame()
	});

	recordPage.on("click", ".goBack", function(){
		recordPage.hide();
		cover.show();
	})
})

