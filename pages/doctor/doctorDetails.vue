<template>
	<view class="content">
		<view class="doctorde_top">
			<image src="../../static/images/z002.png" mode=""></image>
			<view class="doctorde_top_ri">
				<view class="doctorde_top_ri_name">
					{{doctorInfo.DoctorName || '暂无'}} <text>/</text> <text>{{doctorInfo.DoctorLevel || '暂无'}}</text>
				</view>
				<view class="doctorde_top_ri_con">
					专业特长：{{doctorInfo.Description || '暂无'}}
				</view>
			</view>
		</view>
		<view class="doctorde_box btb">
			<view class="doctorde_title"><text></text>简介</view>
			<view class="doctorde_con">
				{{doctorInfo.Description || '暂无'}}
			</view>
		</view>
		<view style="height: 24rpx;"></view>
		
		<navigator v-if="list.length>0" class="regde_btn" :url="'/pages/doctor/doctorDetailsChoice?DoctorCode='
				 +DoctorCode+'&BeginDate='+BeginDate+'&EndDate='+EndDate
				 +'&SourceType=2'">
			预约挂号
			<image src="../../static/img/doctorDetails02.png" mode=""></image>
		</navigator>
		<view style="height: 50rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				DoctorCode:"",
				doctorInfo:{},
				BeginDate: "",
				EndDate: "",
				list:[]
			};
		},onLoad(e) {
			this.DoctorCode = e.DoctorCode;
			this.EndDate = this.$moment(this.$moment().add(7, 'days')).format('YYYY-MM-DD');
			this.BeginDate = this.$moment().format('YYYY-MM-DD');
			this.loadData(e.DoctorCode);
			this.loadRegisterData(this.BeginDate, this.EndDate, "2", e.DoctorCode);
		},methods:{
			loadData(DoctorCode){
				// 查询医生详情信息
				this.$http.request({
					url: this.$api.uri.querydoctor,
					method: "POST",
					noCheckToken: true,
					data:{DoctorCode:DoctorCode}
				}).then(res => {
					let result = res.data;
					if (result.code === 0) {
						this.doctorInfo = result.data.List[0]||{};
					}
				});
			},loadRegisterData(BeginDate, EndDate, SourceType, DoctorCode) {
				// 查询医生详情信息
				this.$http.request({
					url: this.$api.uri.queryregistersource,
					method: "POST",
					noCheckToken: true,
					data: {
						BeginDate: BeginDate,
						EndDate: EndDate,
						SourceType: SourceType,
						DoctorCode: DoctorCode,
					}
				}).then(res => {
					let result = res.data;
					if (result.code === 0) {
						console.log(JSON.stringify(result))
						this.list = result.data.List;
					}
				});
			}
		}
	}
</script>

<style lang="scss">
@mixin ellipsiso { display: block; overflow: hidden; white-space: nowrap; -o-text-overflow: ellipsis; text-overflow: ellipsis; }
@mixin ellipsiss($num1, $num2) { line-height: $num2 + rpx; overflow: hidden; display: -webkit-box; height: $num1*$num2 + rpx;
 -webkit-line-clamp: $num1; -webkit-box-orient: vertical; }
page{ background:#f4f4f4;}
.content{ padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.pad030{ padding-left: 30rpx; padding-right: 30rpx;}
.bgf4f4f4{ background: #f4f4f4;}
.btb{ border-bottom: 1px solid #ececec; border-top: 1px solid #ececec;}
.doctorde_top{ min-height: 280rpx; padding: 58rpx 30rpx; background: url(~@/static/img/doctorDetails01.png) no-repeat center; background-size: 100% 100%;
	image{ display: block; float: left; height: 160rpx; width: 160rpx; border: 4rpx solid #80f2e4; border-radius: 50%;}
}
.doctorde_top_ri{ margin-left: 210rpx;}
.doctorde_top_ri_name{ line-height: 74rpx; font-size: 32rpx; color: #fff;
	text{ font-size: 24rpx;}
	text:nth-child(1){ color: #c8fcf9; font-size: 28rpx; padding: 0 8rpx;}
}
.doctorde_top_ri_con{ font-size: 24rpx; color: #ffffff;
	@include ellipsiss(2,34)
}
// 
.doctorde_box{ padding: 12rpx 30rpx 30rpx 30rpx; background: #fff;}
.doctorde_title{ font-size: 32rpx; line-height: 84rpx; color: #000000; font-weight: bold;
	text{ display: block; float: left; height: 4rpx; width: 22rpx; margin-right: 14rpx; background: #00dfca; margin-top: 43rpx;}
}
.doctorde_con{ font-size: 26rpx; color: #666666; line-height: 2em;}
.regde_btn{ margin: 40rpx 30rpx 0 30rpx; background: #3eceb5; line-height: 76rpx; border-radius: 10rpx; text-align: center; font-size: 32rpx; color: #ffffff;
	image{ width: 35rpx; height: 21rpx; margin-left: 20rpx;}
}
</style>
