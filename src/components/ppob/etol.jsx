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
    FlatList,
    TextInput
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../../assets/css/Colors';
import { screenHeight, screenWidth, bold, regular, api_url, get_about, logo, f_25, f_m, f_l, f_s, f_xl, ppob_images } from '../../config/Constants';
import Icon, { Icons } from '../Icons';
import { formatCurrency, formatNumber } from "../../helper";
import axios from "axios";
import EMoneyPay from "./scpay";
import SCPayment from "./scpay";
// Sample pulsa products


// Sample operator prefixes
const operatorPrefixes = {
    telkomsel: ['0811', '0812', '0813', '0821', '0822', '0852', '0853'],
    indosat: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
    xl: ['0817', '0818', '0819', '0859', '0877', '0878'],
    three: ['0895', '0896', '0897', '0898', '0899'],
    smartfren: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888'],
};



const operatorImages = {
    telkomsel: ppob_images.telkomsel,
    indosat: ppob_images.im3,
    xl: ppob_images.xl,
    three: ppob_images.three,
    smartfren: ppob_images.smartfren,
}

const OrderPartItem = ({ item }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'grey', marginBottom: 10, paddingBottom: 5 }}>
            <Text style={{ color: 'black', fontSize: f_m }}>{item.title}</Text>
            <Text style={{ color: 'green', fontWeight: 'bold', fontSize: f_m, maxWidth: '70%' }}>{item.type === 'price' ? formatCurrency(1 * item.description) : item.description}</Text>
        </View>
    )
}
const OrderPart = ({ order }) => {
    useEffect(() => {
        console.log('order', order)
    }, [order])
    return (
        <View style={{ width: '100%', height: 'auto', backgroundColor: 'white', borderRadius: 10, marginBottom: 10, padding: 10 }}>

            <OrderPartItem item={{ title: 'Tujuan: ', type: "text", description: order.data.results.idpel }} />
            <OrderPartItem item={{ title: 'Product: ', type: "text", description: order.data.results.produk }} />
            <OrderPartItem item={{ title: 'S/N: ', type: "text", description: order.data.results.sn }} />
            <OrderPartItem item={{ title: 'TRXID: ', type: "text", description: order.data.results.trxid }} />
            <OrderPartItem item={{ title: 'Waktu: ', type: "text", description: order.data.results.waktu_trx }} />
            <OrderPartItem item={{ title: 'Status: ', type: "text", description: order.data.results.status }} />
            <OrderPartItem item={{ title: 'Saldo Terpotong: ', type: order.data.results.saldo_terpotong !== "0" ? "price" : "text", description: order.data.results.saldo_terpotong !== "0" ? order.price : "-" }} />

        </View>
    )
}



