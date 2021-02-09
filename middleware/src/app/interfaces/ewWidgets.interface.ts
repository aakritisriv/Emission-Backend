

//It can access for only edge interface Request from the data
export interface IEdgeWidget{
    _id: string; // it can random numbert generate
    title: string;// type of widgets
    variableName: string;// choosing for oil disecel
    description: string;
    type: string;// color of wdiget information for  'Info', 'Alert','Event','Warning'
    sourceId: string;
    expirationType:string;// time ,depth
    start: string;
    end: string;
    finalDestination: string;// type oil getting info(driller or screener)
    approvalRequired: boolean;
    priority: number;
}
//setting page
export interface IOilBurner{
    _Id:string,
    EDBurnerDco2:string,
    EDBurnernorwayco2:string,
    EDBurnerDco:string,
    EDBurnernorwayco:string,
    EDBurnerDNOX:string,
    EDBurnernorwayNOX:string,
    EDBurnerDTHC:string,
    EDBurnernorwayTHCCH:string,
    flrLiquid:string,
    flrLiquidType:string,
    flrLiquidonoff:boolean,
    mevolumeLiquid:string,
    mevolumeLiquidType:string,
    totVolumeliquid:string,
}
export interface IGasFlareEmission{
    _Id:string,
    gasHPNorwayCO2:string,
    gasHPNorwayNOX:string,
    gasHPNorwayCO:string,
    gasHPNorwayTHCCH:string,
    aFlowrateGAs:string,
    meVolumegas:string,
    totVolumegas:string

    
}
export interface IDieselUlity{
    _Id:string,
    dueCO2:string,
    dueCO:string,
    dueNOX:string,
    dueTHCCH:string,
    dueAirComType:string,
    dueGenaratorType:string,
    dueBoosterPump:string,
    dueOthrUtilityType:string
    dueEQPId:string,
    dueEQPRunTime:boolean,
    dueEQPoffduration:string,
    dueEQPusage:string,
    dueEQPTotUsage:string,
    dueVolumeLiquid:string

}
export interface IUtilityUsage{
    _Id:string,
    uuTotaleletric:string,
    uuTotalWater:string,
    uuTotalChemical:string,
    uuTotalsolids:string,    
    uuEQPId:string,
    uuEQPRunTime:boolean,
    uuEQPoffduration:string,
    uuEQPusage:string,
    dueEQPTotUsage:string
}
