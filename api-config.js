/**
 * sp:要跳转的页面配置
 * uri:后台api接口地址
 * 
 */
export default{
	//页面地址路径
	sp:{
		//首页
		home:"/pages/home/home",
		// 我的
		my:"/pages/my/mycenter",
		
		survey:"/pages/survey/survey",
		
		/** start 首页公告类型**/
		// 冬病夏治--列表
		dbxzList:"/pages/home/news/dbxz-list",
		// 冬病夏治--详情
		dbxzDetail:"/pages/home/news/dbxz-detail",
		// 就医指南--列表
		jyznList:"/pages/home/news/jyzn-list",
		// 就医指南--详情
		jyznDetail:"/pages/home/news/jyzn-detail",
		// 新闻动态--列表
		xwdtList:"/pages/home/news/xwdt-list",
		// 新闻动态--详情
		xwdtDetail:"/pages/home/news/xwdt-detail",
		// 使用帮助--列表
		sybzList:"/pages/home/news/sybz-list",
		// 使用帮助
		sybzDetail:"/pages/home/news/sybz-detail",
		// 楼层导航--列表
		lcdhList:"/pages/home/news/lcdh-list",
		// 楼层导航--详情
		lcdhDetail:"/pages/home/news/lcdh-detail",
		/** end 首页公告类型* */
		
		/**start 患者信息管理 **/
		patientList:"/pages/patient/patient",
		patientAdd:"/pages/patient/patientAdd",
		patientDetails:"/pages/patient/patientDetails",
		patientEdit:"/pages/patient/patientEdit",
		/**end 患者信息管理 **/
		
		/**start 挂号记录 **/
		registerList:"/pages/registerList/registerList",
		registerListDetails:"/pages/registerList/registerListDetails",
		/**end 挂号记录 **/
		
		/**start 缴费记录 **/
		payPayment:"/pages/payRecord/payPayment",
		payResult:"/pages/payRecord/payResult",
		payResultForRegister:"/pages/payRecord/payResultForRegister",
		payRecord:"/pages/payRecord/payRecord",
		payRecordDetails:"/pages/payRecord/payRecordDetails",
		/**end 缴费记录 **/
		
		
		/**start 医生介绍 *  */
		/* 科室列表 */
		department_introduce:"/pages/department/department_introduce",
		/* 医生列表 */
		doctor_introduce:"/pages/doctor/doctor_introduce",
		/* 医生简介 */
		doctorDetails_introduce:"/pages/doctor/doctorDetails_introduce",
		
		/* 看诊详情 */
		consultDetails:"/pages/consult/consultDetails",
		consultList:"/pages/consult/consultList",
		
		
		/**start 医生介绍 *  */
		/* 科室列表 */
		department:"/pages/department/department",
		/* 医生列表 */
		clinic:"/pages/clinic/clinic",
		/* 医生预约挂号 */
		doctorDetailsChoice:"/pages/doctor/doctorDetailsChoice",
		/* 挂号确认支付页 */
		payment:"/pages/payment/payment",
		
		/**end 医生介绍 **/

		/**start 客服咨询 **/
		kefuIntroduce:"/pages/kefu/kefu_introduce"
		/**end 客服咨询  **/
		
	},
	//请求数据路径
	uri:{
		
		// 凯蒙中医院开始位置
		// 首页轮播图查询
		indexBanner:"/system/bannerimage/nonlogin/query/ylfw-index",
		yyxxBanner:"/system/bannerimage/nonlogin/query/yyxx-top",
		// 首页新闻动态列表页查询
		indexNewsList:"/nonlogin/notice/list",
		// 首页新闻动态详情
		indexNewsDetail:function(id){return "/nonlogin/notice/detail/"+id},
        // 提交满意度调查
		questionnaire:"/nonlogin/hospital/questionnaire/add",
		// 查询医院信息
		queryhispitalinfo:"/nonlogin/hospital/info",
		//	医院订单记录更新支付成功
		updatepaystatus:"/hospital/hospitalorder/nonlogin/updatepaystatus",
		
		/**start 患者信息管理 **/
		createpatient:"/nonlogin/hisapi/common/createpatient",// 添加就诊人
		querypatientlist:"/nonlogin/hisapi/common/querypatientlist",// 查询我绑定的就诊人 后台数据
		querypatientDetail:"/nonlogin/hisapi/common/querypatient",// 查询我绑定的就诊人 HIS数据
		modifypatient:"/nonlogin/hisapi/common/modifypatient",// 查询我绑定的就诊人 HIS数据
		delPatient:"/nonlogin/hisapi/common/delPatient",// 删除就诊人 HIS数据
		setPatienDefault:"/nonlogin/hisapi/common/setPatienDefault",// 删除就诊人 HIS数据
		/**end 患者信息管理 **/
		
		/**start 门诊缴费 **/
		queryWaitPayRecipe:"/nonlogin/hisapi/outpatientpay/querywaitpayrecipe",// 门诊待缴费处方查询
		createRecipeOrder:"/nonlogin/hisapi/outpatientpay/createrecipeorder",// 门诊待缴费处方查询
		createUnifiedOrder:"/nonlogin/wxpay/createUnifiedOrder",// 门诊待缴费处方查询
		queryRecipePayStatus:"/nonlogin/hisapi/outpatientpay/queryrecipepaystatus",// 门诊缴费订单状态查询
		queryPayOrderRecord:"/nonlogin/hisapi/outpatientpay/querypayorderrecord",//门诊缴费订单记录查询
		queryPayOrderRecipeRecord:"/nonlogin/hisapi/outpatientpay/querypayorderreciperecord",//门诊缴费订单处方记录查询
		queryPrepayid:"/nonlogin/wxpay/queryPrepayid",//门诊缴费订单处方记录查询
		cancelRecipeOrder:"/nonlogin/hisapi/outpatientpay/cancelrecipeorder",//门诊缴费订单处方记录查询
		/**end 门诊缴费 **/

		/**start 门诊挂号 **/
		queryPreRegisterRecord:"/nonlogin/hisapi/outpatientregister/querypreregisterrecord",// 预约已挂记录查询
		registerLock:"/nonlogin/hisapi/outpatientregister/registerlock",//挂号锁号
		createUnifiedOrderForRegister:"/nonlogin/wxpay/createUnifiedOrderForRegister",//挂号缴费微信预支付
		queryRegisterPayStatus:"/nonlogin/hisapi/outpatientregister/queryregisterpaystatus",//挂号费支付状态查询
		registerUnLock:"/nonlogin/hisapi/outpatientregister/registerunlock",//号源取消锁定
		wxRefund:"/nonlogin/wxpay/refund",//微信申请退款
		/**end 门诊挂号 **/

		/**start 客服咨询 **/
		imusercreate:"/nonlogin/im/creatImUserDocker", //创建对应的im用户信息
		kefulist:"/nonlogin/im/querykefulist", //创建对应的im用户信息
		/**end 客服咨询  **/
		
		// 医生介绍科室查询
		querydepartment:"/nonlogin/hisapi/outpatientregister/querydepartment",
		// 医生介绍医生查询
		querydoctor:"/nonlogin/hisapi/outpatientregister/querydoctor",
		
		//查询看诊记录列表
		queryhistoryrecipe:"/nonlogin/hisapi/outpatientpay/queryhistoryrecipe",
		//查询看诊记录详情
		queryrecipedetail:"/nonlogin/hisapi/outpatientpay/queryrecipedetail",
		//号源查询
		queryregistersource:"/nonlogin/hisapi/outpatientregister/queryregistersource",
		
		// 获取用户信息
		getUserInfo:"/system/user/nonlogin/getWxInfoByToken",
		//凯蒙中医院结束位置
		
	}
}