
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
    FlatList,
    Linking
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../../assets/css/Colors';
import { screenHeight, screenWidth, bold, regular, api_url, get_about, logo, f_25, f_m, f_l, f_s, f_xl, ppob_images } from '../../config/Constants';
import Icon, { Icons } from '../Icons';
import { getBanks, isObjectEmpty, userTopup } from "../../helpersc";
import { Picker } from '@react-native-picker/picker';
import { useTopupTicketStore, useWalletStore } from "../../reducers/wallet";


const PPOBView = ({ route }) => {
    const navigation = useNavigation();
    const [ppobItems, setPPOBItems] = useState([]);

    useEffect(() => {
        // Fetch PPOB items from API or define them here
        const fetchPPOBItems = async () => {
            // Example data
            const items = [
                { id: '1', name: 'Via Speedcash', image: ppob_images.speedcash },
                { id: '2', name: 'Via Gama', image: ppob_images.etiket },
                // { id: '3', name: 'Token PLN', image: ppob_images.pln, icon: 'bolt' },
                // { id: '4', name: 'E-Money', image: ppob_images.emoney, icon: 'bolt' },
                // { id: '5', name: 'E-Toll', image: ppob_images.emoney, icon: 'bolt' },
            ];
            setPPOBItems(items);
        };

        fetchPPOBItems();
    }, []);

    const go_back = () => {
        navigation.navigate('Home')
    }

    const handlePress = (id) => {
        if (id === '1') {
            const url = 'https://play.google.com/store/apps/details?id=com.bm.sc.bebasbayar&referrer=utm_medium%3Dandroid%26utm_content%3Dregistrasi%252520dengan%252520upline%252520150108%26utm_term%3Dupline%26utm_source%3D150108%26utm_campaign%3Dbebasbayar'
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(url);
                    } else {
                        console.log("Don't know how to open URI: " + url);
                    }
                })
        }

        if (id === '2') {
            navigation.navigate('WebRender', {
                url: "https://velotiket.com/gamappob",

                title: 'Gama PPOB',
            });
        }

        // if (id === '3') {
        //     navigation.navigate('PLN')
        // }

        // if (id === '4') {
        //     navigation.navigate('EMoney')
        // }

        // if (id === '5') {
        //     navigation.navigate('ETol')
        // }

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
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>Gama PPOB</Text>
            </View>
        </View>
        <View style={{ flex: 1, padding: 15 }} >
            <FlatList
                data={ppobItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.itemContainer}>
                        <Image source={item.image} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            {/* <Icon type={Icons.MaterialIcons} name={item.icon} color={colors.theme_fg_two} style={{ fontSize: 24 }} /> */}
                            <Text style={styles.itemName}>{item.name}</Text>
                            {/* <Text style={styles.itemPrice}>{item.price}</Text> */}
                        </View>
                    </TouchableOpacity>
                )}
                numColumns={2}
            />
        </View>


    </SafeAreaView>
}

export default PPOBView;




const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: colors.theme
    },
    header: {
        height: 80,
        paddingTop: 20,
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

    itemContainer: {
        flex: 1,
        margin: 10,
        backgroundColor: colors.theme_bg_three,
        borderRadius: 10,
        // overflow: 'hidden',
        padding: 10,

    },
    itemImage: {
        width: 60,
        height: 50,
        margin: 'auto',
        marginBottom: 10,
        marginTop: 10,

    },
    itemDetails: {
        padding: 15,
        // backgroundColor: 'red',
        // height: 70,

    },
    itemName: {
        fontSize: f_m,
        fontFamily: bold,
        color: colors.theme_fg_two,
        textAlign: 'center',
        marginTop: 0,
    },
    itemPrice: {
        fontSize: f_s,
        fontFamily: regular,
        color: colors.theme_fg_two,
    },


});

