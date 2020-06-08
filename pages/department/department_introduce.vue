<template>
	<view class="content">
		<!-- <view class="department_s">
			<input type="text" value="" placeholder="请输入医生姓名、科室名称" />
		</view> -->
		<image v-show="department.length == 0" src="~@/static/img/nodata.png" style="display:block;height:410rpx;width:410rpx;margin:120rpx auto;" mode=""></image>
		<view class="department_list">
			<view class="department_item" v-for="item in department" :key="item.DeptCode" @click="goDoc(item.DeptCode,item.DeptName)">
				{{item.DeptName}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			department:[],
				type:""
			};
		},onLoad(option) {
			this.type = option.type;
			this.loadData();
		},methods:{
			goDoc(id,DeptName){
				this.$utils.skipPage("navigateTo", this.$api.sp.doctor_introduce+"?DeptCode="+id+"&DeptName="+DeptName+"&type="+this.type);
			},
			loadData(){
				// 查询医院信息
				this.$http.request({
					url: this.$api.uri.querydepartment,
					method: "POST",
					noCheckToken: true
				}).then(res => {
					let result = res.data;
					if (result.code === 0) {
						this.department = result.data.List;
					} else {
						uni.showToast({
							icon: 'none',
							title: result.msg
						});
					}
				}).catch(error => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '网络异常，请稍后再试'
					});
				});
			}
		}
	}
</script>

<style lang="scss">
page{ background:#fff;}
.content{padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.department_s{ padding: 38rpx 30rpx 28rpx 30rpx; background: #f4f4f4;
	input{ display: block; height: 66rpx; line-height: 64rpx; border: 1px solid #eeeeee; border-radius: 10rpx; padding: 0 20rpx 0 100rpx; font-size: 26rpx;
		background: #fff url(~@/static/img/department01.png) no-repeat 56rpx center; background-size: 24rpx 24rpx; color: #333;
	}
}
.department_list{ padding-bottom: 20rpx;}
.department_item{ padding: 0 30rpx; border-top: 1px solid #eeeeee; line-height: 78rpx; font-size: 28rpx; color: #666666;
	background: #fff url(~@/static/img/patient03.png) no-repeat 705rpx center; background-size: 12rpx 24rpx;
}
</style>
