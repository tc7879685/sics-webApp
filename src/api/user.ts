import { httpPost, httpGet } from '@/utils/Httprequest';

//获取验证码
export const getCaptcha = () => {
	let url  = '/sys/randomImage';
	url = url +'/'+new Date().getTime()
	return httpGet(url);
};

//登陆
export const loginApi = data => {
	return httpPost('/login', data);
};

//获取账户信息
export const getAccountsInfoApi = data => {
	return httpGet('/getAccountsInfo', data);
};

export const getListApi = data => {
	return httpGet('/getList', data, {
		isLoading: false,
	});
};
