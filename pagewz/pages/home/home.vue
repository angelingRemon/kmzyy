<template>
	<view>
		<!-- 搜索条 -->
		<view class="searchMain">
			<view class="searchBox">
				<text class="cuIcon-search"></text>
				<view class="searchInput">
					<input type="text" value="" placeholder="搜索疾病、医生、科室、医院" />
				</view>
			</view>
		</view>
		<!-- banner -->
		<view class="bannerMain">
			<swiper class="swiper" :autoplay="false" :indicator-dots="true" :indicator-color="'rgba(255,255,255,0.5)'"
			 :indicator-active-color="'#08ccc8'" :interval="5000" :duration="500">
				<swiper-item v-for="(item, index) in bannerImageList" :key="index">
					<image :src="item.imageUrl" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- menu -->
		<view class="menuMain">
			<view class="menuBox">
				<view class="menuTopBox">
					<router-link to="" class="menuTopItem">
						<image src="../../static/images/menu/menuTopIcon1.png" mode="widthFix"></image>
						<text>免费咨询</text>
						<text>方便快速</text>
					</router-link>
					<router-link to="" class="menuTopItem">
						<image src="../../static/images/menu/menuTopIcon2.png" mode="widthFix"></image>
						<text>找医生</text>
						<text>三甲名医</text>
					</router-link>
					<router-link to="" class="menuTopItem">
						<image src="../../static/images/menu/menuTopIcon3.png" mode="widthFix"></image>
						<text>去开药</text>
						<text>安全便捷</text>
					</router-link>
				</view>
				<view class="menuSubBox">
					<view class="menuSubItem">
						<image src="../../static/images/menu/menuSubIcon1.png" mode="widthFix"></image>
						<view>
							<text>专家在线</text>
							<text>权威专业</text>
						</view>
					</view>
					<view class="menuSubItem">
						<image src="../../static/images/menu/menuSubIcon2.png" mode="widthFix"></image>
						<view>
							<text>电话问诊</text>
							<text>实时通话</text>
						</view>
					</view>
					<view class="menuSubItem">
						<image src="../../static/images/menu/menuSubIcon3.png" mode="widthFix"></image>
						<view>
							<text>视频问诊</text>
							<text>面对面咨询</text>
						</view>
					</view>
					<view class="menuSubItem">
						<image src="../../static/images/menu/menuSubIcon4.png" mode="widthFix"></image>
						<view>
							<text>申请找药</text>
							<text>新药特药</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- doctor -->
		<view class="doctorMain">
			<view class="tabMain">
				<view class="tabBox">
					<view class="active">
						呼吸内科
					</view>
					<view>
						内科
					</view>
					<view>
						外科
					</view>
					<view>
						妇科
					</view>
					<view>
						儿科
					</view>
				</view>
				<view class="tabViewMore">
					更多 <text class="cuIcon-right lg"></text>
				</view>
			</view>
			<view class="doctorListMain">
				<view class="doctorListItem">
					<image class="vDoctorIcon" src="../../static/images/vDoctorIcon.png" mode="widthFix"></image>
					<view class="headerImg">
						<image src="../../static/images/doctor.jpg" mode="widthFix"></image>
					</view>
					<text class="name">郭福莹</text>
					<text class="subTitle">呼吸内科 | 副主任医师</text>
					<text class="hospital">沈阳医学院附属第二医院</text>
				</view>
				<view class="doctorListItem">
					<image class="vDoctorIcon" src="../../static/images/vDoctorIcon.png" mode="widthFix"></image>
					<view class="headerImg">
						<image src="../../static/images/doctor.jpg" mode="widthFix"></image>
					</view>
					<text class="name">郭福莹</text>
					<text class="subTitle">呼吸内科 | 副主任医师</text>
					<text class="hospital">沈阳医学院附属第二医院</text>
				</view>
				<view class="doctorListItem">
					<image class="vDoctorIcon" src="../../static/images/vDoctorIcon.png" mode="widthFix"></image>
					<view class="headerImg">
						<image src="../../static/images/doctor.jpg" mode="widthFix"></image>
					</view>
					<text class="name">郭福莹</text>
					<text class="subTitle">呼吸内科 | 副主任医师</text>
					<text class="hospital">沈阳医学院附属第二医院</text>
				</view>
				<view class="doctorListItem">
					<image class="vDoctorIcon" src="../../static/images/vDoctorIcon.png" mode="widthFix"></image>
					<view class="headerImg">
						<image src="../../static/images/doctor.jpg" mode="widthFix"></image>
					</view>
					<text class="name">郭福莹</text>
					<text class="subTitle">呼吸内科 | 副主任医师</text>
					<text class="hospital">沈阳医学院附属第二医院</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bannerImageList: [{
						imageUrl: "../../static/images/bannerImg.png"
					},
					{
						imageUrl: "../../static/images/bannerImg.png"
					},
					{
						imageUrl: "../../static/images/bannerImg.png"
					}
				],
			};
		}
	}
