/*
 * 定义一个函数，用来获取指定元素的当前的样式
 * 参数：
 * 		obj 要获取样式的元素
 * 		name 要获取的样式名
 */

function getStyle(obj,name){
    if(window.getComputedStyle){
        return getComputedStyle(obj,null)[name];
    }else{
        return obj.currentStyle[name];
    }
}

/*
 * 创建一个可以执行简单动画的函数
 * 参数：
 * 	obj:要执行动画的对象
 * 	attr:要执行动画的样式，比如：left top width height
 * 	target:执行动画的目标位置
 * 	speed:移动的速度(正数向右移动，负数向左移动)
 *  callback:回调函数，这个函数将会在动画执行完毕以后执行
 */


function move(obj, attr, target, speed, callback) {
    clearInterval(obj.timer);
    //目标当前位置
    var current = parseInt(getStyle(obj, attr));
    if (current>target){
        // 判断速度的正负值
        // 如果从0 向 800移动，则speed为正
        // 如果从800向0移动，则speed为负
        speed=-speed;
    }

    obj.timer=setInterval(function (){
        // 获取box1的原来的left值
        var oldValue = parseInt(getStyle(obj, attr));
        // 在旧值的基础上增加
        var newValue = oldValue + speed;
        // 判断newValue是否大于800
        // 从800 向 0移动
        // 向左移动时，需要判断newValue是否小于target
        // 向右移动时，需要判断newValue是否大于target
        if ((speed < 0 && newValue < target) || (speed > 0 && newValue > target)) {
            newValue = target;
        }
        obj.style[attr] = newValue + "px";

        // 当元素移动到0px时，使其停止执行动画
        if (newValue === target) {
            // 达到目标，关闭定时器
            clearInterval(obj.timer);
            // 动画执行完毕，调用回调函数
            callback && callback();
        }
    },30)
}

/*
 * 定义一个函数，用来向一个元素中添加指定的class属性值
 * 参数:
 * 	obj 要添加class属性的元素
 *  cn 要添加的class值
 */
function addClass(obj, cn) {
    // 检查obj中是否含有cn
    if (!hasClass(obj, cn)) {
        obj.className += " " + cn;
    }
}

/*
 * 判断一个元素中是否含有指定的class属性值，
 * 	如果有该class，则返回true，没有则返回false。
 */
function hasClass(obj, cn) {
    // 判断obj中有没有cn class
    // 创建一个正则表达式
    var reg = new RegExp("\\b" + cn + "\\b");
    return reg.test(obj.className);
}

/*
 * 删除一个元素中的指定的class属性
 */
function removeClass(obj, cn) {
    // 创建一个正则表达式
    var reg = new RegExp("\\b" + cn + "\\b");
    // 删除class
    obj.className = obj.className.replace(reg, "");
}

/*
 * toggleClass可以用来切换一个类
 * 	如果元素中具有该类，则删除
 * 	如果元素中没有该类，则添加
 */
function toggleClass(obj, cn) {
    //判断obj中是否含有cn
    if (hasClass(obj, cn)) {
        //有，则删除
        removeClass(obj, cn);
    } else {
        //没有，则添加
        addClass(obj, cn);
    }
}


window.onload = function() {
    // 获取图片列表
    var imgList = document.getElementById("img-list");
    // 获取页面中所有的img标签
    var imgArr = document.getElementsByTagName("img");
    // 设置imgList的宽度
    imgList.style.width = 520 * imgArr.length + "px";

    // 设置导航按钮居中
    // 获取导航按钮
    var navBtns = document.getElementById("nav-btns");
    // 获取outer
    var outer = document.getElementById("outer");
    // 设置navBtns的left值
    navBtns.style.left = (outer.offsetWidth - navBtns.offsetWidth) / 2 + "px";

    // 默认显示图片的索引
    var index = 0;
    // 获取所有的a
    var allA = document.getElementsByTagName("a");
    // 设置默认选中的效果
    allA[index].style.backgroundColor = "black";

    /*
     *	点击超链接切换到指定的图片
     *		点击第一个超链接，显示第一个图片
     *		点击第二个超链接，显示第二个图片
     * */

// 为所有的超链接都绑定单击响应函数
    for (var i = 0; i < allA.length; i++) {
        // 为每一个超链接都添加一个num属性
        allA[i].num = i;

        // 为超链接绑定单击响应函数
        allA[i].onclick = function() {
            // 关闭自动切换的定时器
            clearInterval(timer);

            // 获取点击超链接的索引,并将其设置为index
            index = this.num;

            // 设置选中的a
            setA();

            // 使用move函数来切换图片
            move(imgList, "left", -520 * index, 20, function() {
                // 动画执行完毕，开启自动切换
                autoChange();
            });
        };
    }
    // 开启自动切换图片
    autoChange();

    // 设置选中的a
    function setA() {
        // 判断当前索引是否是最后一张图片
        if (index >= imgArr.length - 1) {
            // 则将index设置为0
            index = 0;

            // 此时显示的最后一张图片，而最后一张图片和第一张是一摸一样
            // 通过CSS将最后一张切换成第一张
            imgList.style.left = 0;
        }

        // 遍历所有a，并将它们的背景颜色设置为红色
        for (var i = 0; i < allA.length; i++) {
            allA[i].style.backgroundColor = "";
        }

        // 将选中的a设置为黑色
        allA[index].style.backgroundColor = "black";
    }

    // 定义一个自动切换的定时器的标识
    var timer;
    // 创建一个函数，用来开启自动切换图片
    function autoChange() {
        // 开启一个定时器，用来定时去切换图片
        timer = setInterval(function() {
            // 使索引自增
            index++;

            // 判断index的值
            index %= imgArr.length;

            // 执行动画，切换图片
            move(imgList, "left", -520 * index, 20, function() {
                // 修改导航按钮
                setA();
            });
        }, 3000);
    }

};