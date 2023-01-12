import { request } from "../../index";

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