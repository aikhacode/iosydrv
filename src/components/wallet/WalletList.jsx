import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, LayoutAnimation, Image, Button, Linking, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { formatCurrency } from '../../helper';
import { sc_logo } from '../../config/Constants';
import { useTopupTicketStore, useWalletStore } from '../../reducers/wallet';
import { RevealFromBottomAndroidSpec } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionSpecs';
import { btn_color } from '../../assets/css/Colors';
import { binding, userDebit, userTopup } from '../../helpersc';
import { useNavigation } from '@react-navigation/native';
import { shallow } from 'zustand/shallow';

// const SCItem = memo(({ item, merchantId, navigation }) => {
//     if (item.isSC) {
//         return (item.isRegistered && item.isActive) ? RegisteredSCItem({ item, merchantId, navigation }) : UnregisteredSCItem({ item, merchantId, navigation })
//     } else {
//         return RegisteredSCItem({ item, merchantId, navigation })
//     }



// })


const RegisteredSCItem = ({ item, merchantId, navigation }) => {

    const onPress = () => {
        console.log('RegisteredSCItem', item.label)
        if (item.id === '21') {
            // userDebit(sc.merchantId, sc.token).then((res) => {
            //     console.log('userDebit res', res)
            //     if (res.result.responseCode = '2005400') {
            //         if (res.result.webRedirectUrl)
            //             navigation.navigate('WebRender', { url: res.result.webRedirectUrl, title: 'Topup SpeedCash' })
            //     }
            // }).catch((err) => {
            //     console.log('userDebit err', err)
            // })
            navigation.navigate('NominalPickView', { title: 'Pilih Amount' })
        }

        if (item.id === '22') {
            Alert.alert('Info', 'Fitur QRISH belum tersedia di driver ini')
        }

        if (item.id === '31') {
            console.log('RegisteredSCItem', item.label)
            // navigation.navigate('N', { data: dataTopup, title: 'Topup SpeedCash Detail' })
            // navigation.navigate('BankPickView', { title: 'Pilih Bank' })
            const handleOpenSCApp = () => {
                const url = 'https://play.google.com/store/apps/details?id=com.bm.sc.bebasbayar&referrer=utm_medium%3Dandroid%26utm_content%3Dregistrasi%252520dengan%252520upline%252520150108%26utm_term%3Dupline%26utm_source%3D150108%26utm_campaign%3Dbebasbayar'
                Linking.canOpenURL(url)
                    .then((supported) => {
                        if (supported) {
                            Linking.openURL(url);
                        } else {
                            console.log("Don't know how to open URI: " + url);
                        }
                    })
                    .catch((err) => console.error('An error occurred', err));
            }

            handleOpenSCApp()

            // userTopup(sc.merchantId, sc.token, "MANDIRI", "10000.00").then((res) => {
            //     console.log('userTopup res', res)
            //     if (res.result.responseCode = '2009000') {
            //         if (res.result.additionalInfo) {
            //             setDataTopup(res.result.additionalInfo)
            //         }
            //         navigation.navigate('TopupDetailView', { data: res.result.additionalInfo, title: 'Topup SpeedCash Detail' })
            //     }
            // }).catch((err) => {
            //     console.log('userDebit err', err)
            // })
        }

        if (item.id === '32') {
            // console.log('RegisteredSCItem', item.label)
            navigation.navigate('BankTransferPickView', { title: 'Pilih Bank' })
        }

        if (item.id === '41') {
            navigation.navigate('WalletTransaction')
        }
    }
    return (
        <TouchableOpacity onPress={() => onPress()}>
            <View style={styles.childItem}>

                <Text style={styles.childTitle}>{item.label}</Text>
                {item.amount && <Text style={styles.childAmount}>{item.amount}</Text>}
            </View>
        </TouchableOpacity>
    )
}

