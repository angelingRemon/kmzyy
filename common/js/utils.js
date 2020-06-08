function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}


var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};



// Base64加密方法
function Base64() {

	// private property
	let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// public method for encoding
	this.encode = function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
				_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}

	// public method for decoding
	this.decode = function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}

	// private method for UTF-8 encoding
	let _utf8_encode = function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

	// private method for UTF-8 decoding
	let _utf8_decode = function(utftext) {
		var string = "";
		var i = 0;
		var c = 0,c1 = 0,c2 = 0,c3 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}
//url 解密
function _getUrlBase64Decode(url) {
	if (!url) {
		return ""
	}
	let urlTmp = url.replace(/percent/g, "%").replace(/slash/g, "/");
	// if(urlTmp.indexOf("=") != urlTmp.length-1){
	// 	urlTmp = urlTmp + "==";
	// }
	let base64 = new Base64();
	try {
		return base64.decode(urlTmp);
	} catch (e) {
		console.error(e);
		return "";
	}

}
//url 加密
function _getUrlBase64Encode(url){
	if (!url) {
		return ""
	}
	let base64 = new Base64();
	let urlTmp = base64.encode(url);
	let s = urlTmp.replace(/%/g, "percent").replace(/\//g, "slash")
				.replace(/\n\r/g, "").replace(/\r\n/g, "").replace(/\r/g, "").replace(/\n/g, "");
	return s;
}
//获取完整页面url
function _getPageUrl(route,options){
	let params='';
	for (let key in options) {
		params=(params+key + "=" + options[key] + "&");
	}
	if(!route){
		let pages = getCurrentPages();
		let page = pages[pages.length - 1];
		route = page.route;
	}
	(route.substr(0,1) != "/")&&(route = "/" + route);
	let url = route + (params?("?" + params.substr(0,params.length-1)):"");
	return url;
}
// url加密
function _getUrlBase64(route,options){
	let url = _getPageUrl(route,options);
	return _getUrlBase64Encode(url);
}
//跳转页面
function _skipPage(type,url,isBase64,params){
	//第三个参数手否是对象
	let failRelayUrl;
	let isThreeObj = (typeof isBase64 == "object");
	let paramsTmp = isThreeObj?isBase64:params;
	let defaultParam = Object.assign({},{
		fail:()=>{
			//打开行的webview 打开新页面
			let newUrl = "/pages/common/webView?relayUrl="+failRelayUrl;
			let toPageParam = {
				url:newUrl
			}
			switch (type){
				case "navigateTo":
					uni.navigateTo(toPageParam);
					break;
				case "redirectTo":
					uni.redirectTo(toPageParam);
					break;
				case "reLaunch":
					uni.reLaunch(toPageParam);
					break;
			}
		}
	},paramsTmp);
	if(type == "navigateBack"){
		defaultParam.delta = (typeof url == 'number')?url:1;
	}else{		
		if(!isThreeObj && isBase64){
			defaultParam.url = _getUrlBase64Decode(url);
			failRelayUrl = url;
		}else{
			defaultParam.url = url;
			failRelayUrl = _getUrlBase64Encode(url)
		}
	}
	switch (type){
		case "navigateTo":
			uni.navigateTo(defaultParam);
			break;
		case "redirectTo":
			uni.redirectTo(defaultParam);
			break;
		case "reLaunch":
			uni.reLaunch(defaultParam);
			break;
		case "switchTab"://跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面，路径后不能带参数
			uni.switchTab(defaultParam);
			break;
		case "navigateBack"://跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面，路径后不能带参数
			uni.navigateBack(defaultParam);
			break;
	}
	
}
//跳转到登录页
function _skipLoginPage(urlBase64,loginType,lnRouteType){
		if(loginType == "WEIXIN"){
			uni.showModal({
				title: '提示',
				content: '登录超时，请重新打开页面',
				showCancel:true,
				success:function(res){
					window.location.reload();
				}
			})
		}else{
			let routeTypeTmp = lnRouteType||"";
			_skipPage('redirectTo', "/pages/base/login/login?relayUrl="+urlBase64+"&routeType="+routeTypeTmp);
		}
}


/**
 * 功能：格式化耗时
 *
 */
function formatDuration(value) {
	if(!value){
		return "";
	}
	var second = parseInt(value);// 秒
	var minute = 0;// 分
	var hour = 0;// 小时
	if(second > 60) {
		minute = parseInt(second/60);
		second = parseInt(second%60);
		if(minute > 60) {
			hour = parseInt(minute/60);
			minute = parseInt(minute%60);
		}
	}
	var result = ""+parseInt(second)+"秒";
	if(minute > 0) {
		result = ""+parseInt(minute)+"分";
	}
	if(hour > 0) {
		result = ""+parseInt(hour)+"小时";
		if(hour > 72){
			hour = parseInt(parseInt(value/60)/60)%24;
			var day = parseInt(parseInt(parseInt(value/60)/60)/24);
			result = day + "天";
			if(hour != 0){
				result += hour + "小时";
			}
		}
	}
	return result;
}

function _getDictLabel(dicts,dictVal){
	if(dicts){
		for (let i = 0; i < dicts.length; i++) {
			let dict = dicts[i];
			if(dict["dictValue"] == dictVal){
				return i;
			}
		}
		return -1;
	}
	return -1;
}

module.exports = {
	formatTime: formatTime,
	formatDuration: formatDuration,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	getUrlBase64Decode:_getUrlBase64Decode,
	getUrlBase64Encode:_getUrlBase64Encode,
	getPageUrl:_getPageUrl,
	getUrlBase64:_getUrlBase64,
	skipPage: _skipPage,
	skipLoginPage: _skipLoginPage,
	getDictLabel: _getDictLabel
}




