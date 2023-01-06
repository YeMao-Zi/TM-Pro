import { request } from "../../index";

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