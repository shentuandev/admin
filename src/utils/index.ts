/**
 * Created by hao.cheng on 2017/4/28.
 */

import { notification } from 'antd';
import { isEmpty } from 'lodash';
import { getToken } from '../axios/tools';

// 获取url的参数
export const queryString = () => {
    let _queryString: { [key: string]: any } = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};

/**
 * 校验是否登录
 * @param permits
 */
export const checkLogin = (): boolean => !isEmpty(getToken()); // (process.env.NODE_ENV === 'production' && !!permits) || process.env.NODE_ENV === 'development';

export function toast(title: string, des: string | undefined) {
    notification.open({
        message: title,
        description: des,
    });
}

export function toastNetworkError(data: any) {}

export function checkPhone(mobile: string) {
    if (!mobile || isEmpty(mobile)) return false;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(mobile)) {
        return false;
    } else {
        return true;
    }
}
