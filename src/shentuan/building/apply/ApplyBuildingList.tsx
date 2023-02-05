import { Button, Card, Col, Modal, Row, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getAllBuildingApplyList } from '../../../axios';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import { BuildingApplyInfo } from '../../types/BuildingApplyInfo';

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
    const updatePage = () => {
        updateData(data + 1);
    };
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="楼栋管理" second="入驻申请" />
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Content
                                buildings={allApplyInfo}
                                isLoading={isLoading}
                                updatePage={updatePage}
                            />
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
                {record.status === '申请中' && (
                    <ComfirmDialog buildingId={record.buildingId} merchantId={record.merchantId} />
                )}
            </span>
        ),
    },
];

function ComfirmDialog(props: { buildingId: string; merchantId: string }) {
    const [show, updateShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const passApply = useRef(true);
    const onOk = () => {};
    const onCancel = () => {
        updateShow(false);
    };
    const onClick = (pass: boolean) => {
        passApply.current = pass;
        updateShow(true);
    };
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

function Content(props: {
    buildings: BuildingApplyInfo[];
    isLoading: boolean;
    updatePage: Function;
}) {
    const dataSource: any[] | undefined = [];
    props.buildings.forEach((info, index) => {
        const data = Object.assign({ key: index }, info);
        const status = info.status;
        if (status === -1) {
            data.status = '未入驻';
        } else if (status === 0) {
            data.status = '已驳回';
        } else if (status === 1) {
            data.status = '申请中';
        } else if (status === 2) {
            data.status = '已入驻';
        }
        dataSource.push(data);
    });
    return <Table columns={columns} dataSource={dataSource} loading={props.isLoading} />;
}
