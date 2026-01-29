import { Pressable } from "react-native";

const TouchableOpacity = (props) => {
    return (
        <Pressable style={{ ...props.style, opacity: activeOpacity ? 0.5 : 1 }} onPress={props.onPress} >
            {props.children}
        </Pressable>
    );
};

export default TouchableOpacity;