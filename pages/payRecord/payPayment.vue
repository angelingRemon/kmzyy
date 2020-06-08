<template>
	<view class="content">
		<view class="paypayment_top">
			<view class="paypayment_top_switch" @click="isShow = true">切换就诊人</view>
			<view class="paypayment_top_name" >{{ currentPatientName}}</view>
			<view class="paypayment_top_no" >就诊卡号 : {{currentPatientCardNo }} </view>
		</view>
		<view class="payrecord_list">
			<checkbox-group @change="checkboxChange">
				<image v-show="witPayRecipeList.length == 0" src="~@/static/img/nodata.png" style="display:block;height:410rpx;width:410rpx;margin:120rpx auto;" mode=""></image>
				<view class="payrecord_item"  v-for="(item,index) in witPayRecipeList" :key="index">
					<view class="payrecord_item_left">
						<checkbox name="recipeNo" :checked="item.checked" @click="onItemClick(item)" :value="item.RecipeNo" color="#ff9000" />
					</view>
					<view class="payrecord_item_right" @click="goInfo(item.RecipeNo,currentPatientCardNo)">
						<view class="payrecord_num">处方号：{{item.RecipeNo}}</view>
						<view class="payrecord_con">
							<view class=""><text>{{item.RecipeName}}</text>处方名称</view>
							<view class=""><text>{{item.DeptName}}</text>就诊科室名称</view>
							<view class=""><text>{{item.DoctorName}}</text>就诊医生姓名</view>
							<view class=""><text>{{item.RecipeDate}}</text>处方日期</view>
						</view>
						<view class="payrecord_bot">
							<text>￥{{item.RecipeCost}}</text>
							处方金额
						</view>
					</view>
				</view>
			</checkbox-group>
		</view>
		<view class="payrecord_bots">
			<label class="radio"    >
				<checkbox name="recipeNo" :checked="isAllCheck" @click="selectAll"  color="#ff9000" />全选
			</label>
			<view class="payrecord_bots_ri">
				<view @click="createRecipeOrder">去缴费</view>
				总金额:<text>￥{{sumCost}}</text>
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
				
				
				witPayRecipeList :[],
				recipeNos:[],
				isAllCheck:false,
				sumCost: 0.00,
			};
		},
		onLoad() {
		},
		onShow() {
			this.queryPatientList();
			this.isAllCheck = false;
			this.recipeNos = [];
			this.sumCost = 0;
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
							      content: '取消支付，再次支付，请到缴费记录继续支付',
							  	showCancel:false
							  });
						  }
					});
					
				});
				
				uni.$wx.error(function(res){
					console.log(res);
				});
			},
			createUnifiedOrder(hisOrderId,orderCost){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				//微信预支付下单
				let _self = this;
				let data = {HisOrderId:hisOrderId,OrderCost:orderCost};
				_self.$http.request({url:_self.$api.uri.createUnifiedOrder,
				data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					uni.hideLoading();
					let infoRes = result.data;
					if (infoRes.code === 0) {
						let config = infoRes.data;
						_self.wxChoosePay(config,hisOrderId,orderCost);
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
						title: '创建微信订单失败，请稍后再试'
					});
				});
			},
			createRecipeOrder(){
				//创建HIS订单
				if(!this.currentPatientCardNo){
					return;
				}
				if(this.recipeNos.length<=0){
					uni.showToast({
						icon: 'none',
						title: '请选择处方'
					});
					return;
				}
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				let data = {CardNo:this.currentPatientCardNo,RecipeNoArray:this.recipeNos};
				this.$http.request({url:this.$api.uri.createRecipeOrder,
				data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					uni.hideLoading();
					let infoRes = result.data;
					if (infoRes.code === 0) {
						let hisOrderId =  infoRes.data.HisOrderId;
						let orderCost =  infoRes.data.OrderCost;
						this.createUnifiedOrder(hisOrderId,orderCost);
					} else {
						uni.showModal({
						    title: '提示',
						    content: infoRes.msg,
							showCancel:false
						});
					}
				}).catch(error => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '创建订单失败，请稍后再试'
					});
				});
				
			},
			goInfo(recipeNo,cardNo){
				uni.navigateTo({
					url: this.$api.sp.consultDetails+"?CardNo="+cardNo+"&RecipeNo="+recipeNo
				});
			},
			selectAll() {
				this.isAllCheck = !this.isAllCheck;
				this.recipeNos = [];
				this.sumCost = 0;
				this.witPayRecipeList.forEach((item, index) => {
					if(this.isAllCheck){
						this.witPayRecipeList[index].checked = true;
						//设置选择的数组
						this.recipeNos.push(item.RecipeNo);
						//合计选择的金额
						this.sumCost = this.numFilter(Number(this.sumCost) + Number(item.RecipeCost)) ;
					}else{
						this.witPayRecipeList[index].checked = false;
						
					}
				});
			},
			checkboxChange (e) {
				let values = e.detail.value;
				this.recipeNos = values;
				//处理统一全选
				if(this.witPayRecipeList.length==values.length){
					this.isAllCheck = true;
				}else{
					this.isAllCheck = false;
				}
			},
			onItemClick(item){
				item.checked = !item.checked
				this.computSumCost();
				
			},
			computSumCost(){
				this.sumCost = 0;
				this.witPayRecipeList.forEach((item, index) => {
					if(item.checked){
						//合计选择的金额
						this.sumCost = this.numFilter(Number(this.sumCost) + Number(item.RecipeCost)) ;
					}
				});
			},
			numFilter(value) {
				// 截取当前数据到小数点后三位
				let realVal = parseFloat(value).toFixed(2);
				return realVal;
			},
			queryWaitPayRecipe(){
				if(!this.currentPatientCardNo){
					return;
				}
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				let data = {CardNo:this.currentPatientCardNo};
				this.$http.request({url:this.$api.uri.queryWaitPayRecipe,data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					uni.hideLoading();
					let infoRes = result.data;
					if (infoRes.code === 0) {
						this.witPayRecipeList = infoRes.data.List;
						for (var i = 0; i < this.witPayRecipeList.length; i++) {
							this.$set(this.witPayRecipeList[i], "checked", false);
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
			},
			initDefPatient(){
				for (var i = 0; i < this.patientList.length; i++) {
					var patient = this.patientList[i];
					if(patient.defaults){
						this.currentPatientCardNo = patient.cardNo;
						this.currentPatientName = patient.patientName;
						//查询处方
						this.queryWaitPayRecipe();
					}
				}
				
				
			},
			switchPatient(item){
				this.currentPatientCardNo = item.cardNo;
				this.currentPatientName = item.patientName;
				
				//查询处方
				this.queryWaitPayRecipe();
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
