import * as ActionTypes from './ActionTypes';

export const updateVehicleName = (data) => ({
    type: ActionTypes.UPDATE_VEHICLE_NAME,
    data: data
})

export const updateVehicleBrand = (data) => ({
    type: ActionTypes.UPDATE_VEHICLE_BRAND,
    data: data
})

export const updateVehicleColor = (data) => ({
    type: ActionTypes.UPDATE_VEHICLE_COLOR,
    data: data
})

export const updateVehicleNumber = (data) => ({
    type: ActionTypes.UPDATE_VEHICLE_NUMBER,
    data: data
})

export const updateVehicleType = (data) => ({
    type: ActionTypes.UPDATE_VEHICLE_TYPE,
    data: data
})

export const updateVehicleTypeLbl = (data) => ({
    type: ActionTypes.UPDATE_VEHICLE_TYPE_LBL,
    data: data
})

export const updateVehicleTypeMulti = (data) => ({
    type: ActionTypes.UPDATE_VEHICLE_TYPE_MULTI,
    data: data
})

export const updateVehicleFitureType = (data) => ({
    type: ActionTypes.UPDATE_VEHICLE_FITURE_TYPE,
    data: data
})