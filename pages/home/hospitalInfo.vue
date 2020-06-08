<template>
	<view class="content">
		<view class="swiper_box" v-if="bannerImageList.length>0">
			<swiper class="swiper" :autoplay="false" :indicator-dots="true" :indicator-color="'rgba(255,255,255,0.5)'"
			 :indicator-active-color="'#08ccc8'" :interval="5000" :duration="500" style="height: 440rpx;">
				<swiper-item v-for="(item, index) in bannerImageList" :key="index" style="height: 440rpx;">
					<image :src="imgPath + '/' + item.imageUrl" mode="" style="display: block; width: 100%; height: 440rpx;"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="swiper_box" v-else>
			<swiper class="swiper" :autoplay="false" :indicator-dots="true" :indicator-color="'rgba(255,255,255,0.5)'"
			 :indicator-active-color="'#08ccc8'" :interval="5000" :duration="500" style="height: 440rpx;">
				<swiper-item style="height: 440rpx;">
					<image src="../../static/images/z001.jpg" mode="" style="display: block; width: 100%; height: 440rpx;"></image>
				</swiper-item>
			</swiper>
		</view>


		<view class="index_title pad030">
			{{hospitalInfo.hosName}}
		</view>
		<view class="pad030">
			<view class="index_tel clearfix">
				<text>{{hospitalInfo.hosTels}}</text>
			</view>
			<view class="index_site">
				<navigator :url="'/pages/home/mapInfo?hosLatitude='+hosLatitude">
				<view class="">
					<image src="../../static/img/index01.png" mode=""></image>{{hospitalInfo.hosAddrs}}
				</view>
				</navigator>
				<view class="">
					<image src="../../static/img/index02.png" mode=""></image>{{hospitalInfo.hosTraffic}}
				</view>
			</view>
		</view>
		<view class="bgf4f4f4 btb" style="height: 23rpx;"></view>
		<view class="index_menu clearfix">
			<!-- view和navigator都可以 -->
			<navigator :url="this.$api.sp.dbxzList">
				<image src="../../static/img/index03.png" mode=""></image>
				<text>冬病夏治</text>
			</navigator>
			<navigator url="/pages/department/department_introduce">
				<image src="../../static/img/index04.png" mode=""></image>
				<text>名医介绍</text>
			</navigator>
			<navigator :url="'/pages/home/mapInfo?hosLatitude='+hosLatitude">
				<image src="../../static/img/index05.png" mode=""></image>
				<text>医院地址</text>
			</navigator>
			<navigator :url="this.$api.sp.lcdhList">
				<image src="../../static/img/index06.png" mode=""></image>
				<text>楼层导航</text>
			</navigator>
			<navigator :url="this.$api.sp.jyznList">
				<image src="../../static/img/index07.png" mode=""></image>
				<text>就医指南</text>
			</navigator>
			<navigator :url="this.$api.sp.xwdtList">
				<image src="../../static/img/index08.png" mode=""></image>
				<text>新闻动态</text>
			</navigator>
			<navigator :url="this.$api.sp.sybzList">
				<image src="../../static/img/index09.png" mode=""></image>
				<text>使用帮助</text>
			</navigator>
			<navigator url="/pages/about/about">
				<image src="../../static/img/index10.png" mode=""></image>
				<text>医院概况</text>
			</navigator>
		</view>
		<view class="bgf4f4f4 btb" style="height: 23rpx;"></view>
		<view class="index_hot_doc pad030">推荐医生</view>
		<view class="index_hot_doc_list">
			<swiper class="swiper" :autoplay="true" :indicator-dots="false" :indicator-color="'#d5d5d5'" :indicator-active-color="'#08ccc8'"
			 :interval="5000" :duration="500" style="height: 210rpx;">
				<swiper-item v-for="(item,index) in doctorList" :key="index" style="height: 210rpx;">
					<navigator class="index_hot_item" :url="'/pages/doctor/doctorDetails_introduce?DoctorCode='+item.DoctorCode">
						<image src="../../static/images/z002.png" mode=""></image>
						<view class="index_hot_item_right">
							<view class="index_hot_item_t">
								<text class="">{{item.DoctorName || '暂无'}}</text>
								<text class="">{{item.DoctorLevel || '暂无'}}</text>
								<image src="../../static/img/index11.png" mode=""></image>
							</view>
							<view class="index_hot_item_b">专业特长：{{item.Description || '暂无'}}</view>
						</view>
					</navigator>
				</swiper-item>
			</swiper>

		</view>
		<view class="bgf4f4f4" style="height: 23rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgPath: this.$globle.imgHtmlPath,
				bannerImageList: [],
				hospitalInfo: {
					hosName: "呼和浩特金桥凯蒙中医医院",
					hosTels: "0471-6378031",
					hosAddrs: "呼和浩特市赛罕区金桥开发区阿拉坦大街旺第嘉华南门东50米",
					hosTraffic: "交通方式：公交202路 78路 100路"
				},
				hosLatitude:"",
				doctorList : [],
			};
		},
		onLoad(options) {
			/** 首页 医疗服务 个人中心 必须设置 token **/
			this.$globle.saveToken(options.token);
			this.getMainInfo()
		},
		methods: {
			getMainInfo() {
				// 查询轮播图
				this.$http.request({
					url: this.$api.uri.yyxxBanner,
					method: "GET",
					noCheckToken: true
				}).then(res => {
					this.bannerImageList = res.data.data
				});
				// 查询医院信息
				this.$http.request({
					url: this.$api.uri.queryhispitalinfo,
					method: "GET",
					noCheckToken: true
				}).then(res => {
					let result = res.data;
					if (result.code === 0) {
						this.hospitalInfo = result.data;
						this.hosLatitude = result.data.hosLatitude;
					}
				});
				
				// 查询医生列表信息
				this.$http.request({
					url: this.$api.uri.querydoctor,
					method: "POST",
					noCheckToken: true
				}).then(res => {
					let result = res.data;
					if (result.code === 0) {
						this.doctorList = result.data.List;
					}
				});

			}
		}
	};