const ETolComponent = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amountPay, setAmountPay] = useState(0);
    const [operator, setOperator] = useState(null);
    const [error, setError] = useState();
    const [pulsaProducts, setPulsaProducts] = useState(null);
    const [loading, setLoading] = useState(false)
    const [canView, setCanView_] = useState({ payment: false, order: false, listing: true })


    const [order, setOrder] = useState(null)
    const [currentItem, setCurrentItem] = useState(null)
    const navigation = useNavigation()
    const route = useRoute()
    // const tipe = route.params.tipe

    const setCanView = (which, mode) => {
        setCanView_({ ...canView, [which]: mode })
    }

    const PaymentSuccess = () => {
        setCanView_({ payment: false, order: false, listing: false })

        const item = currentItem
        axios({
            method: 'post',
            url: api_url + 'v1/rb/pulsa',
            data: {
                method: 'bayar',
                productid: item.id,
                idpel: phoneNumber,
                etoll: 'YES'

            },
        }).then(response => {
            console.log('buy', response.data)
            setOrder({
                product: item.id,
                price: item.price,
                data: response.data
            })
            setCanView_({ payment: false, order: true, listing: false })

        }).catch(error => {
            alert('Sorry something went wrong')
            console.log('err ppob/products', error)
        })

        // setPaymentMode(false)
        // const item = currentItem
        // axios({
        //     method: 'post',
        //     url: api_url + 'v1/rb/pulsa',
        //     data: {
        //         method: 'bayar',
        //         productid: item.id,
        //         idpel: phoneNumber

        //     },
        // }).then(response => {
        //     console.log('buy', response.data)
        //     setOrder({
        //         product: item.id,
        //         price: item.price,
        //         data: response.data
        //     })
        //     setOrderMode(true)

        // }).catch(error => {
        //     alert('Sorry something went wrong')
        //     console.log('err ppob/products', error)
        // })

    }
    const PaymentPart = ({ amount, phone }) => {
        console.log('payment part')
        return (<View>

            <EMoneyPay amount={amount} phone={phone} />
        </View>
        )
    }


    const go_back = () => {
        navigation.navigate('PPOB')
    }
    const handlePhoneNumberChange = (text) => {
        if (text.length < 8) {
            setError('Phone number must be at least 8 digits or more');

        } else {
            setError('')
        }
        setPhoneNumber(text);
        detectOperator(text);
        // console.log({ text })
    };

    const detectOperator = (number) => {

        setOperator(number);
    };

    const call_operator = (operator) => {
        setLoading(true)
        axios({
            method: 'post',
            url: api_url + 'rb/ppob/pulsa/operator',
            data: { operator: 'etollall', method: 'get', group: 'ETOLL' }, // 'PULSA' | 'DATA'
            // headers: {
            //     'Authorization': 'Bearer ' + global.token
            // }
        })
            .then(response => {
                setLoading(false);
                console.log('called operator', response.data)
                setPulsaProducts(response.data.products.map((data) => {
                    return {
                        id: data.product,
                        name: data.deskripsi,
                        price: data.harga_jual
                    }
                }))
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
                console.log('err ppob/products', error)
            });
    }

    useEffect(() => {
        if (operator) {
            call_operator(operator)
            setCanView_({ payment: false, order: false, listing: true })
        }
        console.log('operator', operator)
    }, [operator, phoneNumber]);



    const handleBuy = (item) => {
        setAmountPay(item.price)
        setCanView_({ payment: true, order: false, listing: false })
        setCurrentItem(item)
        // setOrder({
        //     product: item.id,
        //     price: item.price,
        //     data: response.data
        // })
        // setOrderMode(true)





    }

    const renderProduct = ({ item }) => (
        <TouchableOpacity disabled={error !== ""} onPress={() => handleBuy(item)} style={styles.productItem}>
            <View style={styles.productContent}>

                <Text style={{ color: 'black', fontSize: f_m, textAlign: 'center' }}>{item.name}</Text>
                <Text style={{ color: 'green', marginTop: 10, fontWeight: 'bold', fontSize: f_xl }}>{formatCurrency(item.price)}</Text>
            </View>
        </TouchableOpacity>
    );

    const OperatorView = ({ operator }) => {
        return (
            <View style={styles.operatorImage}>
                <View style={{ width: '100%', height: 'auto', }}>
                    <Image source={operatorImages[operator]} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            </View>
        )
    }

    useEffect(() => {
        console.log({ canView, pulsaProducts })
    }, [canView])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>Gama PPOB | EToll </Text>
                </View>
            </View>
            <View style={{ flex: 1, padding: 15 }} >
                <View style={styles.bodyContent}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <TextInput
                            style={{ ...styles.input, width: operator ? '80%' : '100%' }}
                            placeholder="Enter ID EToll"
                            keyboardType="numeric"
                            value={phoneNumber}
                            onChangeText={handlePhoneNumberChange}


                        />
                        {/* {operator ? <OperatorView operator={operator} /> : null} */}
                    </View>
                    {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}



                    {canView.listing ? <FlatList
                        data={pulsaProducts}
                        keyExtractor={(item) => 'as-' + item.id}
                        renderItem={renderProduct}
                        numColumns={2} /> : ""}
                    {canView.payment && <SCPayment amount={amountPay} phone={phoneNumber} onSuccess={PaymentSuccess} />}

                    {canView.order && <OrderPart order={order} />}


                </View>
            </View>
        </SafeAreaView>

    );
};

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
    bodyContent: {
        padding: 16,
        flex: 1
    },
    input: {
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        fontSize: f_xl,
        color: 'black',
        fontFamily: regular,
        height: 60,
        backgroundColor: colors.text_container_bg,

    },
    operatorImage: {
        width: '20%',
        marginLeft: 10,
        height: 60,
    },
    productItem: {
        flex: 1,
        margin: 5,
        backgroundColor: colors.theme_bg_three,
        borderRadius: 10,
        overflow: 'hidden',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    productContent: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: '#ccc',
        // padding: 5
    },
});

export default ETolComponent;