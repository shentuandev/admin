import { Card, Col, Row, Table, Tag } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { getAllBuildings } from '../../../axios';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import { BuildingInfo } from '../../types/BuildingInfo';

export function BuildingList() {
    const [allBuildings, updateBuildings] = useState<BuildingInfo[]>([]);
    const [isLoading, updateLoadingState] = useState<boolean>(true);
    useEffect(() => {
        getAllBuildings().then((data) => {
            const newData = data.list as BuildingInfo[];
            _.remove(newData, (item) => item.status === 0);
            updateBuildings(newData);
            updateLoadingState(false);
        });
    }, []);
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="楼栋管理" second="楼栋列表" />
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
        render: (status: number, record: any) => {
            if (status === 1) {
                return (
                    <Tag color="green" key={status}>
                        入驻未满
                    </Tag>
                );
            } else {
                return (
                    <Tag color="volcano" key={status}>
                        入驻已满
                    </Tag>
                );
            }
        },
    },
    {
        title: '商家入驻上限',
        dataIndex: 'upperLimit',
        key: 'upperLimit',
    },
    {
        title: '入驻商家数',
        dataIndex: 'settledNum',
        key: 'settledNum',
    },
    {
        title: '开放商家入驻状态',
        dataIndex: 'applyStatus',
        key: 'applyStatus',
        render: (status: number, record: any) => {
            if (status === 1) {
                return (
                    <Tag color="green" key={status}>
                        开放
                    </Tag>
                );
            } else {
                return (
                    <Tag color="volcano" key={status}>
                        关闭
                    </Tag>
                );
            }
        },
    },
    {
        title: '开放用户点餐状态',
        dataIndex: 'openStatus',
        key: 'openStatus',
        render: (status: number, record: any) => {
            if (status === 1) {
                return (
                    <Tag color="green" key={status}>
                        开放
                    </Tag>
                );
            } else {
                return (
                    <Tag color="volcano" key={status}>
                        关闭
                    </Tag>
                );
            }
        },
    },
];

function Content(props: { buildings: BuildingInfo[]; isLoading: boolean }) {
    const dataSource: any[] | undefined = [];
    props.buildings.forEach((info, index) => {
        dataSource.push(Object.assign({ key: index }, info));
    });
    return <Table columns={columns} dataSource={dataSource} loading={props.isLoading} />;
}
