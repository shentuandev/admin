import { Card, Col, Row } from 'antd';
import React from 'react';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import BasicTable from '../../../components/tables/BasicTable';

export function BuildingList() {
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="楼栋管理" second="楼栋列表" />
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <BasicTable />
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
    {
        title: '开放状态',
        dataIndex: 'applyStatus',
        key: 'applyStatus',
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
];

function Tables() {}
