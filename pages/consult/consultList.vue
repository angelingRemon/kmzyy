<template>
	<view class="content">
		<view class="paypayment_top">
			<view class="paypayment_top_switch" @click="isShow = true">切换就诊人</view>
			<view class="paypayment_top_name" >{{ currentPatientName}}</view>
			<view class="paypayment_top_no" >就诊卡号 : {{currentPatientCardNo }} </view>
		</view>
		<image v-show="historyrecipeList.length == 0" src="~@/static/img/nodata.png" style="display:block;height:410rpx;width:410rpx;margin:200rpx auto;" mode=""></image>
		<view class="payrecord_list">
			<view class="payrecord_item" v-for="(item,index) in historyrecipeList" :key="index">
				<view class="payrecord_item_right" @click="goInfo(item.RecipeNo,currentPatientCardNo)">
					<view class="payrecord_num">处方号：{{item.RecipeNo}}</view>
					<view class="payrecord_con">
						<view class=""><text>{{item.RecipeName}}</text>处方名称</view>
						<view class=""><text>{{item.DeptName}}</text>就诊科室名称</view>
						<view class=""><text>{{item.DoctorName}}</text>就诊医生姓名</view>
					</view>
					<view class="payrecord_bot">
						<text>￥{{item.RecipeCost}}</text>
						处方金额
					</view>
				</view>
			</view>
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
					<view class="patient_open_list_num">就诊卡号 : {{item.cardNo}}  </view>
				</view>
			</view>
			<view class="patient_open_btn">
				<view class="patient_open_btn_item" @click="goAddPatientPage" >添加就诊人</view>
				<view class="patient_open_btn_item" @click="goPatientListPage" style="border-left: 1px solid #d1fff7;">管理就诊人</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:false,
				maxPatient:this.$globle.maxPatient,
				currentPatientCardNo:"",
				currentPatientName:"",
				patientList:[],
				historyrecipeList:[]
			};
		},onLoad() {
			this.queryPatientList();
		},methods:{
			/* pages/consult/consultDetails */
			/* /nonlogin/hisapi/outpatientpay/queryrecipedetail */
			goInfo(recipeNo,cardNo){
				uni.navigateTo({
					url: this.$api.sp.consultDetails+"?CardNo="+cardNo+"&RecipeNo="+recipeNo
				});
			},
			loadData(cardNo){
				let EndDate = this.$moment().format('YYYY-MM-DD');
				let BeginDate = this.$moment(this.$moment().subtract(30, 'days').calendar()).format('YYYY-MM-DD');
				// 查询看诊列表信息/nonlogin/hisapi/outpatientpay/queryhistoryrecipe
				this.$http.request({
					url: this.$api.uri.queryhistoryrecipe,
					method: "POST",
					noCheckToken: true,
					data:{BeginDate:"",EndDate:"",CardNo:cardNo}
				}).then(res => {
					let result = res.data;
					if (result.code === 0) {
						this.historyrecipeList = result.data.List;
					}else {
						uni.showToast({
							icon: 'none',
							title: result.msg
						});
					}
				});
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
			switchPatient(item){
				this.currentPatientCardNo = item.cardNo;
				this.currentPatientName = item.patientName;
				this.loadData(item.cardNo);
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
			queryPatientList(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				let data = {openId:this.$globle.token};
				this.$http.request({url:this.$api.uri.querypatientlist,data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					uni.hideLoading();
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
*{ box-sizing: border-box;}
page{ background:#f4f4f4;}
.content{ padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.paypayment_top{ position: fixed; left: 0; top: var(--window-top); z-index: 100; width: 100%; background: #fff; padding: 23rpx 30rpx 20rpx 30rpx; border-bottom: 1px solid #eeeeee;}
.paypayment_top_switch{ float: right; line-height: 42rpx; font-size: 24rpx; color: #3eceb5; border: 1px solid #3eceb5; border-radius: 4rpx; padding: 0 10rpx;}
.paypayment_top_name{ line-height: 50rpx; font-size: 32rpx; color: #000000;}
.payrecord_list{ padding: 160rpx 30rpx 110rpx 30rpx;}
.payrecord_item{ background: #fff; padding: 0 30rpx 0 0; margin-bottom: 14rpx; border:1px solid #eeeeee; border-radius: 6rpx;}
.payrecord_num{ line-height: 75rpx; color: #333333; font-size: 28rpx; border-bottom: 1px solid #ebebeb;
	background: url(~@/static/img/patient03.png) no-repeat 570rpx center; background-size: 14rpx 25rpx;
}
.payrecord_con{ padding: 7rpx 0;border-bottom: 1px solid #eeeeee;
	>view{ line-height: 68rpx; font-size: 28rpx; color: #999999;
		text{ display: block; float: right; color: #000000;}
	}
}
.payrecord_bot{ line-height: 80rpx; font-size: 28rpx; color: #333333;
	text{ display: block; float: right; color: #ff9000;}
}
.payrecord_item_right{ margin-left: 50rpx;}
.payrecord_item_left{ float: left;padding: 30% 0 0 0;
	radio,checkbox{transform:scale(0.6); margin-left:8rpx;}
}
// 
.payrecord_bots{ position: fixed; left: 0; bottom: 0; width: 100%; z-index: 66; line-height: 80rpx; height: 81rpx; border-top: 1px solid #eeeeee; background: #fff; padding: 0 0 0 30rpx;
	.radio{ float: left; font-size: 26rpx; color: #666666;}
	radio,checkbox{transform:scale(0.6)}
}
.payrecord_bots_ri{ float: right;
	view{ height: 80rpx; margin-left: 20rpx; float: right; width: 200rpx; text-align: center; background: #3eceb5; color: #fff; font-size: 28rpx;}
	text{ color: #ff9000;}
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
.uni-checkbox-input.uni-checkbox-input-checked{ background: #000000 !important;}
.uni-checkbox.uni-checkbox-input{ background: #000000 !important;}
</style>
