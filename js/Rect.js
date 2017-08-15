/**
 * Created by Administrator on 2016/4/23.
 */

var contentwidth = parseInt($("#gameView").width());

function Rect(n,color,color_dif){
    createjs.Shape.call(this);  //表示针对shape对象进行操作，可以使用create shape中的设置方法
    this.setRectType = function(type){
        this._RecType = type;
        switch (type){
            case 1:
                this.setColor(color);
                break;
            case 2:
                this.setColor(color_dif);
                break;
        }
    }
    this.setColor = function(colorString){
        this.graphics.beginFill(colorString);
        this.graphics.drawRect(0,0,contentwidth/n-3,contentwidth/n-3);
        this.graphics.endFill();
    }
    this.getRectType = function(){
        return this._RecType;  //返回颜色标志位
    }
    this.setRectType(1);
}

Rect.prototype = new createjs.Shape();