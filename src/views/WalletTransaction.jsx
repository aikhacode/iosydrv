import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    FlatList,
    Button,
    Linking
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, img_url, api_url, add_wallet, no_data_loader, income_icon, expense_icon, payment_methods, app_name, wallet, f_xs, f_s, f_m, f_xl, f_30, regular, qrish1, screenWidth, screenHeight, qrish2 } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
// import RazorpayCheckout from 'react-native-razorpay';

import DialogInput from 'react-native-dialog-input';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import Moment from 'moment';


import { connect } from 'react-redux';

import { formatCurrency } from "../helper";

import { ContainerWallet } from "../components/wallet/WalletList";
import { useWalletStore } from "../reducers/wallet";
import { balanceInquiry, bindingInquiry, check_saldo, getPhoneNumber, getToken, unBinding } from "../helpersc";

const WalletTransaction = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [payment_methods_list, setPaymentMethodsList] = useState([]);
    const wallet_ref = useRef(null);
    const [data, setData] = useState([]);
    const [all, setAll] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [receives, setReceives] = useState([]);
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [wallet_amount, setWalletAmount] = useState(0);
    const { cash, credit, sc, setCash, setCredit, setSC } = useWalletStore()
    const [filter, setFilter] = useState(1);
    const isFocused = useIsFocused()
    // const qrish_ref = useRef()




    const go_back = () => {
        navigation.navigate('Home')
    }

    // const close_flutterwave = () => {
    //     setFlutterwaveId({ flutterwave_id: 0 });
    //     wallet_ref.current.close();
    // }



    axios.interceptors.request.use(async function (config) {
        // Do something before request is sent
        //console.log("loading")
        setLoading(true);
        return config;
    }, function (error) {
        //console.log(error)
        setLoading(false);
        console.log("finish loading")
        // Do something with request error
        return Promise.reject(error);
    })

    const open_dialog = () => {
        setDialogVisible(true);
    }

    const close_dialogbox = () => {
        setDialogVisible(false);
    }



    const change_filter = (id) => {
        setFilter(id);
        if (id == 1) {
            setData(all);
        } else if (id == 2) {
            setData(expenses);
        } else if (id == 3) {
            setData(receives);
        }
    }



    const call_sc_flow = () => {
        //binding inquiry to get status binding
        bindingInquiry().then((res) => {
            console.log('bindingInquiry res', res)
            if (res.result.responseCode === '2000800') {
                if (res.result.additionalInfo.status === 1) {

                    // setSC({
                    //     ...sc,
                    //     active: true,
                    //     merchantId: res.result.additionalInfo.merchantId,
                    //     registered: true,
                    // })

                    const tempMerchantId = res.result.additionalInfo.merchantId;

                    // update saldo
                    getToken().then((res) => {
                        console.log('getToken ', res.result.sc_access_token)
                        const tempToken = res.result.sc_access_token;
                        balanceInquiry(tempMerchantId, res.result.sc_access_token).then((res) => {
                            console.log('balanceInquiry res', res)
                            if (res.result.responseCode === "2001100") {
                                setSC({
                                    ...sc,
                                    saldo: res.result.availableBalance.value,
                                    merchantId: tempMerchantId,
                                    token: tempToken,
                                    registered: true,
                                    active: true,
                                })
                            }
                            if (res.result.responseCode === '4011102') {
                                unBinding(tempMerchantId).then((res) => {
                                    console.log('unbinding', res)
                                    setSC({
                                        ...sc,
                                        active: false,
                                        registered: true,
                                        merchantId: res.result.additionalInfo.merchantId,
                                    })
                                })

                            }

                        }).catch((err) => console.log('balanceInquiry err', err))

                        // setSC({
                        //     ...sc,
                        //     token: res.result.sc_access_token,

                        // })
                    }).catch((err) => {
                        console.log('getToken err', err)
                        setSC({
                            ...sc,
                            active: false,
                            registered: true,
                            merchantId: res.result.additionalInfo.merchantId,
                        })
                    })
                }
                if (res.result.additionalInfo.status === 2) {
                    setSC({
                        ...sc,
                        active: false,
                        registered: true,
                        merchantId: res.result.additionalInfo.merchantId,
                    })
                }
            } else if (res.result.responseCode === "4040805") {
                if (res.result.additionalInfo.status === 0) {
                    // "Not Registered"
                    setSC({
                        ...sc,
                        active: false,
                        registered: false,
                    })
                }
            } else if (res.result.responseCode === "4011102") {

            }



        }).catch((err) => {
            console.log('bindingInquiry err', err)
        })




    }



    const call_wallet = () => {
        axios({
            method: 'post',
            url: api_url + wallet,
            data: { id: global.id }
        })
            .then(async response => {
                setLoading(false);
                setWalletAmount(response.data.result.wallet);
                setCash(response.data.result.wallet);
                if (response.data.result.wallet < 0) setCredit(response.data.result.wallet)
                setAll(response.data.result.all);
                setExpenses(response.data.result.expenses);
                setReceives(response.data.result.receives);
                setFilter(1);
                setData(response.data.result.all);

                call_sc_flow()

                // console.log('call wallet', response.data.result.wallet)
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });





    }


    useEffect(() => {
        if (isFocused) {

        }
    }, [isFocused])

    useEffect(() => {
        call_wallet()
    }, [])


    const show_list = ({ item }) => (
        <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 10 }}>
            <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center' }}>
                {item.type == 1 ?
                    <View style={{ height: 35, width: 35 }}>
                        <Image source={income_icon} style={{ flex: 1, height: undefined, width: undefined }} />
                    </View>
                    :
                    <View style={{ height: 35, width: 35 }}>
                        <Image source={expense_icon} style={{ flex: 1, height: undefined, width: undefined }} />
                    </View>
                }
            </View>
            <View style={{ width: '30%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: normal }}>{Moment(item.created_at).format("DD-MMM-YYYY")}</Text>
                <View style={{ margin: 2 }} />
                <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: regular }}>{item.message}</Text>
            </View>
            <View style={{ width: '40%', alignItems: 'flex-end', justifyContent: 'center' }}>
                {item.type == 1 ?
                    <Text style={{ color: colors.success, fontSize: f_s, fontFamily: normal }}>+ {formatCurrency(item.amount)}</Text>
                    :
                    <Text style={{ color: colors.error, fontSize: f_s, fontFamily: normal }}>- {formatCurrency(item.amount)}</Text>
                }
            </View>
        </View>
    );

    const open_qrish_rbsheet = () => {
        // qrish_ref.current.open();
    }

    const [qrish_visible, setQrishVisible] = useState(false)

    const dataView = [
        { id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb2834' }
    ]

    const FlatListRenderItem = () =>
        <View style={{ padding: 20 }}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.text_grey, fontSize: f_s, fontFamily: normal }}>Transactions List</Text>
            <View style={{ margin: 10 }} />
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '33%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={change_filter.bind(this, 1)} style={[filter == 1 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
                        <Text style={[filter == 1 ? styles.segment_active_fg : styles.segment_inactive_fg]}>All</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={change_filter.bind(this, 2)} style={[filter == 2 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
                        <Text style={[filter == 2 ? styles.segment_active_fg : styles.segment_inactive_fg]}>Expenses</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '33%', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={change_filter.bind(this, 3)} style={[filter == 3 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
                        <Text style={[filter == 3 ? styles.segment_active_fg : styles.segment_inactive_fg]}>Receives</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ margin: 10 }} />
            <View style={{ flex: 1 }}>
                {data.length > 0 ?
                    <FlatList
                        data={data}
                        renderItem={show_list}
                        keyExtractor={item => item.id}
                    />
                    : ""

                }
            </View>
        </View>



    const FlatListRender = () =>
        <FlatList


            renderItem={FlatListRenderItem}

            data={dataView}
            keyExtractor={item => item.id}

        />

    return (
        <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>Wallet Transaction</Text>
                </View>
            </View>
            {/* <ScrollView> */}


            <FlatListRender />










        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.theme_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    segment_active_bg: { padding: 5, width: 100, backgroundColor: colors.theme_bg, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
    segment_active_fg: { color: colors.theme_fg_three, fontSize: 14, fontFamily: normal },
    segment_inactive_bg: { padding: 5, width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
    segment_inactive_fg: { color: colors.text_grey, fontSize: 14, fontFamily: normal }
});

function mapStateToProps(state) {
    return {
        paypal_payment_status: state.payment.paypal_payment_status
    };
}

const mapDispatchToProps = (dispatch) => ({
    paypalPaymentStatus: (data) => dispatch(paypalPaymentStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletTransaction);