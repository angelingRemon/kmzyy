<template>
	<view>
		<view class="cu-chat" id="liaotiancontent">
			<block v-for="(message, index) in currentMessageList" :key="message.id" :id="message.id">
				<view v-if="message.fromAccount==myInfo.id" class="cu-item self">
					<view class="main">
<!--						<view class="action">-->
<!--							<text class="cuIcon-locationfill text-orange text-xxl"></text>-->
<!--						</view>-->
						<view v-if="message.msgType == 'TIMTextElem'" class="content bg-green shadow">
							<text >{{message.content}}</text>
						</view>
						<image v-else-if="message.msgType == 'TIMImageElem'" :src="message.content" 
						class="radius" mode="widthFix" @click="previewImg(message.content)"></image>
					</view>
					<view class="cu-avatar radius" :style="'background-image:url('+myInfo.avatar+');'"></view>
					<view class="date">{{message.newtime}}</view>
				</view>
				<view v-else class="cu-item">
					<view class="cu-avatar radius" :style="'background-image:url('+message.avatar+');'"></view>
					<view class="main">
						<view v-if="message.msgType == 'TIMTextElem'" class="content shadow">
							<text >{{message.content}}</text>
						</view>
						<image v-else-if="message.msgType == 'TIMImageElem'" :src="message.content" 
							class="radius" mode="widthFix" @click="previewImg(message.content)"></image>
					</view>
					<view class="date">{{message.newtime}}</view>
				</view>
			</block>

		</view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px;'}]+';padding-top: 0.3rem;padding-bottom: 0.3rem;'">
			<view class="action">
				<text class="cuIcon-camera text-grey" @click="chooseImage"></text>
			</view>
			<textarea type="text" class="solid-bottom lt_input"
					  v-model.lazy:value="messageContent"
					  confirm-type="send"
					  hold-keyboard="true"
					  maxlength="300"
					  :focus="false" auto-height
					  @focus="InputFocus" @blur="InputBlur" @confirm='sendMessage' />
<!--			<view class="action">-->
<!--				<text class="cuIcon-emojifill text-grey"></text>-->
<!--			</view>-->
			<button class="cu-btn bg-green shadow" style="width: 3.8rem;margin-left: 0.3rem;" @click="sendMessage">发送</button>
		</view>

	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState({
				currentMessageList: state => {
					console.log(state.conversation.currentMessageList)
					return state.conversation.currentMessageList
				},
				currentConversation: state => state.conversation.currentConversation,
				myInfo: state => {
					let minfo = state.imuser.myInfo;
					if(minfo.img.indexOf("http://") ===0
						||minfo.img.indexOf("https://") ===0 ){
						minfo.avatar = minfo.img;
					}else{
						minfo.avatar = uni.$globle.imgHtmlPath +"/"+ minfo.img;
					}
					return minfo;
				}
			})
		},
		data() {
			return {
				InputBottom: 0,
				selfInfo:{},
				isShow: false,
				messageContent:""
			};
		},
		onShow () {
			this.isShow = true
		},
		onLoad (options) {
			this.set = options.toAccount;
			// 设置header——聊天对象昵称或群名
			this.set && uni.setNavigationBarTitle({title: this.set});
			let sysInfo = uni.getSystemInfoSync();
			this.height = sysInfo.windowHeight;
			let that = this;
			uni.$zim.on(uni.ZIM.EVENT.MESSAGE_RECEIVED, () => {
				let query = uni.createSelectorQuery();
				query.select('#liaotiancontent').boundingClientRect(function (res) {
					console.log('#liaotiancontent',res,that.height);
					if (res.bottom - that.height > 280) {
						that.scrollToBottom()
					}
				}).exec()
			},this);
			let interval = setInterval(() => {
				if (this.currentMessageList.length !== 0) {
					this.scrollToBottom();
					clearInterval(interval)
				}
			}, 600);
		},
		onUnload () {
			this.isShow = false;
			uni.$zim.off(uni.ZIM.EVENT.MESSAGE_RECEIVED);
		},
		onPullDownRefresh () {
			this.getMessageList();
		},
		methods: {
			// 获取消息
			getMessageList () {
				this.$store.dispatch('getMessageList');
				uni.stopPullDownRefresh()
			},
			// 滚动到列表bottom
			scrollToBottom () {
				if (this.isShow) {
					setTimeout(()=>{
						uni.pageScrollTo({
							scrollTop: 999999,
						})
					},500);
				}
			},
			isnull (content) {
				if (content === '') {
					return true
				}
				const reg = '^[ ]+$'
				const re = new RegExp(reg)
				return re.test(content)
			},
			// 发送text message 包含 emoji
			sendMessage () {
				if (!this.isnull(this.messageContent)) {
					const message = uni.$zim.createTextMessage({
						from: this.myInfo.id,
						to: this.$store.getters.toAccount,
						type: this.$store.getters.currentConversationType,
						content: this.messageContent
					});
					this.messageContent = '';
					this.$store.commit('sendMessage', message);
					this.scrollToBottom();
					uni.$zim.sendMessage(message);
					this.messageContent = ''
				} else {
					this.$store.commit('showToast', { title: '消息不能为空' })
				}
			},
			chooseImage () {
				let self = this
				uni.chooseImage({
					count: 1,
					success: (res)=> {
						let message = uni.$zim.createImageMessage({
							from: this.myInfo.id,
							to: this.$store.getters.toAccount,
							type: this.$store.getters.currentConversationType,
							content:res,
							onProgress: percent => {
								console.log(percent);
								self.percent = percent
							}
						});
						uni.$zim.sendMessage(message);
						self.$store.commit('sendMessage', message);
						this.scrollToBottom();
					}
				});
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			previewImg(imgUrl){
				uni.previewImage({
					urls:[imgUrl],
					
				});
			}
		}
	}
</script>

<style>
	@import "@/common/css/chat.css";
	.solid-bottom{
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 5px;
	}
	.cu-chat .main .content{
		word-wrap: break-word;
		word-break: break-all;
	}
	page{
	  padding-bottom: 100upx;
	}
	.lt_input{
		cursor: auto;
		display: block;
		height: 1.8rem;
		text-overflow: clip;
		overflow: hidden;
		white-space: nowrap;
		font-family: UICTFontTextStyleBody;
		min-height: 1.8rem;

	}
</style>
