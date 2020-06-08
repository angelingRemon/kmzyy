<template>
	<view class="content">
		<view class="swiper_box" v-if="bannerImageList.length>0">
			<swiper class="swiper" :autoplay="false" :indicator-dots="true" :indicator-color="'rgba(255,255,255,0.5)'"
			 :indicator-active-color="'#08ccc8'" :interval="5000" :duration="500" style="height: 440rpx;">
				<swiper-item  v-for="(item, index) in bannerImageList"  :key="index" style="height: 440rpx;">
					<image :src="imgPath + '/' + item.imageUrl" mode="" style="display: block; width: 100%; height: 440rpx;"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="swiper_box" v-else >
			<swiper class="swiper" :autoplay="false" :indicator-dots="true" :indicator-color="'rgba(255,255,255,0.5)'"
			 :indicator-active-color="'#08ccc8'" :interval="5000" :duration="500" style="height: 440rpx;">
				<swiper-item  style="height: 440rpx;">
					<image  src="../../static/images/z001.jpg" mode="" style="display: block; width: 100%; height: 440rpx;"></image>
				</swiper-item>
			</swiper>
		</view>
		
		
		<view class="home_menu clearfix">
				<navigator url="/pages/department/department" class="home_menu_item home_menu1">
					<view class="">预约挂号</view>
					<text>当日挂号、预约挂号</text>
				</navigator>
			
				<navigator :url="$api.sp.payPayment" class="home_menu_item home_menu2">
					<view class="">门诊缴费</view>
					<text>在线缴费快速不排队</text>
				</navigator>
		</view>
		<view class="bgf4f4f4 btb" style="height: 20rpx;"></view>
		<view class="index_menu clearfix">
			<!-- view和navigator都可以 -->
			<navigator :url="$api.sp.registerList">
				<image src="../../static/img/home09.png" mode=""></image>
				<text>挂号记录</text>
			</navigator>
			<navigator :url="$api.sp.payRecord">
				<image src="../../static/img/home05.png" mode=""></image>
				<text>缴费记录</text>
			</navigator>
			<navigator :url="$api.sp.consultList">
				<image src="../../static/img/home10.png" mode=""></image>
				<text>看诊记录</text>
			</navigator>
			<navigator :url="$api.sp.patientList">
				<image src="../../static/img/home08.png" mode=""></image>
				<text>我的就诊人</text>
			</navigator>
			<navigator :url="$api.sp.survey">
				<image src="../../static/img/home04.png" mode=""></image>
				<text>满意度调查</text>
			</navigator>
			<navigator :url="$api.sp.kefuIntroduce">
				<image src="../../static/img/home03.png" mode=""></image>
				<text>客服导诊</text>
			</navigator>
			<navigator :url="$api.sp.department_introduce+'?type=zxzx'">
				<image src="../../static/img/home06.png" mode=""></image>
				<text>在线咨询</text>
			</navigator>
			<view @click="showBuiding">
				<image src="../../static/img/home07.png" mode=""></image>
				<text>报告查询</text>
			</view>
			
		</view>
		<view class="bgf4f4f4 btb" style="height: 23rpx;"></view>
		<view class="index_hot_doc pad030">新闻动态</view>
		<view class="index_hot_doc_list">
			<swiper class="swiper" :autoplay="true" :indicator-dots="true" :indicator-color="'#d5d5d5'"
			 :indicator-active-color="'#08ccc8'" :interval="5000" :duration="500" style="height: 210rpx;">
				<swiper-item v-for="(item, index) in newsList" :key="index" style="height: 210rpx;">
					<navigator :url="newsDetailPath + '?id=' + item.noticeId" class="clearfix">
						<view class="index_hot_item">
							<image v-if="item.noticeImg && JSON.parse(item.noticeImg).length > 0" :src="imgPath + '/nonlogin/fileupload/viewimg/' + JSON.parse(item.noticeImg)[0].id" mode=""></image>
							<image v-else src="../../static/images/z001.jpg" mode=""></image>
							<view class="index_hot_item_right">
								<view class="index_hot_item_t">{{item.noticeTitle}}</view>
								<view class="index_hot_item_b">{{item.createTime}}
								   <image src="../../static/img/index11.png" mode=""></image>
								</view>
							</view>
						</view>
					</navigator>
				</swiper-item>
			</swiper>
		</view>
		<view class="bgf4f4f4" style="height: 23rpx;"></view>
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
				imgPath:this.$globle.imgHtmlPath,
				bannerImageList:[],
				newsList:[],
				newsDetailPath:this.$api.sp.xwdtDetail,
			};
		},
		onLoad(options) {
			/** 首页 医疗服务 个人中心 必须设置 token **/
			this.$globle.saveToken(options.token);
			this.getBannerinfo();
			this.getXwdtList();
			// this.initZim();
	    },
		methods:{
			showBuiding(){
				//this.$store.dispatch('checkoutConversation', "c2c:1:"+this.myInfo.id);
				uni.showToast({
					icon: 'none',
					title: "功能正在建设中，敬请期待！"
				});
			},
			getBannerinfo() {
				// 查询轮播图
				this.$http.request({
					url:this.$api.uri.indexBanner,
					method: "GET",
					noCheckToken:true
				}).then(res=>{
					this.bannerImageList = res.data.data||[];
				});
				
			},
			getXwdtList() {
				this.$http.request({
					url:this.$api.uri.indexNewsList,
					data: {noticeType:'3',status:'0',pageSize:'5',pageNum:'1'},
					method:"POST",
					noCheckToken:true})
					.then( (result) => {
						let infoRes = result.data;
						console.log(infoRes)
						if (infoRes.code === 0) {
							this.newsList =infoRes.rows;
						}
					});
			}
		}
	};
	
