import { defineStore } from "pinia";

// 创建store,命名规则： useXxxxStore
const useInfoStore = defineStore({
	id: "useInfo",
	state: () => ({
		user: {},
		token: (uni.getStorage({
			key: 'storage_token'
		}) as unknown as string) || '',
	}),
	getters: {},
	actions: {
		setUserInfo() {
			this.user = {
				name: 'yemao',
				sex: 1,
			}
		},
		setToken(token: string) {
			uni.setStorage({
				key: 'storage_token',
				data: token,
			});
			this.token = token
		},
	},
});
export default useInfoStore;