import { Button, Card, Col, Modal, Row, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { examineBuildingApply, getAllBuildingApplyList } from '../../../axios';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import { BuildingApplyInfo } from '../../types/BuildingApplyInfo';
import { toast, toastNetworkError } from './../../../utils/index';

const ApplyStatus = {
    REJECT: 0,
    PASS: 2,
    APPLYING: 1,
    UNKNOWN: -1,
};

let refresh = () => {};

export function ApplyBuildingList() {
    const [data, updateData] = useState(1);
    const [allApplyInfo, updateApplyInfo] = useState<BuildingApplyInfo[]>([]);
    const [isLoading, updateLoadingState] = useState<boolean>(true);
    useEffect(() => {
        updateLoadingState(true);
        getAllBuildingApplyList().then((data) => {
            updateApplyInfo(data.list);
            updateLoadingState(false);
        });
    }, [data]);
    refresh = () => {
        updateData(data + 1);
    };
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="楼栋管理" second="入驻申请" />
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Content buildings={allApplyInfo} isLoading={isLoading} />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

const columns = [
    {
        title: '楼栋',
        dataIndex: 'buildingName',
        key: 'buildingName',
        render: (text: any) => <span>{text}</span>,
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'buildingId',
        dataIndex: 'buildingId',
        key: 'buildingId',
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
        title: '入驻状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '操作',
        key: 'action',
        render: (text: any, record: any) => (
            <span>
                <ComfirmDialog
                    buildingId={record.buildingId}
                    merchantId={record.merchantId}
                    status={record.status}
                    buildingName={record.buildingName}
                    merchantName={record.merchantName}
                />
            </span>
        ),
    },
];

function ComfirmDialog(props: {
    buildingId: string;
    merchantId: string;
    status: string;
    buildingName: string;
    merchantName: string;
}) {
    const [show, updateShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const passApply = useRef(true);

    const request = (status: number, noticeTitle: string) => {
        setConfirmLoading(true);
        examineBuildingApply(props.buildingId, props.merchantId, status)
            .then((data) => {
                toast(noticeTitle, '审批成功');
                setTimeout(() => {
                    refresh();
                }, 0);
                setConfirmLoading(false);
            })
            .catch((data) => {
                toastNetworkError(data);
                setConfirmLoading(false);
            })
            .finally(() => {
                updateShow(false);
            });
    };

    const onOk = () => {
        request(passApply.current ? ApplyStatus.PASS : ApplyStatus.REJECT, '入驻审核');
    };
    const onCancel = () => {
        updateShow(false);
    };
    const onClick = (pass: boolean) => {
        passApply.current = pass;
        updateShow(true);
    };

    if (props.status === '已入驻') {
        return (
            <span>
                <Button onClick={() => updateShow(true)}>强制退驻</Button>
                <Modal
                    title="强制退驻"
                    visible={show}
                    onOk={() => {
                        request(ApplyStatus.REJECT, '强制退驻');
                    }}
                    onCancel={onCancel}
                    confirmLoading={confirmLoading}
                >
                    <p>确定强制该用户退驻吗？</p>
                </Modal>
            </span>
        );
    }
    return (
        <span>
            <Button onClick={() => onClick(true)}>通过</Button>
            <Button onClick={() => onClick(false)}>驳回</Button>
            <Modal
                title="楼栋入驻审核"
                visible={show}
                onOk={onOk}
                onCancel={onCancel}
                confirmLoading={confirmLoading}
            >
                {passApply.current ? <p>确定通过申请？</p> : <p>确定驳回申请？</p>}
            </Modal>
        </span>
    );
}

function Content(props: { buildings: BuildingApplyInfo[]; isLoading: boolean }) {
    const dataSource: any[] | undefined = [];
    props.buildings.forEach((info, index) => {
        const data = Object.assign({ key: index }, info);
        const status = info.status;
        if (status === ApplyStatus.UNKNOWN) {
            data.status = '未入驻';
        } else if (status === ApplyStatus.REJECT) {
            data.status = '已驳回';
        } else if (status === ApplyStatus.APPLYING) {
            data.status = '申请中';
        } else if (status === ApplyStatus.PASS) {
            data.status = '已入驻';
        }
        dataSource.push(data);
    });
    return <Table columns={columns} dataSource={dataSource} loading={props.isLoading} />;
}
