import React, { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle, memo, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  PermissionsAndroid,
  Platform,
  StatusBar,
  TouchableOpacity,

  Image,
  Alert,
  Pressable,
} from "react-native";
// import TouchableOpacity from "../components/touch";
import { useNavigation } from "@react-navigation/native";
import { connect, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  normal,
  bold,
  regular,
  screenHeight,
  screenWidth,
  dashboard,
  api_url,
  change_online_status,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  f_s,
  f_tiny,
  f_xs,
  get_heatmap_coordinates,
  img_url,
  vehicle_image_tracking_car,
  pair_car,
  userLocationButton,
  GOOGLE_KEY,
  power_on,
  power_off,
  nav_on,
  refresh3,
  get_profile,
  poweron_lottie,
  loading_lt,
  refresh_lt,
  accept_loader,
  btn_loader,
  poweron_lt,
  poweroff,
  nav_lt,
  vehicle_image_tracking_bike,
  suspended,
  moving_car,
  position_icon,
  vehicle_image_tracking_home,
} from "../config/Constants";
// import FusedLocation from "react-native-fused-location";
import database from "@react-native-firebase/database";
import axios from "axios";
import MapView, { PROVIDER_GOOGLE, Heatmap, Marker, AnimatedRegion } from "react-native-maps";
import * as colors from "../assets/css/Colors";
import Icon, { Icons } from "../components/Icons";
import { changeLocation } from "../actions/ChangeLocationActions";
import {
  initialLat,
  initialLng,
  initialRegion,
} from "../actions/BookingActions";
import DropShadow from "react-native-drop-shadow";
import { animate, formatCurrency, getCurrentLocation, getDistance, getValueOfSnapshot, handleAxiosError, locationPermission, mapDispatchToProps, mapStateToProps, onCenter, } from "../helper";
import MapViewDirections from 'react-native-maps-directions';


