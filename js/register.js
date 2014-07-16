/**
 * Created by creditease on 2014/7/7.
 */
(function () {

    'use strict';
    var submitBock = $(".formBlock"),
        submitBockOne = document.querySelector(".formBlock"),
        iphoneNumberValue = document.querySelector(".iphoneNumber"),
        mgCodeSpan = $(".message"),
        mgCodeValue = document.querySelector(".codeTextOne"),
        psswordValue = document.querySelector(".password"),
        ischecked = document.querySelector(".ischecked"),
        imgCodeSpan = $(".imgCode"),
        errorText = $("#error_trips"),
        imgCodeValue = document.querySelector(".codeTextTwo"),
        bodys = document.querySelector("body"),
        closeSpan = $("span.left"),
        finalRegister =document.querySelector(".finalRegister"),
        timeOut = 60;
//        is_hide = true;

    //判断事件
    var errorTextConfig = {
        iphone: {
            empty: "手机号码不能为空！",
            errorRule: "手机号码不符合规则！"
        },
        password: {
            empty: "密码不能为空！",
            errorRule: "密码长度应在6-16之间！"
        },
        imgCode: {
            empty: "图片验证码不能为空！",
            errorRule: "图片验证码错误！"
        },
        mgCode: {
            empty: "短信验证码不能为空！",
            errorRule: "短信验证码错误！"
        },
        checked: {
            errorRule: "请确认是否同意该条款！"
        }
    };
//    密码长度的控制
    var pwd = {
        minLength: 6,
        maxLength: 16
    };

    function changeText() {
        var time = setInterval(function () {
            mgCodeSpan.text(timeOut + "s后重发");
            timeOut = timeOut - 1;
            if (timeOut < 0) {
                clearInterval(time);
                mgCodeSpan.text("重新发送");
            }
        }, 1000);
    }


    //重新短信获取验证码
    function getSmsCodeAgain(mobile) {
        $.ajax({
            url: "{:U('WebCard/ajaxGetCode')}",
            data: {"mobile": mobile},
            dataType: 'json',
            type: 'post',
            success: function (obj) {
                //获取短信验证码失败
                if(failed){
                    getMessageCodeFail();
                }
                //获取短信验证码成功
                if(success){
                    getMessageCodeSuccess();
                }
            }
        });
    }

    //发送短信失败
    function getMessageCodeFail() {
           var tripswindowThree = document.querySelector(".tripswindowThree"),
               top = document.querySelector(".top");
        tripswindowThree.style.display = "block";
        top.style.display ="block";

    }
    //发送短信成功
    function getMessageCodeSuccess(){
        var tripswindowOne = document.querySelector(".tripswindowOne"),
            top = document.querySelector(".top");
        tripswindowOne.style.display ="block";
        top.style.display ="block";
        changeText();
    }
    //注册成功
    function registerSuccess(){
        var tripswindowSecond = document.querySelector(".tripswindowSecond"),
            top = document.querySelector(".top");
        tripswindowSecond.style.display ="block";
        top.style.display ="block";
    }
    //发送验证码
    mgCodeSpan.on("click", function () {
        if (timeOut <= 0) {
            timeOut = 60;
            changeText();
            getSmsCodeAgain('{$post.userName}');
        }
    });

    //刷新图形验证码
    imgCodeSpan.on('click', function () {
        $.ajax({
            url: "xx",
            data: {"xx": "xx"},
            dataType: 'json',
            type: 'post',
            success: function (data) {
                imgCodeSpan.attr("src", data.url);
            }
        });
    });


    //提交表单
    submitBock.on("submit", function (e) {
        var errorArray = new Array();
        errorArray[0] = new Array();
        errorArray[1] = new Array();
        e.preventDefault();
        var iphoneValue = iphoneNumberValue.value.trim(),
//            mgCodeValueText = mgCodeValue.value,
            passwordValueText = psswordValue.value,
            imgValueText = imgCodeValue.value.trim();
        if (iphoneValue.length === 0) {
            errorArray[0].push(iphoneNumberValue);
            errorArray[1].push(errorTextConfig.iphone.empty);
        }
        else if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(iphoneValue)) || (iphoneValue.length > 0 && iphoneValue.length !== 11 )) {
            iphoneNumberValue.focus();
            errorArray[0].push(iphoneNumberValue);
            errorArray[1].push(errorTextConfig.iphone.errorRule);
        }
        if (passwordValueText === "") {
            errorArray[0].push(psswordValue);
            errorArray[1].push(errorTextConfig.password.empty);
        }

        else if (passwordValueText.length < pwd.minLength || passwordValueText.length > pwd.maxLength) {
            errorArray[0].push(psswordValue);
            errorArray[1].push(errorTextConfig.password.errorRule);
        }
        if (imgValueText === '') {
            errorArray[0].push(imgCodeValue);
            errorArray[1].push(errorTextConfig.imgCode.empty)
        }
        if (ischecked.checked === false) {
            errorArray[0].push(ischecked);
            errorArray[1].push(errorTextConfig.checked.errorRule);
        }
        var i = 0, length = errorArray[0].length,
            erroTexts = "";
        for (i; i < length; i = i + 1) {
            errorArray[0][0].focus();
            errorArray[0][i].classList.add("focusError");
            erroTexts += errorArray[1][i];
        }
        errorText.text(erroTexts);

        if (length > 0) {
            e.preventDefault();
        }
        //表单通过时，提交服务端
        else {
            window.scrollTo(0, 0);
            bodys.scrollTop = 0;
            $.ajax({
                url: "url",
                data: {},
                dataType: 'json',
                type: 'post',
                success: function (obj) {
                    //成功后发送短信
                    if(success) {
                        getSmsCodeAgain();
                    }
                }
            });

        }
    });


    submitBockOne.addEventListener("focus", function (e) {
        var atrributeDataVal = e.target.getAttribute("data-value");

        e.target.classList.add("focus");

        if (atrributeDataVal === "passwordValue" || atrributeDataVal === "iphone") {
            e.target.classList.add("focusError");
        }
        if (atrributeDataVal === "passwordValue") {
            e.target.setAttribute("type", "password");
        }
        if (e.target.getAttribute("type") === 'submit') {
            e.target.classList.remove("focus");
        }
    }, true);
    submitBockOne.addEventListener("blur", function (e) {
        e.target.classList.remove('focusError');
        e.target.classList.remove('focus');
        if (e.target.getAttribute("data-value") === "passwordValue") {
            if (e.target.value === "") {
                e.target.setAttribute("type", "text");
            }
        }
    }, true);

    //展开验证码
    iphoneNumberValue.addEventListener('input', function (e) {
        var iphoneValue = iphoneNumberValue.value.trim();
        if ((/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(iphoneValue)) && iphoneValue.length === 11) {
            this.classList.remove('focusError');
            //判断密码是否为空，
            if (psswordValue.value === "") {
                psswordValue.focus();
            }
            else if ((psswordValue.value.length >= pwd.minLength) && (psswordValue.value.length <= pwd.minLength) && imgCodeValue.value.trim() === "") {
                imgCodeValue.focus();
            }
        }
    });

    psswordValue.addEventListener("keyup", function (e) {
        var pwdLength = psswordValue.value.length;
        if (pwdLength >= pwd.minLength && pwdLength <= pwd.maxLength) {
            this.classList.remove("focusError");
        }
        else {
            this.classList.add("focusError");
        }
    });

    //关闭按钮
    closeSpan.on("tap",function(){
        closeSpan.css({display:"none"});
        $(".top").css({display:"none"});
    });

    // 提交短信验证码
    finalRegister.addEventListener("touchstart",function(){
        var messgCode = mgCodeValue.value.trim(),
           errors = $(".error");
        if(messgCode===""){
            errors.text(errorTextConfig.mgCode.empty);
        }
        else{
            $.ajax({
                url: "url",
                data: {},
                dataType: 'json',
                type: 'post',
                success: function (obj) {
                      //提交短信成功
                    if(sucess){
                        var second = document.querySelector(".tripswindowOne");
                        second.style.display ="none";
                        registerSuccess();
                    }
                    //验证码不对
                    if(error){
                        errors.text(error.mgg);
                    }
                }
            });
        }
    });

    //按下的效果图
    window.addEventListener("touchstart", function (e) {
        var values = e.changedTouches[0].target.getAttribute('data-value');
        if (values === 'telphone') {
            e.changedTouches[0].target.src = 'image/hover.png';
        }
        if (values === 'zhuce') {
            e.changedTouches[0].target.classList.add("registerTouch");
        }
    });
    window.addEventListener("touchend", function (e) {
        var values = e.changedTouches[0].target.getAttribute('data-value');
        if (values === 'telphone') {
            e.changedTouches[0].target.src = 'image/current.png';
        }
        if (values === 'zhuce') {
            e.changedTouches[0].target.classList.remove("registerTouch");
        }

    });


}());
//注册成功后的提交表单
(function () {
    'use strict';
    var closeWidth = window.innerWidth,
        bodys = document.querySelector(".content"),
        closeHeight = bodys.clientHeight,
        closeWindow = document.querySelector(".top"),
        tripswindow = document.querySelectorAll(".tripswindow");
    for (var i = 0; i < tripswindow.length; i += 1) {
        tripswindow[i].style.marginTop = window.innerHeight * 0.45 + 'px';
    }
    closeWindow.style.width = closeWidth + 'px';
    closeWindow.style.height = closeHeight + 'px';
    closeWindow.addEventListener("touchmove", function (e) {
        e.preventDefault();
    });
}());