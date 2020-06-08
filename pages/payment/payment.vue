<template>
	<view class="content">
		<view class="payment_time">剩余支付时间  {{leftTime}}</view>
		<view class="payment_con">
			<view class="payment_con_txt">支付金额(元)</view>
			<view class="payment_con_money">￥{{payment.RegisterFee}}</view>
			<view class="payment_item"><text>就诊科室：</text>{{payment.DeptName}}</view>
			<view class="payment_item" v-if="payment.RegLevelCode != '02'"><text>医生姓名：</text>{{payment.DoctorName}}</view>
			<view class="payment_item" v-if="payment.RegLevelCode != '02'"><text>医生职称：</text>{{payment.RegLevelName}}</view>
		</view>
		<view class="payment_con">
			<view class="payment_item"><text>就诊时间：</text>{{payment.ScheduleDate}}  {{payment.NoonName}}</view>
			<view class="payment_item"><text>就 诊 人：</text>{{payment.PatientName}}</view>
			<view class="payment_item"><text>就诊卡号：</text>{{payment.CardNo}}</view>
		</view>
		<view class="regde_btn" v-if="showPayButton" @click="queryOrderDetail">微信支付</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				HisOrderId:"",
				payment:{},
				leftTime:"",
				OrderTime:"",
				showPayButton: true,
				currentPatientCardNo:"",
				config:{},
				configcode:"",
				configmsg:""
			};
		},
		onLoad(options) {
			this.HisOrderId = options.HisOrderId
			this.payment = JSON.parse(options.infos)
			this.currentPatientCardNo = this.payment.CardNo
			this.loadData()
			this.createUnifiedOrder()
		},
		methods:{
			wxChoosePay(config,hisOrderId,orderCost){
				let _self = this;
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
							 	url:_self.$api.sp.payResultForRegister+"?hisOrderId="+hisOrderId+"&orderCost="+orderCost
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
							     content: '如需继续挂号请再次支付或在挂号记录中支付',
							 	 showCancel:false
							 });
						  }
					});
					
				});
				
				uni.$wx.error(function(res){
					console.log(res);
				});
			},
			queryOrderDetail() {
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				let data = {HisOrderId:this.HisOrderId};
				this.$http.post(this.$api.uri.queryRegisterPayStatus,data).then(
				(result) => {
					uni.hideLoading();
					this.loadModal = false;
					let infoRes = result.data;
					if (infoRes.code === 0) {
						let resData = infoRes.data;
						if(resData.PayStatus == "1"){
							if (this.configcode === 0) {
								this.wxChoosePay(this.config, this.HisOrderId, this.payment.RegisterFee);
							} else {
								uni.showToast({
									icon: 'none',
									title: this.configmsg
								});
							}		
						}else if(resData.PayStatus == "2"){
							uni.showToast({
								icon: 'none',
								title: '该挂号订单【"+this.hisOrderId+"】已支付成功，详情请查询挂号记录'
							});
						}else if(resData.PayStatus == "3" || resData.PayStatus == '4'){
							uni.showToast({
								icon: 'none',
								title: '订单已取消，请重新挂号'
							});
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
						title: '查询失败，请稍后再试'
					});
				});
			},
			createUnifiedOrder(){
				//微信预支付下单
				let _self = this;
				let data = {HisOrderId:_self.HisOrderId,OrderCost:_self.payment.RegisterFee};
				_self.$http.request({url:_self.$api.uri.createUnifiedOrderForRegister,
				data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					let infoRes = result.data;
					this.configcode = infoRes.code
					this.configmsg = infoRes.msg
					if (infoRes.code === 0) {
						this.config = infoRes.data;
					}
				}).catch(error => {
					uni.showToast({
						icon: 'none',
						title: '创建微信订单失败，请稍后再试'
					});
				});
			},
			showTime(){
				let diffSeconds = this.$moment().diff(this.$moment(this.OrderTime), 'seconds');
				let endTime = this.$moment(this.OrderTime).add(600, 'seconds');
				if(diffSeconds < 600){
					let timer = setInterval(()=>{
						if(diffSeconds <= 600){
							diffSeconds++
							let m1 = this.$moment()
							let m2 = this.$moment(endTime)
							var du = this.$moment.duration(m2 - m1, 'ms')
							var mins = du.get('minutes')
							var ss = du.get('seconds')
							if(mins<=0 && ss<=0) {
								this.leftTime = "支付超时"
								this.showPayButton = false
							}else {
								this.leftTime = this.PrefixInteger(mins,2) + ':' + this.PrefixInteger(ss,2)
							}
						}else{
							this.showPayButton = false
							clearInterval(timer)
						}
					}, 1000)
				}
			},
			// 时间补零
			PrefixInteger(num, n) {
				return (Array(n).join(0) + num).slice(-n);
			},
			loadData(){
				let data = {HisOrderId:this.HisOrderId};
				this.$http.post(this.$api.uri.queryRecipePayStatus,data).then(
				(result) => {
					this.loadModal = false;
					let infoRes = result.data;
					if (infoRes.code === 0) {
						let resData = infoRes.data;
						this.OrderTime = resData.OrderTime
						this.showTime()
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
page{ background:#f4f4f4;}
.content{ padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.payment_time{ text-align: center; line-height: 74rpx; font-size: 24rpx; color: #fff; background: #ff9000;}
.payment_con{ margin: 0 30rpx 22rpx 30rpx; background: #fff; border: 1px solid #eeeeee; border-radius: 8rpx; padding: 14rpx 30rpx;}
.payment_item{ line-height: 70rpx; font-size: 28rpx; color: #333333;
	text{ display: block; float: left; color: #999;}
}
.payment_con_txt{ line-height: 50rpx; font-size: 24rpx; color: #999999; text-align: center;}
.payment_con_money{ line-height: 60rpx; height: 85rpx; border-bottom: 1px solid #ebebeb; margin-bottom: 16rpx; font-size: 36rpx; color: #ff9000; text-align: center;}
.regde_btn{ margin: 40rpx 30rpx 0 30rpx; background: #3eceb5; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;}
</style>
