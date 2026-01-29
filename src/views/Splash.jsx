import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  PermissionsAndroid,

  Text,
  Linking,
  Alert
} from "react-native";
import {
  logo,
  app_settings,
  api_url,
  LATITUDE_DELTA,
  LONGITUDE_DELTA
} from "../config/Constants";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from "../assets/css/Colors";
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
// import { initialLat, initialLng, initialRegion } from '../actions/BookingActions';
import VersionNumber from 'react-native-version-number';
// import Geolocation from '@react-native-community/geolocation';
import { call_get_driver, get_driver_fiturs, getCurrentLocation, mapDispatchToProps, mapStateToProps, translate_driver_fiturs } from "../helper";
import { useDeviceStore, useRiderStore, useStore } from "../reducers/zustand";
import Geolocation from "@react-native-community/geolocation";
import DeviceInfo from 'react-native-device-info';
// import firebase from "@react-native-firebase/app"
import messaging from "@react-native-firebase/messaging"
import useGeolocation from "../components/map/useGeoLocation";
import { useGeolocationStore } from "../reducers/zustand";
import { shallow } from "zustand/shallow";
import { NativeModules } from "react-native";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";

const { FloatingBubble } = NativeModules;





const Splash = (props) => {
  const navigation = useNavigation();
  const app_version_code = VersionNumber.buildVersion;
  const setFiturs = useStore((state) => state.setFiturs)
  const fiturs = useStore((state) => state.fiturs)
  const { setLocation, setHeading } = useGeolocationStore((s) => s, shallow);
  const { location } = useGeolocation();
  const { device: deviceId, setDevice: setDeviceId } = useDeviceStore()

  const setVehicleTypeToStore = useRiderStore((state) => state.setVehicleTypeToStore)

  const startBubble = async () => {
    // On Android 6.0+ you must request SYSTEM_ALERT_WINDOW manually
    if (!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW))) {
      console.log("Need to enable overlay permission manually in settings");
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW);
      if (!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW))) {
        console.log("Overlay permission not granted");

      }
    }

    FloatingBubble.startService();
  }

  const stopBubble = () => {
    FloatingBubble.stopService();
  }

  useEffect(() => {
    if (location) {
      // console.log('initial location', location)
    }
  }, [location])

  useEffect(() => {

    // if (Platform.OS == "android") {

      console.log('call android')
      configure();
      channel_create();
      call_settings();
      // fetch('https://star.gamaindonesian.com/api/driver/coba').then((res) => res.text()).then((res) => console.log('res', res)).catch((err) => console.log('error', err))
      //global.fcm_token = '123456'
      DeviceInfo.getUniqueId().then((uniqueId) => {
        console.log('Unique ID:', uniqueId);
        global.device_id = uniqueId;
        setDeviceId(uniqueId)
      })
    // } else {
    //   global.fcm_token = '123456'
    //   call_settings();
    // }

    if (Platform.OS === 'android')
       startBubble();
  }, []);

  const call_settings = async () => {
    console.log('call_settings running...');

    try {
      console.log('Attempting to fetch from:', api_url + app_settings);

      const response = await axios.get(api_url + app_settings, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Raw response:', response);

      if (response.status === 200) {
        console.log('Response data:', response.data);

        if (Platform.OS === 'android') {
          if (response.data.result && response.data.result.driver_android_latest_version) {
            console.log('Version info:', response.data.result.driver_android_latest_version);

            if (response.data.result.driver_android_latest_version.version_code > app_version_code) {
              console.log('New version available');
              navigate_update_app('https://play.google.com/store/apps/details?id=com.mygama154.gama154driver');
            } else {
              console.log('Current version is up to date');
              home(response.data.result);
            }
          } else {
            console.log('Missing version info in response');
          }
        }

        if (Platform.OS === 'ios') {
          if (response.data.result) {
             
          if (response.data.result.ios_latest_version.version_code > app_version_code) {
            navigate_update_app('https://apps.apple.com/app/com.mygama.gamadriver')
          } else {
            home(response.data.result);
            console.log('version_code', response.data.result.ios_latest_version.version_code, app_version_code)
          }
        
            
          }
        }

      } else {
        console.log('Invalid response structure');
      }
    } catch (error) {
      console.log('Error object:', error);

      if (error.response) {
        console.log('Error data:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      } else if (error.request) {
        console.log('Error request:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
      console.log('Error config:', error.config);

      // Handle error (e.g., show an alert to the user)
      // showErrorToUser('Unable to fetch app settings. Please try again later.');
    }
  };

  // const call_settings = async () => {
  //   console.log('app_setting runiing...')
  //   // await axios({
  //   //   method: 'get',
  //   //   url: api_url + app_settings
  //   // })
  //   //   .then(async response => {
  //   //     console.log('fuck', response.data.result.driver_android_latest_version)
  //   //     if (response.data.result.driver_android_latest_version.version_code > app_version_code) {
  //   //       console.log('version_code', response.data.result.driver_android_latest_version.version_code, app_version_code)
  //   //       navigate_update_app('https://play.google.com/store/apps/details?id=com.mygama154.gama154driver');

  //   //     } else {
  //   //       console.log('version_code', response.data.result.driver_android_latest_version.version_code, app_version_code)
  //   //       home(response.data.result);
  //   //     }
  //   //   })
  //   //   .catch(error => {
  //   //     console.log('error app_settings', error)
  //   //     //alert(strings.sorry_something_went_wrong);
  //   //   });

  //   try {
  //     const response = await axios.get(api_url + app_settings);
  //     console.log('Response:', response.data.result.driver_android_latest_version);

  //     if (response.data.result.driver_android_latest_version.version_code > app_version_code) {
  //       console.log('version_code', response.data.result.driver_android_latest_version.version_code, app_version_code);
  //       navigate_update_app('https://play.google.com/store/apps/details?id=com.mygama154.gama154driver');
  //     } else {
  //       console.log('version_code', response.data.result.driver_android_latest_version.version_code, app_version_code);
  //       home(response.data.result);
  //     }
  //   } catch (error) {
  //     console.log('error app_settings', error);
  //     // Handle error (e.g., show an alert)
  //   }
  // }

  const navigate_update_app = (url) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "AppUpdate", params: { url: url } }],
      })
    );
  }

  const home = async (data) => {
    const id = await AsyncStorage.getItem('id');
    const first_name = await AsyncStorage.getItem('first_name');
    const phone_with_code = await AsyncStorage.getItem('phone_with_code');
    const email = await AsyncStorage.getItem('email');
    const lang = await AsyncStorage.getItem('lang');
    global.live_status = await AsyncStorage.getItem('online_status');
    const profile_picture = await AsyncStorage.getItem('profile_picture');
    global.stripe_key = data.stripe_key;
    global.razorpay_key = data.razorpay_key;
    global.flutterwave_public_key = await data.flutterwave_public_key;
    global.app_name = data.app_name;
    global.language_status = data.language_status;
    global.default_language = data.default_language;
    global.polyline_status = data.polyline_status;
    global.driver_trip_time = data.driver_trip_time;
    global.mode = data.mode;
    global.currency = data.default_currency_symbol;
    global.admin_topup = data.admin_topup;
    global.admin_topup_wa = '62' + data.admin_topup.substring(1);
    //Note
    global.lang = 'en';
    /*if(global.language_status == 1){
       global.lang = await global.default_language;
    }
    if(lang){
      strings.setLanguage(lang);
      global.lang = await lang;
    }else{
      strings.setLanguage('en');
      global.lang = await 'en';
    }
   
   if(global.lang == 'en' && I18nManager.isRTL){
     I18nManager.forceRTL(false);
     await RNRestart.Restart();
   }
   
   if(global.lang == 'ar' && !I18nManager.isRTL){
     I18nManager.forceRTL(true);
     await RNRestart.Restart();
   }*/

    if (id !== null) {
      global.id = id;
      global.first_name = first_name;
      global.phone_with_code = phone_with_code;
      global.email = email;
      global.profile_picture = profile_picture;
      const res = await translate_driver_fiturs(id)
      if (res.ok) {
        console.log('td', res)
        setFiturs(res.result)
      }

      const driverResp = await call_get_driver(id);
      if (driverResp) {
        console.log('call_get_driver', driverResp)
        global.vehicle_type = driverResp.result.vehicle_type;
        setVehicleTypeToStore(driverResp.result.vehicle_type);
        console.log('call_get_driver', driverResp.result.vehicle_type, global.vehicle_type)
      }


      check_location();
    } else {
      global.id = 0;
      check_location();
    }
  }

  // useEffect(() => { console.log('fiturs change', fiturs) }, [fiturs])

  const channel_create = () => {
    // PushNotification.createChannel(
    //   {
    //     channelId: "taxi_booking", // (required)
    //     channelName: "Booking", // (required)
    //     channelDescription: "Taxi Booking Solution", // (optional) default: undefined.
    //     playSound: true, // (optional) default: true
    //     soundName: "uber.mp3", // (optional) See `soundName` parameter of `localNotification` function
    //     importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    //     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    //   },
    //   (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    // );
  }

  const configure = async () => {
    console.log('call configure')
    await messaging().registerDeviceForRemoteMessages()
    const token = await messaging().getToken()
    console.log('fcmtoken', token)
    // const token = "kjashdkjasdkjgsajhgdjasgjdgasjhgdjha"
    global.fcm_token = token
    // PushNotification.configure({
    //   // (optional) Called when Token is generated (iOS and Android)
    //   onRegister: function (token) {
    //     console.log("TOKEN:", token);
    //     global.fcm_token = token.token;
    //   },

    //   // (required) Called when a remote is received or opened, or local notification is opened
    //   onNotification: function (notification) {
    //     console.log("NOTIFICATION:", notification);

    //     // process the notification

    //     // (required) Called when a remote is received or opened, or local notification is opened
    //     notification.finish(PushNotificationIOS.FetchResult.NoData);
    //   },

    //   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    //   onAction: function (notification) {
    //     console.log("ACTION:", notification.action);
    //     console.log("NOTIFICATION:", notification);

    //     // process the action
    //   },

    //   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    //   onRegistrationError: function (err) {
    //     console.error(err.message, err);
    //   },

    //   // IOS ONLY (optional): default: all - Permissions to register.
    //   permissions: {
    //     alert: true,
    //     badge: true,
    //     sound: true,
    //   },

    //   // Should the initial notification be popped automatically
    //   // default: true
    //   popInitialNotification: true,

    //   /**
    //    * (optional) default: true
    //    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    //    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    //    * - if you are not using remote notification or do not have Firebase installed, use this:
    //    *     requestPermissions: Platform.OS === 'ios'
    //    */
    //   requestPermissions: true,
    // });
  }

  const openGeneralSettings = async () => {
    try {
      await Linking.openSettings()
    } catch (error) {
      console.error('Error opening location settings:', error);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {

      // const storageReadGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
      //   title: 'Storage Permission',
      //   message: 'This app needs access to your storage.',
      //   buttonNeutral: 'Ask Me Later',
      //   buttonNegative: 'Cancel',
      //   buttonPositive: 'OK',
      // })

      // const storageWriteGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
      //   title: 'Storage Permission',
      //   message: 'This app needs access to your storage.',
      //   buttonNeutral: 'Ask Me Later',
      //   buttonNegative: 'Cancel',
      //   buttonPositive: 'OK',
      // })

      // const canDrawOverApps = await PermissionsAndroid.check(
      //   PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW
      // );

      // if (!canDrawOverApps) {
      //   try {
      //     await Linking.openSettings();
      //     // or more specific:
      //     // await Linking.openURL('package:' + YOUR_PACKAGE_NAME);
      //     // or use: 'android.settings.action.MANAGE_OVERLAY_PERMISSION'
      //   } catch (err) {
      //     console.warn('Cannot open overlay settings', err);
      //   }
      // }



      const foregroundGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      // Request background location permission
      const backgroundGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message: 'This app needs access to your location in the background.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if ((foregroundGranted === PermissionsAndroid.RESULTS.GRANTED) && (backgroundGranted === PermissionsAndroid.RESULTS.GRANTED)) { //&& backgroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        getInitialLocation();
      } else {
        console.log('Location permission denied');
        try {
          await PermissionsAndroid.openSettings();
        } catch (error) {
          console.log('Error opening settings', error);
          // await openGeneralSettings()
        }
      }
      // try {
      //   const results = await requestMultiple([
      //     // PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      //     // PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      //     PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      //     PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
      //   ])

      //   console.log('permission', results)

      //   if (
      //     // results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted' &&
      //     // results[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted' &&
      //     results[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted' &&
      //     results[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION] === 'granted') {
      //     getInitialLocation();
      //   } else {
      //     // try {
      //     //   await PermissionsAndroid.openLocationSettings();
      //     // } catch (error) {
      //     //   console.log('Error opening settings', error);
      //     await openGeneralSettings()
      //     // }
      //   }


      // } catch (err) {
      //   console.warn(err)
      // }



    }
    if (Platform.OS === 'ios') {
        
      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);

      //  Alert.alert(
        
      //   JSON.stringify(result),
      //   RESULTS.GRANTED === result ? "You can" : "You cannot",
      //  )
     

      if (result === RESULTS.GRANTED) {
        console.log('Location permission granted');
        getInitialLocation();
      } else {
        console.log('Location permission denied');
      }
    }
  };




  const check_location = async () => {
    console.log('check location splash run')
    await requestLocationPermission();
    // await getInitialLocation();
  }

  const getInitialLocation = async () => {
    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
    //   title: 'App needs to access your location',
    //   message: 'App needs access to your location ' +
    //     'so we can let our app be even more awesome.'
    // }
    // );



    // Geolocation.requestAuthorization((success) => {
    getCurrentLocation().then((position) => {
      console.log('splash', position)

      let region = {
        ...position,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      // props.initialRegion(region);
      //heading: location.heading, 
      props.initialRegion({ ...props.initial_region, latitude: position.latitude, longitude: position.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })
      props.initialLat(position.latitude);
      props.initialLng(position.longitude);
      setLocation({ ...position })

      navigate();
    }).catch((error) => {
      console.log('geo current location error', error);
      // navigation.navigate('LocationEnable');
      Alert.alert(
        'Location Error',
        error)  
    })

    // }, (error) => { console.log('loc current err', error) })




  }

  const navigate = () => {
    console.log('navigate from splash to --')
    if (global.id > 0) {
      console.log('navigate from splash to Home')
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    } else {
      console.log('navigate from splash to Checkphone')
      navigation.navigate('CheckPhone')
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [{ name: "CheckPhone" }],
      //   })
      // );
    }
  }
  // console.log('version', VersionNumber)
  return (
    <TouchableOpacity activeOpacity={1} style={styles.backgroundBlue}>
      <StatusBar
        backgroundColor={colors.theme_bg}
      />
      <View style={styles.logo_container}>
        <Image style={styles.logo} source={logo} />
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.gamadev}>By Gama Dev</Text>
        <Text style={styles.gamadevversion}>v {VersionNumber.appVersion}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.theme_bg_three,
  },
  backgroundBlue: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.theme_bg_blue,
  },
  logo_container: {
    height: 196,
    width: 196,
  },
  logo: {
    height: undefined,
    width: undefined,
    flex: 1,
    borderRadius: 0
  },
  bottomView: {
    width: '100%',
    height: 50,
    // backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 3, //Here is the trick

  },
  gamadev: {
    // fontFamily: bold,

    fontSize: 18,
    color: '#FFF',
  },
  gamadevversion: {
    // fontFamily: bold,

    fontSize: 14,
    color: '#FFF',
  }

});



export default connect(mapStateToProps, mapDispatchToProps)(Splash);
