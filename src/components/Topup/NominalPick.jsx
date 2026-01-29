
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
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../../assets/css/Colors';
import { screenHeight, screenWidth, bold, regular, api_url, get_about, logo, f_25, f_m, f_l, f_s, f_xl } from '../../config/Constants';
import Icon, { Icons } from '../Icons';
import { getBanks, isObjectEmpty, userDebit, userTopup } from "../../helpersc";
import { Picker } from '@react-native-picker/picker';
import { useTopupTicketStore, useWalletStore } from "../../reducers/wallet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import withTranslation from '../../hook/withTranslation'


const NominalPickView = (props) => {
    const navigation = useNavigation();
    const { route, t } = props
    const { title } = route.params;
    const go_back = () => {
        navigation.navigate('Wallet');
    }

    const [selectedAmount, setSelectedAmount] = useState(50000);
    const [amounts,] = useState([25000, 50000, 100000, 150000, 200000, 250000]);
    const { sc } = useWalletStore()
    const insets = useSafeAreaInsets()

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
    };

    const handlePayment = () => {
        // Implement payment logic here


        const beAmount = selectedAmount.toString() + '.00'

        userDebit(sc.merchantId, sc.token, beAmount).then((res) => {
            console.log('userDebit res', res)
            if (res.result.responseCode = '2005400') {
                if (res.result.webRedirectUrl)
                    navigation.navigate('WebRender', { url: res.result.webRedirectUrl, title: 'Topup SpeedCash' })
            }
        }).catch((err) => {
            console.log('userDebit err', err)
        })


    };


    useEffect(() => {

    }, [])


    return <SafeAreaView style={{
        ...styles.container, top: insets.top,

    }}>
        <StatusBar
            backgroundColor={colors.theme_bg}
        />
        <View style={[styles.header]}>
            <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
            </TouchableOpacity>
            <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('choose_amount')}</Text>
            </View>
        </View>
        <View style={{ flex: 1 }} >


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
            style={{ ...styles.payButton, bottom: 50 + insets.bottom }}
            onPress={handlePayment}
            disabled={!selectedAmount}
        >
            <Text style={styles.payButtonText}>{t('topup')}</Text>
        </TouchableOpacity>
    </SafeAreaView>
}

export default withTranslation(NominalPickView);




const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: colors.theme,

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

