import Vue from 'vue'
import Vuex from 'vuex'
import imuser from './modules/imuser.js'
import conversation from './modules/conversation.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		imuser:imuser,
		conversation:conversation,
	},
    state: {
		token:null,
		msg:{
			unReadNum:0
		},
		/**
		 * 是否需要强制登录
		 */
        forcedLogin: true,
        userName: ""
    },
    mutations: {
        login(state, param) {
			console.log(param);
			state.token = param.token;
			//将token保存到本地缓存中
			uni.setStorageSync("token",param.token);
			//保存用户信息
			uni.setStorageSync("userInfo",param.user);
        },
        logout(state) {
			state.token = null;
			uni.removeStorageSync("token");
			uni.removeStorageSync("userInfo");
        },
		setUnReadNum(state,param){
			state.msg.unReadNum = param.num;
			let numStr = (param.num>99)?"99+":(""+param.num)
			if(param.num<=0){
				uni.removeTabBarBadge({
					index:param.tabIndex
				})
			}else{
				uni.setTabBarBadge({
					index:param.tabIndex,
					text: numStr
				});
			}
		},
		relaunchLogin(state){
			let token = state.token || uni.getStorageSync("token");
			state.token = token;
			if (!token && state.appBase.loginType != "WEIXIN") {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !state.forcedLogin,
					success: res => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							if (state.forcedLogin) {
								uni.reLaunch({
									url: '/pages/login/login'
								});
							} else {
								uni.navigateTo({
									url: '/pages/login/login'
								});
							}
						}
					}
				});
			}
		}
    },
	actions:{ //异步修改状态
		
	}
})

export default store
