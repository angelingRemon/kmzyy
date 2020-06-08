<template>
	<view class="content">
		<view class="doctorde_top">
			<image src="../../static/images/z002.png" mode=""></image>
			<view class="doctorde_top_ri">
				<view class="doctorde_top_ri_name">
					{{doctorinfo.DoctorName || '暂无'}} <text>/</text> <text>{{doctorinfo.DoctorLevel || '暂无'}}</text>
				</view>
				<view class="doctorde_top_cart">
					<text>{{doctorinfo.DeptName || '暂无'}}</text>
				</view>
				<view class="doctorde_top_ri_con">
					专业特长：{{doctorinfo.DoctorDesc || '暂无'}}
				</view>
			</view>
		</view>
		<view class="doctorde_times_box">
			<view class="doctorde_times clearfix">
				<view class="doctorde_times_item" v-bind:class="{'on':isall}" @click="clactive(-1,'2')"><text>全部</text>日期</view>
				<view class="doctorde_times_itemf on" @click="clactive(index,'2')" v-for="(item,index) in timeList" :key="index">
					<view class="doctorde_times_itemft">{{item.week}}</view>
					<view class="doctorde_times_itemfn" v-bind:class="{'on':item.active}">
						<text>{{item.time}}</text>
						<!-- <view v-if="list.length>0  && item.active">有</view> -->
					</view>
				</view>
			</view>
		</view>
		<view class="bgf4f4f4" style="height: 20rpx;"></view>
		<view class="doctode_list">
			<view class="doctode_list_item" v-for="(item,index) in list" :key="index" :item="reload(item)" @click="isShowLoad(index)">
				<view v-if="item.LeftNum == 0">无号</view>
				<view class="num" v-if="item.LeftNum != 0">余 {{item.LeftNum}}<text>￥{{item.RegisterFee}}</text></view>
				{{item.ScheduleDate}}  {{item.NoonName}}
			</view>
		</view>
		<!--  -->
		<view class="doctorde_open_zz" v-show="isShow"></view>
		<view class="doctorde_open" v-show="isShow">
			<image @click="isShow = !isShow" class="doctorde_open_close" src="../../static/img/doctorDetailsChoice02.png" mode=""></image>
			<view class="doctorde_open_top clearfix">
				<image src="../../static/images/z002.png" mode=""></image>
				<view class="doctorde_open_text">
					<view class="">
						<view>医生：</view><text>{{infos.DoctorName || '暂无'}}</text>
					</view>
					<view class="">
						<view>科室：</view><text>{{infos.DeptName || '暂无'}}</text>
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
				<view class="doctorde_open_bot_se">请选择就诊人</view><!-- currentPatientCardNo:"",
				currentPatientName:"", -->
				<view class="doctorde_open_bot_num">({{currentPatientName}} 卡号:{{currentPatientCardNo}} )</view>
				<view class="doctorde_open_bot_name clearfix">
					<view v-bind:class="{'listname':item.cardNo == currentPatientCardNo}"
					 v-for="item in patientList" :key="item.cardNo" @click="switchPatient(item)">{{item.patientName.substring(item.patientName.length-3)}}</view>
					<view><image src="../../static/img/doctorDetailsChoice01.png"  @click="goAddPatientPage" mode=""></image></view>
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
				timeList:[],
				list:[],
				isall:false,
				infos:{},
				doctorinfo:{},
				isShow:false,
				DeptCode: "",
				DoctorCode: "",
				BeginDate: "",
				EndDate: "",
				SourceType: "",
				maxPatient:this.$globle.maxPatient,
				currentPatientCardNo:"",
				currentPatientName:"",
				patientList:[],
			};
		},onLoad(e) {
			this.DoctorCode = e.DoctorCode;
			this.BeginDate = e.BeginDate;
			this.EndDate = e.EndDate;
			this.SourceType = e.SourceType;
			this.getTimes();
			this.clactive(e.clactiveNnm, "2");	
			this.queryPatientList();
		},
		methods:{
			loadData(BeginDate, EndDate, SourceType, DoctorCode) {
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
						DoctorCode: DoctorCode,
					}
				}).then(res => {
					uni.hideLoading();
					let result = res.data;
					if (result.code === 0) {
						this.list = result.data.List;
						if(result.data.List.length>0){
							this.doctorinfo = result.data.List[0]||{};
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
			},getTimes(){
				for(var i = 0; i < 7; i++){
					var times = {};
					if(i == 0){
						times.active = true;
						times.week = "今天";
					}else{
						times.active = false;
						times.week = this.getWeek(this.$moment().add(i, 'days'));
					}
					times.time = this.$moment(this.$moment().add(i, 'days')).format('MM-DD');
					times.day = this.$moment(this.$moment().add(i, 'days')).format('YYYY-MM-DD');
					this.timeList.push(times);
				}
			},clactive(index,sourceType){
				if(index == -1 ){
					this.isall = true;
					this.loadData(this.timeList[0].day, this.timeList[this.timeList.length-1].day, sourceType, this.DoctorCode);
				}
				for(var i = 0; i < 7; i++){
					if(i == index){
						this.isall = false;
						this.timeList[i].active = true;
						this.loadData(this.timeList[i].day, this.timeList[i].day, sourceType, this.DoctorCode);
					}else{
						this.timeList[i].active = false;
					}
				}
			},reload(item){
				item.ScheduleDate = this.$moment(item.ScheduleDate).format('YYYY-MM-DD')
				return item;
			},isShowLoad(index){
				this.isShow = true;
				this.infos = this.list[index];
			},
			initDefPatient(){
				for (var i = 0; i < this.patientList.length; i++) {
					var patient = this.patientList[i];
					if(patient.defaults){
						this.currentPatientCardNo = patient.cardNo;
						this.currentPatientName = patient.patientName;
						this.loadData(patient.cardNo);
					}
				}
			},
			switchPatient(item){
				this.currentPatientCardNo = item.cardNo;
				this.currentPatientName = item.patientName;
				this.loadData(item.cardNo);
			},
			goPatientListPage(){
				uni.navigateTo({
					url: this.$api.sp.patientList
				});
			},
			goAddPatientPage(){
				if(this.patientList.length >= this.maxPatient){
					uni.showToast({
						icon: 'none',
						title: "最多添加"+this.maxPatient+"位就诊人,请先删除其他就诊人"
					});
					return;
				}
				uni.navigateTo({
					url: this.$api.sp.patientAdd
				});
			},
			queryPatientList(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				let data = {openId:this.$globle.token};
				this.$http.request({url:this.$api.uri.querypatientlist,data: data ,method:"POST",noCheckToken:true}).then(
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
						title: '查询失败，请稍后再试'
					});
				});
			},
			confirmOrder(){
				console.log(this.currentPatientCardNo+")"+this.currentPatientName+")"+JSON.stringify(this.infos))
				uni.showLoading({
					title:"处理中...",
					mask:true
				})
				let data = {
					DeptCode:this.infos.DeptCode,
					DoctorCode:this.infos.DoctorCode,
					RegLevelCode:this.infos.RegLevelCode,
					ScheduleDate:this.infos.ScheduleDate,
					NoonCode:this.infos.NoonCode,
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
				this.infos.CardNo = this.currentPatientCardNo
				this.infos.PatientName = this.currentPatientName
				this.$http.request({url:this.$api.uri.registerLock,data: data ,method:"POST",noCheckToken:true}).then(
				(result) => {
					uni.hideLoading();
					let infoRes = result.data;
					console.log(infoRes);
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
						title: '挂号失败，请稍后再试'
					});
				});
			}
		}
	}
