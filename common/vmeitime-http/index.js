import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */
//登录方法
export const login = (params) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		delete config.header.token;
	} 
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		//判断返回状态 执行相应操作
		return response;
	}
	params.method = "POST";
	return http.request(params);
}
//分页数据
export const pageRequest = (params) =>{
	//分页方法
	const __pageClass = function(options){
		let that = this;
		let d_options = {
			url:"",
			currentUrlBase64:"",
			data:{
			},
			req:{
				pageNum:"pageNum",
				pageSize:"pageSize"
			},
			res:{
				total:"total",
				rows:"rows",
				code:"code",
				msg:"msg"
			},
			resultP:{
				setLoading:undefined,//loading加载样式
				setDataList:undefined,
				loadError: undefined,
				dataList:[]//页面渲染加载的的数据化
			},
			resultCode:{
				success:0,
				error:500,
				loginfail:1001
			}
		};
	
		//重新初始化参数
		that.d_options = Object.assign({},d_options,options);
		//初始化参数
		(!that.d_options.data)&&(that.d_options.data = {});
		(!that.d_options.data[that.d_options.req.pageNum])&&(that.d_options.data[that.d_options.req.pageNum] = 1);
		(!that.d_options.data[that.d_options.req.pageSize])&&(that.d_options.data[that.d_options.req.pageSize] = 10);
		that.d_options.data[that.d_options.res.total] = 0;
		//传递引用传递数据
		that.d_options.resultP = options.resultP;
		//加载数据
		let getMoreData = function(resolve, reject){
			//如果等于1表示第一次加载所以数据都从新设置
			let pageNum = that.d_options.data[that.d_options.req.pageNum];
			let pageSize = that.d_options.data[that.d_options.req.pageSize];
			let total = that.d_options.data[that.d_options.res.total];
			if(!that.d_options.url ){
				console.error("url不能为空！")
				return
			}
			let newParam = Object.assign({},that.d_options.data);
			if(pageNum == 1){
				that.d_options.resultP.dataList=[];
				(that.fristPageSize)&&(newParam[that.d_options.req.pageSize]=that.fristPageSize);
			}
			if(total!=0 && total<=that.d_options.resultP.dataList.length){
				return;
			}
			let reqOpt = {
				url : that.d_options.url,
				data: newParam,
				method:"POST",
			};
				
			(that.d_options.noCheckToken)&&(reqOpt.noCheckToken = that.d_options.noCheckToken);
			http.request(reqOpt).then((result) => {
					resolve(result);
					uni.stopPullDownRefresh();
					let infoRes = result.data;
					if (infoRes[that.d_options.res.code] == that.d_options.resultCode.success) {
						that.d_options.data[that.d_options.res.total] = infoRes.total;
						let list = infoRes[that.d_options.res.rows];
						for (let item of list) {
							that.d_options.resultP.dataList.push(item);
						}
						if(that.d_options.resultP.setDataList){
							that.d_options.resultP.setDataList(that.d_options.resultP.dataList);
						}
						let _class = "loading";
						if(infoRes.total <= that.d_options.resultP.dataList.length){
							_class = "over";
						}else{
							_class = "loading";
						}
						if(that.d_options.resultP.setLoading){
							that.d_options.resultP.setLoading(_class);
						}
					} else if(infoRes[that.d_options.res.code] == that.d_options.resultCode.loginfail){
						result.$utils.skipLoginPage(that.d_options.currentUrlBase64,result.globle.loginType);
					}else{
						uni.showToast({
							icon: 'none',
							title: infoRes[that.d_options.res.msg]
						})
						if(that.d_options.resultP.setLoading){
							that.d_options.resultP.setLoading("erro text-red");
						}
					}
					if(typeof that.d_options.success == "function"){
						that.d_options.success(result);
					}
				}).catch((erro) => {
					reject(erro);
					if(that.d_options.resultP.setLoading){
						that.d_options.resultP.setLoading("erro text-red");
					}
					uni.stopPullDownRefresh();
				});
			
		}
		//加载新的也页
		that.addData = function(pageIndex){
			that.d_options.data[that.d_options.req.pageNum] += pageIndex;
			return new Promise((resolve, reject) => {
				getMoreData(resolve, reject)
			});
		}
		//加载第一页
		that.loadFrist = function(fPagesize){
			that.d_options.data[that.d_options.req.pageNum] = 1;
			that.fristPageSize = fPagesize;
			return new Promise((resolve, reject) => {
				getMoreData(resolve, reject)
			});
		}
		
	}
	let pageObj = new __pageClass(params);
	return pageObj;
}
// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'

export const test = (data) => {
	/* http.config.baseUrl = "http://localhost:8080/api/"*/
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {
			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		}
	} 
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		//判断返回状态 执行相应操作
		return response;
	}
    return http.request({
		baseUrl: 'https://unidemo.dcloud.net.cn/',
        url: 'ajax/echo/text?name=uni-app',
		dataType: 'text',
        data,
    })
}

// 轮播图
export const banner = (data) => {
    return http.request({
        url: '/banner/36kr',
        method: 'GET', 
        data,
		// handle:true
    })
}
// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	...http,
	login,
	pageRequest,
	test,
    banner
}