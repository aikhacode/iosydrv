import { create } from 'zustand'
import { LATITUDE_DELTA, LONGITUDE_DELTA } from '../config/Constants'

export const useStore = create((set) => ({
    change_location: null,
    initial_lat: null,
    initial_lng: null,
    initial_region: null,
    vehicle: {
        vehicle_name: '',
        vehicle_brand: '',
        vehicle_color: '',
        vehicle_number: '',
        vehicle_type: ''
    },
    fiturs: [],

    changeLocation: (state) => set({ location: state }),
    initialLat: (state) => set({ latitude: state }),
    initialLng: (state) => set({ longitude: state }),
    initialRegion: (state) => set({ region: state }),
    initialVehicle: (state) => set({ vehicle: state }),
    setFiturs: (fiturs) => set({ fiturs: Array.isArray(fiturs) ? fiturs : [] }),
}))

export const useGlobalStore = create((set) => ({
    isShowTabNavigator: true,

    setIsShowTabNavigator: (state) => set({ isShowTabNavigator: state })
}))

export const useProfileStore = create((set) => ({
    profile_image_url: null,
    setDataProfileImageUrl: (fileimage) => set({ profile_image_url: fileimage })
}))

export const useRiderStore = create((set) => ({
    isRiderActive: false,
    vehicleType: 4,
    setVehicleTypeToStore: (vehicleType) => set({ vehicleType: Number(vehicleType), isRiderActive: Number(vehicleType) === 4 }),
    setRiderActive: (active) => set({ isRiderActive: active })
}))

export const useFormTolParkirStore = create((set) => ({
    dataForm: { tol: 0, parkir: 0 },
    setDataFormTolParkir: (data) => set({ dataForm: data })
}))

export const useBroadcastStore = create((set) => ({
    broadcast: false,
    setBroadcast: (data) => set({ broadcast: data })
}))

export const useDeviceStore = create((set) => ({
    device: false,
    setDevice: (data) => set({ device: data })
}))

export const useTransferStore = create((set) => ({
    dataTransfer: {
        status: '',
        bankName: '',
        referenceNo: '',
        accountName: '',
        accountNumber: '',
        amount: 0
    },
    setDataTransfer: (data) => set({ dataTransfer: data })
}))

export const useRegistrationStore = create((set) => ({
    vehicleType: 'MOBIL_AIRPORT', // MOBIL_AIRPORT, MOBIL_REGULER, MOTOR
    vehicles: [],
    motors: [],
    vehicleBrand: '',
    vehicleName: '',
    vehicleColor: '',
    vehicleNumber: '',
    vehicleFitur: [],
    vehicleCategories: [],
    vehiclePicks: [
        {
            id: 1,
            name: 'Mobil Airport',
            status: true,
            stateId: 'MOBIL_AIRPORT'
        },
        {
            id: 2,
            name: 'Mobil Reguler',
            status: false,
            stateId: 'MOBIL_REGULER'
        },
        {
            id: 3,
            name: 'Motor',
            status: false,
            stateId: 'MOTOR'
        }
    ],
    setVehiclePicks: (data) => set({ vehiclePicks: data }),
    setVehicleCategories: (data) => set({ vehicleCategories: data }),
    setVehicleFitur: (data) => set({ vehicleFitur: data }),
    setVehicleNumber: (data) => set({ vehicleNumber: data }),
    setVehicleColor: (data) => set({ vehicleColor: data }),
    setVehicleName: (data) => set({ vehicleName: data }),
    setVehicleBrand: (data) => set({ vehicleBrand: data }),
    setVehicleType: (data) => set({ vehicleType: data }),
    setVehicles: (data) => set({ vehicles: data }),
    setMotors: (data) => set({ motors: data }),

}))

export const useAntrianStore = create((set) => ({
    isAntrianRunning: false,
    currentAntrianNumber: 0,
    maxAntrianNumber: 0,
    lostInPool: false,
    latitude: 0,
    longitude: 0,
    setGeo: (data) => set({ latitude: data.latitude, longitude: data.longitude }),
    setIsAntrianRunning: (data) => set({ isAntrianRunning: data }),
    setCurrentAntrianNumber: (data) => set({ currentAntrianNumber: data }),
    setMaxAntrianNumber: (data) => set({ maxAntrianNumber: data }),
    setLostInPool: (data) => set({ lostInPool: data }),
}))

export const useOneWay = create((set) => ({
    oneWay: false,
    setOneWay: (data) => set({ oneWay: data })
}))

export const useOnewayDashboardStore = create((set) => ({
    onewayFlag: false,
    latitude: 0,
    longitude: 0,
    setOnewayFlag: (data) => set({ onewayFlag: data }),
    setGPS: (data) => set({ latitude: data.latitude, longitude: data.longitude })

}))

export const useGeolocationStore = create((set) => ({
    location: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    },
    heading: 0,
    setLocation: (data) => set({ location: data }),
    setHeading: (data) => set({ heading: data }),

}))