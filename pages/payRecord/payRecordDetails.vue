<template>
	<view class="content">
		<view class="payrecord_list">
			<navigator class="payrecord_item" :url="$api.sp.consultDetails+'?CardNo=' + CardNo + '&RecipeNo=' + item.RecipeNo"
			v-for="(item, index) in recipeList" :key="index">
				<view class="payrecord_num">处方号：{{item.RecipeNo}}</view>
				<view class="payrecord_con">
					<view class=""><text>{{item.RecipeName}}</text>处方名称</view>
					<view class=""><text>{{item.RecipeDate}}</text>处方日期</view>
					<view class=""><text>{{item.DeptName}}</text>就诊科室名称</view>
					<view class=""><text>{{item.DoctorName}}</text>就诊医生姓名</view>
					<view class=""><text>￥{{item.RecipeCost}}</text>处方金额</view>
				</view>
			</navigator>
		</view>
		<view  class="regde_btn_red" v-if="PayStatus == '1'" @click="cancelConfirm">取消订单</view>
		<view  class="regde_btn" v-if="PayStatus == '1'" @click="continuePay">继续支付</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				HisOrderId:"",
				CardNo:"",
				PayStatus:"",
				recipeList :[],
			};
		},
		onLoad(e) {
			this.HisOrderId = e.HisOrderId
			this.CardNo = e.CardNo
			this.PayStatus = e.PayStatus
			this.queryPayRecipe()
		},
		methods:{
			cancelConfirm(){
				let self_ = this;
				uni.showModal({
				    title: '提示',
				    content: '取消后，需要从门诊缴费重新下单后支付，确定要取消该订单吗？',
				    success: function (res) {
				        if (res.confirm) {
							self_.cancelHisOrder();
				        } 
				    }
				});
				
			},
			cancelHisOrder(){
				let data = {HisOrderId:this.HisOrderId};
				this.$http.request({url:this.$api.uri.cancelRecipeOrder,
				data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					let infoRes = result.data;
					console.log(infoRes);
					if (infoRes.code === 0) {
						uni.showToast({
							icon: 'none',
							title: '取消成功'
						});
						//跳转到缴费列表页面
						uni.navigateBack({
							url:this.$api.sp.payRecord
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: infoRes.msg
						});
					}
				}).catch(error => {
					uni.showToast({
						icon: 'none',
						title: '取消订单失败，请稍后再试'
					});
				});
			},
			wxChoosePay(config){
				let _self = this;
				let hisOrderId = config.hisOrderId;
				let orderCost = config.orderCost;
				//微信JSAPI支付
				uni.$wx.config({
				  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				  appId:config.appId,
				  timestamp: config.timeStamp, // 必填，生成签名的时间戳
				  nonceStr: config.nonceStr, // 必填，生成签名的随机串
				  signature: config.paySign,// 必填，签名
				  jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表
				});
				
				uni.$wx.ready(function(){
					uni.$wx.chooseWXPay({
						  timestamp: config.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						  nonceStr: config.nonceStr, // 支付签名随机串，不长于 32 位
						  package: config.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
						  signType: config.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						  paySign: config.paySign, // 支付签名
						  success: function (res) {
							 uni.redirectTo({
							 	url:_self.$api.sp.payResult+"?hisOrderId="+hisOrderId+"&orderCost="+orderCost
							 })
						  },
						  fail:function(r){
							uni.showModal({
							    title: '提示',
							    content: '支付失败，如您已付款，请勿重复支付',
								showCancel:false
							});
						  },
						  cancel: function(r) {
							uni.showModal({
							    title: '提示',
							    content: '若订单超过2小时未支付，提示订单已过期，请取消订单后在门诊缴费重新下单后支付',
								showCancel:false
							});
						  }
					});
					
				});
				
				uni.$wx.error(function(res){
					console.log(res);
				});
			},
			continuePay(){
				//查询预支付存下来的信息，直接使用吊起微信支付
				let data = {HisOrderId:this.HisOrderId};
				this.$http.request({url:this.$api.uri.queryPrepayid,
				data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					let infoRes = result.data;
					if (infoRes.code === 0) {
						let config = infoRes.data;
						this.wxChoosePay(config);
					} else {
						uni.showToast({
							icon: 'none',
							title: infoRes.msg
						});
					}
				}).catch(error => {
					uni.showToast({
						icon: 'none',
						title: '查询预支付信息失败，请稍后再试'
					});
				});
				
			},
			queryPayRecipe(){
				if(!this.HisOrderId){
					return;
				}
				let data = {HisOrderId:this.HisOrderId};
				this.$http.request({url:this.$api.uri.queryPayOrderRecipeRecord,data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					let infoRes = result.data;
					if (infoRes.code === 0) {
						this.recipeList = infoRes.data.List;
					} else {
						uni.showToast({
							icon: 'none',
							title: infoRes.msg
						});
					}
				}).catch(error => {
					uni.showToast({
						icon: 'none',
						title: this.$globle.errorTip
					});
				});
			},
		}
	}
</script>

<style lang="scss">
page{ background:#f4f4f4;}
.content{ padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.payrecord_list{ padding: 30rpx 30rpx 0 30rpx;}
.payrecord_item{ background: #fff; padding: 0 30rpx; margin-bottom: 14rpx; border:1px solid #eeeeee; border-radius: 6rpx;}
// .payrecord_num{ line-height: 75rpx; color: #333333; font-size: 28rpx; border-bottom: 1px solid #ebebeb;}
.payrecord_num{ line-height: 75rpx; color: #333333; font-size: 28rpx; border-bottom: 1px solid #ebebeb;
	background: url(~@/static/img/patient03.png) no-repeat 600rpx center; background-size: 14rpx 25rpx;
}
.payrecord_con{ padding: 7rpx 0;
	>view{ line-height: 68rpx; font-size: 28rpx; color: #999999;
		text{ display: block; float: right; color: #000000;}
	}
}
.payrecord_title{ line-height: 74rpx; font-size: 28rpx; color: #999999;
	text{ display: block; float: right; color: #000000; padding-right: 35rpx; background: url(~@/static/img/payRecordDetails02.png) no-repeat right center;
		background-size: 20rpx 10rpx;
		&.on{ background: url(~@/static/img/payRecordDetails01.png) no-repeat right center;background-size: 20rpx 10rpx;}
	}
}
.payrecord_money{ padding: 0 50rpx; line-height: 108rpx; margin-top: -20rpx; font-size: 28rpx; color: #333333;
	text{ font-size: 30rpx; color: #ff9000; font-weight: bold;}
}
.regde_btn_red{ margin: 40rpx 30rpx 0 30rpx; background: #ff0000; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;}
.regde_btn{ margin: 10rpx 30rpx 0 30rpx; background: #3eceb5; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;}

</style>
