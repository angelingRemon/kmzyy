<template>
	<view class="content">
		<view class="clinic_tab">
			<view v-bind:class="{'on':tabNum == 0}" @click="selectTabNum(0,'2')">专家门诊</view>
			<view v-bind:class="{'on':tabNum == 1}" @click="selectTabNum(1,'3')">普通门诊</view>
		</view>
		<view class="bgf4f4f4" style="height: 94rpx;"></view>
		<view v-show="tabNum == 0">
			<view class="doctorde_times_box">
				<view class="doctorde_times clearfix">
					<view class="doctorde_times_item" v-bind:class="{'on':isall}" @click="clactive(-1,'2')"><text>全部</text>日期</view>
					<view class="doctorde_times_itemf" @click="clactive(index,'2')" v-bind:class="{'on':item.active}" v-for="(item,index) in timeList"
					 :key="item.id">
						<text>{{item.week}}</text>{{item.time}}
					</view>
				</view>
			</view>
			<view class="bgf4f4f4" style="height: 14rpx;"></view>
			<view class="clinic_list">
				<navigator class="clinic_item" :url="'/pages/doctor/doctorDetailsChoice?DoctorCode='
				 +item.DoctorCode+'&BeginDate='+BeginDate+'&EndDate='+EndDate
				 +'&SourceType='+SourceType+'&clactiveNnm='+clactiveNnm"
				 v-for="item in list" :key="item.id" track-by="item.DoctorName">
					<image src="../../static/images/z002.png" mode=""></image>
					<view class="clinic_item_right">
						<view class="clinic_item_mz" v-show="item.LeftNum == 0">满诊</view>
						<view class="clinic_item_yu" v-show="item.LeftNum != 0">余 {{item.LeftNum}}</view>
						<view class="clinic_item_name">{{item.DoctorName || '暂无'}}</view>
						<view class="clinic_item_title"><text>{{item.DoctorLevel || '暂无'}}</text></view>
						<view class="clinic_item_con">专业特长：{{item.DoctorDesc || '暂无'}}</view>
					</view>
				</navigator>
			</view>
			<image v-show="list.length == 0"
			 src="~@/static/img/nodata.png"
			  style="display:block;height:410rpx;width:410rpx;margin:120rpx auto;"
			   mode=""></image>
		</view>
		<view v-show="tabNum == 1">
			<view class="doctorde_times_box">
				<view class="doctorde_times clearfix">
					<view class="doctorde_times_item" v-bind:class="{'on':isall}" @click="clactive(-1,'3')"><text>全部</text>日期</view>
					<view class="doctorde_times_itemf" @click="clactive(index,'3')" v-bind:class="{'on':item.active}" v-for="(item,index) in timeList"
					 :key="item.id">
						<text>{{item.week}}</text>{{item.time}}
					</view>
				</view>
			</view>
			<view class="bgf4f4f4" style="height: 14rpx;"></view>
			<view class="clinic_plist">
				<view class="clinic_pitem" url="" v-for="(item,index) in listOther" :key="item.id" :item="reload(item)" @click="isShowLoad(index)">
					<image src="../../static/img/clinic01.png" mode=""></image>
					<view class="clinic_pitem_right">
						<view class="clinic_pitem_money">￥{{item.RegisterFee || '暂无'}}</view>
						<view class="clinic_pitem_name">{{item.DeptName || '暂无'}}</view>
						<view class="clinic_pitem_type">{{item.ScheduleDate  || '暂无'}}</view>
						<view class="clinic_pitem_type"><text>类型：</text>{{item.RegLevelName || '暂无'}}</view>
					</view>
				</view>
			</view>
			<image v-show="listOther.length == 0"
			 src="~@/static/img/nodata.png"
			  style="display:block;height:410rpx;width:410rpx;margin:120rpx auto;"
			   mode=""></image>
		</view>
		<!--  -->
		<view class="doctorde_open_zz" v-show="isShow"></view>
		<view class="doctorde_open" v-show="isShow">
			<image @click="isShow = !isShow" class="doctorde_open_close" src="../../static/img/doctorDetailsChoice02.png" mode=""></image>
			<view class="doctorde_open_top clearfix">
				<image src="../../static/img/clinic01.png" mode=""></image>
				<view class="doctorde_open_text">
					<view class="">
						<view>科室：</view><text>{{infos.DeptName || '暂无'}}</text>
					</view>
					<view class="">
						<view>类型：</view><text>{{infos.RegLevelName || '暂无'}}</text>
					</view>
					<view class="">
						<view>费用：</view><text style="color: #ff9000;">￥{{infos.RegisterFee || '暂无'}}</text>
					</view>
					<view class="">
						<view>日期：</view><text>{{infos.ScheduleDate || '暂无'}} </text>
					</view>
					<view class="">
						<view>时间：</view><text>{{infos.NoonName || '暂无'}}</text>
					</view>
				</view>
			</view>
			<view class="doctorde_open_bot">
				<view class="doctorde_open_bot_se">请选择就诊人</view>
				<view class="doctorde_open_bot_num">({{currentPatientName}} 卡号:{{currentPatientCardNo}} )</view>
				<view class="doctorde_open_bot_name clearfix">
					<view v-bind:class="{'listname':item.cardNo == currentPatientCardNo}" v-for="item in patientList" :key="item.cardNo"
					 @click="switchPatient(item)">{{item.patientName.substring(item.patientName.length-3)}}</view>
					<view>
						<image src="../../static/img/doctorDetailsChoice01.png" @click="goAddPatientPage" mode=""></image>
					</view>
				</view>
			</view>
			<view class="doctorde_open_btn" @click="confirmOrder">确认挂号</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabNum: 0,
				timeList: [],
				list: [],
				listOther: [],
				DeptCode: "",
				DoctorCode: "",
				BeginDate: "",
				EndDate: "",
				SourceType: "",
				isShow: false,
				isall:true,
				clactiveNnm:-1,
				infos: {},
				maxPatient: this.$globle.maxPatient,
				currentPatientCardNo: "",
				currentPatientName: "",
				patientList: [],

			};
		},
		onLoad(e) {
			this.DeptCode = e.DeptCode;
			let EndDate = this.$moment().format('YYYY-MM-DD');
			let BeginDate = this.$moment().format('YYYY-MM-DD');
			this.getTimes();
			this.clactive(-1, "2");
			this.queryPatientList();
		},
		onShow() {
			this.queryPatientList();
		},
		methods: {
			loadData(BeginDate, EndDate, SourceType, DeptCode, DoctorCode) {
				this.BeginDate = BeginDate;
				this.EndDate = EndDate;
				this.SourceType = SourceType;
				
				uni.showLoading({
					title: "加载中...",
					mask: true
				})
				// 查询医生详情信息
				this.$http.request({
					url: this.$api.uri.queryregistersource,
					method: "POST",
					noCheckToken: true,
					data: {
						BeginDate: BeginDate,
						EndDate: EndDate,
						SourceType: SourceType,
						DeptCode: DeptCode,
						DoctorCode: DoctorCode,
					}
				}).then(res => {
					uni.hideLoading();
					let result = res.data;
					if (result.code === 0) {
						
						if(SourceType =='2'){
							this.list = this.removeDuplicatedItem(result.data.List) ;
							this.listOther = [];
						}else{
							this.listOther = result.data.List;
							this.list = [];
						}
					}
				}).catch(error => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: this.$globle.errorTip
					});
				});
			},
			getWeek(date) { // 参数时间戳
				let week = this.$moment(date).day()
				switch (week) {
					case 1:
						return '周一'
					case 2:
						return '周二'
					case 3:
						return '周三'
					case 4:
						return '周四'
					case 5:
						return '周五'
					case 6:
						return '周六'
					case 0:
						return '周日'
				}
			},
			getTimes() {
				for (var i = 0; i < 7; i++) {
					var times = {};
					if (i == 0) {
						times.active = false;
						times.week = "今天";
					} else {
						times.active = false;
						times.week = this.getWeek(this.$moment().add(i, 'days'));
					}
					times.time = this.$moment(this.$moment().add(i, 'days')).format('MM-DD');
					times.day = this.$moment(this.$moment().add(i, 'days')).format('YYYY-MM-DD');
					this.timeList.push(times);
				}
			},
			clactive(index, sourceType) {
				this.clactiveNnm = index;
				if(index == -1 ){
					this.isall = true;
					this.loadData(this.timeList[0].day, this.timeList[this.timeList.length-1].day, sourceType, this.DeptCode, "");
				}
				for (var i = 0; i < 7; i++) {
					if (i == index) {
						this.isall = false;
						this.timeList[i].active = true;
						this.loadData(this.timeList[i].day, this.timeList[i].day, sourceType, this.DeptCode, "");
					} else {
						this.timeList[i].active = false;
					}
				}
			},
			selectTabNum(num, sourceType) {
				this.tabNum = num;
				if (this.isall) {
					this.clactive(-1,sourceType);
					return;
				}
				for (var i = 0; i < 7; i++) {
					if (this.timeList[i].active) {
						this.loadData(this.timeList[i].day, this.timeList[i].day, sourceType, this.DeptCode, "");
					}
				}
			},
			reload(item) {
				item.ScheduleDate = this.$moment(item.ScheduleDate).format('YYYY-MM-DD')
				return item;
			},
			isShowLoad(index) {
				console.log(index)
				this.isShow = true;
				this.infos = this.listOther[index] || {};
			},
			initDefPatient() {
				for (var i = 0; i < this.patientList.length; i++) {
					var patient = this.patientList[i];
					if (patient.defaults) {
						this.currentPatientCardNo = patient.cardNo;
						this.currentPatientName = patient.patientName;
					}
				}
			},
			switchPatient(item) {
				this.currentPatientCardNo = item.cardNo;
				this.currentPatientName = item.patientName;
			},
			goPatientListPage() {
				uni.navigateTo({
					url: this.$api.sp.patientList
				});
			},
			goAddPatientPage() {
				if (this.patientList.length >= this.maxPatient) {
					uni.showToast({
						icon: 'none',
						title: "最多添加" + this.maxPatient + "位就诊人,请先删除其他就诊人"
					});
					return;
				}
				uni.navigateTo({
					url: this.$api.sp.patientAdd
				});
			},
			queryPatientList() {
				uni.showLoading({
					title: "加载中...",
					mask: true
				})
				this.$http.request({
					url: this.$api.uri.querypatientlist,
					method: "POST",
					noCheckToken: true
				}).then(
					(result) => {
						uni.hideLoading();
						let infoRes = result.data;
						if (infoRes.code === 0) {
							this.patientList = infoRes.data;
							this.initDefPatient();
						} else {
							uni.showToast({
								icon: 'none',
								title: infoRes.msg
							});
						}
					}).catch(error => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: this.$globle.errorTip
					});
				});
			},
			confirmOrder() {
				
				let data = {
					DeptCode:this.infos.DeptCode,
					ScheduleDate:this.infos.ScheduleDate,
					RegisterFee:this.infos.RegisterFee,
					CardNo:this.currentPatientCardNo,
					PatientName:this.currentPatientName
				};
				
				if(this.currentPatientCardNo == "" || this.currentPatientName== ""){
					uni.showToast({
						icon: 'none',
						title: "请选择或添加就诊人"
					});
					return;
				}
				uni.showLoading({
					title:"处理中...",
					mask:true
				})
				
				this.infos.CardNo = this.currentPatientCardNo
				this.infos.PatientName = this.currentPatientName
				this.$http.request({url:this.$api.uri.registerLock,data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					uni.hideLoading();
					let infoRes = result.data;
					if (infoRes.code === 0) {
						uni.navigateTo({
							url:this.$api.sp.payment + "?HisOrderId=" + infoRes.data.HisOrderId + "&infos=" + JSON.stringify(this.infos)
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: infoRes.msg
						});
					}
				}).catch(error => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: this.$globle.errorTip
					});
				});
			},
			removeDuplicatedItem(ar) {
				var ret = [];
                var retnew = [];
				for (var i = 0, j = ar.length; i < j; i++) {
					if (retnew.indexOf(ar[i].DoctorCode)== -1){
						retnew.push(ar[i].DoctorCode);
						ret.push(ar[i]);
					}
				}
				return ret;
			}
		}
	}
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
		line-height: $num2 + rpx;
		overflow: hidden;
		display: -webkit-box;
		height: $num1*$num2 + rpx;
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

	.bgf4f4f4 {
		background: #f4f4f4;
	}

	.btb {
		border-bottom: 1px solid #ececec;
		border-top: 1px solid #ececec;
	}

	// @import "@/static/test.scss";
	.clinic_tab {
		position: fixed;
		top: var(--window-top);
		;
		left: 0;
		width: 100%;
		z-index: 100;
		background: #fff;
		border-bottom: 1px solid #eeeeee;
		height: 83rpx;
		line-height: 82rpx;

		>view {
			float: left;
			width: 50%;
			text-align: center;
			font-size: 28rpx;
			color: #333333;
			height: 83rpx;

			&:nth-child(1) {
				border-right: 1px solid #eeeeee;
			}

			&.on {
				border-bottom: 2px solid #3eceb5;
			}
		}
	}

	// 
	.doctorde_top_cart {

		text,
		& {
			height: 38rpx;
		}

		text {
			display: block;
			float: left;
			line-height: 38rpx;
			font-size: 24rpx;
			color: #666666;
			background: #fff;
			border-radius: 6rpx;
			padding: 0 10rpx;
		}
	}

	.doctorde_times {
		white-space: nowrap;
		overflow-x: auto;
		overflow-y: hidden;
		border-bottom: 1px solid #eeeeee;
		background: #fff;

		>view {
			display: inline-block;
		}
	}

	.doctorde_times_box {
		background: #fff;
		padding: 0 30rpx;
	}

	.doctorde_times_item {
		margin: 0 25rpx 0 0;
		color: #8a8a8a;
		height: 120rpx;
		padding: 20rpx 0 0 0;
		line-height: 40rpx;

		text {
			display: block;
		}
	}

	.doctorde_times_itemf {
		box-sizing: border-box;
		height: 120rpx;
		padding: 20rpx 0;
		margin: 0 25rpx;
		text-align: center;
		line-height: 40rpx;

		text {
			display: block;
		}
	}

	.doctorde_times_item,
	.doctorde_times_itemf {
		&.on {
			color: #3eceb5;
			border-bottom: 2px solid #3eceb5;
		}
	}

	.clinic_list {
		border-top: 1px solid #eeeeee;
		background: #fff;
	}

	.clinic_item {
		padding: 24rpx 30rpx;
		border-bottom: 1px dashed #e0dfdf;

		image {
			display: block;
			float: left;
			height: 154rpx;
			width: 154rpx;
			border: 1px solid #e7e7e7;
			border-radius: 50%;
		}
	}

	.clinic_item_right {
		margin-left: 186rpx;
		min-height: 154rpx;
	}

	.clinic_item_mz,
	.clinic_item_yu {
		float: right;
		padding: 0 18rpx;
		font-size: 24rpx;
		border-radius: 14rpx;
		margin-top: 12rpx;
	}

	.clinic_item_mz {
		line-height: 32rpx;
		background: #ffb400;
		color: #fff;
	}

	.clinic_item_yu {
		line-height: 30rpx;
		border: 1px solid #00dfca;
		color: #00dfca;
	}

	.clinic_item_name {
		line-height: 50rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.clinic_item_title {
		margin-top: 4rpx;

		text,
		& {
			height: 36rpx;
			line-height: 36rpx;
		}

		text {
			display: block;
			float: left;
			padding: 0 14rpx;
			font-size: 24rpx;
			background: #00dfca;
			border-radius: 6rpx;
			color: #fff;
		}
	}

	.clinic_item_con {
		line-height: 62rpx;
		font-size: 24rpx;
		color: #999999;
		@include ellipsiso;
	}

	// 
	.clinic_plist {
		border-top: 1px solid #eeeeee;
		background: #fff;
	}

	.clinic_pitem {
		padding: 22rpx 30rpx;
		border-bottom: 1px dashed #e0dfdf;

		image {
			display: block;
			float: left;
			height: 154rpx;
			width: 154rpx;
			border: 1px solid #e7e7e7;
			border-radius: 50%;
		}
	}

	.clinic_pitem_right {
		margin-left: 190rpx;
		min-height: 154rpx;
	}

	.clinic_pitem_money {
		float: right;
		margin-top: 36rpx;
		line-height: 36rpx;
		background: #ffb400;
		color: #fff;
		padding: 0 12rpx;
		border-radius: 12rpx;
		font-size: 24rpx;
	}

	.clinic_pitem_name {
		padding-top: 16rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.clinic_pitem_type {
		line-height: 54rpx;
		font-size: 24rpx;
		color: #333333;

		text {
			color: #999999;
		}
	}

	//
	.doctorde_open_zz {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.5);
	}

	.doctorde_open {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 120;
		min-height: 200rpx;
		background: #fff;
		padding: 38rpx 30rpx 0 30rpx;
	}

	.doctorde_open_top {
		border-bottom: 1px solid #eaeaea;
		padding-bottom: 20rpx;

		image {
			display: block;
			float: left;
			margin-top: 43rpx;
			width: 154rpx;
			height: 154rpx;
			border-radius: 50%;
			border: 1px solid #e1e1e1;
		}
	}

	.doctorde_open_text {
		margin-left: 180rpx;
		line-height: 54rpx;
		font-size: 28rpx;

		>view {
			>view {
				float: left;
				color: #000000;
			}

			>text {
				display: block;
				margin-left: 95rpx;
				color: #999999;
			}
		}
	}

	.doctorde_open_bot {
		padding: 30rpx 0 16rpx 0;
	}

	.doctorde_open_bot_se {
		line-height: 50rpx;
		font-size: 28rpx;
		color: #000000;
	}

	.doctorde_open_bot_num {
		line-height: 50rpx;
		font-size: 28rpx;
		color: #999999;
	}

	.doctorde_open_bot_name {
		padding-top: 28rpx;

		>view {
			float: left;
			margin: 0 44rpx 28rpx 0;
			line-height: 98rpx;
			text-align: center;
			box-sizing: border-box;
			border: 1px solid #3eceb5;
			border-radius: 50%;

			&,
			image {
				display: block;
				height: 98rpx;
				width: 98rpx;
			}

			&.listname {
				background: #3eceb5;
				color: #ffffff;
				font-size: 26rpx;
			}
		}
	}

	.doctorde_open_btn {
		line-height: 82rpx;
		background: #3eceb5;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
		box-sizing: content-box;
		padding: 0 30rpx;
		margin-left: -30rpx;
		width: 100%;
	}

	.doctorde_open_close {
		position: absolute;
		top: 22rpx;
		right: 30rpx;
		height: 33rpx;
		width: 33rpx;
		z-index: 130;
	}
</style>
