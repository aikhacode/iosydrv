import * as Actions from '../actions/ActionTypes'
const VehicleReducer = (state = { vehicle_name: '', vehicle_brand: '', vehicle_color: '', vehicle_number: '', vehicle_type: '', vehicle_type_lbl: '', vehicle_type_multi: '', vehicle_fiture_type: '' }, action) => {
    switch (action.type) {
        case Actions.UPDATE_VEHICLE_NAME:
            return Object.assign({}, state, {
                vehicle_name: action.data
            });
        case Actions.UPDATE_VEHICLE_BRAND:
            return Object.assign({}, state, {
                vehicle_brand: action.data
            });
        case Actions.UPDATE_VEHICLE_COLOR:
            return Object.assign({}, state, {
                vehicle_color: action.data
            });
        case Actions.UPDATE_VEHICLE_NUMBER:
            return Object.assign({}, state, {
                vehicle_number: action.data
            });
        case Actions.UPDATE_VEHICLE_TYPE:
            return Object.assign({}, state, {
                vehicle_type: action.data
            });
        case Actions.UPDATE_VEHICLE_TYPE_LBL:
            return Object.assign({}, state, {
                vehicle_type_lbl: action.data
            });
        case Actions.UPDATE_VEHICLE_TYPE_MULTI:
            return Object.assign({}, state, {
                vehicle_type_multi: action.data
            });
        case Actions.UPDATE_VEHICLE_FITURE_TYPE:
            return Object.assign({}, state, {
                vehicle_fiture_type: action.data
            });
        default:
            return state;
    }
}

export default VehicleReducer