const TYPES = {
    CONV_C2C:"c2c",
    CONV_GROUP:"group"

};
let handleMessage = function (state,message) {
    let date = new Date(message.msgTimeStamp * 1000);
    message.newtime =  uni.$moment(date)
        .format('A HH:mm')
        .replace('PM', '下午')
        .replace('AM', '上午');
    if(message.type ===TYPES.CONV_C2C){
        if(message.from === state.currentConversation.from){
            message.isSelf = "self"
            if(state.currentConversation.c2cImage.indexOf("http://") ===0
                ||state.currentConversation.c2cImage.indexOf("https://") ===0 ){
                message.avatar = state.currentConversation.c2cImage;
            }else{
				if(state.currentConversation.c2cImage){
					message.avatar = uni.$globle.imgHtmlPath +"/"+ state.currentConversation.c2cImage;
				}else{
					message.avatar = "../../static/img/z002.eb9138a5.png";
				}
            }
        }
    }
    let msgBody = message.msgBody[0];
    message.msgType = msgBody.MsgType;
    if("TIMTextElem" === msgBody.MsgType){
        message.content = msgBody.MsgContent.Text;
    }else if("TIMImageElem" === msgBody.MsgType){
        message.content = msgBody.ImageInfoArray[0].URL;
    }
    return message;
};
const conversationModules = {
    state: {
        allConversation: [], // 所有的conversation
        currentConversationID: '', // 当前聊天对话ID
        currentConversation: {}, // 当前聊天对话信息
        currentMessageList: [], // 当前聊天消息列表
        isCompleted: false, // 当前会话消息是否已经请求完毕
        isLoading: false, // 是否正在请求
        pageNum:1,
        pageSize:10
    },
    getters: {
        allConversation: state => state.allConversation,
        // 当前聊天对象的ID
        toAccount: state => {
            if (state.currentConversation.type === TYPES.CONV_C2C ) {
                return state.currentConversation.fromAccount;
            } else if (state.currentConversation.type === TYPES.CONV_GROUP) {
                return state.currentConversation.id;
            }
        },
        // 当前聊天对象的昵称
        toName: state => {
            if (state.currentConversation.type === 'C2C') {
                return state.currentConversation.userProfile.userID
            } else if (state.currentConversation.type === 'GROUP') {
                return state.currentConversation.groupProfile.name
            }
        },
        // 当前聊天对话的Type
        currentConversationType: state => {
            return state.currentConversation.type
        },
        currentConversation: state => state.currentConversation,
        currentMessageList: state => state.currentMessageList,
        totalUnreadCount: state => {
            const result = state.allConversation.reduce((count, { unreadCount }) => count + unreadCount, 0);
            // if (result === 0) {
            //   uni.removeTabBarBadge({ index: 1 })
            // } else {
            //   uni.setTabBarBadge({ index: 1, text: result > 99 ? '99+' : String(result) })
            // }
            return result
        }
    },
    mutations: {
        // 历史头插消息列表
        unshiftMessageList (state, messageList) {
            let list = [...messageList];
            let newList = [];
            for (let i = 0; i < list.length; i++) {
                list[i] = handleMessage(state,list[i]);
                newList.unshift(list[i])
            }
            state.currentMessageList = [...newList, ...state.currentMessageList]
        },
        // 收到
        receiveMessage (state, messageList) {
            let list = [...messageList];
            for (let i = 0; i < list.length; i++) {
                list[i] = handleMessage(state,list[i]);
            }
            state.currentMessageList = [...state.currentMessageList, ...list];
            //滚动到底部
            setTimeout(()=>{
                uni.pageScrollTo({
                    scrollTop: 999999,
                })
            },500);
        },
        sendMessage (state, message) {
            let newMsg = handleMessage(state, message);
            state.currentMessageList.push(newMsg)
        },
        // 更新当前的会话
        updateCurrentConversation (state, conversation) {
            state.currentConversation = conversation;
            state.currentConversationID = conversation.id;
        },
        // 更新当前所有会话列表
        updateAllConversation (state, list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].lastMessage && (typeof list[i].lastMessage.lastTime === 'number')) {
                    let date = new Date(list[i].lastMessage.lastTime * 1000)
                    list[i].lastMessage._lastTime = uni.$moment(date)
                        .format('A HH:mm')
                        .replace('PM', '下午')
                        .replace('AM', '上午');
                }
            }
            state.allConversation = list
        },
        // 重置当前会话
        resetCurrentConversation (state) {
            state.currentConversationID = '';// 当前聊天对话ID
            state.currentConversation = {}; // 当前聊天对话信息
            state.currentMessageList = []; // 当前聊天消息列表
            state.isCompleted = false; // 当前会话消息是否已经请求完毕
            state.isLoading = false; // 是否正在请求
            state.pageNum = 1;
        },
        resetAllConversation (state) {
            state.allConversation = []
        },
        removeMessage (state, message) {
            state.currentMessageList.splice(state.currentMessageList.findIndex(item => item.ID === message.ID), 1)
        },
        changeMessageStatus (state, index) {
            state.currentMessageList[index].status = 'fail'
        }
    },
    actions: {
        // 消息事件
        onMessageEvent (context, message) {
            let id = context.state.currentConversationID;
            if (!id) {
                return
            }
            let list = [];
            if(message.sid === id){
                list.push(message);
            }
            context.commit('receiveMessage', list)
        },
        // 获取消息列表
        getMessageList (context) {
            const {currentConversationID,pageNum,pageSize} = context.state;
            // 判断是否拉完了
            if (!context.state.isCompleted) {
                if (!context.state.isLoading) {
                    context.state.isLoading = true;
                    uni.$zim.getMessageList({ conversationID: currentConversationID, pageNum: pageNum, pageSize:pageSize }).then(res => {
                        context.state.pageNum = pageNum+1;
                        let result = res.data;
                        if(result.code === 0){
                            context.commit('unshiftMessageList', result.rows);
                            if ((pageNum-1)*pageSize>=result.total || result.rows< pageSize) {
                                context.state.isCompleted = true
                            }
                        }
                        context.state.isLoading = false
                    }).catch(err => {
                        console.log(err)
                        context.state.isLoading = false
                    })
                } else {
                    uni.showToast({
                        title: '你拉的太快了',
                        icon: 'none',
                        duration: 500
                    })
                }
            } else {
                uni.showToast({
                    title: '没有更多啦',
                    icon: 'none',
                    duration: 1500
                })
            }
        },
        checkoutConversation (context, conversationID) {
            return context.dispatch('checkoutConversationSetTitle',{conversationID});
        },
        checkoutConversationSetTitle (context, param){
            context.commit('resetCurrentConversation');
            // uni.$zim.setMessageRead({ conversationID:param.conversationID });
            let perrt = uni.$zim.getConversationProfile(param.conversationID);
            console.log(perrt);
            return perrt.then(({ data: result }) => {
                let conversation = result.data;
                context.commit('updateCurrentConversation', conversation);
                context.dispatch('getMessageList');
                let name = ''
                switch (conversation.type) {
                    case TYPES.CONV_C2C:
                        name = param.title || conversation.c2cNick || conversation.fromAccount;
                        break;
                    case TYPES.CONV_GROUP:
                        name = param.title || conversation.groupNick || conversation.toAccount;
                        break;
                    default:
                        name = '系统通知'
                }
                uni.navigateTo({ url: '/pages/chat/chat?toAccount='+name+'&type='+conversation.type });
                return Promise.resolve()
            })
        }
    }
}

export default conversationModules