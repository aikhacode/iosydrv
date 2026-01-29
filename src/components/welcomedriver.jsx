import { useEffect, useState } from "react";
import Notif from "./notif";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming, FadeIn, FadeOut } from "react-native-reanimated";
import { mail } from "../config/Constants";
import DropShadow from "react-native-drop-shadow";
import Icon, { Icons } from "./Icons";
import Wooble from "./wooble";

export default function WelcomeDriver({ open, msg = 'Yuk, ayo kita kerja !!' }) {
    const [open_, setOpen_] = useState(open)
    const show = useSharedValue(100)

    useEffect(() => {
        const interval = setTimeout(() => { setOpen_(false) }, 3000)

        return () => interval
    }, [])




    return open_ ? <Animated.View style={[styles.content, { marginLeft: 'auto', marginRight: 'auto' }]} entering={FadeIn} exiting={FadeOut}>

        <DropShadow
            style={{

                marginBottom: 5,
                marginTop: 5,
                shadowColor: "#000",
                shadowOffset: {
                    width: 2,
                    height: 2,
                },
                shadowOpacity: 0.2,
                shadowRadius: 3
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 30, height: 23, backgroundColor: '#0097ff', borderRadius: 5, borderColor: 'blue', borderWidth: 2 }}>
                    <Image source={mail} style={{ width: undefined, height: undefined, flex: 1 }} />

                </View>
                <Text style={{ marginLeft: 10, fontSize: 12 }}>Gama Driver . sekarang</Text>
                <Wooble>
                    <Icon type={Icons.MaterialCommunityIcons} name={"bell-badge"} size={16} style={{ marginLeft: 5 }} color={'black'} />
                </Wooble>
            </View>
        </DropShadow>
        <View>
            <Text style={{ color: 'black', fontSize: 14, width: '100%', marginTop: 5, marginLeft: 15, fontWeight: 'bold' }}>Gama Driver</Text>
            <Text style={{ color: 'black', fontSize: 14, width: '100%', marginTop: 0, marginLeft: 15 }}>{msg}</Text>
        </View>

    </Animated.View> : ''
}

const styles = StyleSheet.create({

    content: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3
    }
})