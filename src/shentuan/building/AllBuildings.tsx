/**
 * Created by hao.cheng on 2017/4/15.
 */
import { Card, Col, Row } from 'antd';
import React from 'react';
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
import BasicTable from '../../components/tables/BasicTable';

const AllBuildings = () => (
    <div className="gutter-example">
        <BreadcrumbCustom first="表格2" second="基础表格" />
        <Row gutter={16}>
            <Col className="gutter-row" md={24}>
                <div className="gutter-box">
                    <Card title="基础表格" bordered={false}>
                        <BasicTable />
                    </Card>
                </div>
            </Col>
        </Row>
    </div>
);

export default AllBuildings;
