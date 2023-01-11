import { fetchNet } from "@/tmui/tool/lib/fetch";
import { fetchConfig } from "@/tmui/tool/lib/interface";
import useStore from "@/store"
import { storeToRefs } from 'pinia'
const { useInfoStore } = useStore()
const { token } = storeToRefs(useInfoStore)

export let baseUrl: string = ''; // 当为空时会判断是否是生产环境，否则就是写死的
!baseUrl && (baseUrl = process.env.NODE_ENV === "development" ? "http://test.chuangjisu.com" : "https://ec.zjpuyule.com")

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
	newConfig.url = baseUrl + newConfig.url;
	if (!whiteList.some((item) => newConfig.url && newConfig.url.includes(item))) {
		newConfig.header = { ...newConfig.header, Authorization: token || "" };
	}
	return newConfig;
}

function afterRequestFun(result: any): any {
	const { data } = result
	if (data.code === 200) {
		return data;
	} else if (data.code === 401) {
		uni.$tm.u.toast('身份过期')
		return Promise.reject(data)
	} else if (data.code >= 500) {
		uni.$tm.u.toast(data.msg || '系统繁忙，请稍后再试')
		return Promise.reject(data)
	} else {
		return Promise.reject('未捕捉的错误')
	}
}

export function request(cog: fetchConfig, complete?: Function) {
	let newConfig = { ...config, ...cog };
	const fetch = fetchNet.request(newConfig, beforeRequestFun, afterRequestFun, complete);
	return fetch;
}

