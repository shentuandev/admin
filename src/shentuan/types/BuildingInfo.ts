export interface BuildingInfo {
    buildingId: string;
    buildingName: string;
    areaName: string;
    address: string;
    floor: number;
    settledStatus: number;
    upperLimit: number;
    settledNum: number;
    applyStatus: number;
    openStatus: number;
    status: number;
    createTime: number;
    updateTime: number;
    podiums: Podium[];
}

export interface Podium {
    buildingId: string;
    podiumCode: string;
    podiumFloor: number;
}
