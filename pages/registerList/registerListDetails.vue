<template>
	<view class="content">
		<!-- 锁号成功 -->
		<view  v-if="registerInfo.PayStatus == '1'">
			<view class="regde_top">
				<view class="regde_top_type clearfix">
					<image src="../../static/img/registerList05.png" mode=""></image>
					<view>锁号成功</view>
					<text>{{leftTime}}</text>
				</view>
				<view class="regde_top_text">
					请在锁号的时间内完成支付，否则将取消号源
				</view>
			</view>
			<view class="regde_cons_box">
				<view class="regde_cons">
					<view class="regde_cons_title">就诊信息</view>
					<view class="regde_cons_list">
						<view><text>{{registerInfo.PatientName}}</text>就诊人</view>
						<view><text>{{registerInfo.CardNo}}</text>就诊卡号</view>
						<view><text>{{registerInfo.ScheduleDate}}  {{registerInfo.NoonName}}</text>就诊时间</view>
						<view><text>{{registerInfo.DeptName}}</text>就诊科室</view>
						<view v-if="registerInfo.RegLevelCode != '02'"><text>{{registerInfo.DoctorName}}</text>医生姓名</view>
						<view><text>{{registerInfo.RegLevelName}}</text>医生职称</view>
					</view>
				</view>
				<view class="regde_cons">
					<view class="regde_cons_title">就诊信息</view>
					<view class="regde_cons_list">
						<view><text>￥{{registerInfo.RegisterFee}}</text>交易金额</view>
						<!-- <view><text>呼和浩特金桥凯蒙中医院</text>医院名称</view> -->
						<view><text>{{registerInfo.HisOrderId}}</text>订单号</view>
						<view><text>{{registerInfo.OrderTime}}</text>创建时间</view>
					</view>
				</view>
			</view>
			<view class="regde_btn_red" v-if="showPayButton" @click="quitRegister()">退号</view>
			<view class="regde_btn" v-if="showPayButton" @click="queryOrderDetail()">继续支付</view>
		</view>
		<!-- 预约成功 -->
		<view  v-if="registerInfo.PayStatus == '2'">
			<view class="regde_top" style="background: #ff9000;">
				<view class="regde_top_type clearfix">
					<image src="../../static/img/registerList06.png" mode=""></image>
					<view>预约成功</view>
				</view>
				<view class="regde_top_text">
					请在预约的时间内就诊，当天有效，过期不退。
				</view>
			</view>
			<view class="regde_cons_box">
				<view class="regde_cons">
					<view class="regde_cons_title">就诊信息</view>
					<view class="regde_cons_list">
						<view><text>{{registerInfo.PatientName}}</text>就诊人</view>
						<view><text>{{registerInfo.CardNo}}</text>就诊卡号</view>
						<view><text>{{registerInfo.ScheduleDate}}  {{registerInfo.NoonName}}</text>就诊时间</view>
						<view><text>{{registerInfo.DeptName}}</text>就诊科室</view>
						<view v-if="registerInfo.RegLevelCode != '02'"><text>{{registerInfo.DoctorName}}</text>医生姓名</view>
						<view><text>{{registerInfo.RegLevelName}}</text>医生职称</view>
					</view>
				</view>
				<view class="regde_cons">
					<view class="regde_cons_title">缴费信息</view>
					<view class="regde_cons_list">
						<view><text>￥{{registerInfo.RegisterFee}}</text>交易金额</view>
						<!-- <view><text>呼和浩特金桥凯蒙中医院</text>医院名称</view> -->
						<view><text>{{registerInfo.HisOrderId}}</text>订单号</view>
						<view><text>{{registerInfo.OrderTime}}</text>创建时间</view>
						<view><text>{{registerInfo.PayTime}}</text>支付时间</view>
					</view>
				</view>
			</view>
			<view class="regde_btn_red" v-if="registerInfo.PrintFlag == '0'"  @click="payRefund()">退号</view>
		</view>
		<!-- 取消成功 -->
		<view  v-if="registerInfo.PayStatus == '3' || registerInfo.PayStatus == '4'">
			<view class="regde_top" style="background: #6d6d6d;">
				<view class="regde_top_type clearfix">
					<image src="../../static/img/registerList07.png" mode=""></image>
					<view>取消成功</view>
				</view>
				<view class="regde_top_text">
					挂号已取消，如需就诊请重新挂号。
				</view>
			</view>
			<view class="regde_cons_box">
				<view class="regde_cons">
					<view class="regde_cons_title">就诊信息</view>
					<view class="regde_cons_list">
						<view><text>{{registerInfo.PatientName}}</text>就诊人</view>
						<view><text>{{registerInfo.CardNo}}</text>就诊卡号</view>
						<view><text>{{registerInfo.ScheduleDate}}  {{registerInfo.NoonName}}</text>就诊时间</view>
						<view><text>{{registerInfo.DeptName}}</text>就诊科室</view>
						<view v-if="registerInfo.RegLevelCode != '02'"><text>{{registerInfo.DoctorName}}</text>医生姓名</view>
						<view><text>{{registerInfo.RegLevelName}}</text>医生职称</view>
					</view>
				</view>
				<view class="regde_cons">
					<view class="regde_cons_title">缴费信息</view>
					<view class="regde_cons_list">
						<view><text>￥{{registerInfo.RegisterFee}}</text>交易金额</view>
						<!-- <view><text>呼和浩特金桥凯蒙中医院</text>医院名称</view> -->
						<view><text>{{registerInfo.HisOrderId}}</text>订单号</view>
						<view><text>{{registerInfo.OrderTime}}</text>创建时间</view>
						<!-- <view><text>1200012521064</text>取消时间</view>
						<view><text>1200012521064</text>取消原因</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				registerInfo:{},
				leftTime:"",
				showPayButton: false
			};
		},
		onLoad(options) {
			this.registerInfo = JSON.parse(options.item)
			// console.log(this.registerInfo);
			if(this.registerInfo.PayStatus == '1'){
				this.showTime()
			}
		},
		methods:{
			payRefund(){
				uni.showModal({
					title: '提示',
					content: '退号后如需就诊请重新挂号',
					cancelText: '不退号',
					confirmText: '退号',
					success: res => {
						if(res.confirm){
							uni.showLoading({
								title:"退号中...",
								mask:true
							})
							let data = {outTradeNo:this.registerInfo.HisOrderId, totalFee:this.registerInfo.RegisterFee};
							this.$http.request({url:this.$api.uri.wxRefund,
							data: data ,method:"POST",noCheckToken:true}).then(
							(result) => {
								console.log(result);
								let infoRes = result.data;
								if (infoRes.code === 0) {
									setTimeout(() => {
										uni.hideLoading()
										uni.showToast({
											icon: 'none',
											title: '退号成功'
										});
										uni.navigateBack({
											delta:1
										})
									}, 5000)
									
								} else {
									uni.showToast({
										icon: 'none',
										title: infoRes.msg
									});
								}
							}).catch(error => {
								uni.showToast({
									icon: 'none',
									title: '申请微信退款失败，请稍后再试'
								});
							});
						}
					}
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
							 	url:_self.$api.sp.payResultForRegister+"?hisOrderId="+_self.registerInfo.HisOrderId+"&orderCost="+_self.registerInfo.RegisterFee
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
							     content: '取消支付，点击继续支付按钮重新发起支付',
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
				let data = {HisOrderId:this.registerInfo.HisOrderId};
				this.$http.post(this.$api.uri.queryRegisterPayStatus,data).then(
				(result) => {
					uni.hideLoading();
					this.loadModal = false;
					let infoRes = result.data;
					if (infoRes.code === 0) {
						let resData = infoRes.data;
						if(resData.PayStatus == "1"){
							this.continuePay()
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
			
			continuePay(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				//查询预支付存下来的信息，直接使用吊起微信支付
				let data = {HisOrderId:this.registerInfo.HisOrderId};
				this.$http.request({url:this.$api.uri.queryPrepayid,
				data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					uni.hideLoading();
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
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '查询预支付信息失败，请稍后再试'
					});
				});
			},
			quitRegister(){
				uni.showModal({
					title: '提示',
					content: '退号后如需就诊请重新挂号',
					cancelText: '不退号',
					confirmText: '退号',
					success: res => {
						if(res.confirm){
							uni.showLoading({
								title:"退号中...",
								mask:true
							})
							this.$http.request({
								url: this.$api.uri.registerUnLock,
								method: "POST",
								noCheckToken: true,
								data:{HisOrderId:this.registerInfo.HisOrderId}
							}).then(res => {
								uni.hideLoading();
								let result = res.data;
								if (result.code === 0) {
									uni.showToast({
										title: '退号成功',
										icon:'none'
									});
									setTimeout(function() {
										uni.navigateBack({
											delta:1
										})
									}, 1000);
									
								}else{
									uni.showToast({
										icon: 'none',
										title: result.msg
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
				});
			},
			showTime(){
				let diffSeconds = this.$moment().diff(this.$moment(this.registerInfo.OrderTime), 'seconds');
				let endTime = this.$moment(this.registerInfo.OrderTime).add(600, 'seconds');
				if(diffSeconds < 600){
					this.showPayButton = true
					let timer = setInterval(()=>{
						if(diffSeconds <= 600){
							diffSeconds++
							let m1 = this.$moment()
							let m2 = this.$moment(endTime)
							var du = this.$moment.duration(m2 - m1, 'ms')
							var mins = du.get('minutes')
							var ss = du.get('seconds')
							if(mins<=0 && ss<=0) {
								this.leftTime = ""
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
			}
			
		}
	}
</script>

<style lang="scss">
page{ background:#f4f4f4;}
.content{ padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.regde_top{ background: #3eceb5; padding: 34rpx 30rpx 88rpx 30rpx;}
.regde_top_type{ line-height: 60rpx;
	image{ display: block; float: left; height: 60rpx; width: 60rpx;}
	view{ float: left; font-size: 36rpx; color: #ffffff; padding-left: 22rpx;}
	text{ display: block; float: right; font-size: 36rpx; color: #ffffff;}
}
.regde_top_text{ padding-top: 18rpx; line-height: 46rpx; font-size: 26rpx; color: #fff;}
.regde_cons{ background: #fff; margin-bottom: 20rpx; padding: 14rpx 30rpx 18rpx 30rpx; border: 1px solid #e9e9e9; border-radius: 8rpx;}
.regde_cons_box{ margin: -47rpx 30rpx 0 30rpx;}
.regde_cons_title{ line-height: 70rpx; font-size: 32rpx; color: #000000; font-weight: bold;}
.regde_cons_list{
	>view{ font-size: 28rpx; line-height: 70rpx; color: #999999;
		text{ display: block; float: right; color: #000000;}
	}
}
.regde_btn_red{ margin: 30rpx 30rpx 10rpx 30rpx; background: #ff0000; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;}
.regde_btn{ margin: 0rpx 30rpx 30rpx 30rpx; background: #3eceb5; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;}

</style>
