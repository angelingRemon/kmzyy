import SockJS from "sockjs-client";
// import Stomp from "stompjs";

!function(e,option){
    if("object" == typeof exports && "undefined" != typeof module){
        module.exports = option();
    }else{
        if("function" == typeof define && define.amd){
            define(option);
        }else{
            (e = e || self).ZIM = option()
        }
    }
}(this,(function(){
    var e = {
            SDK_READY: "sdkStateReady",
            SDK_NOT_READY: "sdkStateNotReady",
            SDK_DESTROY: "sdkDestroy",
            MESSAGE_RECEIVED: "onMessageReceived",
            MESSAGE_REVOKED: "onMessageRevoked", //消息撤销
            CONVERSATION_LIST_UPDATED: "onConversationListUpdated",//当前会话列表
            GROUP_LIST_UPDATED: "onGroupListUpdated",
            GROUP_SYSTEM_NOTICE_RECEIVED: "receiveGroupSystemNotice",
            PROFILE_UPDATED: "onProfileUpdated",
            BLACKLIST_UPDATED: "blacklistUpdated",
            KICKED_OUT: "kickedOut",
            ERROR: "error"
        };
    let _class = function(){};
    let _zim = function(){};
    let ctx = "",url,stompClient,socket
        , eventThis = {}
        ,self = new _class()
        ,zim = new _zim();
    self.EVENT = e;
    let guid =function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).replace(/\-/g,"");
    };
    //将会话消息处理成接收消息
    let handleSessionMsg2MsgObj = function(sessionMsg){
        return {
            sid:sessionMsg.sessionId,
            id:sessionMsg.lastMsgId,
            fromAccount:sessionMsg.fromAccount,
            toAccount:sessionMsg.toAccount,
            msgTimeStamp:sessionMsg.msgTimeStamp,
            msgBody:sessionMsg.lastMsg,
            type:sessionMsg.type
        };
    };
	let sockHandleIndex;
    //创建websocket连接
    let socketConn = function(){
        if(stompClient){
            stompClient.disconnect();
            stompClient = undefined
        }
        socket = new SockJS(ctx + url + "?appToken=" + uni.getStorageSync("token"),undefined,{transports:"websocket",timeout:10000});
        stompClient = Stomp.over(socket);
        stompClient.heartbeat.outgoing = 10000; // 客户端不发送
        stompClient.heartbeat.incoming = 10000;     // 客户端每5s接收一次数据从服务器

        stompClient.connect({}, function (frame) {
            zim.isConnect = true;
            zim.trigger(e.SDK_READY,frame);
            //监听更新用户会话列表
            stompClient.subscribe("/user/queue/consession", function (message) {
                let sessionMsg = JSON.parse(message.body);
                let newMsg = handleSessionMsg2MsgObj(sessionMsg);
                zim.trigger(e.MESSAGE_RECEIVED,newMsg);
                zim.trigger(e.CONVERSATION_LIST_UPDATED,sessionMsg);
            });
        },function(e){
            stompClient.disconnect();
			clearTimeout(sockHandleIndex);
            sockHandleIndex = setTimeout(function(){socketConn();clearTimeout(sockHandleIndex);},3000);
            zim.isConnect = false;
            zim.trigger(e.ERROR,e);
            console.error("stomp连接失败",e);
        });
    };
    zim.socketConn = function(){
        socketConn();
    };
    zim.disconnect = function(){
        stompClient.disconnect();
    };
    self.create = function(option){
        (option.basePath !=undefined )&&(ctx = option.basePath);
        url = option.url;
        socketConn();
        return zim;
    };

    // 创建后的实例
    //创建触发事件
    zim.trigger = function(eventName){
        var params = arguments.length>1 ? Array.prototype.slice.call(arguments,1) :[];
        var _this = eventThis[eventName+"_this"];
        if(this[eventName]){
            Array.prototype.forEach.call(this[eventName],function(arg,i){
                var eventSelf = (_this[i])?_this[i]:zim;
                arg.apply(eventSelf,params);
            });
        }
    };
    //创建事件接听
    zim.on = function(eventName, callback,_this){
        this[eventName] = this[eventName] || new Array();
        eventThis[eventName+"_this"] = eventThis[eventName+"_this"] || new Array();
        this[eventName].push(callback);
        _this ? eventThis[eventName+"_this"].push(_this):eventThis[eventName+"_this"].push(zim);
    };
    zim.off = function(eventName){
        this[eventName] = this[eventName] || new Array();
        eventThis[eventName+"_this"] = eventThis[eventName+"_this"] || new Array();
        this[eventName].pop();
        eventThis[eventName+"_this"].pop();
    };

    //获取监听当前会话聊天消息
    zim.messageReceived = function(conversationId){
        new Promise((resolve, reject) => {
            let subscription =  stompClient.subscribe("/topic/"+conversationId,function (message) {
                console.log("群组消息：",message);
                resolve(message,subscription)
            })
        });
    };
    //获取用户信息
    zim.getMyProfile = function(){
        return uni.$http.post("/nonlogin/openim/getzim_userinfo");
    };
    //设置消息已读
    zim.setMessageRead = function(){

    };
    //获取当前点击的会话信息
    zim.getConversationProfile = function(conversationID){
        return uni.$http.post("/nonlogin/openim/getroammsg",{conversationID:conversationID});
    };
    //通过获取消息列表
    zim.getMessageList = function(param){
        return uni.$http.post("/nonlogin/openim/getmessagelist",param);
    };
    let handleSendMessage = function(message){
        return {
            id:message.id,
            fromAccount:message.fromAccount,
            toAccount:message.toAccount,
            type:message.type,
            msgTimeStamp: message.msgTimeStamp,
            msgBody:message.msgBody
        }
    };
    // 发送消息
    zim.sendMessage = function(message){
        if(message){
            let sendIndex = setInterval(()=>{
                if(message.status == 'upSend'){
                    message.status = 'unSend';//正在发送或上传
                    let sendMsg = handleSendMessage(message);
                    stompClient.send("/app/sendMsg",{toId:sendMsg.toAccount,type:sendMsg.type},JSON.stringify(sendMsg));
                    message.status = "success";
                    clearInterval(sendIndex);
                }else if(message.status != "unSend"){
                    clearInterval(sendIndex);
                }
            },500);

        }else{
            console.error("消息体不能为空");
        }

    };
    zim.createTextMessage = function(param){
        let msgTime = Math.floor(new Date().getTime()/1000);
        return  {
            id:"tmp_"+guid(),
            fromAccount:param.from,
            toAccount:param.to,
            type:param.type,
            msgTimeStamp: msgTime,
            msgBody:[{
                "MsgType": "TIMTextElem",
                "MsgContent": {
                    "Text": param.content
                }
            }],
            status:"upSend"//表示开始发送
        };
    };
    let _createImageMessage = function (param) {
        let msgTime = Math.floor(new Date().getTime()/1000);
        let message  =  {
            id:"tmp_"+guid(),
            fromAccount:param.from,
            toAccount:param.to,
            type:param.type,
            msgTimeStamp: msgTime,
            msgBody:[{
                "MsgType": "TIMImageElem",
                "ImageInfoArray": [
                    {
                        "Type": 1,           //原图
                        "URL": param.content.tempFiles[0].path
                    }
                ]
            }],
            status:"unSend"//表示开始发送
        };
        //开始上传图片
        let uploadImg = uni.$http.uploadFile({
            url: '/nonlogin/openim/fileupload/uploadImageFile', //仅为示例，非真实的接口地址
            filePath: message.msgBody[0].ImageInfoArray[0].URL,
            name: 'file',
            fileType: 'image',
            success: (uploadFileRes) => {
                let resultData = JSON.parse(uploadFileRes.data);
                if(resultData.code === 0){
                    message.msgBody[0].ImageInfoArray[0].URL = resultData.data.src;
                    message.status = "upSend";
                }else{
                    message.status = "fail";
                }
            },
            fail:err=>{
                message.status = "fail";
            }
        });
        (typeof(param.onProgress) === "function")&&(uploadImg.onProgressUpdate(param.onProgress));

        return message;
    };
    zim.createImageMessage = function (param){
        return new _createImageMessage(param);
    };

    return self;
}));