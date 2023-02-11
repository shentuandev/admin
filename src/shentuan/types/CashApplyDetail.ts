export interface CashApplyDetail {
    recordId: number;
    merchantId: string;
    merchantName: string;
    merchantAddress: string;
    phoneNo: string;
    amount: number;
    countDates: string;
    cashOutCharge: number;
    receiveAmount: number;
    collectionAccountName: string;
    collectionAccountNo: string;
    status: number;
    remark: string;
}

export interface Root {
    accountId: number;
    merchantId: string;
    accountName: string;
    accountNo: string;
    accountBankName: string;
    accountBankBranchName: any;
    status: number;
    remark: string;
    createTime: number;
    updateTime: number;
}
