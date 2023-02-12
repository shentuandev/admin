import { Card, Col, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAllBuildings } from '../../../axios';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import { BuildingInfo } from '../../types/BuildingInfo';

export function BusinessStatics() {
    const [allBuildings, updateBuildings] = useState<BuildingInfo[]>([]);
    const [isLoading, updateLoadingState] = useState<boolean>(true);
    useEffect(() => {
        getAllBuildings().then((data) => {
            updateBuildings(data.list);
            updateLoadingState(false);
        });
    }, []);
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="商户管理" second="经营统计" />
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Content buildings={allBuildings} isLoading={isLoading} />
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
        title: '地区',
        dataIndex: 'areaName',
        key: 'areaName',
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '楼层数',
        dataIndex: 'floor',
        key: 'floor',
    },
    {
        title: '入驻状态',
        dataIndex: 'settledStatus',
        key: 'settledStatus',
    },
    {
        title: '楼栋上限',
        dataIndex: 'upperLimit',
        key: 'upperLimit',
    },
    {
        title: '驻商家数',
        dataIndex: 'settledNum',
        key: 'settledNum',
    },
    {
        title: '开放状态',
        dataIndex: 'applyStatus',
        key: 'applyStatus',
    },
];

function Content(props: { buildings: BuildingInfo[]; isLoading: boolean }) {
    const dataSource: any[] | undefined = [];
    props.buildings.forEach((info, index) => {
        dataSource.push(Object.assign({ key: index }, info));
    });
    return <Table columns={columns} dataSource={dataSource} loading={props.isLoading} />;
}
