<template>
	<view>
		<map style="width: 100vw; height: 100vh;" :latitude="latitude" :longitude="longitude" :markers="markers" :polyline="polyline">
		</map>
	</view>
</template>

<script>
	import Amap from '@/common/js/lyn4ever-gaode.js';
	export default {
		data() {
			return {
				longitude: 111.736761,
				latitude: 40.771531,
				markers: [],
				polyline: []
			}
		},
		onLoad(e) {
			let that = this;
			var startPoi =  that.longitude +","+ that.latitude;
			  uni.getLocation({
			    type: 'wgs84',
			    success: function (res) {
					startPoi = res.longitude +","+ res.latitude;
					that.longitude = res.longitude;
					that.latitude = res.latitude;
			        console.log('当前位置的经度：' + res.longitude);
			        console.log('当前位置的纬度：' + res.latitude);
			    },fail: function (res) {
			        console.log(JSON.stringify(res));
			    }
			}); 
			wx.getLocation({
			  type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			  success: function (res) {
				startPoi = res.longitude +","+ res.latitude;
				that.longitude = res.longitude;
				that.latitude = res.latitude;
				 console.log(JSON.stringify(res));
			  }
			});
			
			var wayPoi ="";
			var endPoi = e.hosLatitude;
			
			Amap.line(startPoi, endPoi, wayPoi,function(res){
				that.polyline.push(res)
			});
		
			Amap.markers(startPoi,endPoi,wayPoi,function(res){
				that.markers.push.apply(that.markers,res)
			})
		},
		methods: {

		}
	}
</script>

<style>

</style>
