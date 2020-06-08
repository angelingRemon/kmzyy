<template>
	<view class="bg-white">
		<view v-if="type == 'select'" class="margin-xs">
			<view class="cu-bar dashed-bottom">
				<view class="action">
					<text class="cuIcon-title text-green"></text>
					<text class="margin-xs text-xl text-bold" v-if="title.length != 0">{{title}}</text>
				</view>
			</view>
			<radio-group class="cu-form-group">
				<view v-for="(v,index) in value" :key="index" :data-value="v.val" @tap="select">
					<label>
						<radio class='blue radio' :value="v.val" :checked="defaultValue.indexOf(v.val) >= 0" />
						<text class="margin-left-xs title">{{v.text}}</text>
					</label>
				</view>
			</radio-group>
		</view>

		<view v-else-if="type == 'boolean'" class="margin-xs">
			<view class="cu-bar dashed-bottom">
				<view class="action">
					<text class="cuIcon-title text-green"></text>
					<text class="margin-xs text-xl text-bold" v-if="title.length != 0">{{title}}</text>
				</view>
			</view>
			<radio-group class="cu-form-group">
				<view data-value="true" @tap="select">
					<label>
						<radio class='blue radio' :checked="defaultValue.indexOf(true) >= 0 || value[0]==defaultValue" />
						<text class="margin-left-xs title">{{this.value[0]?this.value[0]:'true'}}</text>
					</label>
				</view>
				<view  data-value="false" @tap="select">
					<label>
						<radio class='blue radio' :checked="defaultValue.indexOf(false) >= 0 || value[1]==defaultValue" />
						<text class="margin-left-xs title">{{this.value[1]?this.value[1]:'false'}}</text>
					</label>
				</view>
				<view>　</view>
				<view>　</view>
				<view>　</view>
			</radio-group>
		</view>

		<view v-else-if="type == 'textarea'" class="cu-form-group margin-xs">
			<textarea v-model="result[0]" :placeholder="defaultValue==''?'请输入':defaultValue" @input="input" :maxlength="maxSelect>0?maxSelect:200"
			 @blur="input" @confirm="input" />
			</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				result:[""],
				value2:[],
				init:false,
				
			}
		},
		methods:{
			select(e){
				this.$set(this.result,0,e.currentTarget.dataset.value);
				this.$emit('change',this.result);
			},
			input(e){
				this.$nextTick(function(){
					this.$emit('change',this.result);
				})
			}
		},
		//name:'wenjuan',
		props:{
			type:{
				type:String,
				default:"select"
			},
			title:{
				type:String,
				default:""
			},
			subTitle:{
				type:String,
				default:""
			},
			value:{
				type:[String,Array],
				default:()=>{}
			},
			defaultValue:{
				type:[String,Array],
				default:()=>{}
			},
			maxSelect:{
				type:Number,
				default:-1
			}
		},
	}
</script>

<style lang="scss">
	radio{transform: scale(0.6); position: relative; top:-5rpx; left:5rpx}
	.margin-left-xs{ font-size:26rpx}
	.margin-xs{ font-size:30rpx; color:#666;}
	.uni-radio-input-checked:before{display: none !important;}
</style>