</script>

<style lang="scss">
@mixin ellipsiso { display: block; overflow: hidden; white-space: nowrap; -o-text-overflow: ellipsis; text-overflow: ellipsis; }
@mixin ellipsiss($num1, $num2) { line-height: $num2 + upx; overflow: hidden; display: -webkit-box; height: $num1*$num2 + upx;
 -webkit-line-clamp: $num1; -webkit-box-orient: vertical; }
page{ background:#fff;}
.content{ padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.pad030{ padding-left: 30rpx; padding-right: 30rpx;}
.bgf4f4f4{ background: #f4f4f4;}
.btb{ border-bottom: 1px solid #ececec; border-top: 1px solid #ececec;}
// @import "@/static/test.scss";
.home_menu{ padding: 42rpx 28rpx; background: #fff;}
.home_menu_item{ width: 318rpx; height: 115rpx;padding-left: 110rpx;
	view{ padding-top: 23rpx; line-height: 38rpx; font-size: 26rpx; color: #ffffff;}
	text{display: block; font-size: 20rpx; line-height: 32rpx; color: #e2fffd;white-space: nowrap;transform: scale(0.95); margin-left: -5px;}
}
.home_menu1{ float: left; background: url(~@/static/img/home01.png) no-repeat center;background-size: 100% 100%;}
.home_menu2{ float: right; background: url(~@/static/img/home02.png) no-repeat center;background-size: 100% 100%;}
// 
.index_menu{ text-align: center; padding: 10rpx 0 5rpx 0; background: #fff;
	>view,>navigator{ float: left; width: 25%; padding: 20rpx 0;}
	image{ display: block; width: 88rpx; height: 88rpx;margin: 0 auto;}
	text{ display: block; line-height: 62rpx; font-size: 26rpx; color: #666666;}
}
.index_hot_doc{ line-height: 86rpx; font-size: 28rpx; color: #151515; border-bottom: 1px dashed #e5e5e5; font-weight: bold; background: #fff;}
.index_hot_item{ padding: 30rpx;
	>image{ display: block; float: left; height: 112rpx; width: 112rpx; border: 4rpx solid #e4e4e4; border-radius: 50%;;}
}
.index_hot_doc_list{ background: #fff;}
.index_hot_item_right{ margin-left: 142rpx;}
.index_hot_item_t{ line-height: 48rpx; padding-top: 10rpx; font-size: 28rpx; color: #2d2d2d;
	@include ellipsiso;
}
.index_hot_item_b{ line-height: 40rpx; font-size: 24rpx; color: #bbbbbb;
	>image{ height: 15rpx; width: 28rpx; vertical-align: middle; margin-left: 28rpx;}
}
</style>
