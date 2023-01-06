import useInfoStore from "./modules/userInfo";

/*
* 组件中使用
* import { storeToRefs } from 'pinia'
* import useStore from '@/store'
* const { userInfo } = useStore()
*
* 提交 action
* userInfo.getUserInfo() 
* 
* 获取数据
* 使用storeToRefs可以保证解构出来的数据也是响应式的
* const { userInfo } = storeToRefs(userInfo)
*/
export default function useStore() {
  return {
    useInfoStore: useInfoStore(),
  };
}
