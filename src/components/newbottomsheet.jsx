import React, { useEffect, useRef } from 'react';
import { View, PanResponder, Animated } from 'react-native';

const BottomSheet = ({ children, sliderMinHeight, sliderMaxHeight, isOpen, lockHeight }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const slideAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            Animated.timing(slideAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [isOpen]);

    const panResponder = lockHeight ? {} : PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const newHeight = sliderMaxHeight - gestureState.dy;
            if (newHeight >= sliderMinHeight && newHeight <= sliderMaxHeight) {
                pan.setValue({ x: 0, y: -gestureState.dy });
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > 50) {
                Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            } else {
                Animated.spring(pan, { toValue: { x: 0, y: sliderMaxHeight - sliderMinHeight }, useNativeDriver: false }).start();
            }
        },
    });

    const bottomSheetHeight = lockHeight
        ? sliderMinHeight
        : pan.y.interpolate({
            inputRange: [0, sliderMaxHeight - sliderMinHeight],
            outputRange: [sliderMinHeight, sliderMaxHeight],
            extrapolate: 'clamp',
        });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: bottomSheetHeight,
                transform: [{
                    translateY: slideAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [sliderMaxHeight, 0],
                    })
                }],
            }}
            {...(lockHeight ? {} : panResponder.panHandlers)}
        >
            <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                {children(lockHeight ? () => { } : panResponder.onPanResponderRelease)}
            </View>
        </Animated.View>
    );
};

export default BottomSheet;
