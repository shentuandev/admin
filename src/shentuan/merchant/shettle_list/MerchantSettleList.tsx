/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Card,
    Col,
    Descriptions,
    Divider,
    Drawer,
    Input,
    Modal,
    Row,
    Spin,
    Table,
    Tag,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { confirmMerchant, getAllMerchants, merchantApplyDetail } from '../../../axios';
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

let showMerhcantDetail = (info: MerchantInfo | null) => {};

export function MerchantSettleList() {
    const [data, updateData] = useState(1);
    const [allMerchants, updateAllMerchants] = useState<MerchantInfo[]>([]);
    const [isLoading, updateLoadingState] = useState<boolean>(true);
    const [showingMerchantInfo, updateShowingMerchantInfo] = useState<MerchantInfo | null>(null);
    showMerhcantDetail = updateShowingMerchantInfo;
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
            <BreadcrumbCustom first="商户管理" second="入驻详情" />
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <Content buildings={allMerchants} isLoading={isLoading} />
                        </Card>
                    </div>
                </Col>
            </Row>
            {showingMerchantInfo != null && (
                <ApplyMerchantDetail
                    info={showingMerchantInfo}
                    onClose={() => updateShowingMerchantInfo(null)}
                />
            )}
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
                    <a onClick={() => showMerhcantDetail(record)}>详情</a>
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

function ApplyMerchantDetail(props: { info: MerchantInfo; onClose: () => any }) {
    const [info, updateInfo] = useState<MerchantInfo | null>(null);
    useEffect(() => {
        merchantApplyDetail(props.info.merchantId).then(
            (data) => updateInfo(data),
            (err) => {
                console.log('err', err);
            }
        );
    }, [props.info]);
    let deadlineDate: Date | null = null;
    if (info != null) {
        deadlineDate = new Date(new Date().setHours(0, 0, 0, 0) + info.settingDto.orderDeadline);
    }

    return (
        <div>
            <Drawer
                title={props.info.merchantName}
                placement="right"
                closable={false}
                visible={props.info != null}
                width="50%"
                onClose={() => showMerhcantDetail(null)}
            >
                {info == null && <Spin />}
                {info != null && (
                    <div>
                        <Descriptions bordered column={1} title="商户信息">
                            <Descriptions.Item label="商户名称">
                                {info.merchantName}
                            </Descriptions.Item>
                            <Descriptions.Item label="电话">{info.phoneNo}</Descriptions.Item>
                            <Descriptions.Item label="地址">
                                {info.areaName + ' ' + info.address}
                            </Descriptions.Item>

                            <Descriptions.Item label="商户id">{info.merchantId}</Descriptions.Item>
                            <Descriptions.Item label="商户token">
                                {info.merchantToken}
                            </Descriptions.Item>
                            <Descriptions.Item label="openid">{info.openid}</Descriptions.Item>
                            <Descriptions.Item label="法人姓名">{info.ownerName}</Descriptions.Item>

                            <Descriptions.Item label="法人身份证正面照">
                                <img src={info.idCardFacePic} width={200} alt="cce" />
                            </Descriptions.Item>
                            <Descriptions.Item label="法人身份证背面照">
                                <img src={info.idCardBackPic} width={200} alt="cce" />
                            </Descriptions.Item>
                            <Descriptions.Item label="营业执照">
                                <img src={info.licensePic} width={200} alt="cce" />
                            </Descriptions.Item>
                            <Descriptions.Item label="卫生许可证">
                                <img src={info.hygienicPic} width={200} alt="cce" />
                            </Descriptions.Item>
                            <Descriptions.Item label="首页图片">
                                <img src={info.showPic} width={200} alt="cce" />
                            </Descriptions.Item>
                            <Descriptions.Item label="备注信息">{info.remark}</Descriptions.Item>

                            <Descriptions.Item label="备注信息">{info.remark}</Descriptions.Item>
                        </Descriptions>
                        <Divider dashed />
                        <Descriptions bordered column={1} title="商户设置">
                            <Descriptions.Item label="用户点餐最低消费设置（单位分）">
                                {info.settingDto.minLimit}
                            </Descriptions.Item>
                            <Descriptions.Item label="餐团人数上限">
                                {info.settingDto.groupLimit}
                            </Descriptions.Item>
                            {deadlineDate && (
                                <Descriptions.Item label="当日点餐截止时间戳">
                                    {convertDate(deadlineDate.getHours()) +
                                        ':' +
                                        convertDate(deadlineDate.getMinutes())}
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="订单送达时间">
                                {info.settingDto.orderDeliveryTimes}
                            </Descriptions.Item>
                            <Descriptions.Item label="一级优惠，提前3~7天优惠额度（单位分）">
                                {info.settingDto.firstLevelDiscount}
                            </Descriptions.Item>
                            <Descriptions.Item label="二级优惠，提前1~2天优惠额度（单位分）">
                                {info.settingDto.secondLevelDiscount}
                            </Descriptions.Item>
                            <Descriptions.Item label="三级优惠，提前1小时优惠额度（单位分）">
                                {info.settingDto.thirdLevelDiscount}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Drawer>
        </div>
    );
}

function convertDate(count: number) {
    if (count < 10) {
        return '0' + count;
    } else {
        return count;
    }
}
