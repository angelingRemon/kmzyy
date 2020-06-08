<template>
	<view class="content">
		<image v-show="newsList.length == 0" src="~@/static/img/nodata.png" style="display:block;height:410rpx;width:410rpx;margin:120rpx auto;" mode=""></image>
		<view class="news_list">
			<block v-for="(item, index) in newsList" :key="index">
				<navigator :url="newsDetailPath + '?id=' + item.noticeId" class="clearfix">
					<image v-if="item.noticeImg && JSON.parse(item.noticeImg).length > 0" :src="imgPath + '/nonlogin/fileupload/viewimg/' + JSON.parse(item.noticeImg)[0].id" mode=""></image>
					<image v-else src="/static/images/z001.jpg" mode=""></image>
					<view class="news_list_right">
						<view class="news_list_title">{{item.noticeTitle}}</view>
						<view class="news_list_time">
							<text>{{item.createTime}}</text>
							<image src="../../../static/img/index11.png" mode=""></image>
						</view>
					</view>
				</navigator>
			</block>
			<view class="cu-load" :class="loadingClass"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgPath:this.$globle.imgHtmlPath,
				newsDetailPath:this.$api.sp.xwdtDetail,
				loadingClass:"loading",
				newsList:[]
			};
		},
	    onLoad: function (option) {
			this.currentUrlBase64 = this.$utils.getUrlBase64(this.route,option);
			// 请求列表数据
			this.getNewsList()
	    },
		methods:{
			getNewsList(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				this.pageObj = this.$http.pageRequest({
					url : this.$api.uri.indexNewsList,
					currentUrlBase64:this.currentUrlBase64,
					data:{
						noticeType:'3',
						status:'0'
					},
					noCheckToken:true,
					resultP:{
						setLoading:(_class) =>{
							uni.hideLoading()
							this.loadingClass = _class;
						},
						setDataList:(list) =>{
							uni.hideLoading()
							this.newsList =list;
						}
					}
				});
				this.pageObj.loadFrist();
			}
		},
		onPullDownRefresh() {
			this.pageObj.loadFrist();
		},
		onReachBottom(){
			this.pageObj.addData(1);
		}
	}
</script>

<style lang="scss">
@import "@/static/css/news.scss";
</style>
