/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card, Col, Divider, Input, Modal, Row, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { confirmAccount, paymentList } from '../../../axios';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import { toast } from '../../../utils';
import { PaymentDetail } from '../../types/PaymentDetail';

const PaymentCardStatus = {
    REJECT: 0,
    APPLYING: 1,
    BOUND: 2,
};

let refresh = () => {};

export function Payment() {
    const [data, updateData] = useState(1);
    const [allPayments, updateAllPayments] = useState<PaymentDetail[]>([]);
    const [isLoading, updateLoadingState] = useState<boolean>(true);
    useEffect(() => {
        paymentList().then((data) => {
            updateAllPayments(data.list);
            updateLoadingState(false);
        });
    }, [data]);
    refresh = () => {
        updateData(data + 1);
    };
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="商户管理" second="收款信息" />
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Content buildings={allPayments} isLoading={isLoading} />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

const columns = [
    {
        title: '绑卡主键id',
        dataIndex: 'accountId',
        key: 'accountId',
    },
    {
        title: '商户名称',
        dataIndex: 'merchantName',
        key: 'merchantName',
    },
    {
        title: '收款账号',
        dataIndex: 'accountNo',
        key: 'accountNo',
    },
    {
        title: '收款银行',
        dataIndex: 'accountBankName',
        key: 'accountBankName',
    },
    {
        title: '收款账号户名',
        dataIndex: 'accountName',
        key: 'accountName',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: number, record: any) => {
            if (status === PaymentCardStatus.REJECT) {
                return (
                    <Tag color="volcano" key={status}>
                        已驳回
                    </Tag>
                );
            } else if (status === PaymentCardStatus.APPLYING) {
                return (
                    <Tag color="blue" key={status}>
                        申请中
                    </Tag>
                );
            } else {
                return (
                    <Tag color="green" key={status}>
                        已绑定
                    </Tag>
                );
            }
        },
    },
    {
        title: '商户法人',
        dataIndex: 'ownerName',
        key: 'ownerName',
    },
    {
        title: '手机号',
        dataIndex: 'phoneNo',
        key: 'phoneNo',
    },
    {
        title: 'merchantId',
        dataIndex: 'merchantId',
        key: 'merchantId',
    },
    {
        title: '审核',
        dataIndex: 'status',
        key: 'examine',
        render: (status: number, record: any) => {
            if (status === PaymentCardStatus.APPLYING) {
                return (
                    <span>
                        <Examine
                            title="通过"
                            des="确定通过该银行卡的绑定申请吗？"
                            approved
                            accountId={record.accountId}
                        />
                        <Divider type="vertical" />
                        <Examine
                            title="驳回"
                            des="确定驳回该银行卡的绑定申请吗？"
                            approved={false}
                            accountId={record.accountId}
                        />
                    </span>
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

function Examine(props: {
    title: string | null;
    des: string;
    approved: boolean;
    accountId: string;
}) {
    const [show, updateShow] = useState(false);
    const rejectMessage = useRef('');
    const [confirmLoading, updateConfirmLoading] = useState(false);

    const doExamin = () => {
        if (confirmLoading) return;
        updateConfirmLoading(true);
        confirmAccount(props.accountId, props.approved ? 2 : 0, rejectMessage.current).then(
            (data) => {
                updateConfirmLoading(false);
                updateShow(false);
                toast('审核成功');
                setTimeout(() => {
                    refresh();
                }, 0);
            },
            (err) => {
                updateConfirmLoading(false);
                console.log('err', err);
                toast('审核失败');
            }
        );
    };

    return (
        <span>
            <a
                onClick={() => {
                    updateShow(true);
                }}
            >
                {props.title}
            </a>
            <Modal
                title={props.title}
                visible={show}
                onOk={() => {
                    doExamin();
                }}
                onCancel={() => {
                    updateShow(false);
                }}
                confirmLoading={confirmLoading}
            >
                <p>{props.des}</p>
                {!props.approved && (
                    <Input
                        placeholder="请输入驳回理由"
                        onChange={({ target: { value } }) => {
                            rejectMessage.current = value;
                        }}
                    />
                )}
            </Modal>
        </span>
    );
}

function Content(props: { buildings: PaymentDetail[]; isLoading: boolean }) {
    const dataSource: any[] | undefined = [];
    props.buildings.forEach((info, index) => {
        dataSource.push(Object.assign({ key: index }, info));
    });
    return <Table columns={columns} dataSource={dataSource} loading={props.isLoading} />;
}
