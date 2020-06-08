//高德key，请不要使用本人的这个key用于生产环境
const key = '49b8927b1ba20328fbc693696f77b598';
//请注意使用我在static目录下的图片资源，你也可以自己修改

const amapFile = require('./amap-uni.js'); 


function PlanningRoute(start, end, _waypoints, result, fail) {
	let that = this;
	var myAmapFun = new amapFile.AMapWX({
		key: key
	});

	myAmapFun.getDrivingRoute({
		origin: start,
		destination: end,
		waypoints: _waypoints,
		success: function(data) {
			var points = [];
			if (data.paths && data.paths[0] && data.paths[0].steps) {
				var steps = data.paths[0].steps;
				for (var i = 0; i < steps.length; i++) {
					var poLen = steps[i].polyline.split(';');
					for (var j = 0; j < poLen.length; j++) {
						points.push({
							longitude: parseFloat(poLen[j].split(',')[0]),
							latitude: parseFloat(poLen[j].split(',')[1])
						})
					}
				}
			}
			//这个返回结果就是对应的路线坐标,其他属性页面自己配置,请参照uniapp地图组件一章节
			//https://uniapp.dcloud.io/component/map
			result({
				points: points,
				color: "#0606ff",
				width: 8
			})
		},
		fail: function(info) {
			fail(info)
		}
	})
}
//标记标记点
function Makemarkers(startpoi, endpoi, waypoints, success) {
	let markers = [];

	//起点
	let start = {
		iconPath: "../../static/images/start.png",
		id: 0,
		longitude: startpoi.split(",")[0],
		latitude: startpoi.split(",")[1],
		width: 23,
		height: 33
	}
	markers.push(start)
	//终点
	let end = {
		iconPath: "../../static/images/end.png",
		id: 1,
		longitude: endpoi.split(",")[0],
		latitude: endpoi.split(",")[1],
		width: 23,
		height: 33
	}
	markers.push(end)
	//途经点,先将其分隔成为数组
	let _waypoints = waypoints.split(';')
	for (let i = 0, _len = _waypoints.length; i < _len; i++) {
		let point = {
			iconPath: "/static/images/tjd.png",
			id: i,
			longitude: parseFloat(_waypoints[i].split(",")[0]),
			latitude: parseFloat(_waypoints[i].split(",")[1]),
			width: 23,
			height: 33
		}
		markers.push(point)
	}

	//统一风格为回调方式,也可以直接返回这个markers
	success(markers);

}

module.exports = {
	line: PlanningRoute,
	markers: Makemarkers
}
