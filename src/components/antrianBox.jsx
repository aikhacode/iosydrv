import { StyleSheet, View, Text } from "react-native"
import { screenHeight } from "../config/Constants"
import { useEffect } from "react"
import { useAntrianStore } from "../reducers/zustand"

export const AntrianBox = ({ isAntrianRunning, antrianNumber, max }) => {
    const { lostInPool: lost, setLostInPool, setIsAntrianRunning } = useAntrianStore()


    return (
        <>
            {isAntrianRunning &&
                <View style={{ position: 'relative', height: '100%' }}>
                    <View style={{
                        position: 'absolute',
                        bottom: 57,
                        height: 50,
                        left: '15%',
                        width: '75%',
                        backgroundColor: 'rgba(248, 243, 243,0.8)',
                        borderRadius: 10,
                        marginLeft: 10,
                        marginRight: 10
                    }}>
                        <Text style={{ fontStyle: 'italic', fontWeight: 'bold', marginTop: 10, color: 'black', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                            {`Antrian ke ${antrianNumber} dari 473 antrian`}

                        </Text>
                    </View>
                </View>
            }
        </>
    )


}