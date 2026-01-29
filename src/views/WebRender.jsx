import WebView from "react-native-webview";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";


const WebRender = ({ route }) => {
    const navigation = useNavigation();
    const { url, title } = route.params;
    const insets = useSafeAreaInsets()
    const go_back = () => {
        navigation.goBack();
    }

    console.log('webrender', { url, title })

    return <SafeAreaView style={{ ...styles.container, }}>
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
        <WebView source={{ uri: url }} style={{ flex: 1, bottom: insets.bottom }} />
    </SafeAreaView>
}

export default WebRender;




const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: colors.theme
    },
    header: {

        height: 80,
        backgroundColor: colors.theme_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
});

