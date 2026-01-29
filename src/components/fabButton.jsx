export const FabButton = ({ onPress }) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.fabButton, styles.shadow]}>
            <Text style={styles.text}>+</Text>
        </TouchableOpacity>
    );

}