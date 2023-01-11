import { fetchNet } from "@/tmui/tool/lib/fetch";
import { fetchConfig } from "@/tmui/tool/lib/interface";
import useStore from "@/store"
import { storeToRefs } from 'pinia'
const { useInfoStore } = useStore()
const { token } = storeToRefs(useInfoStore)

export let baseUrl: string = ''; // 当要动态配置时，为空时就好了，在下方环境判断中配置。只支持两种环境，即开发和生产环境。
!baseUrl && (baseUrl = process.env.NODE_ENV === "development" ? "http://test.chuangjisu.com" : "https://ec.zjpuyule.com")

// 运行平台判断
switch (uni.getSystemInfoSync().platform) {
	case 'android':
		console.log('运行Android上');
		break;
	case 'ios':
		console.log('运行iOS上');
		break;
	default:
		console.log('运行在开发者工具或H5上');
		break;
}

export const WX_APPID = "wxddf85aa6c5bdc11a";

const config: fetchConfig = {
	header: {
		"content-type": "application/json",
	},
	method: "POST",
	timeout: 60000,
	dataType: "json",
	responseType: "text",
};

const whiteList = ["/captchaImage", "/login"];

function beforeRequestFun(newConfig: fetchConfig) {
	if (newConfig.url && !newConfig.url.includes('http')) {
		newConfig.url = baseUrl + newConfig.url
	}

	if (!whiteList.some((item) => newConfig.url && newConfig.url.includes(item))) {
		newConfig.header = { ...newConfig.header, Authorization: token || "" };
	}

	uni.showLoading({
		title: '加载中'
	})

	return newConfig;
}

function afterRequestFun({ data }: any): any {
	uni.hideLoading();
	if (data.code === 200) {
		return data;
	} else if (data.code === 401) {
		uni.$tm.u.toast('身份过期')
		uni.reLaunch({
			url: 'pages/login/index'
		});
	} else if (data.code >= 500) {
		uni.$tm.u.toast(data.msg || '系统繁忙，请稍后再试')
		return Promise.reject(data)
	} else {
		uni.$tm.u.toast('未捕捉的错误！')
		return Promise.reject(data)
	}
}

export function request(cog: fetchConfig, complete?: Function) {
	let newConfig = { ...config, ...cog };
	const fetch = fetchNet.request(newConfig, beforeRequestFun, afterRequestFun, complete);
	return fetch;
}

