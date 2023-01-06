// b2b-店铺登录
import { request } from "../../index";

export function postManageLogin(data: object, complete?: Function) {
	return request({
		method: "POST",
		url: "/pb2b/miniShop/manage/login",
		data,
	}, complete);
}