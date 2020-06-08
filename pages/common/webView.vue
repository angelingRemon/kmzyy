<template>
    <view>
        <web-view :webview-styles="webviewStyles" v-if="loadUrl" :src="loadUrl"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                },
				loadUrl:null
            }
        },
		onLoad(options) {
			//#ifdef H5
			let url = this.$utils.getUrlBase64Decode(options.relayUrl);
			(url) && (window.location.replace(url));
			//#endif
			//非H5执行方式
			//#ifndef H5
				this.loadUrl = this.$utils.getUrlBase64Decode(options.relayUrl);
			//#endif
		}
    }
</script>

<style>

</style>
