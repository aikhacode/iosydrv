import withTranslation from '../hook/withTranslation'

export const FabButton = ({ onPress, t }) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.fabButton, styles.shadow]}>
            <Text style={styles.text}>{t('plus')}</Text>
        </TouchableOpacity>
    );

}

export default withTranslation(FabButton)