export interface IFMenuBase {
    key: string;
    title: string;
    icon?: string;
    component?: string;
    query?: string;
    requireAuth?: string;
    route?: string;
    /** 是否登录校验，true不进行校验（访客） */
    login?: boolean;
}

export interface IFMenu extends IFMenuBase {
    subs?: IFMenu[];
}

const menus: {
    menus: IFMenu[];
    others: IFMenu[] | [];
    [index: string]: any;
} = {
    menus: [
        // 菜单相关路由
        {
            key: '/app/building',
            title: '楼栋管理',
            icon: 'environment',
            subs: [
                { key: '/app/building/list', title: '楼栋列表', component: 'BuildingList' },
                { key: '/app/building/apply', title: '入驻申请', component: 'ApplyBuildingList' },
            ],
        },
        {
            key: '/app/merchant',
            title: '商户管理',
            icon: 'shop',
            subs: [
                {
                    key: '/app/merchant/settle_status',
                    title: '入驻详情',
                    component: 'MerchantSettleList',
                },
                {
                    key: '/app/merchant/bank_info',
                    title: '收款信息',
                    component: 'Payment',
                },
                {
                    key: '/app/merchant/withdraw_money',
                    title: '提现列表',
                    component: 'CashList',
                },
                {
                    key: '/app/merchant/business_statics',
                    title: '经营统计',
                    component: 'BusinessStatics',
                },
            ],
        },
    ],
    others: [], // 非菜单相关路由
};

export default menus;
