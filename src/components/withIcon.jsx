import { StyleSheet, View } from "react-native"
import Icon from "./Icons"
import { useBroadcastStore } from "../reducers/zustand"
import withTranslation from '../hook/withTranslation'


const WithIcon = (props) => {
    const { name } = props
    const { broadcast } = useBroadcastStore()
    return (
        <View style={styles.container}>
            {name === 'mail' && broadcast && <View style={styles.redCircle} />}
            < Icon {...props} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    redCircle: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        zIndex: 1,
    },
})


export default withTranslation(WithIcon)
