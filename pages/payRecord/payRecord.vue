<template>
	<view class="content">
		<view class="paypayment_top">
			<view class="paypayment_top_switch" @click="isShow = true">切换就诊人</view>
			<view class="paypayment_top_name">{{currentPatientName}}</view>
			<view class="paypayment_top_no">就诊卡 : {{currentPatientCardNo}} </view>
		</view>
		<image v-show="payOrderRecordList.length == 0" src="~@/static/img/nodata.png" style="display:block;height:410rpx;width:410rpx;margin:200rpx auto;" mode=""></image>
		<view class="payrecord_list">
			<navigator class="payrecord_item" :url="$api.sp.payRecordDetails+'?HisOrderId='+ item.HisOrderId + '&CardNo=' + currentPatientCardNo+ '&PayStatus=' + item.PayStatus" 
			v-for="item in payOrderRecordList" :key="item.id">
				<view class="payrecord_num">订单号：{{item.HisOrderId}}</view>
				<view class="payrecord_con">
					<view class=""><text>{{item.OrderTime}}</text>缴费时间</view>					<view class="" v-if="item.PayStatus == '1'"><text>未支付</text>订单状态</view>
					<view class="" v-if="item.PayStatus == '2'"><text>已支付</text>订单状态</view>
					<view class="" v-if="item.PayStatus == '3'"><text>已取消</text>订单状态</view>				</view>
				<view class="payrecord_bot">
					<text>￥{{item.OrderCost}}</text>
					缴费金额
				</view>
			</navigator>
		</view>
		<!-- 弹出 -->
		<view class="patient_open_zz" v-show="isShow"></view>
		<view class="patient_open" v-show="isShow">
			<image @click="isShow = false" src="../../static/img/doctorDetailsChoice02.png" mode=""></image>
			<view class="patient_open_title">切换就诊人</view>
			<view class="patient_open_list">
				<view class="patient_open_list_item" v-for="item in patientList" :key="item.cardNo" @click="switchPatient(item)">
					<view class="patient_open_list_sel" v-bind:class="{'on':item.cardNo == currentPatientCardNo}"></view>
					<view class="patient_open_list_name">{{item.patientName}}</view>
					<view class="patient_open_list_num">就诊卡 : {{item.cardNo}} </view>
				</view>
			</view>
			<view class="patient_open_btn">
				<navigator class="patient_open_btn_item" @click="goAddPatientPage">添加就诊人</navigator>
				<view class="patient_open_btn_item" style="border-left: 1px solid #d1fff7;" @click="goPatientListPage">管理就诊人</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				maxPatient:this.$globle.maxPatient,
				currentPatientCardNo:"",
				currentPatientName:"",
				patientList:[],
				isShow:false,
				payOrderRecordList:[]
			};
		},
		onLoad() {
			this.queryPatientList();
		},
		onShow() {
			this.queryPatientList();
		},
		methods:{
			loadData(cardNo){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				// let EndDate = this.$moment().format('YYYY-MM-DD');
				// let BeginDate = this.$moment().subtract(30, 'days').format('YYYY-MM-DD'); 
				// 查询预约已挂记录查询/nonlogin/hisapi/outpatientregister/querypreregisterrecord
				this.$http.request({
					url: this.$api.uri.queryPayOrderRecord,
					method: "POST",
					noCheckToken: true,
					data:{CardNo:cardNo}
				}).then(res => {
					uni.hideLoading();
					let result = res.data;
					if (result.code === 0) {
						this.payOrderRecordList = result.data.List;
					}else {
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
			},
			goPatientListPage(){
				uni.navigateTo({
					url: this.$api.sp.patientList
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
			switchPatient(item){
				this.currentPatientCardNo = item.cardNo;
				this.currentPatientName = item.patientName;
				this.loadData(item.cardNo);
			},
			initDefPatient(){
				for (var i = 0; i < this.patientList.length; i++) {
					var patient = this.patientList[i];
					if(patient.defaults){
						this.currentPatientCardNo = patient.cardNo;
						this.currentPatientName = patient.patientName;
						this.loadData(patient.cardNo);
					}
				}
			},
			queryPatientList(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				let data = {openId:this.$globle.token};
				this.$http.request({url:this.$api.uri.querypatientlist,data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					uni.hideLoading()
					let infoRes = result.data;
					if (infoRes.code === 0) {
						this.patientList = infoRes.data;
						if(this.patientList.length > 0){
							this.initDefPatient();
						}else{
							uni.showToast({
								icon: 'none',
								title: '请先绑定就诊人'
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
.payrecord_list{ padding: 170rpx 30rpx 30rpx 30rpx;}
.payrecord_item{ background: #fff; padding: 0 30rpx; margin-bottom: 14rpx; border:1px solid #eeeeee; border-radius: 6rpx;}
.payrecord_num{ line-height: 75rpx; color: #333333; font-size: 28rpx; border-bottom: 1px solid #ebebeb;
	background: url(~@/static/img/patient03.png) no-repeat 600rpx center; background-size: 14rpx 25rpx;
}
.payrecord_con{ padding: 7rpx 0; border-bottom: 1px solid #ebebeb;
	>view{ line-height: 68rpx; font-size: 28rpx; color: #999999;
		text{ display: block; float: right; color: #000000;}
	}
}
.payrecord_bot{ line-height: 80rpx; font-size: 28rpx; color: #333333;
	text{ display: block; float: right; color: #ff9000;}
}
// 弹出
.paypayment_top{ position: fixed; left: 0; top: var(--window-top); z-index: 100; width: 100%; background: #fff; padding: 23rpx 30rpx 20rpx 30rpx; border-bottom: 1px solid #eeeeee;}
.paypayment_top_switch{ float: right; line-height: 42rpx; font-size: 24rpx; color: #3eceb5; border: 1px solid #3eceb5; border-radius: 4rpx; padding: 0 10rpx;}
.paypayment_top_name{ line-height: 50rpx; font-size: 32rpx; color: #000000;}
// 
.patient_open_zz{ position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 120; background: rgba(0,0,0,0.5);}
.patient_open{position: fixed; bottom: 0; left: 0; z-index: 128; width: 100%; min-height: 120rpx; background: #fff;
	image{ position: absolute; top: 38rpx; right: 30rpx; width: 36rpx; height: 36rpx;}
}
.patient_open_title{ line-height: 108rpx; border-bottom: 1px solid #ececec; text-align: center; font-size: 32rpx; color: #000000;}
.patient_open_btn{
	>view,>navigator,&{ height: 90rpx; line-height: 90rpx;}
	>view,>navigator{ float: left; width: 50%; text-align: center; font-size: 34rpx; background: #3eceb5; color: #fff;}
}
.patient_open_list{ max-height:600rpx; overflow: auto;}
.patient_open_list_item{ height: 156rpx; box-sizing: content-box; border-bottom: 1px solid #ececec; padding-left: 30rpx;}
.patient_open_list_sel{ float: right; width: 142rpx; height: 156rpx;
	&.on{ background: url(~@/static/img/registerList08.png) no-repeat center; background-size: 37rpx 31rpx;}
}
.patient_open_list_name{ padding-top: 18rpx; line-height: 60rpx; font-size: 36rpx; color: #000000;}
.patient_open_list_num{ line-height: 56rpx; font-size: 30rpx; color: #999999;}
</style>
