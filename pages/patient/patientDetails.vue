<template>
	<view class="content">
		<view class="patientde_box">
			<view class="patientlist_item_top">
				{{patient.PatientName}}
				<text v-if="isDefault=='true'">默认就诊人</text>
				<!-- <text v-if="isDefault=='false'">设为默认</text> -->
			</view>
			<view class="patientlist_item_bot">
				院内就诊卡 : {{patient.CardNo}} 
			</view>
			<view class="patientde_text">
				<view><view>{{patient.IDCardNo}} </view>身份证号</view>				<view><view>{{patient.PhoneNumber}} </view>电话号码</view>				<view><view>{{patient.Gender=="1"?"男":"女"}} </view>性　　别</view>				<view><view>{{patient.Birthday}} </view>出生日期</view>
				<view><view>{{patient.AccountBalance}} </view>账户余额</view>
			</view>
		</view>
		<navigator class="" :url="$api.sp.patientEdit + '?cardNo=' + patient.CardNo" >
			 <view class="regde_btn">修改就诊人</view>
		</navigator>
		<view class="patientlist_item_bot" @click="delPatientConfirm">
			 <view class="regde_btn_red">删除就诊人</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isDefault:'false',
				cardNo:"",
				patient:{}
			};
		},
		onLoad(options) {
			this.cardNo = options.cardNo;
			this.isDefault = options.isDefault;
			this.queryPatient();
		},
		onShow() {
			this.queryPatient();
		},
		methods: {
			queryPatient(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				//1 是身份证号 2就诊卡号
				let data = {QueryType:"2",QueryNo:this.cardNo};
				this.$http.request({url:this.$api.uri.querypatientDetail,data: data ,method:"POST",noCheckToken:true}).then(
				    (result) => {
						uni.hideLoading();
						let infoRes = result.data;
						if (infoRes.code === 0) {
							this.patient = infoRes.data;
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
			},
			delPatient(){
				if(this.isDefault == 'true'){
					uni.showToast({
						icon: 'none',
						title: '默认就诊人不能删除，请修改为非默认就诊人后尝试删除！'
					});
					return;
				}
				
				uni.showLoading({
					title:"加载中...",
					mask:true
				});
				let data = {cardNo:this.cardNo};
				this.$http.request({url:this.$api.uri.delPatient,data: data ,method:"POST",noCheckToken:true})
				.then((result) => {
						uni.hideLoading();
						let infoRes = result.data;
						if (infoRes.code === 0) {
							uni.navigateBack({
								url:this.$api.sp.patientList
							})
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
			},
			delPatientConfirm(){
				let self_ = this;
				uni.showModal({
				    title: '提示',
				    content: '您确定要删除该就诊人吗',
				    success: function (res) {
				        if (res.confirm) {
							self_.delPatient();
				        } 
				    }
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
.patientde_box{ margin: 20rpx 30rpx; background: #fff; padding: 25rpx 30rpx 0 30rpx;}
.patientlist_item_bot{ line-height: 54rpx; color: #999999; font-size: 28rpx; padding-bottom: 14rpx; border-bottom: 1px solid #ebebeb;}
.patientlist_item_top{ height: 60rpx; line-height: 60rpx; font-size: 34rpx; color: #000000; font-weight: bold;
	text{ display: inline-block;line-height: 40rpx; color: #999999; padding: 0 20rpx; border: 1px solid #d1d1d1; border-radius: 6rpx; font-size: 24rpx; 
		font-weight: normal; vertical-align: middle; margin-left: 22rpx;
	}
}
.patientde_text{ color: #999999; padding: 17rpx 0;
	&,view,text{ line-height: 70rpx; font-size: 28rpx;}
	view>view{ float: right; color: #000000;}
}
.regde_btn{ margin: 40rpx 30rpx 0 30rpx; background: #3eceb5; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;}
.regde_btn_red{ margin: 40rpx 30rpx 0 30rpx; background: #ff0000; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;}

</style>
