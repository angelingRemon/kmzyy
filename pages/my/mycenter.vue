<template>
	<view class="content">
		<view class="myce_top">
			<view class="myce_top_pic">
				<image :src="avatar" mode=""></image>
			</view>
			<view class="myce_top_no">
				<text>{{userName}}</text>
				<!-- 就诊卡<text> 1 </text>张
				<image src="../../static/img/mycenter10.png" mode=""></image> -->
			</view>
		</view>
		<!-- 有卡 -->
		<view class="myce_cart" v-if="isCart" >
			<view v-for="(item,index) in patientList" :key="index">
				<view class="myce_cart_top" v-if="item.defaults">{{item.patientName}}<text v-if="item.defaults">默认</text></view>
				<view class="myce_cart_bot" v-if="item.defaults">就诊卡号 : {{item.cardNo}} </view>
			</view>
		</view>
		<!-- 无卡 -->
		<navigator class="myce_cart_nodata" :url="$api.sp.patientList" v-if="!isCart"></navigator>
		
		<!-- 功能列表 -->
		<view class="myce_list">
			<navigator class="myce_list_item" :url="$api.sp.patientList" >
				<image src="../../static/img/mycenter05.png" mode=""></image>
				<text>我的就诊人</text>
			</navigator>
			<navigator class="myce_list_item" :url="$api.sp.registerList">
				<image src="../../static/img/mycenter06.png" mode=""></image>
				<text>我的预约挂号</text>
			</navigator>
			<navigator class="myce_list_item" :url="$api.sp.payRecord">
				<image src="../../static/img/mycenter07.png" mode=""></image>
				<text>门诊缴费记录</text>
			</navigator>
			<navigator class="myce_list_item" :url="$api.sp.consultList">
				<image src="../../static/img/mycenter08.png" mode=""></image>
				<text>我的看诊记录</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isCart:false,
				userName:"",
				phonenumber:"",
				avatar:"../../static/img/zzz04.jpg",
				userInfo:{},
				patientList:[]
			}
		},
		onLoad(options) {
			/** 首页 医疗服务 个人中心 必须设置 token **/
			this.$globle.saveToken(options.token);
			/** 获取用户信息**/
			this.userInfo = this.getUser()
			/** 查询就诊人**/
		    this.queryPatientList();
		},
		onShow() {
		
		},
		methods: {
			// 查询用户信息
			getUser() {
				    this.$http.request({ 
						url: this.$api.uri.getUserInfo
					}).then(result => {
						let infoRes = result.data;
						let resultData = infoRes.data;
						if (infoRes.code == this.$globle.resultCode.success) {
							this.userName = resultData.user.nickname
							this.avatar = resultData.user.headimgurl
						}
					}).catch(erro => {
						console.error(erro);
					});
			},
			queryPatientList(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				this.$http.post(this.$api.uri.querypatientlist).then(
				(result) => {
					uni.hideLoading();
					let infoRes = result.data;
					if (infoRes.code === 0) {
						this.patientList = infoRes.data;
						if(this.patientList.length>0){
							this.isCart = true;
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: infoRes.msg
						});
					}
				}).catch(error => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: this.$globle.errorTip
					});
				});
			}
		}
	}
</script>

<style lang="scss">
.content{ padding: 0; background:#f4f4f4 url(~@/static/img/mycenter01.png) no-repeat center top; background-size: 100% auto;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.myce_top{ height: 306rpx; padding-top: 40rpx;}
.myce_top_pic{ width: 150rpx; height: 150rpx; box-sizing: content-box; border: 6rpx solid #ccf8f4; border-radius: 50%; overflow: hidden; margin: 0 auto;
	position: relative;
	image{ display: block;}
	&,image{ width: 150rpx; height: 150rpx;}
	text{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; text-align: center; line-height: 150rpx; font-size: 30rpx; color: #ffffff;
		background: rgba(0,0,0,0.2); text-shadow: 0 0 5px #999;
	}
}
.myce_top_no{ line-height: 92rpx; font-size: 28rpx; color: #fff; text-align: center;
	image{ width: 14rpx; height: 24rpx; margin-left: 24rpx;}
	text{color: #fff600; padding: 0 5rpx;}
}
.myce_cart{ background: url(~@/static/img/mycenter11.png) no-repeat center; background-size: 100% 100%; margin: 0 30rpx; height: 154rpx;
	padding: 28rpx 0 28rpx 45rpx;
}
.myce_cart_top{ line-height: 58rpx; font-size: 32rpx; color: #fff; font-weight: bold;
	text{ display: inline-block; box-sizing: content-box; height: 36rpx; line-height: 36rpx; font-size: 24rpx; font-weight: normal; 
	border: 1px solid #fff; border-radius: 5rpx; padding: 0 10rpx; margin-left: 24rpx;vertical-align: middle;}
}
.myce_cart_bot{ line-height: 44rpx; font-size: 28rpx; color: #dae8ff;}
.myce_cart_nodata{
	 background: url(~@/static/img/mycenter02.png) no-repeat center; background-size: 100% 100%; margin: 0 30rpx; height: 154rpx;
}
// 
.myce_list{ margin: 40rpx 30rpx 0 30rpx; border-radius: 12rpx; background: #fff; padding: 12rpx 0;}
.myce_list_item{ line-height: 86rpx; padding: 0 27rpx 0 16rpx;
	image{ display: block; float: left; height: 42rpx; width: 42rpx; margin-top: 22rpx;}
	text{ display: block; margin-left: 60rpx; font-size: 30rpx; color: #333333;
		background: url(~@/static/img/mycenter09.png) no-repeat right center; background-size: 14rpx 24rpx;
	}
}
</style>
