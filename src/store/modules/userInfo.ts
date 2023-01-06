import { defineStore } from "pinia";

// 创建store,命名规则： useXxxxStore
const useInfoStore = defineStore({
	id: "useInfo",
	state: () => ({
		user: {},
		token: '',
	}),
	getters: {},
	actions: {
		setUserInfo() {
			this.user = {
				name: 'yemao',
				sex: 1,
			}
		},
		setToken(token) {
			this.token = token
		},
	},
});
export default useInfoStore;