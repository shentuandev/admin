/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card, Col, Descriptions, Drawer, Row, Spin, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { accountDetail, cashList } from '../../../axios';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import { CashApplyDetail } from '../../types/CashApplyDetail';
import { PaymentDetail } from '../../types/PaymentDetail';

const CashStatus = {
    HANDLE_FINISHED: 3,
    HANDLE_PROCESSING: 2,
};

let refresh = () => {};

let showMerhcantDetail = (cash: CashApplyDetail | null) => {};

export function CashList() {
    const [data, updateData] = useState(1);
    const [allCashDetails, updateAllCashDetails] = useState<CashApplyDetail[]>([]);
    const [isLoading, updateLoadingState] = useState<boolean>(true);
    const [showingCashDetail, updateShowingCashDetail] = useState<CashApplyDetail | null>(null);
    useEffect(() => {
        cashList().then((data) => {
            updateAllCashDetails(data.list);
            updateLoadingState(false);
        });
    }, [data]);
    refresh = () => {
        updateData(data + 1);
    };
    showMerhcantDetail = updateShowingCashDetail;
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="商户管理" second="提现列表" />
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Content allCash={allCashDetails} isLoading={isLoading} />
                        </Card>
                    </div>
                </Col>
            </Row>
            {showingCashDetail && <CashBankCardDetail info={showingCashDetail} />}
        </div>
    );
}

const columns = [
    {
        title: 'recordId',
        dataIndex: 'recordId',
        key: 'recordId',
    },
    {
        title: '商户名称',
        dataIndex: 'merchantName',
        key: 'merchantName',
    },
    {
        title: '商户地址',
        dataIndex: 'merchantAddress',
        key: 'merchantAddress',
    },
    {
        title: '商户手机号',
        dataIndex: 'phoneNo',
        key: 'phoneNo',
    },
    {
        title: '提现金额',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: '提现手续费',
        dataIndex: 'cashOutCharge',
        key: 'cashOutCharge',
    },
    {
        title: '提现实际到账金额',
        dataIndex: 'receiveAmount',
        key: 'receiveAmount',
    },
    {
        title: '到账银行卡账户名',
        dataIndex: 'collectionAccountName',
        key: 'collectionAccountName',
    },
    {
        title: '到账银行卡账号',
        dataIndex: 'collectionAccountNo',
        key: 'collectionAccountNo',
    },
    {
        title: '提现状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: number, record: any) => {
            if (status === CashStatus.HANDLE_PROCESSING) {
                return (
                    <Tag color="volcano" key={status}>
                        处理中
                    </Tag>
                );
            } else {
                return (
                    <Tag color="green" key={status}>
                        已处理
                    </Tag>
                );
            }
        },
    },
    {
        title: '操作',
        dataIndex: 'status',
        key: 'status_action',
        render: (status: number, record: any) => {
            if (status === CashStatus.HANDLE_PROCESSING) {
                return (
                    <a
                        onClick={() => {
                            showMerhcantDetail(record);
                        }}
                    >
                        处理提现
                    </a>
                );
            } else {
                return null;
            }
        },
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
    },
];

function Content(props: { allCash: CashApplyDetail[]; isLoading: boolean }) {
    const dataSource: any[] | undefined = [];
    props.allCash.forEach((info, index) => {
        dataSource.push(Object.assign({ key: index }, info));
    });
    return <Table columns={columns} dataSource={dataSource} loading={props.isLoading} />;
}

function CashBankCardDetail(props: { info: CashApplyDetail }) {
    const [info, updateInfo] = useState<PaymentDetail | null>(null);
    useEffect(() => {
        accountDetail(props.info.merchantId).then((data) => {
            console.log('data', data);
            updateInfo(data);
        });
    }, [props.info]);
    return (
        <div>
            <Drawer
                title="收款信息"
                placement="right"
                closable={false}
                visible={props.info != null}
                width="50%"
                onClose={() => showMerhcantDetail(null)}
            >
                {info == null && <Spin />}
                {info != null && (
                    <Descriptions bordered column={2} title="商户收款信息">
                        <Descriptions.Item label="accountId">{info.accountId}</Descriptions.Item>
                        <Descriptions.Item label="merchantId">{info.merchantId}</Descriptions.Item>
                        <Descriptions.Item label="收款银行卡账号">
                            {info.accountNo}
                        </Descriptions.Item>
                        <Descriptions.Item label="收款银行卡账户名">
                            {info.accountName}
                        </Descriptions.Item>
                        <Descriptions.Item label="银行名称">
                            {info.accountBankName}
                        </Descriptions.Item>
                        <Descriptions.Item label="银行卡状态">
                            {convertStatus(info.status)}
                        </Descriptions.Item>
                        <Descriptions.Item label="备注">{info.remark}</Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </div>
    );
}

function convertStatus(status: number) {
    if (status === -1) {
        return '已取消';
    } else if (status === 0) {
        return '驳回';
    } else if (status === 1) {
        return '申请中';
    } else if (status === 2) {
        return '已绑定';
    }
}