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
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, bold, regular, api_url, get_about, logo, f_25, f_m, f_l, f_s, f_xl } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import axios from 'axios';
import DropShadow from "react-native-drop-shadow";

const MailBody = ({ route, navigation__ }) => {
    const navigation = useNavigation();
    const [data, setData] = useState("");
    const { message, title, imgUrl } = route.params;


    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {
        console.log('message', message, imgUrl)
    }, []);



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
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>Pesan</Text>
                </View>
            </View>
            <ScrollView>
                <View style={{ margin: 10 }} />
                <DropShadow
                    style={{
                        width: '95%',
                        marginBottom: 0,
                        marginTop: 0,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    <View style={{ flex: 1, backgroundColor: colors.theme_bg_three, padding: 13, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 10 }}>{title}</Text>

                        <Image source={{ uri: imgUrl }} style={{ aspectRatio: 1, resizeMode: 'contain', marginBottom: 10, marginTop: 0 }} />


                        <Text style={{ color: 'black', fontWeight: 'regular' }}>{message}</Text>

                    </View>

                </DropShadow>
            </ScrollView>
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
});

export default MailBody;