const userModules = {
  state: {
    myInfo: {},
  },
  getters: {
    myInfo: state => state.myInfo,
  },
  mutations: {
    updateMyInfo (state, myInfo) {
      state.myInfo = myInfo
    },
    resetUser (state) {
      state.myInfo = {}
    }
  },
  actions:{
  }
};

export default userModules
