import { StyleSheet, View, Text } from "react-native"
import withTranslation from '../hook/withTranslation'


export const AntrianLostInPool = ({ t }) => {



    return (
        <>

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
                        {t('lost_in_pool')}

                    </Text>
                </View>
            </View>

        </>
    )


}

export default withTranslation(AntrianLostInPool)