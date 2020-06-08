<template>
	<view class="content">
		<view class="xwdt_title">{{notice.noticeTitle}}</view>
		<view class="xwdt_time">
			<text>浏览量：{{notice.readTimes}}次</text>
			{{notice.createTime}}
		</view>
		<view v-if="notice.noticeImg && JSON.parse(notice.noticeImg).length > 0" class="p-2">
			<image :src="imgPath + '/nonlogin/fileupload/viewimg/' + JSON.parse(notice.noticeImg)[0].id" mode="widthFix" 
			style="width: 100%;" class="rounded"></image>
		</view>
		<view  class="xwdt_box">
			<jyf-parser :html="notice.noticeContent"></jyf-parser>
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
				imgPath:this.$globle.imgHtmlPath,
				notice:{}
			};
		},
		onLoad: function (option) {
			this.getNewsDetail(option.id)
		},
		methods:{
			getNewsDetail(id){
				// 查询详情
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				this.$http.request({
					url:this.$api.uri.indexNewsDetail(id),
					method: "GET",
					noCheckToken:true
				}).then(res=>{
					uni.hideLoading()
					this.notice = res.data
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
@import "@/static/css/news.scss";
.p-2 { padding: 20rpx; }
.rounded { border-radius: 8rpx;}
</style>