import Fairing from "../components/fairing";
import FiturSelector from "../components/fiturselector";
import Geolocation from "@react-native-community/geolocation";
// import Geolocation from "@react-native-community/geolocation";
import { useAntrianStore, useGlobalStore, useOnewayDashboardStore, useProfileStore, useRiderStore, useStore } from '../reducers/zustand';
import { ALERT_TYPE, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

import LottieView from "lottie-react-native";
import Notif from "../components/notif";
import WelcomeDriver from "../components/welcomedriver";
import Broadcast from "../components/broadcast";
import { updateLocationOnFirebase } from "../hook/location";
import { debounce, isObject, map, throttle } from 'lodash';
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { AntrianBox } from "../components/antrianBox";
// import firebase from "../hook/firebase";
import { useIsFocused } from '@react-navigation/native';
import { AntrianLostInPool } from "../components/antrianLostInPool";
// import SmoothTrackingMap from "../components/map/SmoothTrackingMap";
import SmoothMap from "../components/map/SmoothMap";
import OnewayIcon from "../components/map/OnewayIcon";
import OnewayDashboard from "../components/map/OnewayDashboard";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SoundPlayer from 'react-native-sound-player';

axios.interceptors.response.use(
  (response) => response,
  (error) => handleAxiosError(error),
);

const playPowerOff = () => {
  try {
    SoundPlayer.playSoundFile('power_off', 'mp3');
  } catch (e) {
    console.log('Error playing sound:', e);
  }
}

const playPowerOn = () => {
  try {
    SoundPlayer.playSoundFile('power_on', 'mp3');
  } catch (e) {
    console.log('Error playing sound:', e);
  }
}

const Dashboard = (props) => {

  const navigation = useNavigation();

  const marker_ref = useRef(null);
  const map_ref = useRef(null)
  const [marker_coordinates, setMarkerCoordinates] = useState({ ...props.initial_region, longitudeDelta: LONGITUDE_DELTA, latitudeDelta: LATITUDE_DELTA }
  )
  const [loading, setLoading] = useState(false);
  const [switch_value, setSwitchValue] = useState(
    global.live_status == 1 ? true : false,
  );
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [is_show_tab_navigator, setIsShowTabNavigator] = useState(true);
  const [language, setLanguage] = useState(global.lang);
  const [heat_map_coordinates, setHeatMapCoordinates] = useState([]);
  const [today_bookings, setTodayBookings] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [today_earnings, setTodayEarnings] = useState(0);
  const [vehicle_type, setVehicleType] = useState(0);
  const [vehicleTypeName, setVehicleTypeName] = useState('');
  const [sync_status, setSyncStatus] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [map_region, setMapRegion__] = useState({ ...props.initial_region, longitudeDelta: LONGITUDE_DELTA, latitudeDelta: LATITUDE_DELTA });
  const [trigger_booking_request, setTriggerBookingRequest] = useState(0)
  const ref_refresh = useRef(null)
  const ref_poweron = useRef(null)
  const ref_loading = useRef(null)
  const ref_nav = useRef(null)
  const ref_current_map = useRef()
  const { setIsAntrianRunning, currentAntrianNumber: antrianNumber, maxAntrianNumber: countAntrian, setCurrentAntrianNumber, setMaxAntrianNumber, latitude: geoAntrianlat, longitude: geoAntrianlng, setGeo, lostInPool, setLostInPool } = useAntrianStore()
  const isAntrianRunning = useAntrianStore((state) => state.isAntrianRunning)


  const isFocused = useIsFocused();

  const setMapRegion = (region) => {
    // setMarkerCoordinates(new AnimatedRegion(region))
    setMapRegion__(region)
    console.log('Map_region chg set', region)
  }

  const [cameraHeading, setCameraHeading] = React.useState(0);

  const onewayFlag = useOnewayDashboardStore((state) => state.onewayFlag)

  function updateCameraHeading() {
    if (position && position.heading)
      setCameraHeading(position.heading)
  }


  useEffect(() => {
    // if (map_region) {
    //   props.initialRegion(map_region)
    //   props.initialLat(map_region.latitude)
    //   props.initialLng(map_region.longitude)
    // }

    console.log('region chg useeffect', map_region)

  }, [map_region])


  useEffect(() => {
    console.log('isAntrianrun', isAntrianRunning)
  }, [isAntrianRunning])



  // const [dataProfile, setDataProfile] = useState()
  const setDataProfileImageUrl = useProfileStore((state) => state.setDataProfileImageUrl)
  const call_get_profile = () => {
    axios({
      method: 'post',
      url: api_url + get_profile,
      data: { driver_id: global.id, lang: global.lang }
    })
      .then(async response => {
        setDataProfileImageUrl(img_url + response.data.result.profile_picture)
        setIsSuspended(response.data.suspended)

      })
      .catch(error => {

      });
  }

  const profile_picture_url = useProfileStore((state) => state.profile_image_url)

  const [isSuspended, setIsSuspended] = useState(false)
  const [isOpenNotif, setOpenNotif] = useState(false)
  const [suspendText, setSuspendText] = useState('')

  const call_suspended_firebase = () => {
    database().ref(`/suspended/drivers/${global.id}`).on('value', (snapshot) => {
      const susp = snapshot.val()
      console.log('susp', susp)
      if (susp && susp.suspended) {
        console.log('running...', susp.suspended)

        setIsSuspended(susp.suspended)
        if (susp.text)
          setSuspendText(susp.text)

      } else {
        setIsSuspended(false)
      }
    })
  }

  const syncStatusAntrian = (antrian) => {
    if (antrian) {
      let count = 0;
      let index = 0

      Object.keys(antrian).forEach(key => {
        count++
        const id = antrian[key]['driver_id']

        if (Number(id) === Number(global.id)) {
          index = count
        }
      });



      if (index > 0) {
        console.log('syncatrian exist..')
        setCurrentAntrianNumber(index)
        setIsAntrianRunning(true)
      } else {
        console.log('syncatrian donot exist..')
        setIsAntrianRunning(false)
        setCurrentAntrianNumber(0)
      }


      setMaxAntrianNumber(count)

      console.log('sync statusee', global.id, id, index, count)
    } else {
      console.log('syncatrian2 donot exist..')
      setIsAntrianRunning(false)
      setCurrentAntrianNumber(0)
    }
  }

  const getSnapshot = async (path) => {
    try {
      const snapshot = await database().ref(path).once('value');
      const data = snapshot.val();
      console.log('Data snapshot:', data);
      return data;
    } catch (error) {
      console.error('Error getting snapshot:', error);
      return null;
    }
  };

  const updateAntrians = () => {


    //watch
    database().ref(`/antrians/pool`).on('value', (snapshot) => {
      const antrian = snapshot.val()
      console.log('antrian', antrian)
      syncStatusAntrian(antrian)
    })
  }


  useEffect(() => {
    if (isSuspended) {
      setOpenNotif(true)
    }
    if (!isSuspended) {
      setOpenNotif(false)
    }
  }, [isSuspended])

  useEffect(() => {
    call_get_profile()
    call_suspended_firebase()



    setTimeout(function () {

      if (!isSuspended) booking_sync();

    }, 3000);

    const unsubscribe = navigation.addListener("focus", async () => {
      console.log('focus running')
      // const pos = await getCurrentLocation();
      // setMapRegion({ latitude: pos.latitude, longitude: pos.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA });
      console.log('unsubscribe called')
      await call_dashboard();

    });



    if (Platform.OS === "android") {
      request(PERMISSIONS.ANDROID.CAMERA).then((status) => {
        if (status == RESULTS.GRANTED) {
          console.log('Permission camera granted')
        }
      })

      requestLocationPermission();
      // call_dashboard();
    } else {
      getInitialLocation();
    }

    // watchPosition()
    updateAntrians()

    // setTimeout(() => {
    //   navigation.navigate("BookingRequest", {
    //     trip_id: 47233,
    //     autobid: 0
    //   });
    // }, 3000);



    return () => {

      unsubscribe()
    }//interval, 
  }, []);




  useEffect(() => {
    console.log('sync_status', sync_status)
  }, [sync_status])

  axios.interceptors.request.use(
    async function (config) {
      // Do something before request is sent
      //console.log("loading")
      setLoading(true);
      return config;
    },
    function (error) {
      //console.log(error)
      setLoading(false);
      console.log("finish loading");
      // Do something with request error
      return Promise.reject(error);
    },
  );

  const initialize_driver_fb = (vt) => {
    const refDriver = database().ref(`drivers/${vt}/${global.id}`)
    refDriver.on('value', (snapshot) => {
      // const driver_id = snapshot.val() ? snapshot.val().driver_id ? snapshot.val().driver_id : null : null
      // const booking = snapshot.val() ? snapshot.val().booking ? snapshot.val().booking : null : null
      const driver_id = getValueOfSnapshot(snapshot, 'driver_id')
      const booking = getValueOfSnapshot(snapshot, 'booking')
      const d = { driver_id, booking }


      if (!d.driver_id) refDriver.update({ driver_id: Number(global.id) })
      if (!d.booking) database().ref(`drivers/${vt}/${global.id}/booking`).update({ booking_status: 0 })

    })


  }

  const call_get_heatmap_coordinates = async () => {
    await axios({
      method: "post",
      url: api_url + get_heatmap_coordinates,
      data: { zone: global.zone },
    })
      .then(async (response) => {
        setHeatMapCoordinates({ heat_map_coordinates: response.data.result });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleSwitch = (value) => {
    // console.log('toggleSwitch', value)
    if (value) {
      setSwitchValue(value);
      call_change_online_status(1);
    } else {
      setSwitchValue(value);
      call_change_online_status(0);
    }
  };

  const saveData = async (status) => {
    try {
      await AsyncStorage.setItem("online_status", status.toString());
    } catch (e) { }
  };

  const call_dashboard = async () => {
    console.log('calldashboard isantri', isAntrianRunning)
    await axios({
      method: "post",
      url: api_url + dashboard,
      data: { id: global.id },
    })
      .then(async (response) => {
        // console.log('dashboard', { response })
        setLoading(false);
        if (response.data.result.vehicle_type != 0 && vehicle_type == 0) {
          get_location(
            response.data.result.vehicle_type,
            response.data.result.sync_status,
          );
          setVehicleType(response.data.result.vehicle_type);
          setVehicleTypeToStore(response.data.result.vehicle_type)
          setVehicleTypeName(response.data.result.vehicle_type_name);


        }
        setTodayBookings(response.data.result.today_bookings);
        setTodayEarnings(response.data.result.today_earnings);
        setSyncStatus(response.data.result.sync_status);
        setWallet(response.data.result.wallet);
        // console.log('check', response.data.result)
        //============
        check_booking(
          response.data.result.booking_id,
          response.data.result.trip_type,
        );
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const check_booking = (booking_id, trip_type) => {
    console.log('check_booking', { booking_id, trip_type })

    const valid = true
    if (valid)
      if (booking_id != 0 && trip_type != 5) {
        setTimeout(() => {
          navigation.navigate("Trip", { trip_id: booking_id, from: "home" });
        }, 2000);

      } else if (booking_id != 0 && trip_type == 5) {
        setTimeout(function () {
          navigation.navigate("SharedTrip", {
            trip_id: booking_id,
            from: "home",
          });
        }, 2000);
      }
  };

  const call_change_online_status = async (status) => {
    await axios({
      method: "post",
      url: api_url + change_online_status,
      data: { id: global.id, online_status: status, region: props.initial_region },
    })
      .then(async (response) => {
        console.log('canghe online_status', response.data)
        setLoading(false);
        if (response.data.status == 2) {
          setSwitchValue(false);
          global.live_status == 0;
          saveData(0);
          vehicle_details();
        } else if (response.data.status == 3) {
          setSwitchValue(false);
          global.live_status == 0;
          saveData(0);
          vehicle_documents();
        }
        if (response.data.status == 1 && status == 1 && sync_status == 1) {
          global.live_status == 1;
          saveData(1);
          setSwitchValue(true);

        } else {
          global.live_status == 0;
          saveData(0);
          setSwitchValue(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  vehicle_details = () => {
    navigation.navigate("VehicleDetails");
  };

  vehicle_documents = () => {
    navigation.navigate("VehicleDocument");
  };

  // const get_background_location_permission = async () => {
  //   const bg_granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  //     {
  //       title:
  //         app_name + " App Access your location for tracking in background",
  //       message: "Access your location for tracking in background",
  //       buttonPositive: "OK",
  //     },
  //   );
  // };

  const requestLocationPermission = async () => {
    try {


      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title:
            app_name + " App Access your location for tracking in background",
          message: "Access your location for tracking in background",
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // await get_background_location_permission();
        await getInitialLocation();
        // console.log(`${vehicle_type} ${currentGeoLocation.latitude}`)

      }
    } catch (err) {
      alert(strings.sorry_cannot_fetch_your_location);
    }
  };

  // const getInitialLocation = () => { }
  const getInitialLocation = async () => {
    getCurrentLocation().then((coords) => {

      console.log('getInitialLocation', coords)

      props.initialRegion({ ...props.initial_region, heading: coords.heading, latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })
      props.initialLat(coords.latitude)
      props.initialLng(coords.longitude)

      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,

      })



    })

  };

  const [position, setPosition] = useState()
  // const get_location = ((vt, syncStatus) => { })

  const resetCallback = async () => {

    // setLostInPool(true)

    setLostInPool(true)
  }



  const call_not_in_pool = (coords) => {
    // console.log('call_not_in_pool: isAntri', isAntrianRunning)
    // if (isAntrianRunning) {
    //   console.log('call_not_in_pool isAntrian true', isAntrianRunning)
    // axios.delete(`${api_url}antrian/${global.id}`).then(() => {
    //   // setIsAntrianRunning(false)
    //   setLostInPool(true)
    // })
    // }
  }

  const get_location = async (vt, syncStatus) => {

    await requestLocationPermission()

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title:
          { app_name } +
          "access your location in background for get nearest trip requests",
        message:
          { app_name } +
          " needs to access your location in background for get nearest trips, show live location to customers that will be always in use",
      },
    );

    // const gr = await locationPermission()
    // console.log(`${vt} ${currentGeoLocation.latitude}`)


    if (granted && vt != 0) {

      // watchPosition(vt, syncStatus)
      // initialize
      initialize_driver_fb(vt)
      // await getInitialLocation()
      console.log('inside before', isAntrianRunning)



      // if (syncStatus == 1) {
      //   location = position
      //   database().ref(`drivers/${vt}/${global.id}/geo`).update({
      //     lat: location.latitude,
      //     lng: location.longitude,
      //     bearing: location.bearing,
      //   });
      //   // console.log('fusedloc', location)
      //   // update locatin on map
      //   // setMapRegion(currentGeoLocation);
      // }



    }



  };



  const fiturs = useStore((state) => state.fiturs)


  const booking_sync = async () => {
    // console.log('booking #1')
    console.log('booking_sync runnig...', 'sync status=', sync_status)

    console.log('vehicle_type from booking_sync', fiturs.vehicle_actives)

    //
    if (fiturs.length)
      fiturs.map((key) => {
        console.log(key)
        database()
          .ref(`drivers/${key.id}/${global.id}`)
          // .ref('drivers')
          .on("value", (snapshot) => {
            console.log('booking_sync value change-sync_status', sync_status)
            const driversData = snapshot.val()
            // && sync_status === 1
            if (driversData) {

              // if (fiturs.vehicle_actives) {
              console.log('sync status from change', sync_status)
              // Object.keys(driversData).map((key) => {
              //   if (fiturs.vehicle_actives.includes(key)) {
              if (driversData.booking)
                if ((driversData.booking.booking_status == 1) && (driversData.online_status == 1) && driversData.booking.booking_id) {
                  // setTriggerBookingRequest((prev) => prev + 1)
                  navigation.navigate("BookingRequest", {
                    trip_id: driversData.booking.booking_id,
                    autobid: key.autobid === 1
                  });

                }
            }

          });
      })

    //
  };

  const navigate_document_verify = async () => {
    if (sync_status == 2) {
      vehicle_details();
    } else {
      vehicle_documents();
    }
  };

  navigate_rental = () => {
    navigation.navigate("MyRentalRides");
  };

  navigate_wallet = () => {
    navigation.navigate("Wallet");
  };

  call_trip_settings = () => {
    navigation.navigate("TripSettings");
  };

  handlePressOnline = () => {
    console.log('press online')
    if (!isSuspended)
      toggleSwitch(!switch_value); else {

    }

  };

  handleProfileTouch = () => {
    navigation.navigate("Profile");
  }




  const [watchId, setWatchId] = useState(null)



  const mockLocation = {
    origin: {
      latitude: -7.599738,
      longitude: 111.423214,
    },
    destination: {
      latitude: -7.6300614,
      longitude: 111.5074518
    }
  }


  const [isOpenFairing, setIsOpenFairing] = useState(false)
  const [isOpenFitur, setIsOpenFitur] = useState(false)

  const call_change_online_status_all = async (status) => {
    await axios({
      method: "post",
      url: api_url + change_online_status,
      data: { id: global.id, online_status: status, region: props.initial_region },
    })
      .then(async (response) => {

      })
  }

  useEffect(() => {
    if (switch_value) ref_poweron.current.play()
    console.log('sw', switch_value)
  }, [switch_value])


  // 

  const isRiderActive = useRiderStore((state) => state.isRiderActive)
  const setRiderActive = useRiderStore((state) => state.setRiderActive)
  const setVehicleTypeToStore = useRiderStore((state) => state.setVehicleTypeToStore)

  useEffect(() => {

    console.log('isRiderActive', isRiderActive)
  }, [isRiderActive])

  useEffect(() => {
    if (fiturs.length) {
      console.log('fiturs last', fiturs)
      const check = fiturs.filter((el) => (el.id === 4 && el.status))
      if (check.length) {
        setRiderActive(true)
        console.log('set rider active', check)
        setMinimDriverSaldo(check[0].minim_saldo)
      } else {
        setRiderActive(false)
        console.log('set rider nonactive')
        setMinimDriverSaldo(fiturs[0].minim_saldo)
      }
    }

  }, [fiturs])

  const [minim_driver_saldo, setMinimDriverSaldo] = useState(0)

  const call_fairing = () => {
    if (!isSuspended)
      setIsOpenFairing(true); else {

    }
  }

  useEffect(() => { console.log('map_region changed', { map_region, position, cameraHeading }) }, [map_region]);




  const [carPosition, setCarPosition] = useState();

  // {
  //     latitude: map_region.latitude,
  //     longitude: map_region.longitude,
  //     latitudeDelta: 0.005,
  //     longitudeDelta: 0.005,
  //   }

  const animationRef = useRef(null);


  // Convert meters to degrees (approx)
  const metersToDegrees = (meters) => {
    // Earth's radius in meters
    const earthRadius = 6371000;
    // 1 degree ≈ 111,320 meters (latitude)
    return meters / 111320;
  };

  // Generate random coordinates within a small radius of current position
  const getRandomOffset = (currentLat, currentLng) => {
    const radius = metersToDegrees(15) //0.01; // in degrees (~1km)
    const randomAngle = Math.random() * Math.PI * 2;
    const randomRadius = Math.random() * radius;

    return {
      latitude: currentLat + Math.cos(randomAngle),
      longitude: currentLng + Math.sin(randomAngle),
    };
  };

  // Calculate bearing between two points for car rotation
  const calculateBearing = (start, end) => {
    const startLat = start.latitude * Math.PI / 180;
    const startLng = start.longitude * Math.PI / 180;
    const endLat = end.latitude * Math.PI / 180;
    const endLng = end.longitude * Math.PI / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  const [rotation, setRotation] = useState(0);

  // Move car to new random position
  // const moveCar = () => {
  //   const newPosition = getRandomOffset(carPosition.latitude, carPosition.longitude);
  //   const newRotation = calculateBearing(carPosition, newPosition);

  //   setRotation(newRotation);

  //   // Animate the movement
  //   const duration = 5000; // 5 seconds
  //   const startTime = Date.now();
  //   const startPosition = { ...carPosition };

  //   const animate = () => {
  //     const now = Date.now();
  //     const progress = Math.min(1, (now - startTime) / duration);

  //     if (progress < 1) {
  //       setCarPosition({
  //         ...carPosition,
  //         latitude: startPosition.latitude + (newPosition.latitude - startPosition.latitude) * progress,
  //         longitude: startPosition.longitude + (newPosition.longitude - startPosition.longitude) * progress,
  //       });
  //       animationRef.current = requestAnimationFrame(animate);
  //     } else {
  //       setCarPosition(prev => ({
  //         ...prev,
  //         latitude: newPosition.latitude,
  //         longitude: newPosition.longitude,
  //       }));
  //       // Schedule next move
  //       setTimeout(moveCar, Math.random() * 5000 + 2000); // 2-7 seconds delay
  //     }
  //   };

  //   animationRef.current = requestAnimationFrame(animate);
  // };

  // useEffect(() => {
  //   // Start moving when component mounts
  //   moveCar();

  //   // Clean up animation frame on unmount
  //   return () => {
  //     if (animationRef.current) {
  //       cancelAnimationFrame(animationRef.current);
  //     }
  //   };
  // }, []);



  // const [isMoving, setIsMoving] = useState(false);
  // const prevPositionRef = useRef(carPosition);
  // useEffect(() => {
  //   const distance = getDistance(prevPositionRef.current, carPosition);
  //   const movementThreshold = 2; // meters, adjust as needed

  //   if (distance > movementThreshold) {
  //     setIsMoving(true);
  //   } else {
  //     setIsMoving(false);
  //   }

  //   prevPositionRef.current = carPosition;

  //   console.log('carpos', carPosition)
  // }, [carPosition])

  // const radius = 0.0001; // ~11 meters, adjust as needed
  // const center = { latitude: map_region.latitude, longitude: map_region.longitude };
  // const [angle, setAngle] = useState(0);

  // useEffect(() => {
  //   if (!isMoving) {
  //     // moveCar()
  //     const interval = setInterval(() => {
  //       setAngle(prev => {
  //         const newAngle = (prev + 5) % 360; // increase angle by 5 degrees each tick
  //         const rad = (newAngle * Math.PI) / 180;

  //         const newLat = center.latitude + radius * Math.cos(rad);
  //         const newLng = center.longitude + radius * Math.sin(rad);

  //         setCarPosition(prev => ({
  //           ...prev,
  //           latitude: newLat,
  //           longitude: newLng,
  //         }));

  //         return newAngle;
  //       });
  //     }, 1000); // update every 1 second
  //     console.log('not moving')
  //     return () => clearInterval(interval);
  //   }

  // }, [isMoving])

  const [shouldRenderMap, setShouldRenderMap] = useState(true);

  useEffect(() => {
    console.log('ue shouldrendermap', isFocused, shouldRenderMap)
    let timeout = null;
    if (isFocused) {
      timeout = setTimeout(() => {
        setShouldRenderMap(true);
      }, 1000); // delay render to avoid native crash
    } else {
      setShouldRenderMap(false);
    }
    return () => { if (timeout) clearTimeout(timeout) };
  }, [isFocused]);

  const mapRegion = useMemo(() => {
    return map_region
  }, [map_region])

  const markerCoordinates = useMemo(() => marker_coordinates, [marker_coordinates])

  // const MapViewDashboard = useCallback(() => {
  //   const debouncedUpdate = useCallback(debounce((lat, lng, id) => {
  //     console.log('debounce update isAntri', useAntrianStore.getState().isAntrianRunning)
  //     updateLocationOnFirebase({ lat, lng }, id, useAntrianStore.getState().isAntrianRunning, resetCallback);

  //   }, 1000), []) // every 5 seconds

  //   const mapUpdate = async (coords) => {

  //     // // Update rotation based on heading
  //     if (coords.heading !== undefined && coords.heading !== null) {
  //       setRotation(pos.heading);
  //     }
  //     if (marker_ref.current) {
  //       await marker_ref.current.animateMarkerToCoordinate({ latitude: coords.latitude, longitude: coords.longitude }, 500); // 500ms duration
  //       setMarkerCoordinates(coords)
  //     }
  //     // Update map region to follow the marker
  //     if (map_ref.current) {
  //       // await map_ref.current.animateToRegion({ latitude: coords.latitude, longitude: coords.longitude }, 500);
  //       // setMapRegion({ ...map_region, latitude: coords.latitude, longitude: coords.longitude })

  //     }

  //   }

  //   useEffect(() => {
  //     console.log('dashboard render..')
  //     const check = async () => {
  //       await requestLocationPermission()
  //     }

  //     check()

  //     // const watch = Geolocation.watchPosition((position) => {
  //     //   console.log('wl22', position)
  //     //   const pos = position.coords

  //     //   setPosition(position.coords)
  //     //   const newCoordinate = {
  //     //     latitude: pos.latitude,
  //     //     longitude: pos.longitude,
  //     //     latitudeDelta: LATITUDE_DELTA,
  //     //     longitudeDelta: LONGITUDE_DELTA,
  //     //   };



  //     //   // props.initialRegion({ ...props.initial_region, ...pos })
  //     //   // props.initialRegion({ ...props.initial_region, latitude: pos.latitude, longitude: pos.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })

  //     //   // props.initialLat(pos.latitude)
  //     //   // props.initialLng(pos.longitude)
  //     //   setGeo({ latitude: pos.latitude, longitude: pos.longitude })

  //     //   // throttleUpdate({ latitude: pos.latitude, longitude: pos.longitude })

  //     //   // updateCameraHeading()
  //     //   // setCarPosition({ ...carPosition, latitude: pos.latitude, longitude: pos.longitude })
  //     //   setCameraHeading(position.coords.heading)
  //     //   // setMapRegion({ ...map_region, latitude: pos.latitude, longitude: pos.longitude })
  //     //   // animate(pos.latitude, pos.longitude, ref_current_map)



  //     //   mapUpdate(newCoordinate)
  //     //   // if (marker_ref.current) {
  //     //   //   marker_ref.current.animateMarkerToCoordinate(newCoordinate, 500); // 500ms duration
  //     //   // }
  //     //   // // Update map region to follow the marker
  //     //   // if (map_ref.current) {
  //     //   //   map_ref.current.animateToRegion(newCoordinate, 500);
  //     //   // }

  //     //   console.log('tracking ....', pos, fiturs)
  //     //   if (Array.isArray(fiturs) && fiturs.length) {
  //     //     fiturs.map((el) => {
  //     //       if (el.status) {

  //     //         console.log('tracking debounce call isantri', useAntrianStore.getState().isAntrianRunning)
  //     //         // Inside watchPosition:
  //     //         debouncedUpdate(pos.latitude, pos.longitude, el.id);
  //     //       }

  //     //     })

  //     //   }

  //     // }, (err) => console.log('watchLoc err', err), { enableHighAccuracy: true, distanceFilter: 10 })

  //     return () => {
  //       // if (watch)
  //       //   Geolocation.clearWatch(watch)
  //       debouncedUpdate.cancel();
  //       // throttleUpdate.cancel();
  //     }
  //   }, [])

  //   return (
  //     <View style={{ flex: 1 }}>
  //       {/* {shouldRenderMap && */}
  //       <MapView
  //         ref={map_ref}
  //         style={styles.map}
  //         region={map_region}
  //         // loadingEnabled={true}
  //         // initialRegion={map_region}
  //         // onRegionChangeComplete={setMapRegion}
  //         onTouchEnd={() => {
  //           // if (map_ref.current && map_region.latitude && map_region.longitude) {
  //           //   // onCenter(map_ref, map_region);

  //           // }
  //         }}
  //         onTouchCancel={() => {
  //           updateCameraHeading();
  //         }}
  //         onTouchStart={() => {
  //           updateCameraHeading();
  //         }}
  //         onTouchMove={() => {
  //           updateCameraHeading();
  //         }}
  //       >
  //         {/* <Marker coordinate={{ latitude: map_region.latitude, longitude: map_region.longitude }} /> */}
  //         {/* <Image
  //           source={isRiderActive ? vehicle_image_tracking_bike : vehicle_image_tracking_car}
  //           style={{ width: 40, height: 40 }}
  //           resizeMode="contain"
  //         /> */}
  //         <Marker.Animated
  //           ref={marker_ref}
  //           coordinate={marker_coordinates}
  //           anchor={{ x: 0.5, y: 0.5 }}
  //           // rotation={rotation}
  //           image={isRiderActive ? vehicle_image_tracking_bike : vehicle_image_tracking_car}
  //         >

  //         </Marker.Animated>
  //       </MapView>
  //       {/* } */}
  //     </View >
  //   )
  // }, [])

  useEffect(() => {
    console.log('lostinpool', lostInPool)
    if (lostInPool) {
      setTimeout(() => {
        setLostInPool(false)
      }, 4000)
    }
  }, [lostInPool])

  return (

    <AlertNotificationRoot>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.theme_bg} />


        <SmoothMap mapViewRef={map_ref} />

        < View
          style={{
            padding: 15,
            backgroundColor: "",
            flexDirection: "row",
            position: "absolute",
            top: 20,
            right: 0,
          }}
        >

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => handleProfileTouch()} >
              <View style={{ width: 70, height: 70, padding: 0, marginRight: 5 }} >
                <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 35 }} source={{ uri: profile_picture_url }} />

              </View>
            </TouchableOpacity>

            <DropShadow style={{

              marginBottom: 5,
              marginTop: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}>
              <TouchableOpacity onPress={() => call_dashboard()} style={{ backgroundColor: 'white', padding: 4, paddingLeft: 8, paddingRight: 8, borderRadius: 10, flexDirection: 'row', gap: 10 }}>

                <Icon type={Icons.FontAwesome} name="money" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                <Text style={{ color: wallet < 50000 ? 'red' : colors.theme_fg, fontWeight: 'bold', fontSize: 14 }}>{formatCurrency(wallet)}</Text>

              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={() => setIsOpenFitur(!isOpenFitur)} style={{ marginTop: 5, backgroundColor: 'white', padding: 4, paddingLeft: 8, paddingRight: 8, borderRadius: 10, flexDirection: 'row', gap: 10, width: 130, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  {/* <Icon type={Icons.FontAwesome} name="car" color={colors.theme_fg_two} style={{ fontSize: 22 }} /> */}
                  <Text style={{ color: colors.theme_fg, fontWeight: 'bold', fontSize: 14, }}>{switch_value ? 'Online' : 'Offline'}</Text>
                  <Icon type={Icons.AntDesign} name="caretdown" color={colors.theme_bg_blue} style={{ fontSize: 14 }} />
                </View>
              </TouchableOpacity>





            </DropShadow>

          </View>

          <TouchableOpacity
            onPress={() => {
              handlePressOnline()
              if (switch_value) {
                playPowerOff()
              } else {
                playPowerOn()
              }
              // ref_poweron.current.play()
            }
            }
            activeOpacity="0.5"
            style={{ backgroundColor: 'transparent', padding: 8, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 10 }}
          >
            {switch_value ? <View style={{ height: 80, width: 80, }}>
              <LottieView style={{ width: '100%', height: '100%' }} source={poweron_lt} ref={ref_poweron} loop={false} autoPlay={false} />
            </View> : <Image source={poweroff} style={{ width: 46, height: 46 }} />}
            {/* */}



          </TouchableOpacity>

          <OnewayIcon />


        </View>



        <View style={{ position: "absolute", top: 120, width: "100%" }}>

          {wallet <= minim_driver_saldo && (
            <TouchableOpacity
              activeOpacity={1}

              onPress={navigate_wallet.bind(this)}
              style={{
                flexDirection: "row",
                backgroundColor: colors.error_background,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                width: "90%",
                marginLeft: "5%",
              }}
            >
              <Icon
                type={Icons.Ionicons}
                name="wallet"
                style={{ fontSize: 20, color: colors.error }}
              />
              <View style={{ margin: 5 }} />
              <Text
                style={{
                  fontFamily: regular,
                  fontSize: f_xs,
                  color: colors.error,
                }}
              >
                Saldo dompetmu telah mendekati batas minimum penerimaan order. Silakan topup/isi kembali.
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ position: "absolute", alignItems: 'flex-end', bottom: 110, width: "100%", flexDirection: "row" }}>
          <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'space-between', width: '100%' }}>
            <TouchableOpacity

              onPress={() => call_fairing()}
              TouchableOpacity={0.7}
              style={{
                width: 60,
                backgroundColor: colors.btn_color,
                borderRadius: 50,
                height: 60,
                marginLeft: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30

              }}
            >

              <Image source={pair_car} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
            <View >
              <TouchableOpacity

                onPress={() => {
                  // ref_refresh.current.play(); 
                  getCurrentLocation().then((loc) => {
                    console.log('loc', loc)
                    const current_region = { ...map_region, latitude: loc.latitude, longitude: loc.longitude }
                    // setMapRegion(current_region)
                    if (map_ref)
                      onCenter(map_ref, { latitude: loc.latitude, longitude: loc.longitude })
                  })

                  // await call_change_online_status_all(0);
                  // await call_change_online_status_all(1);
                  // ref_refresh.current.pause(); 
                }}
                style={{ paddingLeft: 0, marginRight: 24 }}
              >
                {/* <Image source={refresh3} style={{ width: 55, height: 55, marginLeft: 0, marginBottom: 5, marginRight: 15 }} /> */}
                <View style={{ height: 28, width: 28, backgroundColor: 'white', borderRadius: 40, padding: 2 }}>
                  {/* <LottieView style={{ width: '100%', height: '100%' }} source={refresh_lt} ref={ref_refresh} /> */}

                  <Image source={position_icon} style={{ width: '100%', height: '100%', flex: 1 }} />
                </View>

              </TouchableOpacity>
              <TouchableOpacity

                onPress={async () => {
                  ref_nav.current.play()
                  // onCenter(map_ref, props.initial_region)
                  await call_change_online_status_all(0);
                  await call_change_online_status_all(1);
                  // ref_nav.current.reset()
                }}
                style={{ paddingRight: 7, marginRight: -2 }}
              >
                {/* <Image source={nav_on} style={{ width: 45, height: 45, marginRight: 10 }} /> */}
                <View style={{ height: 50, width: 50 }}>
                  <LottieView style={{ width: '100%', height: '100%' }} source={nav_lt} ref={ref_nav} loop={false} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View >
      {isAntrianRunning && <AntrianBox isAntrianRunning={isAntrianRunning} antrianNumber={antrianNumber} max={countAntrian} />}
      {lostInPool && <AntrianLostInPool />}


      {
        isOpenFairing && <Fairing setStatus={setIsOpenFairing} />
      }
      {
        (isOpenFitur && !onewayFlag) && <FiturSelector setOpen={setIsOpenFitur} />
      }
      {
        isOpenNotif &&
        <Notif setOpen={setOpenNotif} ismodal={true}>

          <View style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center', }}>
            <Image style={{ width: 200, height: 200 }} source={suspended} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>Anda tidak dapat menerima order sementara</Text>
          <Text style={{ color: 'black', fontSize: 18, width: '100%', marginTop: 10, textAlign: 'center', marginBottom: 20 }}>{suspendText}</Text>
        </Notif>
      }

      {switch_value && <WelcomeDriver open={switch_value} />}

      <Broadcast />
      {onewayFlag && <OnewayDashboard />}
    </AlertNotificationRoot >

  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
    width: screenWidth,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
// export default Dashboard