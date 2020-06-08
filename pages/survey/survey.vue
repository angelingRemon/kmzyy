<template>
	<view>
		<template v-if="!isSuccess">
			<view class="bg-white padding-xs ">
				<view class="flex-sub">
					为了提高我院医疗服务质量，营造良好的医疗服务环境，请您利用几分钟时间填写这份问卷调查，
					真实、客观地对我院医疗服务进行评价，您的回答将是我们改进医疗服务的重要依据，
					请您根据亲身经历或感受，在您认为是以上序号划‘’√‘’，谢谢您的合作与支持，敬祝您早日康复。
				</view>
			</view>
			<view v-for="(wj,i) in wenjuanList" :key="i">
				<wenjuan  :type="wj.type" :value="wj.value" :maxSelect="wj.maxSelect" :title="wj.title" :subTitle="wj.subTitle" :defaultValue="wj.defaultValue" @change="change($event,wj.id,wj.name)" @send="sendCode($event,wj.id,wj.name)"></wenjuan>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" @click="submit">提交</button>
			</view>
		</template>
		
		<template v-else>
			<view class='bg-white padding-lr'>
				<view class=' padding-xs flex align-center'>
					<view class='flex-sub text-center'>
						<view class=' text-xsl padding'>
							<text class='cuIcon-roundcheckfill text-green'></text>
						</view>
						<text class='text-black text-bold'>感谢你的参与。</text>
					</view>
				</view>
				
				<view class="padding flex flex-direction">
					<button class="cu-btn bg-blue margin-tb-sm lg" @click="returnComplainForm()">返回重新填写</button>
				</view>
			</view>
		</template>
		
	</view>
</template>

<script>
	import wenjuan from '@/components/gwh-wenjuan/gwh-wenjuan.vue'
	export default {
		components:{
			wenjuan
		},
		data() {
			return {
				isSuccess:false,
				openid:'',
				wenjuanList:[
					{
						id:"1",
						name:"q1",
						type:"select",
						title:"一、	您对医院的总体印象如何",
						value:[{"text":"满意","val":"1"},{"text":"基本满意","val":"2"},{"text":"不满意","val":"3"}],
						defaultValue:""
					},
					{
						id:"2",
						name:"q2",
						type:"select",
						title:"二、您对医院工作人员的服务态度总体上是否满意",
						value:[{"text":"满意","val":"1"},{"text":"基本满意","val":"2"},{"text":"不满意","val":"3"}],
						defaultValue:""
					},
					{
						id:"3",
						name:"q3",
						type:"select",
						title:"三、您对医院提供的诊疗技术是否满意",
						value:[{"text":"满意","val":"1"},{"text":"基本满意","val":"2"},{"text":"不满意","val":"3"}],
						defaultValue:""
					},
					{
						id:"4",
						name:"q4",
						type:"select",
						title:"四、您对医院的就诊环境是否满意",
						value:[{"text":"满意","val":"1"},{"text":"基本满意","val":"2"},{"text":"不满意","val":"3"}],
						defaultValue:""
					},
					{
						id:"5",
						name:"q5",
						type:"select",
						title:"五、您对医院的服务设施是否满意",
						value:[{"text":"满意","val":"1"},{"text":"基本满意","val":"2"},{"text":"不满意","val":"3"}],
						defaultValue:""
					},
					{
						id:"6",
						name:"q6",
						type:"boolean",
						title:"六、您认为医院是否存在违规收费行为",
						value:["是","否"],
						defaultValue:""
					},
					{
						id:"7",
						name:"q7",
						type:"boolean",
						title:"七、您认为医院的收费是否透明",
						value:["是","否"],
						defaultValue:""
					},
					{
						id:"8",
						name:"q8",
						type:"boolean",
						title:"八、您或您的家属在医院就诊或住院过程中，是否向医务人员送过“红包”，是否宴请过该院义务人员",
						value:["是","否"],
						defaultValue:""
					},
					{
						id:"9",
						name:"q9",
						type:"boolean",
						title:"九、您询问义务人员或您有意见医院投诉时，医院工作人员是否主动服务，耐心解释，让您能够了解清楚",
						value:["是","否"],
						defaultValue:""
					},
					{
						id:"10",
						name:"q10",
						type:"boolean",
						title:"十、您认为医院是否做到尊重、关爱患者、周到、热情、文明服务、一切以病人为中心",
						value:["是","否"],
						defaultValue:""
					},
					{
						id:"11",
						name:"q11",
						type:"textarea",
						title:"",
						value:"",
						defaultValue:"可写下您的具体意见和建议："
					}
				]
			}
		},
		onLoad(e) {
			this.openid = e.openid
		},
		methods: {
			returnComplainForm() {
				this.isSuccess = false;
				window.location.reload();
			},
			change(e,...res){
				for (var i=0;i<this.wenjuanList.length;i++){
				    //根据实例res首先传输了问卷的id
				    if(this.wenjuanList[i].id == res[0]){
				      //更新该条目结果
				      this.wenjuanList[i].resultValue = e[0];
				      break;
				    }
				 }
			},
			submit(){
			     console.log(this.wenjuanList);
				 let data = {};
				 for (var i=0;i<this.wenjuanList.length;i++){
					var result = this.wenjuanList[i].resultValue;
					if(!result){
						uni.showToast({
							title: '您还有未完成的调查题目',
							duration: 2000,
							icon: "none"
						});
					   return;
					}
					data['val'+(i+1)] = result;
				  }
				  
				  data['openid'] = this.openid
				  this.$http.request({url:this.$api.uri.questionnaire,data: data,method:"POST",noCheckToken:true}).then(
				      (result) => {
				  		let infoRes = result.data;
				  		if (infoRes.code === 0) {
				  			uni.showToast({
				  				icon: 'none',
				  				title: '提交成功'
				  			});
							this.isSuccess=true;
				  		} else {
				  			uni.showToast({
				  				icon: 'none',
				  				title: infoRes.msg
				  			});
				  		}
				  	}).catch(error => {
				  		uni.showToast({
				  			icon: 'none',
				  			title: '提交失败，请稍后再试'
				  		});
				  	});
			}
		}
	}
</script>

<style>
.flex-sub{ font-size:30rpx; line-height: 1.8em; color: #666;}
</style>
