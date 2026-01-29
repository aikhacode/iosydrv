import { Pressable } from "react-native";
import withTranslation from '../hook/withTranslation'

const TouchableOpacity = (props) => {
    return (
        <Pressable style={{ ...props.style, opacity: activeOpacity ? 0.5 : 1 }} onPress={props.onPress} >
            {props.children}
        </Pressable>
    );
};

export default withTranslation(TouchableOpacity);