import { message } from 'antd';
import axios from 'axios';
import _, { isEmpty, isUndefined } from 'lodash';
import umbrella from 'umbrella-storage';
import { autoRefreshToken } from '.';
import { checkLogin } from '../utils';
import { HOST } from './config';

export const HEADERS = {
    Authorization: '',
};

axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

let hasClick = false;

function startLoop() {
    setTimeout(() => {
        console.log('loop time reached!');
        if (hasClick && checkLogin()) {
            autoRefreshToken().then(
                (data) => {
                    updateToken(data);
                },
                () => {
                    removeToken();
                }
            );
        }
        startLoop();
        hasClick = false;
    }, 1 * 60 * 1000);
}

window.document.onmouseover = function () {
    hasClick = true;
};

export function updateToken(token: string) {
    HEADERS.Authorization = token;
    umbrella.setLocalStorage('token', token);
    axios.defaults.headers.common['Authorization'] = token;
}

export function getToken() {
    if (isEmpty(HEADERS.Authorization)) {
        HEADERS.Authorization = umbrella.getLocalStorage('token');
    }
    return HEADERS.Authorization;
}

export function removeToken() {
    HEADERS.Authorization = '';
    umbrella.removeLocalStorage('token');
}

export function initAxios() {
    updateToken(getToken());
    startLoop();
}

interface IFRequestParam {
    url: string;
    msg?: string;
    config?: any;
    data?: any;
}

// TODO: 待添加
/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export async function get({ url, data }: IFRequestParam) {
    if (!_.startsWith(url, 'https')) {
        url = HOST + url;
    }
    const dataWrap = { params: { timeStamp: Date.now() } };
    if (data) {
        Object.assign(dataWrap.params, data);
    }
    try {
        const res = await axios.get(url, dataWrap);
        if (res.data.msgCode !== 0) {
            throw res.data.message;
        } else {
            console.log('res', res);
            return res.data.data.data;
        }
    } catch (err) {
        console.log(err);
        if (err instanceof Error) {
            message.warn(err.message);
        }
        throw err;
    }
}

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export async function post({ url, data }: IFRequestParam) {
    if (!_.startsWith(url, 'https')) {
        url = HOST + url;
    }
    const dataWrap = isUndefined(data) ? {} : data;
    dataWrap.timeStamp = Date.now();
    try {
        const res = await axios.post(url, dataWrap);
        if (res.data.msgCode !== 0) {
            throw new Error(res.data.message);
        } else {
            return res.data.data;
        }
    } catch (err) {
        console.log(err);
        if (err instanceof Error) {
            message.warn(err.message);
        }
        throw err;
    }
}