</script>

<style lang="scss">
@mixin ellipsiso { display: block; overflow: hidden; white-space: nowrap; -o-text-overflow: ellipsis; text-overflow: ellipsis; }
@mixin ellipsiss($num1, $num2) { line-height: $num2 + rpx; overflow: hidden; display: -webkit-box; height: $num1*$num2 + rpx;
 -webkit-line-clamp: $num1; -webkit-box-orient: vertical; }
page{ background:#fff;}
.content{ padding: 0;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block; display:block; zoom:1;}
.pad030{ padding-left: 30rpx; padding-right: 30rpx;}
.bgf4f4f4{ background: #f4f4f4;}
.btb{ border-bottom: 1px solid #ececec; border-top: 1px solid #ececec;}
// @import "@/static/test.scss";
.doctorde_top{ min-height: 280rpx; padding: 58rpx 30rpx; background: url(~@/static/img/doctorDetails01.png) no-repeat center; background-size: 100% 100%;
	image{ display: block; float: left; height: 160rpx; width: 160rpx; border: 4rpx solid #80f2e4; border-radius: 50%;}
}
.doctorde_top_ri{ margin-left: 210rpx;}
.doctorde_top_ri_name{ line-height: 50rpx; font-size: 32rpx; color: #fff;
	text{ font-size: 24rpx;}
	text:nth-child(1){ color: #c8fcf9; font-size: 28rpx; padding: 0 8rpx;}
}
.doctorde_top_ri_con{ font-size: 24rpx; color: #ffffff; margin-top: 8rpx;
	@include ellipsiss(2,30)
}
.doctorde_top_cart{
	text,&{ height: 38rpx;}
	text{ display: block; float: left; line-height: 38rpx; font-size: 24rpx; color: #666666; background: #fff; border-radius: 6rpx; padding: 0 10rpx;}
}
.doctorde_times{ white-space: nowrap; overflow-x: auto; overflow-y: hidden; border-bottom: 1px solid #eeeeee; background: #fff;
	>view{ display: inline-block;}
}
.doctorde_times_box{ background: #fff; padding: 0 30rpx;}
.doctorde_times_item{ margin: 0 25rpx 0 0; color: #8a8a8a; height: 88rpx;
	text{ display: block;}
	&.on{ color: #3eceb5; border-bottom: 2px solid #3eceb5;}
}
.doctorde_times_itemf{ padding: 12rpx 25rpx; text-align: center;}
.doctorde_times_itemft{ line-height: 58rpx; font-size: 26rpx;}
.doctorde_times_itemfn{ border-radius: 6rpx; padding: 5rpx 6rpx 5rpx 6rpx; font-size: 24rpx; line-height: 26rpx; color: #8b8b8b;
	text{ display: block; font-size: 26rpx; line-height: 28rpx;}
	&.on{ background: #3eceb5; color: #fff;}
}
// 
.doctode_list{ background: #fff; border-top: 1px solid #eaeaea;}
.doctode_list_item{ padding: 0 30rpx; line-height: 94rpx; border-bottom: 1px solid #eaeaea; font-size: 28rpx; color: #999999;
	view{ float: right; font-size: 26rpx;
		&.num{ color: #ff9000;
			text{ display: inline-block; line-height: 26rpx; font-size: 24rpx; color: #fff; background: #ffb400; padding: 0 10rpx; border-radius: 10rpx;
				margin-left: 10rpx;
			}
		}
	}
}
// 
.doctorde_open_zz{ position: fixed; top: 0; left: 0; bottom: 0; right: 0; z-index: 100; background: rgba(0,0,0,0.5);}
.doctorde_open{ position: fixed; bottom: 0; left: 0; width: 100%; z-index: 120; min-height: 200rpx; background: #fff; padding: 38rpx 30rpx 0 30rpx;}
.doctorde_open_top{ border-bottom: 1px solid #eaeaea; padding-bottom: 20rpx;
	image{ display: block; float: left; margin-top: 43rpx; width: 154rpx; height: 154rpx; border-radius: 50%; border: 1px solid #e1e1e1;}
}
.doctorde_open_text{ margin-left: 180rpx; line-height: 54rpx; font-size: 28rpx;
	>view{
		>view{float: left; color: #000000;}
		>text{ display: block; margin-left: 95rpx; color: #999999;}
	}	
}
.doctorde_open_bot{ padding: 30rpx 0 16rpx 0;}
.doctorde_open_bot_se{ line-height: 50rpx; font-size: 28rpx; color: #000000;}
.doctorde_open_bot_num{ line-height: 50rpx; font-size: 28rpx; color: #999999;}
.doctorde_open_bot_name{ padding-top: 28rpx;
	>view{ float: left; margin: 0 44rpx 28rpx 0; line-height: 98rpx; text-align: center;
	            box-sizing: border-box;
				border: 1px solid #3eceb5;
				border-radius: 50%;
		&,image{display: block; height: 98rpx; width: 98rpx;}
		&.listname{ background: #3eceb5; color: #ffffff; font-size: 26rpx; }
	}
}
.doctorde_open_btn{ line-height: 82rpx; background: #3eceb5; font-size: 28rpx; color: #fff; text-align: center; box-sizing: content-box; padding: 0 30rpx;
	margin-left: -30rpx; width: 100%;
}
.doctorde_open_close{ position: absolute; top: 22rpx; right: 30rpx; height: 33rpx; width: 33rpx; z-index: 130;}
</style>
