import { fetchNet } from "@/tmui/tool/lib/fetch";
// import { fetchConfig } from "@/tmui/tool/lib/interface";
import useStore from "@/store";
import { storeToRefs } from "pinia";
const { useInfoStore } = useStore();
const { token } = storeToRefs(useInfoStore);

export let baseUrl: string = "/api";

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
  newConfig.url = baseUrl + newConfig.url;

  // 请求头的添加逻辑
  if (!whiteList.some((item) => newConfig.url && newConfig.url.includes(item))) {
    newConfig.header = { ...newConfig.header, Authorization: token || "" };
  }

  uni.showLoading({
    title: "加载中",
  });

  return newConfig;
}

function afterRequestFun({ data }: AnyObject) {
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

/** complete 可选，为执行成功后的回调，相当于 finally，其实直接用 finally 也可以,这里只是保留了原生的 complete 能力。
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
