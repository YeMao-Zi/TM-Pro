import { request } from "../../index";

// 如果直接传入完整url,baseUrl会失效，即如果传入 url 为 http://xxx.com/login 不会再加上 baseUrl 了(环境判断也同样失效)
// 若传入 /login ,会加上 url，输出为 baseUrl +  /login
// complete 可选，为执行成功后的回调，相当于 finally，其实直接用 finally 也可以,这里只是保留了原生的 complete 能力
// 无论 post 还是 get 请求统一传入 data:any 格式,不区分 body 传参还是 query 传参，已经做了封装

export function getCaptchaImage(complete?: Function) {
	return request({
		method: "GET",
		url: "http://test.chuangjisu.com/pyl/common/captchaImage",
	}, complete);
}

export function getSmsCaptcha(data: object) {
	return request({
		method: "GET",
		url: "/pb2b/common/smsCaptcha",
		data
	});
}