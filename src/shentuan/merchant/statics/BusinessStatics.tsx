import { Card, Cascader, Col, DatePicker, Row, Table, Tag } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';
import CheckboxGroup, { CheckboxValueType } from 'antd/lib/checkbox/Group';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { dialyBusinessStatics } from '../../../axios';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import { DialyBusinessStatics } from '../../types/DialyBusinessStatics';

function convertToDate(dateStr: string) {
    return new Date(Date.parse(dateStr.replace(/-/g, '/')));
}

export function BusinessStatics() {
    const [allDialyBusinessStatics, updateAllDialyBusinessStatics] = useState<
        DialyBusinessStatics[]
    >([]);
    const [showingStatics, updateShowingStatics] = useState<DialyBusinessStatics[]>([]);
    const [isLoading, updateLoadingState] = useState<boolean>(true);
    const [selectedMerchant, selectMerchant] = useState('0');
    const [merchantOptions, updateMerchantOptions] = useState<CascaderOptionType[]>([]);
    const [statusOptions, updateStatusOptions] = useState<string[]>([]);
    const [selectedStatus, selectStatus] = useState<CheckboxValueType[]>([]);
    const [selectedDates, selectDates] = useState<string[]>([]);

    useEffect(() => {
        dialyBusinessStatics().then((data) => {
            // 添加测试数据
            const newData = data.list as DialyBusinessStatics[];
            newData[0].cashOutStatus = 0;
            newData[1].cashOutStatus = 1;
            newData[2].cashOutStatus = 2;
            newData[3].cashOutStatus = 3;

            updateAllDialyBusinessStatics(data.list);
            updateLoadingState(false);
        });
    }, []);

    // 整理过滤商家信息
    useEffect(() => {
        if (allDialyBusinessStatics.length === 0) return;
        const options: CascaderOptionType[] = [];
        const ids: string[] = [];
        options.push({
            value: '0',
            label: '全部',
        });
        allDialyBusinessStatics.forEach((data) => {
            if (ids.indexOf(data.merchantId) === -1) {
                ids.push(data.merchantId);
                options.push({
                    value: data.merchantId,
                    label: data.merchantName,
                });
            }
        });
        updateMerchantOptions(options);
    }, [allDialyBusinessStatics]);

    // 处理状态选择
    useEffect(() => {
        if (allDialyBusinessStatics.length === 0) return;
        const options: string[] = [];
        options.push('不可提现');
        options.push('可提现');
        options.push('提现处理中');
        options.push('提现完成');
        updateStatusOptions(options);
        selectStatus(options);
    }, [allDialyBusinessStatics]);

    useEffect(() => {
        if (allDialyBusinessStatics.length === 0) return;
        let pretreatData = _.cloneDeep(allDialyBusinessStatics);
        // 处理商家过滤
        if (selectedMerchant !== '0') {
            _.remove(pretreatData, (data) => data.merchantId !== selectedMerchant);
        }
        // 处理状态过滤
        const allStatus = selectedStatus.map((item) => convertDesToStatus(item as string));
        _.remove(pretreatData, (item) => allStatus.indexOf(item.cashOutStatus) === -1);
        // 处理日期
        if (selectedDates.length > 0) {
            const startDate = convertToDate(selectedDates[0]);
            const endDate = convertToDate(selectedDates[1]);
            pretreatData = _.filter(pretreatData, (data) => {
                const recordDate = convertToDate(data.countDate);
                return recordDate >= startDate && recordDate <= endDate;
            });
        }
        updateShowingStatics(pretreatData);
    }, [allDialyBusinessStatics, selectedMerchant, selectedStatus, selectedDates]);

    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="商户管理" second="经营统计" />
            <div>
                <p>
                    <strong> 选择商家 </strong>
                </p>
                <Cascader
                    options={merchantOptions}
                    defaultValue={['0']}
                    value={[selectedMerchant]}
                    onChange={(value) => selectMerchant(value[0])}
                    placeholder="请选择商家"
                />
            </div>
            <div>
                <p>
                    <strong>选择提现状态 </strong>
                </p>
                <CheckboxGroup
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={(data) => selectStatus(data)}
                />
            </div>

            <div>
                <p>
                    <strong> 日期选择 </strong>
                </p>
                <DatePicker.RangePicker onChange={(date, dateString) => selectDates(dateString)} />
            </div>
            <br />
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Content statics={showingStatics} isLoading={isLoading} />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

const columns = [
    {
        title: 'countId',
        dataIndex: 'countId',
        key: 'countId',
    },
    {
        title: '商户名称',
        dataIndex: 'merchantName',
        key: 'merchantName',
    },
    {
        title: 'merchantId',
        dataIndex: 'merchantId',
        key: 'merchantId',
    },
    {
        title: '提现状态',
        dataIndex: 'cashOutStatus',
        key: 'cashOutStatus',
        filters: [
            {
                text: '不可提现',
                value: '0',
            },
            {
                text: '可提现',
                value: '1',
            },
            {
                text: '提现处理中',
                value: '2',
            },
            {
                text: '提现完成',
                value: '3',
            },
        ],
        onFilter: (value: number, record: DialyBusinessStatics) => value === record.cashOutStatus,
        render: (cashOutStatus: number) => {
            let content: string | number = cashOutStatus;
            let color = 'green';
            if (cashOutStatus === 0) {
                content = '不可提现';
                color = 'gray';
            }
            if (cashOutStatus === 1) {
                content = '可提现';
                color = 'volcano';
            }
            if (cashOutStatus === 2) {
                content = '提现处理中';
                color = 'volcano';
            }
            if (cashOutStatus === 3) content = '提现完成';

            return (
                <Tag color={color} key={cashOutStatus}>
                    {content}
                </Tag>
            );
        },
    },
    {
        title: '统计日期',
        dataIndex: 'countDate',
        key: 'countDate',
    },
    {
        title: '当日餐食费总金额',
        dataIndex: 'dailyGroupMealAmount',
        key: 'dailyGroupMealAmount',
    },
    {
        title: '当日打包费总金额',
        dataIndex: 'dailyGroupDeliveryAmount',
        key: 'dailyGroupDeliveryAmount',
    },
    {
        title: '当日退款总金额',
        dataIndex: 'dailyRefundAmount',
        key: 'dailyRefundAmount',
    },
    {
        title: '可提现金额',
        dataIndex: 'dailyCashOut',
        key: 'dailyCashOut',
    },
];

function Content(props: { statics: DialyBusinessStatics[]; isLoading: boolean }) {
    const dataSource: any[] | undefined = [];
    props.statics.forEach((info, index) => {
        dataSource.push(Object.assign({ key: index }, info));
    });
    return <Table columns={columns} dataSource={dataSource} loading={props.isLoading} />;
}

function convertDesToStatus(des: string): number {
    if (des === '不可提现') return 0;
    if (des === '可提现') return 1;
    if (des === '提现处理中') return 2;
    if (des === '提现完成') return 3;
    // eslint-disable-next-line no-throw-literal
    else throw '未知 des : ' + des;
}
