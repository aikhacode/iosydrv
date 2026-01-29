
//Fixed
import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../../assets/css/Colors';
import { screenHeight, screenWidth, bold, regular, api_url, get_about, logo, f_25, f_m, f_l, f_s, f_xl } from '../../config/Constants';
import Icon, { Icons } from '../Icons';
import { getBanks, getBankTransfers, isObjectEmpty, userTopup, userTransfer, userTransferInquiry } from "../../helpersc";
import { Picker } from '@react-native-picker/picker';
import { useTopupTicketStore, useWalletStore } from "../../reducers/wallet";
import { useTransferStore } from "../../reducers/zustand";

import withTranslation from '../../hook/withTranslation'


const BankTransferPickView = (props) => {
    const navigation = useNavigation();
    const { route, t } = props
    const { title } = route.params;
    const go_back = () => {
        navigation.navigate('Wallet');
    }

    const [banks, setBanks] = useState([])
    const [selectedBank, setSelectedBank] = useState(undefined);
    const [selectedAmount, setSelectedAmount] = useState('10000');
    const [selectedName, setSelectedName] = useState('');
    const [selectedNumber, setSelectedNumber] = useState('');

    const { sc } = useWalletStore()
    const { dataTransfer, setDataTransfer } = useTransferStore()



    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
    };

    const handlePayment = () => {
        // Implement payment logic here
        console.log('Payment initiated for bank:', selectedBank, 'amount:', selectedAmount);

        const beAmount = selectedAmount.toString() + '.00'
        // userTopup(sc.merchantId, sc.token, selectedBank, beAmount).then((res) => {
        //     console.log('userTopup res', res)
        //     if (res.result.responseCode = '2009000') {
        //         if (!isObjectEmpty(res.result.additionalInfo)) {

        //             setDataTopup(res.result.additionalInfo)
        //         }
        //         navigation.navigate('TopupDetailView', { data: res.result.additionalInfo, title: 'Topup SpeedCash Detail' })
        //     }
        // }).catch((err) => {
        //     console.log('userDebit err', err)
        // })
        const dt = {
            accountNumber: selectedNumber,
            accountName: selectedName,
            bankCode: selectedBank.code,
            bankName: selectedBank.name,
            amount: beAmount,
            merchantId: sc.merchantId,
            token: sc.token,
            notes: 'Transfer bank via speedcash'
        }
        console.log('udertf', dt)
        userTransferInquiry(dt).then((res) => {
            console.log('userTransferInquiry res', res)
            const pinUrl = res.result.setPinUrl
            const pars = {
                merchantId: sc.merchantId, token: sc.token, referenceNo: res.result.referenceNo, accountNumber: selectedNumber, bankCode: selectedBank.code, amount: beAmount, notes: 'Transfer Bank vis Speedcash', accountName: selectedName, transactionCode: res.result.additionalInfo.transactionCode
            }
            const inquiry = { ...res.result }
            console.log('inquiry const', inquiry)
            userTransfer(pars).then((res) => {
                console.log('usertf', res)
                setDataTransfer({
                    status: res.result.additionalInfo.description,
                    referenceNo: res.result.referenceNo,
                    bankName: inquiry.beneficiaryBankName,
                    accountName: inquiry.beneficiaryAccountName,
                    accountNumber: inquiry.beneficiaryAccountNumber,
                    amount: inquiry.amount.value
                })
                navigation.navigate('TransferDetailView', { title: 'Transfer Detail' })
            }).catch((err) => {
                console.log('userTransfer after inquiry err', err)
            })

            navigation.navigate('WebRender', { url: pinUrl, title: 'Input Pin SpeedCash' })

        }).catch((err) => {
            console.log('userTransfer err', err)
        })
    };

    const call_bank = () => {

        getBankTransfers().then((res) => {

            setBanks(res.result)


        }).catch((err) => console.log('getbanks', err))
    }

    useEffect(() => {
        call_bank()
    }, [])

    // useEffect(() => {
    //     console.log('selected', { selectedName, selectedNumber, selectedAmount, selectedBank, selectedAmount })
    // }, [selectedName, selectedNumber, selectedAmount, selectedBank])


    return <SafeAreaView style={styles.container}>
        <StatusBar
            backgroundColor={colors.theme_bg}
        />
        <View style={[styles.header]}>
            <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
            </TouchableOpacity>
            <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('bank_transfer')}</Text>
            </View>
        </View>
        <View style={{ flex: 1, width: '100%', padding: 15 }} >
            <Text style={styles.amountTitle}>{t('input_bank')}</Text>
            <Picker
                selectedValue={selectedBank}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedBank(itemValue)
                    console.log('picker select', itemValue)
                }
                }
                style={styles.picker}
            >
                <Picker.Item label={t('choose_bank')} value="" />
                {banks.map((bank, index) => (
                    <Picker.Item key={index} label={`${bank.name}   (${bank.code})`} value={bank} />
                ))}
            </Picker>
            <View style={styles.amountContainer}>
                <Text style={styles.amountTitle}>{t('input_account_name')}</Text>
                <View style={styles.amountButtonsContainer}>
                    <TextInput

                        placeholder={t('bank_account_name_placeholder')}
                        value={selectedName}
                        onChangeText={setSelectedName}
                        style={styles.textinput}
                    />
                </View>
            </View>

            <View style={styles.amountContainer}>
                <Text style={styles.amountTitle}>{t('input_account_number')}</Text>
                <View style={styles.amountButtonsContainer}>
                    <TextInput
                        placeholder={t('bank_account_number_placeholder')}
                        value={selectedNumber}
                        onChangeText={setSelectedNumber}
                        style={styles.textinput}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.amountContainer}>
                <Text style={styles.amountTitle}>{t('input_amount')}</Text>
                <View style={styles.amountButtonsContainer}>
                    <TextInput
                        placeholder={t('nominal_placeholder')}
                        keyboardType="numeric"
                        style={styles.textinput}
                        value={selectedAmount}
                        onChangeText={setSelectedAmount}
                    />
                </View>
            </View>


        </View>

        <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
            disabled={selectedBank === '' || selectedAmount === '' || selectedName === '' || selectedNumber === ''}
        >
            <Text style={styles.payButtonText}>{t('transfer')}</Text>
        </TouchableOpacity>
    </SafeAreaView>
}

export default withTranslation(BankTransferPickView);




const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: colors.theme
    },
    header: {
        height: 60,
        backgroundColor: colors.theme_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    picker: {
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: colors.theme_bg_three,
        color: colors.theme_fg_two,
    },
    amountContainer: {
        marginTop: 20,

    },
    amountTitle: {
        fontSize: f_m,
        fontFamily: bold,
        color: colors.theme_fg_two,
        marginBottom: 10,
        marginLeft: 15
    },
    amountButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
    },
    amountButton: {
        backgroundColor: colors.theme_bg_three,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.theme_fg_two,
        width: '48%',
        marginBottom: 10,
        alignItems: 'center',
    },
    selectedAmountButton: {
        backgroundColor: colors.theme_bg,
    },
    amountButtonText: {
        color: colors.theme_fg_two,
        fontSize: f_s,
        fontFamily: regular,
    },
    selectedAmountButtonText: {
        color: colors.theme_fg_three,
        fontFamily: bold,
    },
    payButton: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: colors.theme_bg,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonText: {
        color: colors.theme_fg_three,
        fontSize: f_m,
        fontFamily: bold,
    },

    textinput: {
        fontSize: f_m,
        color: colors.grey,
        fontFamily: regular,
        height: 60,
        backgroundColor: colors.text_container_bg,
        width: '100%',
        paddingLeft: 20
    },

});