</script>

<style lang="scss">
	@mixin ellipsiso {
		display: block;
		overflow: hidden;
		white-space: nowrap;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
	}

	@mixin ellipsiss($num1, $num2) {
		line-height: $num2 + upx;
		overflow: hidden;
		display: -webkit-box;
		height: $num1*$num2 + upx;
		-webkit-line-clamp: $num1;
		-webkit-box-orient: vertical;
	}

	.content {
		min-height: 100vh;
		padding: 0;
		background: #fff;
	}

	.clearfix:after {
		content: ".";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}

	.clearfix {
		display: inline-block;
		display: block;
		zoom: 1;
	}

	.pad030 {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	// @import "@/static/test.scss";
	.bgf4f4f4 {
		background: #f4f4f4;
	}

	.swiper_box {
		overflow: hidden;
	}

	.index_title {
		line-height: 72rpx;
		font-size: 30rpx;
		color: #333333;
		border-bottom: 1px solid #eaeaea;
	}

	.index_tel {
		padding: 20rpx 0 14rpx 0;

		text {
			display: block;
			float: left;
			line-height: 42rpx;
			font-size: 28rpx;
			color: #0cb093;
			border: 1px solid #0cb093;
			padding: 0 12rpx;
			border-radius: 6rpx;
		}
	}

	.index_site {
		line-height: 48rpx;
		font-size: 24rpx;
		color: #666666;
		padding-bottom: 10rpx;

		image {
			display: inline-block;
			vertical-align: middle;
			height: 27rpx;
			width: 27rpx;
			margin-right: 12rpx;
		}
	}

	.btb {
		border-bottom: 1px solid #ececec;
		border-top: 1px solid #ececec;
	}

	.index_menu {
		text-align: center;
		padding: 10rpx 0 5rpx 0;

		>view,
		>navigator {
			float: left;
			width: 25%;
			padding: 20rpx 0;
		}

		image {
			display: block;
			width: 88rpx;
			height: 88rpx;
			margin: 0 auto;
		}

		text {
			display: block;
			line-height: 62rpx;
			font-size: 26rpx;
			color: #666666;
		}
	}

	// 
	.index_hot_doc {
		line-height: 86rpx;
		font-size: 28rpx;
		color: #151515;
		border-bottom: 1px dashed #e5e5e5;
		font-weight: bold;
	}

	.index_hot_item {
		padding: 30rpx;
		>image {
			display: block;
			float: left;
			height: 112rpx;
			width: 112rpx;
			border: 4rpx solid #e4e4e4;
			border-radius: 50%;
			;
		}
	}

	.index_hot_item_right {
		margin-left: 142rpx;
	}

	.index_hot_item_t {
		line-height: 52rpx;
		padding-top: 6rpx;

		text:nth-child(1) {
			font-size: 32rpx;
			color: #2d2d2d;
		}

		text:nth-child(2) {
			font-size: 24rpx;
			color: #999999;
		}

		text {
			margin-right: 28rpx;
		}

		>image {
			height: 15rpx;
			width: 28rpx;
			vertical-align: middle;
		}
	}

	.index_hot_item_b {
		line-height: 48rpx;
		font-size: 24rpx;
		color: #999999;
		@include ellipsiso;
	}
</style>