</script>

<style lang="scss">
	.searchMain {
		padding: 30upx;
		background: #fff;

		.searchBox {
			background: #F8F7F7;
			height: 72upx;
			line-height: 72upx;
			overflow: hidden;
			border-radius: 72upx;

			.cuIcon-search {
				display: block;
				width: 72upx;
				height: 72upx;
				text-align: center;
				line-height: 72upx;
				font-size: 29upx;
				float: left;
			}

			.searchInput {
				padding-left: 72upx;

				input {
					height: 72upx;
					font-size: 28upx;

					&::-webkit-input-placeholder {
						color: #BFBEBE;
					}
				}

			}
		}
	}

	.bannerMain {
		padding: 0 30upx;
		height: 240upx;

		.swiper {
			height: 240upx;
			border-radius: 10upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 240upx;
				display: block;
			}

			.uni-swiper-dot-active {
				width: 30upx !important;
			}
		}
	}

	.menuMain {
		padding: 30upx;

		.menuBox {
			background: #fff;
			border-radius: 20upx;

			.menuTopBox {
				display: flex;
				justify-content: space-between;

				.menuTopItem {
					width: 100%;
					padding-top: 40upx;
					text-decoration: none;

					image {
						width: 106upx;
						height: 106upx;
						display: block;
						margin: 0 auto;
					}

					text {
						display: block;
						text-align: center;

						&:first-of-type {
							font-size: 30upx;
							line-height: 30upx;
							margin-top: 34upx;
							color: rgba(37, 37, 37, 1);
							font-weight: bold;
						}

						&:last-of-type {
							font-size: 24upx;
							line-height: 24upx;
							margin-top: 19upx;
							color: rgba(37, 37, 37, 0.8);
						}
					}
				}
			}

			.menuSubBox {
				padding: 29upx 30upx 9upx;
				overflow: hidden;

				.menuSubItem {
					background: rgba(245, 249, 253, 1);
					border-radius: 10upx;
					width: 305upx;
					height: 120upx;
					float: left;
					margin-bottom: 20upx;

					&:nth-of-type(2n) {
						float: right;
					}

					image {
						width: 70upx;
						height: 70upx;
						float: left;
						display: block;
						margin: 27upx 28upx 0 28upx;
					}

					view {
						text {
							display: block;

							&:first-of-type {
								font-size: 30upx;
								line-height: 30upx;
								color: #252525;
								padding-top: 28upx;
								font-weight: bold;
							}

							&:last-of-type {
								font-size: 24upx;
								color: rgba(37, 37, 37, 0.8);
								padding-top: 13upx;
								line-height: 24upx;
							}
						}

					}
				}
			}
		}
	}
	.doctorMain{
		padding:10upx 30upx 0;
		.tabMain{
			display:flex;
			justify-content:space-between;
		}
		.tabBox{
			display:flex;
			view{
				margin-right:30upx;
				line-height:32upx;
				font-size:30upx;
				color:#252525;
				position:relative;
				&.active{
					font-size:32upx;
					line-height:32upx;
					font-weight:bold;
					&::after{
						content:"";
						display:block;
						width:42upx;
						height:15upx;
						background:url(../../static/images/tabActiveImg.png) no-repeat center center;
						background-size:42upx 15upx;
						position:absolute;
						left:50%;
						bottom:-22upx;
						margin-left:-21upx;
					}
				}
			}
		}
		.tabViewMore{
			line-height:32upx;
			color:rgba(37,37,37,0.8);
		}
	}
	.doctorListMain{
		overflow:hidden;
		padding-top:46upx;
		.doctorListItem{
			background:#fff;
			border-radius:20upx;
			overflow:hidden;
			float:left;
			width:335upx;
			height:380upx;
			position:relative;
			margin-bottom:20upx;
			&:nth-of-type(2n){
				float:right;
			}
			.vDoctorIcon{
				width:109upx;
				height:112upx;
				display:block;
				position:absolute;
				left:0;
				top:0;
				z-index:9999;
			}
			.headerImg{
				width:156upx;
				height:156upx;
				overflow:hidden;
				border-radius:50%;
				margin:40upx auto 0;
			}
			text{
				display:block;
				text-align:center;
				&.name{
					font-size:30upx;
					font-weight:500;
					color:#252525;
					line-height:30upx;
					margin-top:30upx;
				}
				&.subTitle{
					font-size:24upx;
					color:rgba(37,37,37,0.8);
					font-weight:500;
					line-height:24upx;
					margin-top:21upx;
				}
				&.hospital{
					font-size:24upx;
					color:rgba(37,37,37,0.6);
					font-weight:500;
					line-height:24upx;
					margin-top:30upx;
				}
			}
			
		}
	}
</style>
