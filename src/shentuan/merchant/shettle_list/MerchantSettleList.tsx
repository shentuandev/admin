/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card, Col, Divider, Input, Modal, Row, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { confirmMerchant, getAllMerchants } from '../../../axios';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import { toast } from '../../../utils';
import { MerchantInfo } from '../../types/MerchantInfo';

const OperationStatus = {
    OPEN: 1,
    CLOSE: 0,
};

const ApplyStatus = {
    NOT_APPLY: 0,
    REJECT: 1,
    QUIT: 2,
    APPLYING: 10,
    SUCCEED: 20,
};

let refresh = () => {};

export function MerchantSettleList() {
    const [data, updateData] = useState(1);
    const [allMerchants, updateAllMerchants] = useState<MerchantInfo[]>([]);
    const [isLoading, updateLoadingState] = useState<boolean>(true);
    useEffect(() => {
        getAllMerchants().then((data) => {
            updateAllMerchants(data.list);
            updateLoadingState(false);
        });
    }, [data]);
    refresh = () => {
        updateData(data + 1);
    };
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="楼栋管理" second="楼栋列表" />
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Content buildings={allMerchants} isLoading={isLoading} />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

const columns = [
    {
        title: '商户',
        dataIndex: 'merchantName',
        key: 'merchantName',
    },
    {
        title: '手机',
        dataIndex: 'phoneNo',
        key: 'phoneNo',
    },
    {
        title: '法人',
        dataIndex: 'ownerName',
        key: 'ownerName',
    },
    {
        title: '入驻状态',
        dataIndex: 'applyStatus',
        key: 'applyStatus',
        render: (status: number) => {
            let content: string | number = status;
            if (status === ApplyStatus.NOT_APPLY) content = '未入驻';
            if (status === ApplyStatus.REJECT) content = '申请驳回';
            if (status === ApplyStatus.QUIT) content = '自主退出';
            if (status === ApplyStatus.APPLYING) content = '申请中';
            if (status === ApplyStatus.SUCCEED) content = '已入驻';
            return <span>{content}</span>;
        },
    },
    {
        title: '营业状态',
        dataIndex: 'operationStatus',
        key: 'operationStatus',
        render: (status: number, record: any) => {
            if (status !== OperationStatus.CLOSE) {
                return (
                    <Tag color="volcano" key={status}>
                        未营业
                    </Tag>
                );
            } else {
                return (
                    <Tag color="green" key={status}>
                        营业中
                    </Tag>
                );
            }
        },
    },
    {
        title: '地区',
        dataIndex: 'areaName',
        key: 'areaName',
    },
    {
        title: '具体地址',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '审批',
        dataIndex: 'applyStatus',
        key: 'examine',
        render: (status: number, record: any) => {
            return (
                <span>
                    {status === ApplyStatus.APPLYING && (
                        <span>
                            <Examine
                                title="通过"
                                des="确定通过该商户入驻申请吗？"
                                approved
                                buildingId={record.merchantId}
                            />
                            <Divider type="vertical" />
                            <Examine
                                title="驳回"
                                des="确定驳回该商户入驻申请吗？"
                                approved={false}
                                buildingId={record.merchantId}
                            />
                            <Divider type="vertical" />
                        </span>
                    )}
                    {status === ApplyStatus.SUCCEED && (
                        <span>
                            <Examine
                                title="强制退驻"
                                des="确定将该商家强制退驻吗？"
                                approved={false}
                                buildingId={record.merchantId}
                            />
                            <Divider type="vertical" />
                        </span>
                    )}
                    <a>详情</a>
                </span>
            );
        },
    },
];

function Examine(props: {
    title: string | null;
    des: string;
    approved: boolean;
    buildingId: string;
}) {
    const [show, updateShow] = useState(false);
    const rejectMessage = useRef('');
    const [confirmLoading, updateConfirmLoading] = useState(false);

    const doExamin = () => {
        if (confirmLoading) return;
        updateConfirmLoading(true);
        confirmMerchant(props.buildingId, props.approved ? 20 : 0, rejectMessage.current).then(
            (data) => {
                console.log('data', data);
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
                    // updateShow(false);
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
                        placeholder="请输入拒绝理由"
                        onChange={({ target: { value } }) => {
                            rejectMessage.current = value;
                        }}
                    />
                )}
            </Modal>
        </span>
    );
}

function Content(props: { buildings: MerchantInfo[]; isLoading: boolean }) {
    const dataSource: any[] | undefined = [];
    props.buildings.forEach((info, index) => {
        dataSource.push(Object.assign({ key: index }, info));
    });
    return <Table columns={columns} dataSource={dataSource} loading={props.isLoading} />;
}
