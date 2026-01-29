import axios from "axios"
import { sc_url } from "./config/Constants"

export const bindingInquiry = () => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    const deviceId = global.device_id
    console.log('bindinginquiry', { phoneNo, deviceId })
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: sc_url + '/account/binding/inquiry',
                data: {
                    phoneNo: phoneNo,
                    deviceId: deviceId
                }
            })
            console.log('bindinginquiry response', response.data)
            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const unBinding = (merchantId) => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    // const deviceId = global.device_id


    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: sc_url + '/account/unbinding',
                data: {
                    phoneNo: phoneNo,
                    merchantId: merchantId
                }
            })

            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const binding = (merchantId) => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    const deviceId = global.device_id
    console.log('binding js', merchantId)

    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: sc_url + '/account/binding',
                data: {
                    phoneNo: phoneNo,
                    deviceId: deviceId,
                    merchantId: merchantId
                }
            })

            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const getToken = () => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    const deviceId = global.device_id
    const driverId = global.id

    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: sc_url + '/driver/info',
                data: {
                    driver_id: `${driverId}`,

                }
            })

            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const balanceInquiry = (merchantId, token) => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    const deviceId = global.device_id
    const driverId = global.id
    console.log('balance inquiry js', { merchantId, token })
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: sc_url + '/balance/inquiry',
                data: {
                    merchantId: merchantId,
                    access_token: token

                }
            })

            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}


export const userDebit = (merchantId, token, beAmount, channel = 'topup', data = {}) => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    const deviceId = global.device_id
    const driverId = global.id
    // console.log('balance inquiry js', { merchantId, token })
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: sc_url + '/user/debit',
                data: {
                    merchantId: merchantId,
                    amount: beAmount,
                    accessToken: token,
                    channel: channel,
                    data: data
                }
            })
            console.log('userDebit call..', response)
            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const userDebitCheck = (refNo, merchantId) => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    const deviceId = global.device_id
    const driverId = global.id
    console.log('userDebitCheck call..', { refNo, merchantId })
    return new Promise(async (resolve, reject) => {
        try {
            console.log('userDebitCheck call axios now..', sc_url + '/user/debit/check')
            // const responsef = fetch(sc_url + '/user/debit/check', {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     method: 'post',
            //     body: JSON.stringify({
            //         merchantId: merchantId,
            //         refNo: refNo
            //     })
            // })
            const response = await axios({
                method: 'post',
                url: sc_url + '/user/debit/check',
                data: {
                    merchantId: merchantId,
                    refNo: refNo

                }
            })
            // console.log('response userdebicheck in call..', { response: await responsef.json() })
            // if (responsef.ok) {
            resolve(response.data)
            // } else {
            //     reject(responsef.status)
            // }

        } catch (error) {
            reject(error)
        }
    })
}

export const userTopup = (merchantId, token, bank, value) => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    const deviceId = global.device_id
    const driverId = global.id
    // console.log('balance inquiry js', { merchantId, token })
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: sc_url + '/customer/topup-ticket',
                data: {
                    merchantId: merchantId,
                    amount: { value: value },
                    accessToken: token,
                    phoneNo: phoneNo,
                    bank: bank,
                    deviceId: deviceId


                }
            })

            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const userTransferInquiry = (props) => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    const deviceId = global.device_id
    const driverId = global.id
    const { accountNumber, accountName, bankCode, bankName, amount, merchantId, token, notes } = props
    // console.log('balance inquiry js', { merchantId, token })
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: sc_url + '/user/tf_bank_inquiry',
                data: {
                    'accountNumber': accountNumber,
                    'accountName': accountName,
                    'phoneNo': phoneNo,
                    'bankCode': bankCode,
                    'bankName': bankName,
                    'amount': amount,
                    'merchantId': merchantId,
                    'accessToken': token,
                    'notes': notes,
                    'deviceId': deviceId


                }
            })

            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const userTransfer = (props) => {
    const phoneNo = getPhoneNumber(global.phone_with_code)
    const deviceId = global.device_id
    const driverId = global.id
    const { merchantId, token, referenceNo, accountNumber, bankCode, amount, notes, accountName, transactionCode } = props
    // console.log('balance inquiry js', { merchantId, token })
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: sc_url + '/user/tf_bank_transaction',
                data: {
                    'partnerReferenceNo': referenceNo,
                    'phoneNo': phoneNo,
                    'accountNumber': accountNumber,
                    'bankCode': bankCode,
                    'amount': amount,
                    'notes': notes,
                    'accountName': accountName,
                    'referenceNo': referenceNo,
                    'transactionCode': transactionCode,
                    'merchantId': merchantId,
                    'accessToken': token,
                    'deviceId': deviceId

                }
            })

            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const getPhoneNumber = (phone) => {
    const phoneraw = phone.slice(3)
    return "0" + phoneraw
}

export const getBanks = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'get',
                url: sc_url + '/bank/list',

            })

            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const getBankTransfers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'get',
                url: sc_url + '/bank-transfer/list',

            })

            resolve(response.data)
        } catch (error) {
            reject(error)
        }
    })
}

export const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}