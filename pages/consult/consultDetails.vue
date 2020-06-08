<template>
	<view class="content">
		<view class="payrecord_list">
			<view class="payrecord_item">
				<view class="payrecord_num">处方号：{{RecipeInfo.RecipeNo}}</view>
				<view class="payrecord_con">
					<view class=""><text>{{RecipeInfo.RecipeName}}</text>处方名称</view>
					<view class=""><text>{{RecipeInfo.RecipeDate}}</text>处方日期</view>
					<view class=""><text>{{RecipeInfo.DeptName}}</text>就诊科室名称</view>
					<view class=""><text>{{RecipeInfo.DoctorName}}</text>就诊医生姓名</view>
					<view class=""><text>￥{{RecipeInfo.RecipeCost}}</text>处方金额</view>
					<view class=""><text>{{RecipeInfo.RecipeState}}</text>处方状态</view>
				</view>
			</view>
			<view class="payrecord_item" v-for="(item,index) in RecipeList" :key="index">
				<view class="payrecord_title" @click="item.show = !item.show"><text v-bind:class="{'on':item.show}">{{item.ItemName}}</text>项目名称</view>
				<view class="payrecord_con" v-show="item.show">
					<view class=""><text>{{item.ItemSpec}}</text>规格</view>
					<view class=""><text>￥{{item.ItemPrice}}</text>单价</view>
					<view class=""><text>{{item.ItemNumber}}</text>数量</view>
					<view class=""><text>{{item.ItemUnit}}</text>单位</view>
				</view>
			</view>
		</view>
		<view class="payrecord_money">
			总金额 :<text>￥{{RecipeInfo.RecipeCost}}</text>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				CardNo:"",
				RecipeNo:"",
				RecipeInfo:{},
				RecipeList:[]
			};
		},onLoad(e) {
			this.RecipeNo = e.RecipeNo;
			this.CardNo = e.CardNo;
			this.loadData(e.RecipeNo,e.CardNo);
		},methods:{
			loadData(RecipeNo,CardNo){
				uni.showLoading({
					title:"加载中...",
					mask:true
				});
				this.$http.request({
					url: this.$api.uri.queryrecipedetail,
					method: "POST",
					noCheckToken: true,
					data:{RecipeNo:RecipeNo,CardNo:CardNo}
				}).then(res => {
					uni.hideLoading();
					let result = res.data;
					 if (result.code === 0) {
						this.RecipeList = result.data.List;
						this.RecipeInfo = result.data;
						for (var i = 0; i < result.data.List.length; i++) {
							this.$set(this.RecipeList[i], "show", false);
						}
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
.content{ padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.payrecord_list{ padding: 30rpx 30rpx 0 30rpx;}
.payrecord_item{ background: #fff; padding: 0 30rpx; margin-bottom: 14rpx; border:1px solid #eeeeee; border-radius: 6rpx;}
.payrecord_num{ line-height: 75rpx; color: #333333; font-size: 28rpx; border-bottom: 1px solid #ebebeb;}
.payrecord_con{ padding: 7rpx 0;
	>view{ line-height: 68rpx; font-size: 28rpx; color: #999999;
		text{ display: block; float: right; color: #000000;}
	}
}
.payrecord_title{ line-height: 74rpx; font-size: 28rpx; color: #999999;
	text{ display: block; float: right; color: #000000; padding-right: 35rpx; background: url(~@/static/img/payRecordDetails02.png) no-repeat right center;
		background-size: 20rpx 10rpx;
		&.on{ background: url(~@/static/img/payRecordDetails01.png) no-repeat right center;background-size: 20rpx 10rpx;}
	}
}
.payrecord_money{ padding: 0 50rpx; line-height: 108rpx; margin-top: -20rpx; font-size: 28rpx; color: #333333;
	text{ font-size: 30rpx; color: #ff9000; font-weight: bold;}
}
</style>
