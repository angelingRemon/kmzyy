<template>
	<view class="content">
		<view class="patientadd_text">
			本院实行实名制就诊，请您如实填写就诊人信息，如因信息错误产生的一切后果自行负责。
		</view>
		<view class="patientadd_form">
			<view class="patientadd_form_item"><view><input type="text" value="" v-model="form.PatientName" placeholder="请输入患者姓名" /></view><text>患者姓名</text></view>			<view class="patientadd_form_item"><view><input type="text" value="" v-model="form.IDCardNo" placeholder="请输入您的身份证号" /></view><text>身份证号</text></view>			<view class="patientadd_form_item"><view><input type="text" value="" v-model="form.PhoneNumber" placeholder="请输入手机号码" /></view><text>手机号码</text></view>
		</view>
		<view class="regde_btn" @click="submit">确定修改</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				form:{
					CardNo:"",
					PatientName:"",
					IDCardNo:"",
					PhoneNumber:"",
				}
			};
		},
		onLoad(options) {
			
			this.form.CardNo = options.cardNo;
			this.queryPatient();
		},
		methods: {
			queryPatient(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				});
				//1 是身份证号 2就诊卡号
				let data = {QueryType:"2",QueryNo:this.form.CardNo};
				this.$http.request({url:this.$api.uri.querypatientDetail,data: data ,method:"POST",noCheckToken:true}).then(
				    (result) => {
						uni.hideLoading();
						let infoRes = result.data;
						if (infoRes.code === 0) {
							this.form = infoRes.data;
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
			submit(){
				  var rule = [
					{name:"PatientName", checkType : "string", checkRule:"1,8",  errorMsg:"患者姓名应为1-8个字符"},
					{name:"IDCardNo", checkType : "string", checkRule:"1,18",  errorMsg:"请输入正确的身份证号"},
					{name:"PhoneNumber", checkType : "reg", checkRule:"^[1][3|4|5|6|7|8|9][0-9]{9}$",  errorMsg:"请输入正确的手机号码"},
				  ];
					//进行表单检查
				  var checkRes = this.$graceChecker.check(this.form, rule);
				  if(!checkRes){
						uni.showToast({ title: this.$graceChecker.error, icon: "none" });
						return;
				  }
				  
				  uni.showLoading({
				  	title:"提交中...",
				  	mask:true
				  });
				  this.$http.request({url:this.$api.uri.modifypatient,data: this.form,method:"POST",noCheckToken:true}).then(
				      (result) => {
						uni.hideLoading();
				  		let infoRes = result.data;
				  		if (infoRes.code === 0) {
				  			uni.showToast({
				  				icon: 'none',
				  				title: '提交成功'
				  			});
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
			}
		}
	}
</script>

<style lang="scss">
page{ background:#f4f4f4;}
.content{ padding: 0 30rpx;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.patientadd_text{ padding: 15rpx 0 24rpx 0; line-height: 40rpx; font-size: 28rpx; color: #ffba00;}
.patientadd_form{ background: #fff; padding: 0 23rpx; border-radius: 6rpx; border: 1px solid #eeeeee;}
.patientadd_form_item{ line-height: 90rpx; border-bottom: 1px solid #ebebeb;
	&:last-child{ border-bottom: none;}
	>view{ float: right; width: 450rpx;
		input{ display: block; height: 90rpx; line-height: 90rpx; text-align: right; font-size: 28rpx; color: #999999;}
	}
	text{ font-size: 28rpx; color: #333333;}
}
.regde_btn{ margin-top: 60rpx; background: #3eceb5; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;}

</style>
