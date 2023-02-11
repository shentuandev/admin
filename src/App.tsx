import { Layout } from 'antd';
import React, { useState } from 'react';
import umbrella from 'umbrella-storage';
import HeaderCustom from './components/HeaderCustom';
import SiderCustom from './components/SiderCustom';
import { Copyright, ThemePicker } from './components/widget';
import Routes from './routes';

const { Content, Footer } = Layout;

type AppProps = {};

const App = (props: AppProps) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    function toggle() {
        setCollapsed(!collapsed);
    }
    return (
        <Layout>
            <SiderCustom collapsed={collapsed} />
            <ThemePicker />
            <Layout className="app_layout">
                <HeaderCustom
                    toggle={toggle}
                    collapsed={collapsed}
                    user={{ userName: umbrella.getLocalStorage('user') }}
                />
                <Content className="app_layout_content">
                    <Routes />
                </Content>
                <Footer className="app_layout_foot">
                    <Copyright />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;
