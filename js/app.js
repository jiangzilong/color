/**
 * Created by Administrator on 2016/4/23.
 */


//十六进制颜色值域RGB格式颜色值之间的相互转换

//-------------------------------------
//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function(){
    var that = this;
    if(/^(rgb|RGB)/.test(that)){
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            var hex = Number(aColor[i]).toString(16);
            if (hex.length == 1) {
                hex = "0" + hex;
            } //问题出在这里
            if(hex === "0"){
                hex += hex;
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = that;
        }
        return strHex;
    }else if(reg.test(that)){
        var aNum = that.replace(/#/,"").split("");
        if(aNum.length === 6){
            return that;
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return that;
    }
};

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function(){
    var sColor = this.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return sColorChange.join(",") ;
    }else{
        return sColor;
    }
};



var stage = new createjs.Stage("gameView");
var gameView = new createjs.Container();
stage.addChild(gameView);

createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick",stage);


var set;
var clickflag=0;
var mod;

var n=2;
var span=120;  //颜色跨度
var score=0;   //得分
var timeleft = 60;   //剩余时间
var score_per = 1;   //单次计分
var score_del=0;   //失误单次扣分
var contentwidth = parseInt($("#gameView").width());  //canvas大小

$(function () {
    $("#end").hide();
    $("#pause").hide();
    findmod();
    //alert(typeof(mod));
    count();
    switch (mod){
        case "1":{
            time();
            break;
        }
        case "2":{
            n=7;
            span=60;
            score_per = 2;
            time();
            break;
        }
        case "3":{
            $(".time_area").remove();
            score_del=1;
            break;
        }
    }
    //响应屏幕大小
    if(screen.width<350){
        $("#gameView").width(280);
        $("#gameView").height(280);
        $(".time_area").css("left","38%");
    }
    else if(screen.width>1000){
        $("#gameView").width(500);
        $("#gameView").height(500);
        $(".time_area").css("left","46%");
    }
    else if(screen.width>700){
        $("#gameView").width(600);
        $("#gameView").height(600);
        $(".time_area").css("left","43%");
    }
    else if(screen.width>500){
        $("#gameView").width(400);
        $("#gameView").height(400);
        $(".time_area").css("left","42%");
    }

    addRect();
});


//提取模式编号
function findmod(){
    var urlinfo = window.location.href;
    //var urlinfo = "***/index.html?mod=1";
    var offset = urlinfo.indexOf("?");
    var d = urlinfo.substr(offset);
    mod = d.split("=")[1];
}

//倒计时控件
function time() {
    document.getElementById("time").innerHTML = timeleft;
    timeleft--;
    set=setTimeout(time,1000);
    if(timeleft == -1 ){
        clearTimeout(set);
        $("#btn_pause").removeAttr("onclick");
        $("#end_score").text(score);
        if(score>=20) {
            if(score>=50) {
                $("#end_descrip").text("你是哪个天宫飞来的仙女！");
            }
            else if(score>=35) {
                $("#end_descrip").text("骄傲吧，共产主义接班人！");
            }
            else{
                $("#end_descrip").text("很有潜质，加油！");
            }
            $("#image").attr('src',"img/high/high_"+Math.round(Math.random()*16+1)+".jpg");
        }
        else {
            $("#end_descrip").text("认真点，小朋友！");
            $("#image").attr('src',"img/low/low_"+Math.round(Math.random()*21+1)+".jpg");
        }
        $("#end").fadeIn(300);
    }
}

//暂停
function pause() {
    if(clickflag==0){
        if(mod!="3") clearTimeout(set);
        //document.getElementById('cover').style.backgroundColor = "rgba(0,0,0,0.3)";
        //document.getElementById('cover').style.zIndex = "10";
        $("#pause").fadeIn(300);
        clickflag=1;
    }
    else{
        if(mod!="3") time();
        //document.getElementById('cover').style.backgroundColor = "rgba(0,0,0,0)";
        //document.getElementById('cover').style.zIndex = "0";
        //$("#pause").hide();
        $("#pause").fadeOut(300);
        clickflag=0;
    }
}

//添加色块
function addRect(){
    document.getElementById("score").innerText=score;
    var cl = [parseInt(Math.random()*255),parseInt(Math.random()*255),parseInt(Math.random()*255)];
    var cl_str="rgb("+cl[0]+","+cl[1]+","+cl[2]+")";
    var color = cl_str.colorHex();

    var color_dif = different_color(cl,span);
    console.log(cl+","+color+","+color_dif);
    var x = parseInt(Math.random()*n);
    var y = parseInt(Math.random()*n);
    for(var indexX= 0;indexX<n;indexX++){
        for(var indexY=0;indexY<n;indexY++){
            var rect=new Rect(n,color,color_dif);
            gameView.addChild(rect);
            if(indexX==x && indexY==y){
                rect.setRectType(2);
                rect.addEventListener("click",function(){
                    score+=score_per;
                    if(span>90) span-=5;
                    else if(span>60) span-=3;
                    else if(span>30) span-=2;
                    else if(span>10) span-=1;
                    console.log(span);

                    if(n<7){
                        ++n;
                    }
                    gameView.removeAllChildren();
                    addRect();
                })
            }
            else{
                rect.addEventListener("click",function(){
                    score-=score_del;
                    if(score<0){
                        $("#image").attr('src',"img/wrong/wrong_"+Math.round(Math.random()*25+1)+".jpg");
                        $("#end").fadeIn(300);
                    }
                    else document.getElementById("score").innerText=score;
                })
            }
            rect.x = indexX*(contentwidth/n);
            rect.y = indexY*(contentwidth/n);
        }
    }
}

//返回差值颜色
function different_color(cl,span){
    //var rgb = color.colorRgb();
    //var rgbnum=[parseInt(rgb.split(",")[0]),parseInt(rgb.split(",")[1]),parseInt(rgb.split(",")[2])];
    var rgbnum=cl;
    var m_index=rgbnum.indexOf(Math.max.apply(Math, rgbnum));

    rgbnum[m_index]=(rgbnum[m_index]-span)>0?(rgbnum[m_index]-span):(rgbnum[m_index]+span);
    var rgbstring="rgb("+rgbnum[0]+","+rgbnum[1]+","+rgbnum[2]+")";
    return rgbstring.colorHex();

}

//用户流量统计
function count(){
    $.ajax({
        type: 'get',
        url: "servlet/request?method=count",
        data:{mod:mod},
        dataType: 'text',
        success: function (msg) {
            console.log(msg);
        },
        error: function () {

        }
    });
}

