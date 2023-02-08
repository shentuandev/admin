/**
 * Created by hao.cheng on 2017/4/16.
 */
import { Button, Form, Icon, Input, message } from 'antd';
import { FormProps } from 'antd/lib/form';
import Search from 'antd/lib/input/Search';
import Countdown from 'antd/lib/statistic/Countdown';
import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { connectAlita } from 'redux-alita';
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
class Login extends React.Component<LoginProps> {
    componentDidMount() {
        const { setAlitaState } = this.props;
        setAlitaState({ stateName: 'auth', data: null });

        setTimeout(() => {
            this.setState({ timer: Date.now() + 1000 * 10 });
        }, 5000);
    }
    componentDidUpdate(prevProps: LoginProps) {
        // React 16.3+弃用componentWillReceiveProps
        const { auth: nextAuth = {}, history } = this.props;
        // const { history } = this.props;
        if (nextAuth.data && nextAuth.data.uid) {
            // 判断是否登陆
            umbrella.setLocalStorage('user', nextAuth.data);
            history.push('/');
        }
    }
    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.form!.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { setAlitaState } = this.props;
                if (values.userName === 'admin' && values.password === 'admin')
                    setAlitaState({ funcName: 'admin', stateName: 'auth' });
                if (values.userName === 'guest' && values.password === 'guest')
                    setAlitaState({ funcName: 'guest', stateName: 'auth' });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form!;

        return (
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <span>神团管理后台</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
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
                                    enterButton={
                                        <Countdown value={1000} onFinish={() => {}} format="ss" />
                                    }
                                    onSearch={(value) => console.log(value)}
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
}

function setIntervalLocal(callback: (cur: number) => any, seconds: number, onFinish: () => any) {
    if (seconds === 0) {
        onFinish();
    } else {
        setTimeout(() => {
            callback(seconds);
            setIntervalLocal(callback, seconds - 1, onFinish);
        }, 1000);
    }
}

function Login2(props: LoginProps) {
    const countdownCount = 10;
    const { setAlitaState } = props;
    const phoneNumber = useRef('');
    const [countdownTimer, updateCountdownTimer] = useState(0);
    useEffect(() => {
        setAlitaState({ stateName: 'auth', data: null });
    }, [setAlitaState]);

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
                console.log('Received values of form: ', values);
                const { setAlitaState } = props;
                if (values.userName === 'admin' && values.password === 'admin')
                    setAlitaState({ funcName: 'admin', stateName: 'auth' });
                if (values.userName === 'guest' && values.password === 'guest')
                    setAlitaState({ funcName: 'guest', stateName: 'auth' });

                login(values.userName, values.phoneNumber, values.smscode)
                    .then((data) => {
                        updateToken(data);
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
                            onClick={(e) => handleSubmit(e)}
                        >
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    );
}

export default connectAlita(['auth'])(Form.create()(Login2));
