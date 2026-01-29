import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid
} from "react-native";
import * as colors from "../assets/css/Colors";
import { bold, location_enable } from "../config/Constants";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { getCurrentLocation, locationPermission } from "../helper";
// import Geolocation from '@react-native-community/geolocation';

const LocationEnable = () => {
  const navigation = useNavigation();
  const enable_gps = async () => {
    // const check = await PermissionsAndroid.check(PERMISSIONS.ACCESS_FINE_LOCATION)
    // console.log('loc permitoin', check)
    // const permit = await locationPermission()
    // if (permit == 'granted') {
    //   console.log('Location Enable', permit)

    getCurrentLocation().then((pos) => {
      console.log('loc enable', pos)
      navigation.navigate("Splash");
    }).catch((error) => console.log(error))
    // }

    // Geolocation.getCurrentPosition(
    //   async (position) => {
    //     navigation.navigate("Splash");
    //   },
    //   (error) => alert("Please try again once"),
    //   { enableHighAccuracy: false, timeout: 10000 },
    // );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: "100%", width: "100%", justifyContent: "center" }}>
        <View style={{ height: 250 }}>
          <LottieView
            style={{ flex: 1 }}
            source={location_enable}
            autoPlay
            loop
          />
        </View>
        <View style={{ margin: 10 }} />
        <View
          style={{ alignItems: "center", justifyContent: "center", margin: 10 }}
        >
          <Text style={{ fontFamily: bold, fontSize: 18, color: colors.green }}>
            Please allow {global.app_name} to enable your GPS for accurate
            pickup.
          </Text>
        </View>
        <View style={{ margin: 20 }} />
        <TouchableOpacity onPress={enable_gps.bind(this)} style={styles.button}>
          <Text style={{ color: colors.theme_fg_three, fontFamily: bold }}>
            Enable GPS
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.theme_bg,
  },
});

export default LocationEnable;
