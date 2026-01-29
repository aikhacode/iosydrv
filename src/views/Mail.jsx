import React, { useState, useEffect, useRef, useCallback, use } from "react";
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

} from "react-native";
import { useNavigation, CommonActions, useIsFocused } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, my_bookings, api_url, img_url, loader, no_data_loader, cancel, f_s, f_xs, f_tiny, f_xl, screenHeight } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import { Badge } from 'react-native-paper';
import axios from 'axios';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import DropdownAlert, {
    DropdownAlertData,
    DropdownAlertType,
} from 'react-native-dropdownalert';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { formatCurrency } from "../helper";
import database from "@react-native-firebase/database";
import WelcomeDriver from "../components/welcomedriver";
import { useBroadcastStore } from "../reducers/zustand";

const Mails = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [openNotif, setOpenNotif] = useState(false)
    const { setBroadcast } = useBroadcastStore()
    const isFocused = useIsFocused();

    let alt = useRef(
        (_data) => new Promise(res => res),
    );
    const viewableItems = useSharedValue([]);


    const go_back = () => {
        navigation.goBack();
    }


    useEffect(() => {
        if (!isFocused) return;
        call_pesan();
        // console.log('entering [] from mail')

        // database().ref(`broadcasts/drivers/${global.id}`).on('value', (snapshot) => {
        //     const val = snapshot.val()
        //     if (val) {
        //         if (val.live) setOpenNotif(true)
        //         if (!val.live) setOpenNotif(false)
        //         console.log('changing')
        //     }
        // })

    }, [isFocused]);



    axios.interceptors.request.use(async function (config) {
        // Do something before request is sent
        // console.log("loading")
        // setLoading(true);
        return config;
    }, function (error) {
        console.log(error)
        setLoading(false);
        console.log("finish loading")
        // Do something with request error
        return Promise.reject(error);
    });

    const call_pesan = () => {
        console.log('calling...pesan')
        // setLoading(true);
        axios({
            method: 'post',
            url: api_url + 'driver/messages',
            data: { driver_id: global.id, lang: global.lang, }
        })
            .then(response => {

                // setLoading(false);
                setData(response.data.result)
                console.log('call_pesan', response.data)

                database().ref(`broadcasts/drivers/${global.id}`).update({ live: false })
                setBroadcast(false)
            })
            .catch(error => {
                // setLoading(false);
                // alert('Sorry something went wrong')
                alt({
                    type: DropdownAlertType.Error,
                    title: 'Error',
                    message: 'Pesan gagal loading',
                });
            });
    }

    // call_pesan();

    // const navigate = (trip_id, status_name) => {
    //     if (filter == 1) {
    //         navigation.navigate('Trip', { trip_id: trip_id, from: 'trips' })
    //     } else if (filter == 2) {
    //         navigation.navigate('Bill', { trip_id: trip_id, from: 'trips' })
    //     } else if (filter == 3) {
    //         alt({
    //             type: DropdownAlertType.Error,
    //             title: 'Error',
    //             message: 'This trip is' + ' ' + status_name,
    //         });

    //     }
    // }



    // const navigate_home = () => {
    //     navigation.dispatch(
    //         CommonActions.reset({
    //             index: 0,
    //             routes: [{ name: "Home" }],
    //         })
    //     );
    // }

    // type ListItemProps = {
    //     viewableItems: Animated.SharedValue<ViewToken[]>;
    //     item: {
    //         id: number;
    //     };
    // };

    // const ListItem: React.FC<ListItemProps> = React.memo(
    const ListItem = React.memo(
        ({ item, viewableItems }) => {
            // console.log('listitem', item)
            const rStyle = useAnimatedStyle(() => {
                const isVisible = Boolean(
                    viewableItems.value
                        .filter((item) => item.isViewable)
                        .find((viewableItem) => viewableItem.item.id === item.id)
                );
                return {
                    opacity: withTiming(isVisible ? 1 : 0),
                    transform: [
                        {
                            scale: withTiming(isVisible ? 1 : 0.6),
                        },
                    ],
                };
            }, []);
            const get_20_char = (str) => {
                if (str.length > 40) {
                    return str.substring(0, 40) + '...'
                }
                return str
            }
            const handlePress = () => {
                const imageUrl = img_url + item.image
                navigation.navigate('MailBody', { message: item.message, title: item.title, imgUrl: imageUrl })
            }
            return (
                <Animated.View style={[
                    {
                        width: '100%',
                    },
                    // rStyle,
                ]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => handlePress()} style={{ alignItems: 'center', borderRadius: 10, padding: 5 }}>
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
                            }}
                        >
                            <View style={{ flex: 1, backgroundColor: colors.theme_bg_three, padding: 13, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>{item.title}</Text>
                                <Text style={{ color: 'black', fontWeight: 'regular' }}>{get_20_char(item.message)}</Text>

                            </View>
                            <View style={{ bottomBorderWidth: 0.5, borderColor: colors.grey, height: 0.5 }} />
                            <View style={{ flex: 1, backgroundColor: colors.theme_bg_three, padding: 5, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                {/* <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text>{item.message}</Text>

                                </View> */}


                                <View style={{ marginTop: 5, padding: 5, flexDirection: 'row', width: '100%', justifyContent: 'space-between', }}>
                                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: f_tiny, fontFamily: normal, color: colors.text_grey }}>{Moment(item.updated_at).format("DD-MMM-YYYY")} {Moment(item.updated_at).format("hh:mm a")}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: f_tiny, fontFamily: normal, color: 'white', alignSelf: 'flex-end', backgroundColor: colors.btn_color, padding: 3, borderRadius: 5, paddingLeft: 15, paddingRight: 15 }}>Lihat</Text>
                                    </View>
                                </View>
                            </View>
                        </DropShadow>

                    </TouchableOpacity>
                </Animated.View>
            );
        }
    );

    const onViewableItemsChanged = ({ viewableItems: vItems }) => {
        viewableItems.value = vItems;
    };

    const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);


    // console.log('rendeer pesan')

    const [refreshingFL, setRefreshingFL] = useState(false);

    const onRefreshFL = useCallback(() => {
        setRefreshingFL(true);

        // Simulate fetching new data from server
        setTimeout(() => {
            call_pesan()
            setRefreshingFL(false);
        }, 500);
    }, []);

    return (
        <>
            <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>

                <StatusBar
                    backgroundColor={colors.theme_bg}
                />
                <View style={[styles.header]}>
                    <View style={{ width: '5%' }} />
                    <TouchableOpacity activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>Pesan</Text>
                    </TouchableOpacity>
                </View>

                {loading ?
                    <View style={{ height: 100, width: 100, alignSelf: 'center', marginTop: '30%' }}>
                        <LottieView style={{ flex: 1 }} source={loader} autoPlay loop />
                    </View>
                    :
                    <View>
                        {/* <ScrollView style={{ height: screenHeight * 0.8 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['white']}
                                    progressBackgroundColor={'#0b8df9'}
                                />
                            }
                        > */}
                        {data.length > 0 ?
                            <FlatList
                                data={data}
                                contentContainerStyle={{ paddingTop: 5 }}
                                viewabilityConfigCallbackPairs={
                                    viewabilityConfigCallbackPairs.current
                                }
                                renderItem={({ item }) => {
                                    return <ListItem item={item} viewableItems={viewableItems} />;
                                }}

                                keyExtractor={(item, index) => { return index }}

                                refreshing={refreshingFL}
                                onRefresh={onRefreshFL}

                            />
                            :
                            ''
                        }
                        {/* </ScrollView> */}
                    </View>
                }
                <View style={{ margin: 40 }} />

                <DropdownAlert alert={func => (alt = func)} />

            </SafeAreaView>
            <WelcomeDriver open={openNotif} />
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.lite_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    segment_active_bg: { width: '33%', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: colors.theme_bg, borderRadius: 10 },
    segment_active_fg: { color: colors.theme_fg_two, fontSize: 12, fontFamily: bold, color: colors.theme_fg_three },
    segment_inactive_bg: { width: '33%', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: colors.theme_bg_three, borderRadius: 10 },
    segment_inactive_fg: { color: colors.theme_fg_two, fontSize: 12, fontFamily: normal, color: colors.theme_fg_two }
});

export default Mails;