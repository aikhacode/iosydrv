
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
import { useTopupTicketStore } from "../../reducers/wallet";
import { isObjectEmpty } from "../../helpersc";
import { formatCurrency } from "../../helper";
import { useTransferStore } from "../../reducers/zustand";


const TransferDetailView = ({ route }) => {
    const navigation = useNavigation();
    const { title } = route.params;
    const { dataTransfer } = useTransferStore()
    const [detailData, setDetailData] = useState([])
    const go_back = () => {
        navigation.goBack(-3);
    }

    useEffect(() => {
        if (!isObjectEmpty(dataTransfer)) {
            const data = { ...dataTransfer }
            setDetailData([
                {
                    label: 'Status',
                    value: data.status
                },
                {
                    label: 'ReferenceNo',
                    value: data.referenceNo
                },
                {
                    label: 'Bank',
                    value: data.bankName
                },
                {
                    label: 'Nama Rekening',
                    value: data.accountName
                },
                {
                    label: 'Nomor Rekening',
                    value: data.accountNumber
                },
                // {
                //     label: 'Nominal Topup',
                //     value: formatCurrency(dataTopup.amount)
                // },
                {
                    label: 'Amount',
                    value: data.amount
                }
            ])
        }
    }, [dataTransfer])

    const DetailItem = ({ label, value }) => {
        return (
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{label}:</Text>
                <Text style={styles.detailValue}>{value}</Text>
            </View>
        )
    }

    return <SafeAreaView style={styles.container}>
        <StatusBar
            backgroundColor={colors.theme_bg}
        />
        <View style={[styles.header]}>
            <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
            </TouchableOpacity>
            <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{title}</Text>
            </View>
        </View>

        <View style={styles.content}>
            {detailData.map((item, index) => <DetailItem key={index} label={item.label} value={item.value} />)}

        </View>
    </SafeAreaView>
}

export default TransferDetailView;




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
    content: {
        flex: 1,
        padding: 20,
    },
    detailItem: {
        marginBottom: 20,
    },
    detailLabel: {
        fontSize: f_m,
        fontFamily: bold,
        color: colors.theme_fg_two,
        marginBottom: 5,
    },
    detailValue: {
        fontSize: f_l,
        fontFamily: regular,
        color: colors.theme_fg_two,
    },
});

