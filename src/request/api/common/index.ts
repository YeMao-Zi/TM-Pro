import { request } from "../../index";

// complete可选，为执行成功后的回调相当于finally，其实直接用 .finally也可以,这里只是为了处理不兼容Promise的情况
export function getCaptchaImage(complete?: Function) {
	return request({
		method: "GET",
		url: "/pyl/common/captchaImage",
	}, complete);
}

export function getSmsCaptcha(data: object, complete?: Function) {
	return request({
		method: "GET",
		url: "/pb2b/common/smsCaptcha",
		data
	}, complete);
}