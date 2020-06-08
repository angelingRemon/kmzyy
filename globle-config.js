let _appInfoTmp = "";
//获取app信息
function getAppInfo(){
	(!_appInfoTmp)&&(_appInfoTmp = uni.getSystemInfoSync());
	return _appInfoTmp;
}
const GlobleEVENT = {
	CHANGE_TOKEN:"changeToken",
	CREATE_ZIM:"createZim"
};
let eventThis = {},eventNames={};
export default {
	EVENT:GlobleEVENT,
	loginType: "WEIXIN", //WEIXIN 、XIAOCX 、APP 三种登陆方式（通过不同类型来执行不同的内容）
	basePath: "",
	imgHtmlPath: "",
	//开发使用，生产请注释
	/* basePath: "/zksv",
	imgHtmlPath: "/../zksv", */
	appInfo: getAppInfo(),
	partnerKey:"hfsidhqnvaxoqndkjpasfj1134nklas",
	token:(uni.getStorageSync("token") || undefined),
	maxPatient:5,//最大添加就诊人数量
	errorTip:"网络异常，请稍后重试！",
	noCheckToken:true,
	saveToken(token){
		//开发使用，生产请注释
		//token = "c51b38c2f6a3bee5de939a5fc56eb3e9";
		token && (this.token = token,uni.setStorageSync("token", token));
		this.trigger(GlobleEVENT.CREATE_ZIM)
	},
	isLogin:false,//登录状态
	userInfo: (uni.getStorageSync("userInfo") || undefined),
	resultCode: {
		success: 0,
		error: 500,
		loginfail: 1001
	},
	resetUserInfo(userInfo){
		this.userInfo = userInfo;
		uni.setStorageSync("userInfo", userInfo);
	},
	on:function(eventName, callback,_this){
		let self = this;
		eventNames[eventName] = eventNames[eventName] || new Array();
		eventNames[eventName].push(callback);
		eventThis[eventName+"_this"] = eventThis[eventName+"_this"] || new Array();
		if(_this!==undefined){
			eventThis[eventName+"_this"].push(_this);
		}else{
			eventThis[eventName+"_this"].push(self);
		}
	},
	trigger:function(eventName){
		let params = arguments.length>1 ? Array.prototype.slice.call(arguments,1) :[];
		let _this = eventThis[eventName+"_this"];
		let self = this;
		if(eventNames[eventName]){
			Array.prototype.forEach.call(eventNames[eventName],function(arg,i){
				var eventSelf = (_this[i])?_this[i]:self;
				arg.apply(eventSelf,params);
			});
		}
	},
	off:function(eventName){
		eventNames[eventName] = eventNames[eventName] || new Array();
		eventThis[eventName+"_this"] = eventThis[eventName+"_this"] || new Array();
		eventNames[eventName].pop();
		eventThis[eventName+"_this"].pop();
	}
}
