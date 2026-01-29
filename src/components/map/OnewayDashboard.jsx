import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { useEffect, useRef, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import * as colors from "../../assets/css/Colors"
import { api_url_driver } from "../../config/Constants"
import { getAddress } from "../../helper"
import axios from "axios"
import { useOnewayDashboardStore } from "../../reducers/zustand"
import withTranslation from '../../hook/withTranslation'

const OnewayDashboard = (props) => {
    const { t } = props
    const navigation = useNavigation()
    const [addressFromGPS, setAddressFromGPS] = useState('')
    const isFocused = useIsFocused()
    const setOnewayFlag = useOnewayDashboardStore((state) => state.setOnewayFlag)
    const onewayFlag = useOnewayDashboardStore((state) => state.onewayFlag)
    const setGPS = useOnewayDashboardStore((state) => state.setGPS)

    const go_back = () => {
        navigation.goBack();
    }
    const bottomSheetRef = useRef(null);



    const handleEdit = () => {
        navigation.navigate('Oneway')
        // bottomSheetRef.current.close()
    }
    const handleOff = () => {
        axios.post(api_url_driver + "onewaygps", {
            get: 3,
            driver_id: global.id,
            latitude: 0,
            longitude: 0,
            place: '-',
        })
            .then((res) => {
                console.log("set one way success", res.data)
                if (bottomSheetRef.current)
                    bottomSheetRef.current.close()


            })
            .catch((err) => console.error("set one way error", err))
            .finally(() => {

            })

    }


    useEffect(() => {
        axios({
            method: 'post',
            url: api_url_driver + 'onewaygps',
            data: {
                get: 1,
                driver_id: global.id,
                latitude: 0,
                longitude: 0,
                place: 'address',
            }
        })
            .then(response => {
                console.log('get one way', response)
                const lat = parseFloat(response.data.gps.latitude)
                const lng = parseFloat(response.data.gps.longitude)

                setGPS({ latitude: lat, longitude: lng })

                getAddress(lat, lng).then(address => {
                    console.log('address', address)
                    setAddressFromGPS(address.formatted_address)
                })
            })
            .catch(error => {
                console.error('get one way error', error)
            });
    }, [isFocused]);

    useEffect(() => {
        console.log('onewayFlag', onewayFlag)
        if (onewayFlag) {
            bottomSheetRef.current.expand()
        } else {
            bottomSheetRef.current.close()
        }
    }, [onewayFlag])

    return (
        <BottomSheet
            ref={bottomSheetRef}
            // onChange={handleSheetChanges}

            snapPoints={['37%', '37%']}

            index={1}
            style={{ zIndex: 5 }}
            enablePanDownToClose={false}

        >

            <BottomSheetView style={styles2.contentContainer} >

                <View style={{ width: '90%', }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{t('one_way_trip')}</Text>
                    <Text style={{ color: 'black', width: '90%' }}>{addressFromGPS}</Text>
                    <View style={{ width: '100%', flexDirection: 'row', gap: 20, marginTop: 15 }}>
                        <TouchableOpacity onPress={handleEdit} activeOpacity={0.5} style=
                            {{ width: '20%', widthmarginTop: 10, height: 35, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.btn_color, borderRadius: 8 }}>
                            <Text style={{ color: colors.theme_fg_three }}>{t('edit')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleOff} activeOpacity={0.5} style=
                            {{ width: '20%', widthmarginTop: 10, height: 35, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.btn_color, borderRadius: 8 }}>
                            <Text style={{ color: colors.theme_fg_three }}>{t('off')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheetView>

        </BottomSheet >)
}



const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
});

export default withTranslation(OnewayDashboard);