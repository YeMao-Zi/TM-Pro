import { fetchNet } from "@/tmui/tool/lib/fetch";
import { fetchConfig } from "@/tmui/tool/lib/interface";
import useStore from "@/store";
import { storeToRefs } from "pinia";
const { useInfoStore } = useStore();
const { token } = storeToRefs(useInfoStore);

export let baseUrl: string = ""; // 当要动态配置时，为空时就好了，在下方环境判断中配置。只支持两种环境，即开发和生产环境。
!baseUrl &&
	(baseUrl =
		process.env.NODE_ENV === "development"
			? "http://test.chuangjisu.com"
			: "https://ec.zjpuyule.com");

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


// 请求白名单
const whiteList = ["/captchaImage", "/login"];

function beforeRequestFun(newConfig: fetchConfig) {
	// baseUrl的添加逻辑
	if (newConfig.url && !newConfig.url.includes("http")) {
		newConfig.url = baseUrl + newConfig.url;
	}

	// 请求头的添加逻辑
	if (!whiteList.some((item) => newConfig.url && newConfig.url.includes(item))) {
		newConfig.header = { ...newConfig.header, Authorization: token || "" };
	}

	uni.showLoading({
		title: "加载中",
	});

	return newConfig;
}

function afterRequestFun({ data }: any): any {

	uni.hideLoading();

	if (data.code === 200) {
		return data;
	} else if (data.code === 401) {
		uni.$tm.u.toast("身份过期");
		uni.reLaunch({
			url: "pages/login/index",
		});
	} else if (data.code >= 500) {
		uni.$tm.u.toast(data.msg || "系统繁忙，请稍后再试");
		return data;
	} else {
		uni.$tm.u.toast("未捕捉的错误！");
		return data;
	}
}

/**
 * 如果直接传入完整 url,baseUrl 会失效，即如果传入 url 为 http://xxx.com/login 不会再加上 baseUrl 了(环境判断也同样失效)。
 *
 * 若传入 /login ,会加上 url，输出为 baseUrl +  /login 。
 *
 * complete 可选，为执行成功后的回调，相当于 finally，其实直接用 finally 也可以,这里只是保留了原生的 complete 能力。
 *
 * 无论 post 还是 get 请求统一传入 data:any 格式,不区分 body 传参还是 query 传参，已经做了封装。
 *
 * @param cog 请求配置表
 * @param complete 执行后的回调
 * @returns fetch 实例
 */
export function request(cog: fetchConfig, complete?: Function) {
	let newConfig = { ...config, ...cog };
	const fetch = fetchNet.request(newConfig, beforeRequestFun, afterRequestFun, complete);
	return fetch;
}
