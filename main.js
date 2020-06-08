import Vue from 'vue'
import App from './App'
import store from './store'
import globle from '@/globle-config'
import api from '@/api-config'
import utils from './common/js/utils.js'
import http from '@/common/vmeitime-http/'
import graceChecker from './common/js/graceChecker.js'
import moment from './common/js/moment-with-locales.min.js'
import wx from 'jweixin-module'
import ZIM from '@/common/zim-sdk/zim-sdk.js'


Vue.config.productionTip = false
Vue.config.devtools = true

Vue.prototype.$store = store;
Vue.prototype.$utils = utils;
Vue.prototype.$graceChecker = graceChecker;
Vue.prototype.$moment = moment;
Vue.prototype.$wx = wx;
uni.$wx = wx;
uni.$moment = moment;
uni.$globle = globle;
uni.$http = http;
uni.ZIM = ZIM;

let initZim = ()=>{
	const zim = ZIM.create({
		basePath: globle.basePath,
		url:'/wxunbind_imws',
	});
	uni.$zim = zim;
	zim.on(ZIM.EVENT.SDK_READY,function(event){
		//查询im用户信息
		zim.getMyProfile().then(res=>{
			if(res.data.code === 0){
				store.commit('updateMyInfo', res.data.data);
			}
			console.log("zim当前用户信息：",res);
		});
		console.log(event);
		console.log(this);
	});
	zim.on(ZIM.EVENT.MESSAGE_RECEIVED,function (message) {
		store.dispatch('onMessageEvent', message)
	});
};
globle.on(globle.EVENT.CREATE_ZIM,initZim);


let isLoginFail = true
//请求拦截器
http.interceptor.request = (cfg => {
	//默认检查token,请求拦截
	if(!cfg.noCheckToken && !(cfg.header||{}).appToken){
		utils.skipPage("redirectTo",api.sp.login);
		cfg.noAjax = true;
	}
	return cfg;
});
//请响应了拦截器
http.interceptor.response = (resp => {
	if (resp.statusCode==200 && resp.data.code == globle.resultCode.loginfail && isLoginFail) {
		//app 执行以下代码
		// #ifdef APP-PLUS
		isLoginFail = false;
		console.log("登陆失败重新登陆");
		globle.clearData();
		uni.navigateTo({
			url:api.sp.login
		})
		// utils.skipPage("navigateTo",api.sp.login);
		//1.5秒内禁止
		setTimeout(() => {
			isLoginFail = true;
		}, 1500);
		// #endif
	}
	return resp;
});
Vue.prototype.$http = http;
Vue.prototype.$globle = globle;
Vue.prototype.$api = api;


App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
