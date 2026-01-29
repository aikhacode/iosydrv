import { useEffect, useState } from "react";
import Notif from "./notif";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming, FadeIn, FadeOut } from "react-native-reanimated";
import { mail } from "../config/Constants";
import DropShadow from "react-native-drop-shadow";
import Icon, { Icons } from "./Icons";
import Wooble from "./wooble";
import database from "@react-native-firebase/database";
import { useBroadcastStore } from "../reducers/zustand";
import withTranslation from '../hook/withTranslation'

// var Sound = require('react-native-sound');

// Sound.setCategory('Playback');

// var sounder = new Sound('notifmsg.mp3', Sound.MAIN_BUNDLE, (error) => {
//     if (error) {
//         console.log('failed to load the sound', error);
//         return;
//     }
//     // loaded successfully
//     console.log('duration in seconds: ' + sounder.getDuration() + 'number of channels: ' + sounder.getNumberOfChannels());

// });

import SoundPlayer from 'react-native-sound-player';

const playSound = () => {
    try {
        SoundPlayer.playSoundFile('notifmsg', 'mp3');
    } catch (e) {
        console.log('Error playing sound:', e);
    }
};


function Broadcast({ t }) {
    const [open_, setOpen_] = useState(false)
    const [msg, setMsg] = useState('Broadcast message')
    const [name, setName] = useState("")
    const show = useSharedValue(100)
    const { setBroadcast } = useBroadcastStore()

    const call_broadcast = () => {
        database().ref(`broadcasts/drivers/${global.id}`).on('value', (snapshot) => {
            const val = snapshot.val()
            if (val) {
                if (val.live) {
                    setOpen_(true)
                    setMsg(val.message)
                    setName(val.driver_name)
                    setBroadcast(true)

                }
                if (!val.live) {
                    setOpen_(false)
                    setMsg('..')
                    setName('')
                    // setBroadcast(false)
                }
                console.log('changing')
            }
        })
    }

    const deliveBroadcast = () => {
        setOpen_(false)
        database().ref(`broadcasts/drivers/${global.id}`).update({
            live: false
        })

    }

    useEffect(() => {
        const interval = setTimeout(() => {
            deliveBroadcast()
        }, 5000)
        call_broadcast()
        return () => interval



    }, [])

    useEffect(() => {
        if (open_) {
            playSound();

        }
        else {
            SoundPlayer.stop();
        }

    }, [open_])




    return open_ ? <Animated.View style={[styles.content, { marginLeft: 'auto', marginRight: 'auto' }]} entering={FadeIn} exiting={FadeOut} >

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
                <Text style={{ marginLeft: 10, fontSize: 12 }}>{t('gama_driver_now')}</Text>
                <Wooble>
                    <Icon type={Icons.MaterialCommunityIcons} name={"bell-badge"} size={16} style={{ marginLeft: 5 }} color={'black'} />
                </Wooble>
            </View>
        </DropShadow>
        <View>
            <Text style={{ color: 'black', fontSize: 14, width: '100%', marginTop: 5, marginLeft: 15, fontWeight: 'bold' }}>{name}</Text>
            <Text style={{ color: 'black', fontSize: 14, width: '100%', marginTop: 0, marginLeft: 15 }}>{msg}</Text>
        </View>

    </Animated.View> : ''
}

export default withTranslation(Broadcast)

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