const UnregisteredSCItem = ({ item, merchantId, navigation }) => {
    const title = item.isRegistered && !item.isActive ? 'Aktifasi' : 'Daftar'

    const handleOnPress = () => {
        if (item.isRegistered && !item.isActive) {
            binding(merchantId).then((res) => {
                console.log('binding btn', res)
                navigation.navigate('WebRender', { url: res.result.redirectUrl, title: 'Aktivasi SpeedCash' })

            }).catch((err) => {
                console.log('binding err', err)
            })
        } else {
            const url = 'https://play.google.com/store/apps/details?id=com.bm.sc.bebasbayar&referrer=utm_medium%3Dandroid%26utm_content%3Dregistrasi%252520dengan%252520upline%252520150108%26utm_term%3Dupline%26utm_source%3D150108%26utm_campaign%3Dbebasbayar'
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(url);
                    } else {
                        console.log("Don't know how to open URI: " + url);
                    }
                })
                .catch((err) => console.error('An error occurred', err));
        }

    }
    return (
        <View style={styles.buttonAction}>

            <Button

                onPress={() => handleOnPress()}
                title={title}

            />
        </View>
    )
}


const WalletList = ({ walletData }) => {
    const [datass, setDatass] = useState([])
    const { sc } = useWalletStore()
    const { dataTopup, setDataTopup } = useTopupTicketStore()
    const navigation = useNavigation()
    // console.log('WalletList sc val', sc)

    const SCItem = memo(({ item, merchantId, navigation }) => {
        if (item.isSC) {
            return item.isRegistered && item.isActive
                ? <RegisteredSCItem item={item} merchantId={merchantId} navigation={navigation} />
                : <UnregisteredSCItem item={item} merchantId={merchantId} navigation={navigation} />
        } else {
            return <RegisteredSCItem item={item} merchantId={merchantId} navigation={navigation} />
        }
    });

    const RenderChildItem = useCallback(
        ({ item }) => <SCItem item={item} merchantId={sc.merchantId} navigation={navigation} />,
        [sc.merchantId, navigation]
    );



    useEffect(() => {
        if (walletData)
            setDatass(walletData.map(item => {
                item.expanded = false
                // console.log(item)
                return item
                // ({ ...item, expanded: false })
            }))
    }, [walletData])


    const toggleExpand = (id) => {
        // return
        console.log('toogle', datass)
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (Array.isArray(datass)) {
            const tmp = datass.map(item =>
                item.id === id ? { ...item, expanded: !item.expanded } : item
            )
            // console.log('tmp', tmp)
            setDatass(tmp);
        }

    };


    const RenderItemMethod = useCallback(({ item }) =>
    (<View>
        <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.item}>
            {item.type === 'sc' ? <Image source={item.logo} style={{ width: 24, height: 24, marginRight: 0 }} /> : <Icon
                name={item.type === 'credit' ? 'credit-card' : 'wallet'}
                type="material"
                color="#517fa4"
                size={24}
            />}

            <View style={styles.itemContainer}>
                <View style={styles.itemContent}>
                    <Text style={styles.title}>{item.label}</Text>
                    <Text style={styles.amount}>{item.amount}</Text>
                </View>
                <Icon
                    name={item.expanded ? "chevron-up" : "chevron-down"}
                    type="material-community"
                    color="#bbb"
                    size={24}
                />
            </View>
        </TouchableOpacity>
        {item.expanded && item.children && (
            item.children.map((itemchild, idx) => <RenderChildItem item={itemchild} key={idx} />)

        )}
    </View>), [datass])







    useEffect(() => {
        console.log('ue data', datass)
    }, [datass])


    return (

        <>
            {
                datass.map((item, index) => <RenderItemMethod key={index} item={item} />)



            }
        </>


    );

}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        alignItems: 'center',

    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemContent: {
        marginLeft: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
    },
    childItem: {
        padding: 12,
        paddingLeft: 56,
        backgroundColor: '#f9f9f9',
        // backgroundColor: btn_color,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    childTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    childAmount: {
        fontSize: 12,
        color: '#666',
    },
    buttonAction: {
        width: 200,
        padding: 12,
        marginLeft: 45,

    }
});



