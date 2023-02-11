export interface MerchantSetting {
    merchantId: string;
    minLimit: number;
    groupLimit: number;
    orderDeadline: number;
    orderDeliveryTimes: string;
    firstLevelDiscount: number;
    secondLevelDiscount: number;
    thirdLevelDiscount: number;
}
