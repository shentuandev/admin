/**
 * Created by hao.cheng on 2017/4/16.
 */
import { Button, Form, Icon, Input, message, notification } from 'antd';
import { FormProps } from 'antd/lib/form';
import Search from 'antd/lib/input/Search';
import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import umbrella from 'umbrella-storage';
import { login, requestSMSCode } from '../../axios';
import { updateToken } from '../../axios/tools';
import { checkPhone } from '../../utils';

const FormItem = Form.Item;
type LoginProps = {
    setAlitaState: (param: any) => void;
    auth: any;
} & RouteComponentProps &
    FormProps;

function setIntervalLocal(
    idBlock: { intervalId: NodeJS.Timeout | null },
    callback: (cur: number) => any,
    seconds: number,
    onFinish: () => any
) {
    if (seconds === 0) {
        onFinish();
    } else {
        idBlock.intervalId = setTimeout(() => {
            callback(seconds);
            setIntervalLocal(idBlock, callback, seconds - 1, onFinish);
        }, 1000);
    }
}

function Login2(props: LoginProps) {
    const countdownCount = 10;
    const phoneNumber = useRef('');
    const [countdownTimer, updateCountdownTimer] = useState(0);
    const idBlock = useRef<{ intervalId: NodeJS.Timeout | null }>({ intervalId: null });

    useEffect(() => {
        return () => {
            if (idBlock.current.intervalId != null) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                clearTimeout(idBlock.current.intervalId);
            }
        };
    }, []);

    const doRequestSMSCode = () => {
        if (countdownTimer !== 0) return;
        if (!checkPhone(phoneNumber.current)) {
            message.warn('请填写准确的电话号码');
            return;
        }
        requestSMSCode(phoneNumber.current)
            .then((data) => {
                console.log('smscode', data);
            })
            .catch((data) => {
                console.log('smscode catch', data);
            });
        updateCountdownTimer(countdownCount);
        setIntervalLocal(
            idBlock.current,
            (cur) => {
                updateCountdownTimer(cur);
            },
            countdownCount,
            () => {
                updateCountdownTimer(0);
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.form!.validateFields((err, values) => {
            if (!err) {
                login(values.userName, values.phoneNumber, values.smscode)
                    .then((data) => {
                        updateToken(data);
                        umbrella.setLocalStorage('user', values.userName);
                        notification['success']({
                            message: '登录成功',
                            description: '欢迎使用神团管理后台！',
                        });
                        props.history.push('/');
                    })
                    .catch((data) => {
                        console.log('error', data);
                    });
            }
        });
    };
    const { getFieldDecorator } = props.form!;

    return (
        <div className="login">
            <div className="login-form">
                <div className="login-logo">
                    <span>神团管理后台</span>
                </div>
                <Form onSubmit={handleSubmit} style={{ maxWidth: '300px' }}>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                placeholder="请输入用户名"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('phoneNumber', {
                            rules: [{ required: true, message: '电话号码不能为空!' }],
                        })(
                            <Input
                                prefix={<Icon type="phone" style={{ fontSize: 13 }} />}
                                placeholder="请输入电话号码"
                                onChange={({ target: { value } }) => {
                                    phoneNumber.current = value;
                                }}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('smscode', {
                            rules: [{ required: true, message: '请输入验证码!' }],
                        })(
                            <Search
                                prefix={<Icon type="safety" style={{ fontSize: 13 }} />}
                                placeholder="请输入验证码"
                                enterButton={countdownTimer === 0 ? '获取验证码' : countdownTimer}
                                onSearch={() => doRequestSMSCode()}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            style={{ width: '100%' }}
                        >
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    );
}

export default Form.create()(Login2);
