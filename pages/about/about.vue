<template>
	<view class="content">
		<view class="about_title">
			<text></text>
			医院概况
		</view>
		<view  class="xwdt_box">
			<jyf-parser :html="hospitalInfo.hosInfo"></jyf-parser>
		</view>
	</view>
</template>

<script>
	import parser from "@/components/jyf-parser/jyf-parser.vue";
	export default {
		components:{
			"jyf-parser": parser
		},
		data() {
			return {
				hospitalInfo: {}
			};
		},
		onLoad(options) {
			this.getMainInfo()
		},
		methods:{
			getMainInfo() {
				uni.showLoading({
					title:"加载中...",
					mask:true
				});
				// 查询医院信息
				this.$http.request({
					url: this.$api.uri.queryhispitalinfo,
					method: "GET",
					noCheckToken: true
				}).then(res => {
					uni.hideLoading();
					let result = res.data;
					if (result.code === 0) {
						this.hospitalInfo = result.data;
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
page{ background:#fff;}
.content{ padding: 0;}
.pad030{ padding-left: 30rpx; padding-right: 30rpx;}
.bgf4f4f4{ background: #f4f4f4;}
.btb{ border-bottom: 1px solid #ececec; border-top: 1px solid #ececec;}
.about_title{ padding: 26rpx 0 0 30rpx; line-height: 66upx; font-size: 28rpx; color: #2d2d2d; font-weight: bold; border-bottom: 1px solid #e8e8e8;
	text{ display: block; float: left; width: 4rpx; height: 30rpx; background: #01b8ce; margin: 18rpx 14rpx 0 0;}
}
.about_con{ font-size: 26rpx; color: #333333; line-height: 2em; padding: 35rpx 30rpx;
	>view{ text-indent: 52rpx;}
}
.xwdt_box{line-height: 2.2em; padding:15rpx 30rpx;}
</style>