const ContainerWallet = () => {
    // console.log(cash)
    const [walletData, setWalletData] = useState([]);
    const { cash, credit, sc, setCash, setCredit, setSC } = useWalletStore((state) => state, shallow)

    const defaultLabelSC = 'Topup SpeedCash'
    const getLabelSC = () => {
        if (sc.registered && !sc.active) {
            return 'SpeedCash belum active.'
        }
        if (!sc.registered) {
            return 'Silakan Daftar SpeedCash.'
        }
        return defaultLabelSC
    }

    useEffect(() => {
        console.log('sc change', { cash, credit, sc })
    }, [cash, credit, sc])

    // useEffect(() => {
    //     console.log('containerwallet', { cash, credit, sc })
    //     setWalletData([
    //         {
    //             id: '1', type: 'credit', label: 'Dompet Kredit', show: true, amount: formatCurrency(credit),
    //             children: [{ id: '11', label: 'Hutang anda', amount: formatCurrency(credit) }]
    //         },
    //         {
    //             id: '2', type: 'cash', label: 'Dompet Tunai', show: true, amount: formatCurrency(cash),
    //             children: [{ id: '21', label: 'Topup dengan SpeedCash' }]
    //         },
    //         {
    //             id: '3', type: 'sc', logo: sc_logo, label: 'Dompet SpeedCash', show: true, amount: ((sc.registered && !sc.active) || (!sc.registered)) ? getLabelSC() : formatCurrency(sc.saldo),
    //             children: [
    //                 {
    //                     id: '31', label: getLabelSC(), isRegistered: sc.registered, isActive: sc.active, isSC: true
    //                 },
    //                 // {
    //                 //     id: '32', label: 'Transfer Bank', isRegistered: sc.registered, isActive: sc.active, isSC: true,
    //                 // }
    //             ]
    //         },
    //         {
    //             id: '4', type: 'transaction', label: 'Transaction List', show: true, amount: '',
    //             children: [
    //                 {
    //                     id: '41', label: 'All',
    //                 },
    //                 {
    //                     id: '42', label: 'Expense'
    //                 },
    //                 {
    //                     id: '43', label: 'Receives'
    //                 }
    //             ]
    //         }
    //     ])
    // }, [])

    useEffect(() => {


        setWalletData([
            {
                id: '1', type: 'credit', label: 'Dompet Kredit', show: true, amount: formatCurrency(credit), expanded: true,
                children: [{ id: '11', label: 'Hutang anda', amount: formatCurrency(credit) }]
            },
            {
                id: '2', type: 'cash', label: 'Dompet Tunai', show: true, amount: formatCurrency(cash), expanded: true,
                children: [
                    { id: '21', label: 'Topup dengan SpeedCash' },
                    { id: '22', label: 'Topup dengan QRISH' },
                ]
            },
            {
                id: '3', type: 'sc', logo: sc_logo, label: 'Dompet SpeedCash', show: true, amount: ((sc.registered && !sc.active) || (!sc.registered)) ? getLabelSC() : formatCurrency(sc.saldo), expanded: true,
                children: [
                    {
                        id: '31', label: getLabelSC(), isRegistered: sc.registered, isActive: sc.active, isSC: true
                    },
                    // {
                    //     id: '32', label: 'Transfer Bank', isRegistered: sc.registered, isActive: sc.active, isSC: true,
                    // }
                ]
            },
            {
                id: '4', type: 'transaction', label: 'Transaction List', show: true, amount: 'All, Expense, Receives', expanded: true,
                children: [
                    {
                        id: '41', label: 'All',
                    },
                    {
                        id: '42', label: 'Expense'
                    },
                    {
                        id: '43', label: 'Receives'
                    }
                ]
            }

        ])
    }, [cash, credit, sc])

    return (
        <View style={stylesWallet.container}>


            <WalletList walletData={walletData} />


        </View>
    );
}

const stylesWallet = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#fff',
        // backgroundColor: 'red',
        borderRadius: 10,


    },
    listContainer: {
        flex: 1,
    },
});

export { WalletList, ContainerWallet };

