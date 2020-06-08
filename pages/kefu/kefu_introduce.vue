<template>
	<view class="content">
<!--		<view class="doctor_top">-->
<!--			{{DeptName}}共{{doctorNum}}位医生-->
<!--		</view>-->
		<view class="doctor_list">
			<navigator class="doctor_item" v-for="item in kefuList" :key="item.userId" @click="openLiaoTian(item)">
				<image src="../../static/images/z002.png" mode=""></image>
				<view class="doctor_list_right">
					<view class="doctor_list_name">
						{{item.userName || '暂无'}} <text> </text>
					</view>
					<view class="doctor_list_con">
						工号：{{item.userId || '暂无'}}
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState({
				myInfo: state => state.imuser.myInfo
			})
		},
		data() {
			return {
				kefuList : [],
			};
		},onLoad(e) {
			this.loadData();
		},methods:{
			openLiaoTian(kfUser){
				uni.showLoading({
					title:"加载中...",
					mask:true
				});
				this.$http.post(this.$api.uri.imusercreate,{userId:kfUser.userId}).then(res=>{
					let resultData = res.data;
					uni.hideLoading();
					if(resultData.code === 0){
						let conversationID = "c2c:"+kfUser.userId+":"+this.myInfo.id;
						this.$store.dispatch('checkoutConversationSetTitle', {conversationID:conversationID,title:kfUser.userName+"导诊"});
					}else{
						uni.showToast({
							icon: 'none',
							title: '发起客服导诊失败'
						});
					}
				}).catch(err=>{
					console.log(err);
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '发起客服导诊失败'
					});
				});

			},
			loadData(){
				// 查询医生列表信息
				this.$http.request({
					url: this.$api.uri.kefulist,
					method: "POST",
				}).then(res => {
					let result = res.data;
					if (result.code === 0) {
						this.kefuList = result.data;
					}
				});
			}
		}
	}
</script>

<style lang="scss">
@mixin ellipsiss($num1, $num2) { line-height: $num2 + rpx; overflow: hidden; display: -webkit-box; height: $num1*$num2 + rpx;
 -webkit-line-clamp: $num1; -webkit-box-orient: vertical; }
page{ background:#fff;}
.content{ padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.doctor_top{ line-height: 88rpx; padding: 0 30rpx; background: #f4f4f4; border-bottom: 1px solid #eeeeee; font-size: 22rpx; color: #999999;}
.doctor_item{ padding: 22rpx 30rpx; border-bottom: 1px dashed #e0dfdf;
	>image{ float: left; height: 154rpx; width: 154rpx; border: 1px solid #e6e6e6; border-radius: 50%;}
}
.doctor_list_right{ height: 154rpx; margin-left: 190rpx;}
.doctor_list_name{ height: 76rpx; line-height: 76rpx; font-size: 30rpx; color: #333333; font-weight: bold;
	text{ display: inline-block; line-height: 42rpx; vertical-align: middle; font-size: 24rpx; color: #ffffff; margin-left: 28rpx; background: #00dfca; padding: 0 14rpx; border-radius: 6rpx; }
}
.doctor_list_con{ font-size: 24rpx; color: #666666;
	@include ellipsiss(2,34)
}
</style>
