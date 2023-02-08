/**
 * Created by 叶子 on 2017/7/30.
 * http通用工具函数
 */
import { message } from 'antd';
import axios from 'axios';
import _, { isUndefined } from 'lodash';
import { HOST } from './config';

export const HEADERS = {
    Authorization:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaGVudHVhbiIsImV4cCI6MTY3NTUxNjU4OSwiaWF0IjoxNjc1NTE1ODEyLCJ1c2VySWQiOiIxNzYyNTkwMjE0MyJ9.hIzhTjWwby6iGipXak8OzQ2WsxNkixr05ZJITLPdBSw',
};
axios.defaults.headers.common['Authorization'] = HEADERS.Authorization;
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

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
export async function get({ url, msg = '接口异常', config }: IFRequestParam) {
    if (!config) {
        config = { header: {} };
    }
    if (!_.startsWith(url, 'https')) {
        url = HOST + url;
    }
    try {
        Object.assign(config.header, HEADERS);
        const res = await axios.get(url, config);
        return res.data.data;
    } catch (err) {
        console.log(err);
        message.warn(msg);
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
            throw res.data.message;
        } else {
            return res.data.data;
        }
    } catch (err) {
        console.log(err);
        message.warn(err);
        throw err;
    }
}
