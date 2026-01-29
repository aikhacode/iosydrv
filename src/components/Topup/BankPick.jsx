
//Fixed
import React, { useState, useEffect } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../../assets/css/Colors';
import { screenHeight, screenWidth, bold, regular, api_url, get_about, logo, f_25, f_m, f_l, f_s, f_xl } from '../../config/Constants';
import Icon, { Icons } from '../Icons';
import { getBanks, isObjectEmpty, userTopup } from "../../helpersc";
import { Picker } from '@react-native-picker/picker';
import { useTopupTicketStore, useWalletStore } from "../../reducers/wallet";
import withTranslation from '../../hook/withTranslation'


const BankPickView = (props) => {
    const navigation = useNavigation();
    const { route, t } = props
    const { title } = route.params;
    const go_back = () => {
        navigation.navigate('Wallet');
    }

    const [banks, setBanks] = useState([])
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(50000);
    const [amounts,] = useState([50000, 100000, 150000, 200000, 250000]);
    const { sc } = useWalletStore()
    const { dataTopup, setDataTopup } = useTopupTicketStore()

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
    };

    const handlePayment = () => {
        // Implement payment logic here
        console.log('Payment initiated for bank:', selectedBank, 'amount:', selectedAmount);

        const beAmount = selectedAmount.toString() + '.00'
        // if (sc.saldo < selectedAmount + 50000) {

        //     Alert.alert('Saldo tidak mencukupi')
        //     return
        // }
        userTopup(sc.merchantId, sc.token, selectedBank, beAmount).then((res) => {
            console.log('userTopup res', res)
            if (res.result.responseCode = '2009000') {
                if (!isObjectEmpty(res.result.additionalInfo)) {

                    setDataTopup(res.result.additionalInfo)
                }
                navigation.navigate('TopupDetailView', { data: res.result.additionalInfo, title: 'Topup SpeedCash Detail' })
            }
        }).catch((err) => {
            console.log('usertopup err', err)
        })
    };

    const call_bank = () => {

        getBanks().then((res) => {
            console.log('getbanks', res)
            if (res.result.responseCode === '2009901') {
                setBanks(res.result.additionalInfo)
                setSelectedBank(res.result.additionalInfo[0].code)
            }

        }).catch((err) => console.log('getbanks', err))
    }

    useEffect(() => {
        call_bank()
    }, [])


    return <SafeAreaView style={styles.container}>
        <StatusBar
            backgroundColor={colors.theme_bg}
        />
        <View style={[styles.header]}>
            <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
            </TouchableOpacity>
            <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('choose_bank')}</Text>
            </View>
        </View>
        <View style={{ flex: 1 }} >
            <Picker
                selectedValue={selectedBank}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedBank(itemValue)
                }
                style={styles.picker}
            >
                <Picker.Item label={t('choose_bank')} value="" />
                {banks.map((bank, index) => (
                    <Picker.Item key={index} label={bank.name} value={bank.code} />
                ))}
            </Picker>

            <View style={styles.amountContainer}>
                <Text style={styles.amountTitle}>{t('choose_amount')}</Text>
                <View style={styles.amountButtonsContainer}>
                    {amounts.map((amount) => (
                        <TouchableOpacity
                            key={amount}
                            style={[
                                styles.amountButton,
                                selectedAmount === amount && styles.selectedAmountButton
                            ]}
                            onPress={() => handleAmountSelect(amount)}
                        >
                            <Text style={[
                                styles.amountButtonText,
                                selectedAmount === amount && styles.selectedAmountButtonText
                            ]}>
                                {amount.toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>

        <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
            disabled={!selectedBank || !selectedAmount}
        >
            <Text style={styles.payButtonText}>{t('topup')}</Text>
        </TouchableOpacity>
    </SafeAreaView>
}

export default withTranslation(BankPickView);




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
        marginTop: 20,
        marginHorizontal: 10,
        backgroundColor: colors.theme_bg_three,
        color: colors.theme_fg_two,
    },
    amountContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    amountTitle: {
        fontSize: f_m,
        fontFamily: bold,
        color: colors.theme_fg_two,
        marginBottom: 10,
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
        bottom: 30,
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
});

