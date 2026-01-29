import { Image, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native"
import { oneway_icon, power_off } from "../../config/Constants"
import { useEffect, useState } from "react"
import database from "@react-native-firebase/database"
import { useIsFocused } from "@react-navigation/native"
import { useOnewayDashboardStore } from "../../reducers/zustand"


const OnewayIcon = () => {
    const [isOneway, setIsOneWay] = useState(false)
    const isFocused = useIsFocused()
    const setOnewayFlag = useOnewayDashboardStore((state) => state.setOnewayFlag)

    useEffect(() => {
        const refDriver = database().ref(`oneway/${global.id}`)
        refDriver.on('value', (snapshot) => {
            const value = snapshot.val()
            console.log('value', value)
            if (value) {

                setIsOneWay(value.enable || false)
                setOnewayFlag(value.enable || false)
            }
        })

    }, [])

    return (
        <TouchableOpacity style={{ ...styles.iconContainer }}>
            {isOneway ? <Image source={oneway_icon} style={{ resizeMode: 'contain', width: 45, height: 45 }} /> : null}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
        position: 'absolute',

        bottom: -50,
        right: 10,
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 50,
        zIndex: 5,
    },
})
export default OnewayIcon