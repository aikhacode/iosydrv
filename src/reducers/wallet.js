import { create } from 'zustand'

export const useWalletStore = create((set) => ({
    cash: null,
    credit: null,
    sc: {
        active: false,
        saldo: 0,
        token: undefined,
        merchantId: undefined,
        registered: false,


    },
    setCash: (wallet) => set({ cash: wallet }),
    setCredit: (wallet) => set({ credit: wallet }),
    setSC: (wallet) => set({ sc: wallet }),

}))

export const useTopupTicketStore = create((set) => ({
    dataTopup: {
        amount: undefined,
        bank: undefined,
        beneficiaryAccountName: undefined,
        beneficiaryAccountNumber: undefined,
        description: undefined,
        expiredTime: undefined,
        requestTime: undefined,
    },

    setDataTopup: (wallet) => set({ dataTopup: wallet }),


}))

export const useSCPayStore = create((set) => ({
    refNo: '',
    merchantId: '',

    setDataSCPay: (data) => set({ refNo: data.refNo, merchantId: data.merchantId }),
    reset: () => set({ refNo: '', merchantId: '' }),


}))
