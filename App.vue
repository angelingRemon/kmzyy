<script>
export default {
    data:{
        retrun:{
            isFristShow:true
        }
    },
	methods: {
		//查询消息未读数
		httpGetMsgUnReadNum(tabIndex) {
			this.$http.request({ url: '/msgInfo/unreadCount' }).then(res => {
				let infoRes = res.data;
				if (infoRes.code == 0) {
					this.$store.commit('setUnReadNum', { num: infoRes.count, tabIndex: tabIndex });
				}
			});
		},
		checkUploadApk(req) {
			console.log(req);
			this.$http
				.get('/nonlogin/upgrade/samrAppUpgrade/appDownAppUpgrade', req, { noCheckToken: true })
				.then(res => {
					console.log(res);
					let infoRes = res.data;
					let dataInfo = infoRes.data.appUpgrade;
					if (infoRes.code == 0 && dataInfo.status == '1') {
						let urlObj = JSON.parse(dataInfo.url);
						if(urlObj.length > 0){
						uni.showModal({
							//提醒用户更新
							title: '更新提示',
							content: dataInfo.note,
							success: sres => {
								if (sres.confirm) {
									plus.runtime.openURL(this.$globle.basePath+"/nonlogin/"+urlObj[0].url);
								}
							}
						});
						}
					}
				})
				.catch(erro => {
					console.error(erro);
				});
		}
	},
	onLaunch: function() {
		let self = this;
		//如果是app-android就检查更新
		// #ifdef APP-PLUS
		if (uni.getSystemInfoSync().platform == "android") {			
			var req = {
				//升级检测数据
				appid: plus.runtime.appid,
				version: plus.runtime.version
			};
			plus.nativeUI.closeWaiting();
			self.checkUploadApk(req);
		}
		// #endif
		// this.httpGetMsgUnReadNum(3);
	},
	onShow: function() {
	    console.log("appvue.onshow");
        this.disSockerIndex&&clearTimeout(this.disSockerIndex);
        //重启开始连接
        if(!this.isFristShow){
            (uni.$zim)&&uni.$zim.socketConn();
        }else{
            this.isFristShow = false;
        }
    },
	onHide: function() {
        console.log("appvue.onhide")
        this.disSockerIndex =
            setTimeout(()=>{
                uni.$zim.disconnect();
                clearTimeout(this.disSockerIndex);
                this.disSockerIndex = 0;
            },5000)
    }
};
</script>

<style>
/* @import "colorui/main.css";
@import "colorui/icon.css"; */
@import "./common/css/main.css";
@import "./common/css/icon.css";
</style>
