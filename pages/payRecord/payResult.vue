<template>
	<view class="padding-xs">
		<view class='bg-white padding-lr'>
			<view class='padding-top padding-xs flex align-center'>
				<view class='flex-sub text-center'>
					<view class='text-xsl padding'>
						<text v-bind:class="{'cuIcon-roundclosefill text-red':!paySucc,'cuIcon-roundcheckfill text-green':paySucc}" ></text>
					</view>
					<view class="text-xl padding-xs">
						<text class="text-black text-bold">{{payText}}</text>
					</view>
					<view class="text-xxl">
						<text class="text-price text-red">{{orderCost}}</text>
					</view>
					<view class="padding">{{payDesc}}</view>
				</view>
			</view>
			
			<view class="padding flex flex-direction">
				<view class="regde_btn margin-tb-sm lg" @click="showDetail">查看缴费记录</view>
			</view>
			
			<view class="cu-load load-modal" v-if="loadModal">
				<view class="text-bold gray-text">支付中...</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadModal: false,
				paySucc:true,
				payText:"",
				payDesc:"",
				hisOrderId:"",
				orderCost:""
			};
		},
		onLoad(options){
			this.hisOrderId = options.hisOrderId;
			this.orderCost = options.orderCost;
			this.loadModals();
		},
		methods:{
			loadModals(e) {
				this.loadModal = true;
				setTimeout(() => {
					this.queryOrderDetail();
				}, 3000)
			},
			queryOrderDetail() {
				let data = {HisOrderId:this.hisOrderId};
				this.$http.post(this.$api.uri.queryRecipePayStatus,data).then(
				(result) => {
					this.loadModal = false;
					let infoRes = result.data;
					if (infoRes.code === 0) {
						let resData = infoRes.data;
						if(resData.PayStatus == "1"){
							this.paySucc = false;
							this.payText = "支付中";
							this.payDesc = "支付中，如您已付款，请勿重复支付，请稍后查询缴费记录!";
						}else if(resData.PayStatus == "2"){
							this.paySucc = true;
							this.payText= "支付成功";
							this.payDesc = "该门诊缴费订单【"+this.hisOrderId+"】已支付成功，详情请查询缴费记录";
						}else if(resData.PayStatus == "3"){
							this.paySucc = false;
							this.payText= "已取消";
							this.payDesc = "如您已付款，请勿重复支付，请稍后查询缴费记录";
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
			showDetail(){
				//跳转到缴费列表页面
				uni.redirectTo({
					url:this.$api.sp.payRecord
				})
			}
		}
	}
</script>

<style lang="scss">
.regde_btn{ margin-top: 60rpx; background: #3eceb5; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;}
</style>
