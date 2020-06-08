<template>
	<view class="content">
		<view class="patientlist">
			<view  class="patientlist_item" v-for="(item,index) in patientList" :key="index">
				<view class="patientlist_item_top">
					{{item.patientName}}
					<text v-if="item.defaults">默认</text>
					<text v-if="!item.defaults" @click="setPatienDefault(item.cardNo)">设为默认</text>
				</view>
				<navigator class="patientlist_item_bot" :url="$api.sp.patientDetails + '?cardNo=' + item.cardNo+'&isDefault='+item.defaults" >
					就诊卡号 : {{item.cardNo}} 
				</navigator>
			</view>
		</view>
		<view @click="goAddPatientPage"  class="patientlist_add clearfix">
			<image src="../../static/img/patient02.png" mode=""></image>
			<view class="">
				还可添加{{maxPatient - patientList.length}}人
			</view>
			添加就诊人
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				maxPatient:this.$globle.maxPatient,
				patientList:[]
			};
		},
		onLoad() {
		},
		onShow() {
			this.queryPatientList();
		},
		methods: {
			setPatienDefault(cardNo){
				let data = {cardNo:cardNo};
				this.$http.request({url:this.$api.uri.setPatienDefault,data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					let infoRes = result.data;
					if (infoRes.code === 0) {
						this.queryPatientList();
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
			goAddPatientPage(){
				if(this.patientList.length >= this.maxPatient){
					uni.showToast({
						icon: 'none',
						title: "最多添加"+this.maxPatient+"位就诊人,请先删除其他就诊人"
					});
					return;
				}
				uni.navigateTo({
					url: this.$api.sp.patientAdd
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
.patientlist{ padding: 30rpx;}
.patientlist_item{ padding: 0 45rpx; background: url(~@/static/img/patient01.png) no-repeat left top; background-size: 100% 100%; margin-bottom: 20rpx; height: 236rpx;}
.patientlist_item_top{ height: 118rpx; line-height: 118rpx; font-size: 34rpx; color: #000000; font-weight: bold;
	text{ display: inline-block;line-height: 40rpx; color: #999999; padding: 0 20rpx; border: 1px solid #d1d1d1; border-radius: 6rpx; font-size: 24rpx; 
		font-weight: normal; vertical-align: middle; margin-left: 22rpx;
	}
}
.patientlist_item_bot{ line-height: 115rpx; color: #999999; font-size: 28rpx; 
	background:  url(~@/static/img/patient03.png) no-repeat right center; background-size: 14rpx 24rpx;
}
.patientlist_add{ background: #3eceb5; padding: 23rpx 28rpx; margin: 0 30rpx; border-radius: 10rpx; line-height: 68rpx; font-size: 32rpx; color: #ffffff;
	image{ display: block; float: left; height: 68rpx; width: 68rpx; margin-right: 20rpx;}
	view{ float: right; font-size: 24rpx; color: #b2fff2; padding-right: 45rpx;
		background:  url(~@/static/img/patient04.png) no-repeat right center; background-size: 14rpx 24rpx;
	}
}
</style>
