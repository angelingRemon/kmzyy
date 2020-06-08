<template>
	<view class="content">
		<view class="doctor_top">
			{{DeptName}}共{{doctorNum}}位医生
		</view>
		<view class="doctor_list">
			<navigator :url="'/pages/doctor/doctorDetails_introduce?DoctorCode='+item.DoctorCode+'&type='+type" class="doctor_item" v-for="item in doctorList" :key="item.DoctorCode">
				<image src="../../static/images/z002.png" mode=""></image>
				<view class="doctor_list_right">
					<view class="doctor_list_name">
						{{item.DoctorName || '暂无'}} <text>{{item.DoctorLevel || '暂无'}} </text>
					</view>
					<view class="doctor_list_con">
						专业特长：{{item.Description || '暂无'}}
					</view>
				</view>
			</navigator>
		</view>
		<image v-show="doctorList.length == 0"
		 src="~@/static/img/nodata.png"
		  style="display:block;height:410rpx;width:410rpx;margin:120rpx auto;"
		   mode=""></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			DeptCode:""	,
			DeptName:"",
			doctorList : [],
			doctorNum:0,
				type:""
			};
		},onLoad(e) {
			this.DeptCode = e.DeptCode;
			this.DeptName = e.DeptName;
			this.type = e.type;
			this.loadData(e.DeptCode);
		},methods:{
			loadData(deptCode){
				// 查询医生列表信息
				this.$http.request({
					url: this.$api.uri.querydoctor,
					method: "POST",
					noCheckToken: true,
					data:{DeptCode:deptCode}
				}).then(res => {
					let result = res.data;
					if (result.code === 0) {
						this.doctorList = result.data.List;
						this.doctorNum = result.data.List.length||0;
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
