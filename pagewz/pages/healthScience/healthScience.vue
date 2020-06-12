<template>
	<view class="pageView">
		<!-- 搜索 -->
		<view class="topSearchMain">
			<view class="searchBox">
				<text class="cuIcon-search"></text>
				<view class="searchInput">
					<input type="text" value="" placeholder="搜索疾病、医生、科室、医院" />
				</view>
			</view>
			<text class="searchBtn">搜索</text>
		</view>
		<!-- banner -->
		<view class="subpageBannerMain">
			<image src="../../static/images/subPageBannerImg.png" mode="widthFix"></image>
		</view>
		<!-- listMain -->
		<view class="healthScienceListMain">
			<!-- tab -->
			<view class="tabMain">
				<view class="tabBox">
					<view class="active">
						中医养生
					</view>
					<view>
						过敏
					</view>
					<view>
						母婴
					</view>
					<view>
						皮肤性病
					</view>
					<view>
						两性生活
					</view>
				</view>
				<view class="tabViewMore">
					更多 <text class="cuIcon-right lg"></text>
				</view>
			</view>
			<!-- list -->
			<view class="listBox">
				<view class="questionListItem">
					<view class="questionListTopBox">
						<span>大家都在看</span> 中医那些穴位是养生穴位
					</view>
					<view class="questionListMiddleBox">
						<view class="questionListViewLeft">
							<image class="doctor" src="../../static/images/doctor.jpg" mode="widthFix"></image>
							<image class="audioIcon" src="../../static/images/audioIcon.png" mode="widthFix"></image>
							语音时长 <text>01:23</text>
						</view>
						<view class="questionListViewRight">
							<image src="../../static/images/headsetIcon.png" mode="widthFix"></image>
							63人听过
						</view>
					</view>
					<view class="questionListSubBox">
						<view><text>张璐 |</text>针灸科 | 主治医师</view>
						<view>63播放量</view>
					</view>
				</view>
				<view class="questionListItem">
					<view class="questionListTopBox">
						<em>大家都在问</em> 中医那些穴位是养生穴位
					</view>
					<view class="questionListMiddleBox">
						<view class="qMiddleLeft">
							<image src="../../static/images/doctor.jpg" mode="widthFix"></image>
						</view>
						<view class="qMiddleRight">
							<view>
								疫情分析：红枣是一种比较好的养生食物和药物，吃红枣部分季节，任何季节均可食用，不见的是...
							</view>
						</view>
					</view>
					<view class="questionListSubBox">
						<view><text>张璐 |</text>针灸科 | 主治医师</view>
						<view>63播放量</view>
					</view>
				</view>
				<view class="questionListItem">
					<view class="questionListTopBox">
						<i>热帖</i> 中医那些穴位是养生穴位
					</view>
					<view class="questionListMiddleBox">
						<view class="qustionText">
							发生膝关节半月板损伤之后是禁止患者做推拿的，半月板损伤的主要特征就是半月板出现了撕裂，会引起膝...
						</view>
					</view>
					<view class="questionListSubBox">
						<view><text>张璐 |</text>针灸科 | 主治医师</view>
						<view>63播放量</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.pageView{
	background:#fff;
	position:fixed;
	left:0;
	top:0;
	right:0;
	bottom:0;
	overflow-x:hidden;
}
.topSearchMain{
	padding:30upx;
	overflow:hidden;
	.searchBox{
		height:72upx;
		line-height:72upx;
		background:#F8F7F7;
		border-radius:72upx;
		width:530upx;
		float:left;
		.cuIcon-search{
			margin-left:30upx;
			float:left;
		}
		.searchInput{
			padding-left:70upx;
			input{
				height:72upx;
				font-size:28upx;
			}
		}
		
	}
	.searchBtn{
		display:block;
		width:140upx;
		height:72upx;
		line-height:72upx;
		text-align: center;
		font-size:30upx;
		color:#fff;
		background:#3B71E9;
		border-radius:72upx;
		float:right;
	}
}
.subpageBannerMain{
	padding:0 30upx;
	image{
		width:100%;
	}
}
.tabMain{
		display:flex;
		justify-content:space-between;
	}
	.tabBox{
		display:flex;
		view{
			margin-right:30upx;
			line-height:32upx;
			font-size:28upx;
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
	.healthScienceListMain{
		padding:30upx;
		.listBox{
			padding-top:45upx;
		}
	}
	.questionListItem{
		border-bottom:1upx solid #F2F2F2;
		margin-bottom:30upx;
		.questionListTopBox{
			font-size:30upx;
			color:#252525;
			overflow:hidden;
			span{
				float:left;
				display:block;
				height:36upx;
				text-align:center;
				line-height:36upx;
				background:#FD4945;
				color:#fff;
				margin-right:13upx;
				font-size:24upx;
				border-radius:5upx;
				 margin-top:5upx;
				 padding:0 16upx;
			}
			em{
				background:#5E95F2;
				color:#fff;
				font-size:22upx;
				display:block;
				float:left;
				line-height:36upx;
				padding:0 16upx;
				font-style:normal;
				 border-radius:5upx;
				 margin-right:13upx;
				 margin-top:5upx;
			}
			i{
				background:#FC8A00;
				color:#fff;
				font-size:22upx;
				display:block;
				float:left;
				line-height:36upx;
				padding:0 16upx;
				font-style:normal;
				 border-radius:5upx;
				 margin-right:13upx;
				 margin-top:5upx;
			}
		}
		.questionListMiddleBox{
			padding-top:29upx;
			overflow:hidden;
			.questionListViewLeft{
				width:439upx;
				height:79upx;
				background-color:#F2F2F2;
				border-radius:79upx;
				margin-top:16upx;
				line-height:79upx;
				float:left;
				.doctor{
					width:96upx;
					height:96upx;
					border-radius:50%;
					overflow:hidden;
					display:block;
					float:left;
					position:relative;
					top:-9upx;
				}
				.audioIcon{
					width:41upx;
					height:33upx;
					float:left;
					margin-top:23upx;
					margin-left:25upx;
					margin-right:41upx;
				}
				text{
					color:#FD4945;
					margin-left:12upx;
				}
				
			}
			.questionListViewRight{
				float:left;
				line-height:79upx;
				overflow:hidden;
				margin-left:30upx;
				font-size:24upx;
				color:rgba(37,37,37,0.6);
				margin-top:18upx;
				image{
					width:29upx;
					height:26upx;
					float:left;
					margin-right:12upx;
					margin-top:25upx;
				}
			}
			.qMiddleLeft{
				width:90upx;
				height:90upx;
				float:left;
				overflow:hidden;
				border-radius:50%;
			}
			.qMiddleRight{
				padding-left:124upx;
				view{
					background:#ECF4FF;
					padding:26upx 33upx;
					border-radius:20upx;
					font-size:28upx;
					line-height:48upx;
					position:relative;
					&::before{
						content:"";
						display:block;
						width:30upx;
						height:30upx;
						background:#ECF4FF;
						position:absolute;
						left:-10upx;
						top:35upx;
						transform:rotate(-45deg);
					}
				}
			}
			.qustionText{
				color:rgba(37,37,37,0.6);
				font-size:28upx;
				line-height:36upx;
			}
		}
		.questionListSubBox{
			display:flex;
			justify-content:space-between;
			padding:30upx 0;
			view{
				color:rgba(37,37,37,0.6);
				font-size:28upx;
				text{
					color:#252525;
					margin-right:10upx;
				}
			}
		}
	}
</style>
