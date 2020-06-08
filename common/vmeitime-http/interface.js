/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import {default as globle} from '@/globle-config'
import {default as utils} from '@/common/js/utils'
import md5 from 'js-md5'
let isLoginFail = true;
export default {
	config: {
		baseUrl: (globle.basePath || ""),
		header: {
			// 'Content-Type':'application/json;charset=UTF-8',
			'Content-Type':'application/x-www-form-urlencoded',
			'appToken': globle.token,
			'loginType':globle.loginType, //WEIXIN 、XIAOCX 、APP 三种登陆方式（通过不同类型来执行不同的内容）
		},
		noCheckToken: globle.noCheckToken,
		data: {},
		method: "GET",
		dataType: "json",  /* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	globle:globle,
	$utils:utils,
	md5:md5,
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		if(options.url.indexOf("http://") != 0){
			options.url = options.baseUrl + options.url
		}
		options.data = options.data || {}
		options.method = options.method || this.config.method
		//TODO 加密数据
		
		//TODO 数据签名
		let keys = Object.keys(options.data);
		keys.sort();
		let urlStr = ""
		keys.forEach((key)=>{
			urlStr = urlStr + "&" + key + "=" + options.data[key];
		});
		if(urlStr){
			urlStr = urlStr.substring(1) + "&key="+globle.partnerKey;
			let _sign = {'sign': this.md5(urlStr)}
			options.header = Object.assign({}, options.header,_sign);
		}
		 
		/* 
		_token = {'token': getStorage(STOREKEY_LOGIN).token || 'undefined'},
		_sign = {'sign': sign(JSON.stringify(options.data))}
		options.header = Object.assign({}, options.header, _token,_sign) 
		*/
	   
		return new Promise((resolve, reject) => {
			let _config = null
			const _globle = this.globle;
			const _utils = this.$utils;
			
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				response.$globle = _globle
				response.$utils = _utils
				if (process.env.NODE_ENV === 'development') {
					if (statusCode === 200) {
					}
				}
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				_reslog(response)
				if (statusCode === 200) { //成功
					resolve(response);
				} else {
					reject(response)
				}
				
			}
			//设置header
			options.header = Object.assign({}, this.config.header, options.header);
			_config = Object.assign({}, this.config, options);
			//设置token
			if(_globle.token){
			_config.header.appToken = _globle.token;
			}
			_config.requestId = new Date().getTime();

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			
			// 统一的请求日志记录
			_reqlog(_config)

			if (process.env.NODE_ENV === 'development') {
				if (_config.data) {
				}
			}
			//设置不发ajax配置
			if(!_config.noAjax){
				uni.request(_config);
			}
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'  
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
	getFileOptions(options){
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		if(options.url.indexOf("http://") != 0 && options.url.indexOf("https://") != 0){
			options.url = options.baseUrl + options.url
		}
		options.data = options.data || {}
		options.method = options.method || this.config.method;
		let header = {
			'appToken': globle.token,
			'loginType':globle.loginType, //WEIXIN 、XIAOCX 、APP 三种登陆方式（通过不同类型来执行不同的内容）
		};
		options.header = Object.assign({}, options.header,header);
		return options
	},
	uploadFile(options){
		return uni.uploadFile(this.getFileOptions(options));
	},
	downloadFile(options){
		return uni.downloadFile(this.getFileOptions(options));
	}
}


/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		if (req.data) {
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		if (res.config.data) {
		}
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch(_statusCode){
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}

