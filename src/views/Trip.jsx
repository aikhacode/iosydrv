import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  FlatList,
  Linking,
  Platform,
  Image,
  Alert,
  Modal,
  Pressable
} from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, normal, bold, regular, trip_details, api_url, change_trip_status, GOOGLE_KEY, btn_loader, LATITUDE_DELTA, LONGITUDE_DELTA, trip_cancel, loader, f_xs, f_m, f_s, vehicle_image_tracking_car, img_url, logo, logo2, pin_map, AUTO_COMPLETED_TRIP_END_MS, vehicle_image_tracking_bike, oneway_icon } from '../config/Constants';
import BottomSheet from 'react-native-simple-bottom-sheet';
import Icon, { Icons } from '../components/Icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import { Badge } from 'react-native-paper';
import axios from 'axios';
// import Dialog from "react-native-dialog";
import { connect } from 'react-redux';
import DialogInput from 'react-native-dialog-input';
import DropdownAlert, {
  DropdownAlertData,
  DropdownAlertType,
} from 'react-native-dropdownalert';
import DropShadow from "react-native-drop-shadow";
import database from '@react-native-firebase/database';
import { autoCompletedInSeconds, call_update_tol_parkir, formatCurrency, getCoordsFromDirection, getCurrentLocation, locationPermission, reAdjustTripStatusName } from "../helper";
import { SwipeButton } from "@arelstone/react-native-swipe-button"
import Wooble from "../components/wooble";
import FormTolNParkir from "../components/tollPark";
import { useFormTolParkirStore, useRiderStore } from "../reducers/zustand";
import MapViewDirections from "react-native-maps-directions";
import useGeolocation from "../components/map/useGeoLocation";
import { shallow } from "zustand/shallow";
// import BottomSheet from "../components/newbottomsheet";
import withTranslation from '../hook/withTranslation'





const Trip = (props) => {
  const { t } = props;
  const navigation = useNavigation();
  const route = useRoute();
  let alt = useRef(
    (_data) => new Promise(res => res),
  );
  const [trip_id, setTripId] = useState(route.params.trip_id);
  const [from, setFrom] = useState(route.params.from);
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancel_loading, setCancelLoading] = useState(false);
  const [on_load, setOnLoad] = useState(0);
  const [cancellation_reason, setCancellationReasons] = useState([]);
  const [dialog_visible, setDialogVisible] = useState(false);
  const [otp_dialog_visible, setOtpDialogVisible] = useState(false);
  const [pickup_statuses, setPickupStatuses] = useState([1, 2]);
  const [drop_statuses, setDropStatuses] = useState([3, 4]);
  const [cancellation_statuses, setCancellationStatuses] = useState([6, 7]);
  const { dataForm } = useFormTolParkirStore()
  const map_ref = useRef();


  const [currentTripStatus, setCurrentTripStatus] = useState(0)
  const [tripDropStatus, setTripDropStatus] = useState({
    title: '',
    permittedNextStatus: true,
    tujuan: 1
  })

  const { location, heading, isTracking, startTracking, stopTracking } = useGeolocation();
  const { isRiderActive } = useRiderStore((state) => state.isRiderActive)
  const [polylines, setPolylines] = useState([]);
  const [region, setRegion] = useState({
    ...location,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });


  const go_back = () => {
    if (from == 'home') {
      navigation.navigate('Dashboard')
    } else {
      navigation.goBack();
    }
  }


  useEffect(() => {
    // getCurrentLocation().then((coords) => {
    //   setRegion(coords)
    // })
    call_trip_details()
    const onValueChange = database().ref(`/trips/${trip_id}`)
      .on('value', snapshot => {
        if (snapshot)
          if (snapshot.val() && data.trip) {
            console.log('from use effect', { sp: snapshot.val(), data })
            if (snapshot.val().status != data.trip.status) {
              call_trip_details();

            }
          }
      });

    // console.log('ue render []', currentTripStatus)

    // return (
    //   // onValueChange
    // );

    startTracking()



    return () => {
      stopTracking()
    }
  }, []);

  const call_get_direction = useCallback((data) => {
    if (data.trip) {
      getCoordsFromDirection(`${data.trip.pickup_lat},${data.trip.pickup_lng}`, `${data.trip.drop_lat},${data.trip.drop_lng}`)
        .then((coords) => {
          console.log('coords call get directions', coords)
          setPolylines(coords)
        })
    }
  }, [data])

  useEffect(() => {
    call_get_direction(data)
  }, [data])

  useEffect(() => {
    console.log('ue status chnaged', currentTripStatus)
  }, [currentTripStatus])

  axios.interceptors.request.use(async function (config) {
    // Do something before request is sent
    // console.log("loading")
    setLoading(true);
    // setCancelLoading(true);
    return config;
  }, function (error) {
    console.log(error)
    setLoading(false);
    // setCancelLoading(false);
    console.log("finish loading")
    // Do something with request error
    return Promise.reject(error);
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [tripDropStatus])

  const call_trip_details = async () => {

    axios({
      method: 'post',
      url: api_url + trip_details,
      data: { trip_id: trip_id }
    })
      .then(async response => {
        setCurrentTripStatus(parseInt(response.data.result.trip.status))

        setLoading(false);
        if (response.data.result.trip.status == 5 && from == 'home') {
          navigation.navigate('Bill', { trip_id: trip_id, from: from });
        } else if (cancellation_statuses.includes(parseInt(response.data.result.trip.status)) && from == 'home') {
          navigate_home();
        }

        console.log('zonasi', response.data.result.trip.zone)
        console.log('trip data', response.data.result.trip)

        if ((response.data.result.trip.status >= 1) && (response.data.result.trip.zone == 1)) {
          // if ((response.data.result.trip.status >= 3)) {
          // console.log('start auto completed')
          // autoCompletedInSeconds(() => {
          //   let completed = true
          //   check_otp(completed)
          //   console.log('auto completed run ... ')
          // }, AUTO_COMPLETED_TRIP_END_MS)
        }


        console.log('from call_trip_details', response.data.result)
        setData(response.data.result);

        setCancellationReasons(response.data.result.cancellation_reasons);
        setOnLoad(1);
        if (parseInt(response.data.result.trip.status) == 3) {
          setTripDropStatus({ permittedNextStatus: false, title: 'Sampai Tujuan 1', tujuan: 1 })
        }

      })
      .catch(error => {
        setLoading(false);
      });
  }

  const check_otp = (completed = false) => {
    // alert('check otp floew')
    // if (data.trip.new_status.id == 3) {
    // setOtpDialogVisible(true);
    if (tripDropStatus.permittedNextStatus)
      onRegionChange(completed);

    if (!tripDropStatus.permittedNextStatus) {

      const stops = data.trip.stops;
      const length = stops.length
      console.log('checkotp', { tripDropStatus, length, stops })
      if (length >= tripDropStatus.tujuan) {
        setLoading(true)
        setTripDropStatus({ permittedNextStatus: tripDropStatus.tujuan == length ? true : false, title: `Sampai Tujuan ${tripDropStatus.tujuan + 1}`, tujuan: tripDropStatus.tujuan + 1 })
      } else {
        setLoading(true)
        setTripDropStatus({ permittedNextStatus: true, title: ``, tujuan: 0 })
      }


    }
    // } else {
    // onRegionChange();
    // }
  }


  const onRegionChange = async (completed = false) => {
    console.log('regionchange', region)
    // alert(JSON.stringify(region))
    // fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + props.change_location.latitude + ',' + props.change_location.longitude + '&key=' + GOOGLE_KEY)
    // const permition = await locationPermission()
    // if (permition == 'granted') {
    //   console.log(permition)
    //   const position = await getCurrentLocation()
    //   console.log(position)
    // }


    // 

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + region.latitude + ',' + region.longitude + '&key=' + GOOGLE_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        // alert('1')

        if (responseJson.results[2].formatted_address != undefined) {
          // console.log('response json', responseJson.results[2].formatted_address)
          console.log(region, props.initial_region, props.change_location)
          // alert('2')
          // setRegion({
          //   // latitude: props.change_location.latitude,
          //   // longitude: props.change_location.longitude,
          //   latitude: position.latitude,
          //   longitude: position.longitude,
          //   latitudeDelta: LATITUDE_DELTA,
          //   longitudeDelta: LONGITUDE_DELTA,
          // })
          call_change_trip_status(responseJson.results[2].formatted_address, completed);
        }
      }).catch((error) => {
        console.log('error onregionchange', error)
      });
  }

  const call_change_trip_status = async (address, completed = false) => {
    // alert('call cts')
    await axios({
      method: 'post',
      url: api_url + change_trip_status,
      data: { trip_id: trip_id, status: completed ? 5 : data.trip.new_status.id, address: address, lat: props.initial_region.latitude, lng: props.initial_region.longitude }
    })
      .then(async response => {
        console.log('cts done', response)
        call_trip_details();
      })
      .catch(error => {
        console.log('cts error', error)
        setLoading(false);
      });
  }

  const showDialog = () => {
    setDialogVisible(true);
  }

  const call_trip_cancel = async (reason_id, type) => {
    setDialogVisible(false)
    setCancelLoading(true)
    console.log({ trip_id: trip_id, status: 7, reason_id: reason_id, cancelled_by: type })
    await axios({
      method: 'post',
      url: api_url + trip_cancel,
      data: { trip_id: trip_id, status: 7, reason_id: reason_id, cancelled_by: type }
    })
      .then(async response => {
        setCancelLoading(false)
        console.log('success')
        call_trip_details();
      })
      .catch(error => {
        //alert(error)
        setCancelLoading(false);
      });
  }

  const navigate_home = () => {
    navigation.navigate('Home');
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: "Home" }],
    //   })
    // );
  }

  const call_dialog_visible = () => {
    setDialogVisible(false)
  }

  const verify_otp = async (val) => {
    if (val == data.trip.otp) {
      setOtpDialogVisible(false);
      await onRegionChange();
    } else {
      alt({
        type: DropdownAlertType.Error,
        title: 'Validation error',
        message: 'Enter valid otp.',
      });

      closeOtpDialog();
    }
  }

  const closeOtpDialog = () => {
    setOtpDialogVisible(false)
  }



  const redirection = () => {

    var stops = data.trip.stops;
    // var waypoints = '&waypoints=';
    // stops.map((stop) => {
    //   waypoints = waypoints + '' + stop.latitude + ',' + stop.longitude + '|'
    // })
    // if (stops.length) {
    //   if (stops.length <= 1) waypoints = ''
    //   if (stops.length > 1) waypoints = waypoints.slice(0, waypoints.length - 2)
    // }

    var lat = 0;
    var lng = 0;

    if (pickup_statuses.includes(parseInt(data.trip.status))) {
      lat = data.trip.pickup_lat;
      lng = data.trip.pickup_lng;
    } else {
      if (!tripDropStatus.permittedNextStatus) {
        lat = stops[tripDropStatus.tujuan - 1].latitude
        lng = stops[tripDropStatus.tujuan - 1].longitude
      } else {
        lat = data.trip.drop_lat;
        lng = data.trip.drop_lng;
      }


    }

    if (lat != 0 && lng != 0) {
      var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
      var url = scheme + `${lat},${lng}`;
      if (Platform.OS === 'android') {


        const url_link = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng + '&travelmode=driving'
        const url_app = "google.navigation:q=" + lat + " , " + lng + "&mode=d"
        console.log('url_link', stops, url_link, url_app)
        // Linking.openURL("google.navigation:q=" + lat + " , " + lng + "&mode=d");

        Linking.openURL(url_app);
      } else {
        const url_link = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng + '&travelmode=driving'
        // console.log('url_link', url_link)
        Linking.openURL(url_link);
      }
    }
  }

  const call_customer = (phone_number) => {
    Linking.openURL(`tel:${phone_number}`)
  }

  const call_chat = (data) => {
    navigation.navigate("Chat", { data: data, trip_id: trip_id })
  }

  useEffect(() => { console.log('data', data) }, [data])
  useEffect(() => { updateCameraHeading() }, [region])

  const marker_ref = useRef()

  const [cameraHeading, setCameraHeading] = React.useState(0);

  function updateCameraHeading() {
    // const map = map_ref.current;
    // map.getCamera().then((info) => {
    //   setCameraHeading(info.heading);
    // });
  }

  // const MapDirectionStatic = useCallback(({ data }) => <MapViewDirections

  //   origin={{ latitude: parseFloat(data.trip.pickup_lat), longitude: parseFloat(data.trip.pickup_lng) }}
  //   destination={{ latitude: parseFloat(data.trip.drop_lat), longitude: parseFloat(data.trip.drop_lng) }}
  //   apikey={GOOGLE_KEY}
  //   strokeWidth={3}
  //   strokeColor="orange"
  //   // waypoints={getWayPoints(drop_address_state)}
  //   optimizeWaypoints={true}
  //   onStart={(params) => {
  //     console.log(`Started routing between`, params);
  //   }}
  //   onReady={result => {

  //     // fetchTime(result.distance, result.duration),
  //     console.log('mapdir', result.coordinates)
  //     // map_ref.current.fitToCoordinates(result.coordinates, {
  //     //   edgePadding: {
  //     //     right: 10,
  //     //     bottom: 300,
  //     //     left: 10,
  //     //     top: 10,
  //     //   },
  //     // });
  //   }}
  //   onError={(errorMessage) => {
  //     console.log('GOT AN ERROR map perjalanan');
  //   }}
  // >

  // </MapViewDirections>, [data])

  useEffect(() => {
    if (location && map_ref && map_ref.current) {
      map_ref.current.animateCamera({
        center: location,
        pitch: 0,
        altitude: 1000,
      }, { duration: 300 });
    }

    if (location && marker_ref && marker_ref.current) {
      if (location.latitude && location.longitude)
        marker_ref.current.animateMarkerToCoordinate(location);
      // console.log('location', location)
    }

  }, [location]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.theme_bg}
      />
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={map_ref}
        style={styles.map}
        initialRegion={region}
      // showsMyLocationButton={true}
      // showsUserLocation={true}

      >

        {data && location && (<Marker
          image={Number(global.vehicle_type) === 4 ? vehicle_image_tracking_bike : vehicle_image_tracking_car}
          ref={marker_ref}
          rotation={heading || 0}

          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={{ latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude) }}></Marker>)}
        {data && location && (<Marker
          coordinate={{ latitude: parseFloat(data.trip.drop_lat), longitude: parseFloat(data.trip.drop_lng) }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Image
              source={oneway_icon}
              style={{ width: 40, height: 40, flex: 1, resizeMode: 'contain' }}
            />
          </View>
        </Marker>)}
        <Polyline coordinates={polylines} strokeWidth={5} strokeColor="orange" />


      </MapView>
      {on_load == 1 &&
        <View>
          {from == 'trips' &&
            <View style={{ flexDirection: 'row' }}>
              <DropShadow
                style={{
                  width: '50%',
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 25,
                }}
              >
                <TouchableOpacity activeOpacity={0} onPress={go_back.bind(this)} style={{ width: 40, height: 40, backgroundColor: colors.theme_bg_three, borderRadius: 25, alignItems: 'center', justifyContent: 'center', top: 20, left: 20 }}>
                  <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.icon_active_color} style={{ fontSize: 22 }} />
                </TouchableOpacity>
              </DropShadow>
            </View>
          }
        </View>
      }
      <BottomSheet sliderMinHeight={310} sliderMaxHeight={screenHeight} isOpen lockHeight={true}>
        {(onScrollEndDrag) => (
          <View onScrollEndDrag={onScrollEndDrag}>
            <View style={{ padding: 30, paddingTop: 0, paddingRight: 0, paddingLeft: 0, }}>
              {on_load == 1 ?
                <View>
                  <TouchableOpacity onPress={redirection.bind(this)} activeOpacity={1}>
                    <View style={{
                      position: 'relative', flexDirection: 'row',

                      justifyContent: 'space-between',
                      width: '100%', marginRight: 10, paddingBottom: 10
                    }}>
                      <View>
                        {data.trip.payment_method === 39 ?
                          <Text style={{
                            color: 'white',
                            borderRadius: 8,
                            fontSize: f_s,
                            fontWeight: 'bold',
                            backgroundColor: 'green',
                            padding: 10,
                          }}>NON TUNAI</Text> : null}
                      </View>
                      <Wooble viewstyle={{ width: 30, alignItems: 'center', justifyContent: 'center', padding: 0, height: 30, display: 'flex', borderWidth: 2, borderColor: colors.success, borderRadius: 15 }}>
                        <Icon type={Icons.MaterialCommunityIcons} name="navigation-variant" color={colors.theme_fg_two} style={{ fontSize: 25, color: colors.theme_bg_blue }} />
                        {/* <LottieView style={{ flex: 1 }} source={pin_map} autoPlay loop /> */}
                      </Wooble>
                    </View>
                  </TouchableOpacity>

                  <View style={{ borderBottomWidth: 0.5, borderColor: colors.grey }}>

                    <View style={{ width: '100%', marginBottom: 20 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                          <View style={{ height: 50, width: 50 }} >
                            <Image source={{ uri: img_url + data.trip.vt.active_icon }} style={{ height: undefined, width: undefined, flex: 1 }} />
                          </View>
                          <Text style={{ color: 'white', fontSize: f_s, fontWeight: 'bold', backgroundColor: '#13a6ff', padding: 10, borderRadius: 8, marginLeft: 10 }}>{data.trip.vt.vehicle_type}</Text>
                        </View>
                        <View style={{ flexDirection: 'row-reverse' }}>
                          <View style={{ width: 50, height: 50 }}>

                            <Image style={{ width: undefined, height: undefined, flex: 1, borderRadius: 50 }} source={{ uri: img_url + data.trip.customer.profile_picture }} />

                          </View>
                          <View style={{ justifyContent: 'flex-start', marginRight: 6, marginTop: 5 }}>
                            <Text style={{ fontWeight: 'bold', marginRight: 10 }}>{data.trip.customer.first_name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                              <Icon type={Icons.MaterialIcons} name="star" color={colors.warning} style={{ fontSize: 18 }} />
                              <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 13, fontFamily: regular }}>{data.trip.customer.overall_ratings}</Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      {pickup_statuses.includes(parseInt(data.trip.status)) &&

                        <TouchableOpacity onPress={redirection.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three }}>

                          <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
                            <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                              <Badge status="success" backgroundColor="green" size={10} />
                            </View>
                            <View style={{ margin: 3 }} />

                            <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                              <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: regular }}>Pickup Address</Text>
                              <View style={{ margin: 2 }} />
                              <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: regular }}>{data.trip.pickup_address}</Text>
                            </View>
                            {/* <View style={{ width: '10%', alignItems: 'flex-end', justifyContent: 'center', paddingTop: 4 }}>
                              <Icon type={Icons.MaterialCommunityIcons} name="navigation-variant" color={colors.theme_fg_two} style={{ fontSize: 25 }} />
                            </View> */}
                          </View>
                        </TouchableOpacity>
                      }
                      {drop_statuses.includes(parseInt(data.trip.status)) && data.trip.trip_type != 2 &&
                        <TouchableOpacity onPress={redirection.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three }}>
                          <View style={{ flexDirection: 'row', width: '100%', height: 'auto' }}>
                            <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                              <Badge status="error" backgroundColor="red" size={10} />
                            </View>
                            <View style={{ margin: 5 }} />
                            <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                              <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_s, fontFamily: regular }}>Drop Address</Text>
                              <View style={{ margin: 2 }} />
                              {data.trip.is_multiple_drops === 1 ? <FlatList
                                data={data.trip.stops}
                                renderItem={({ item, index }) => <View style={{ flexDirection: 'row', gap: 5 }}><Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 13, fontFamily: regular }}>{index + 1 + "."}</Text><Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 13, fontFamily: regular }}>{item.address}</Text></View>}
                                keyExtractor={(item) => item.id}

                              /> :
                                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 15, fontFamily: regular }}>{data.trip.drop_address}</Text>
                              }

                            </View>

                          </View>
                        </TouchableOpacity>
                      }
                      {drop_statuses.includes(parseInt(data.trip.status)) && data.trip.trip_type == 2 &&
                        <TouchableOpacity activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three }}>
                          <View style={{ flexDirection: 'row', marginBottom: 20, marginLeft: 10, marginRight: 10 }}>
                            <View style={{ width: '10%' }}>
                              <Icon type={Icons.MaterialIcons} name="schedule" color={colors.icon_inactive_color} style={{ fontSize: 22 }} />
                            </View>
                            <View style={{ width: '90%' }}>
                              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_m, fontFamily: bold }}>{data.trip.package_details.hours} hrs {data.trip.package_details.kilometers} km package</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      }
                    </View>
                  </View>
                  {data.trip.status <= 2 &&
                    <View style={{ borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: colors.grey }}>
                      <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 10 }}>
                        <TouchableOpacity onPress={call_chat.bind(this, data.customer)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon type={Icons.MaterialIcons} name="chat" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </TouchableOpacity>
                        <View style={{ width: '5%' }} />
                        <TouchableOpacity onPress={call_customer.bind(this, data.trip.customer.phone_number)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon type={Icons.MaterialIcons} name="call" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </TouchableOpacity>
                        <View style={{ width: '10%' }} />
                        {cancel_loading == false ?
                          <TouchableOpacity onPress={showDialog.bind(this)} activeOpacity={1} style={{
                            width: '55%', backgroundColor:
                              colors.error_background, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Text style={{ color: '#000', fontSize: f_m, fontFamily: bold }}>
                              Batalin Order
                            </Text>
                          </TouchableOpacity>
                          :
                          <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                            <LottieView style={{ flex: 1 }} source={loader} autoPlay loop />
                          </View>
                        }
                      </View>
                    </View>
                  }
                  <View style={{ borderColor: colors.grey }}>
                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 20 }}>
                      <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Distance</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                          <Icon type={Icons.MaterialIcons} name="map" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                          <View style={{ margin: 2 }} />
                          <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: normal }}>{data.trip.distance} km</Text>
                        </View>
                      </View>
                      <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Trip Type</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                          <Icon type={Icons.MaterialIcons} name="commute" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                          <View style={{ margin: 2 }} />
                          <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: normal }}>{data.trip.trip_type_name}</Text>
                        </View>
                      </View>
                      <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Estimated Fare</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                          {/* <Icon type={Icons.MaterialIcons} name="local-atm" color={colors.theme_fg_two} style={{ fontSize: 22 }} /> */}
                          <View style={{ margin: 2 }} />
                          <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_m, fontWeight: 'bold', fontFamily: normal }}>{formatCurrency(data.trip.total)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <DialogInput
                    // isDialogVisible={otp_dialog_visible}
                    isDialogVisible={false}
                    title={"Enter your OTP"}
                    message={"Collect your OTP from your customer"}
                    textInputProps={{ keyboardType: "phone-pad" }}
                    submitInput={(inputText) => { verify_otp(inputText) }}
                    closeDialog={() => { closeOtpDialog(false) }}
                    submitText="Submit"
                    cancelText="Cancel"
                    modelStyle={{ fontFamily: regular, fontSize: 14, textColor: colors.theme_fg }}>
                  </DialogInput>
                  {data.trip.status < 5 &&
                    <View>
                      {loading == false ?
                        <View style={{}}>

                          {global.lang == 'en' ?

                            // <TouchableOpacity onPress={check_otp.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            //   <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>{data.trip.new_status.status_name}</Text>
                            // </TouchableOpacity>




                            <View style={{ marginBottom: 25, paddingBottom: 25 }}>
                              {/* {data.trip.new_status.status_name === 'Completed' ? <View>
                                <Text numberOfLines={1} style={{ textAlign: 'center', color: colors.grey, fontSize: f_m, fontFamily: bold }}>Isikan Biaya Toll dan Parkir (jika ada)</Text>
                                <FormTolNParkir trip_id={trip_id} />
                              </View> : ''
                              } */}

                              {data.trip.new_status.status_name === 'Completed' ? <View>

                                {/* <Text numberOfLines={1} style={{ textAlign: 'center', color: colors.grey, fontSize: f_m, fontFamily: bold }}>Isikan Biaya Toll dan Parkir (jika ada)</Text> */}
                                <FormTolNParkir trip_id={trip_id} permitted={data.trip.vehicle_type != 4} />
                              </View> : ""}




                              <SwipeButton
                                Icon={<View style={{ height: 38, width: 38 }} >
                                  <Image source={{ uri: img_url + data.trip.vt.active_icon }} style={{ height: undefined, width: undefined, flex: 1 }} />

                                </View>}
                                width={screenWidth * 0.75}

                                completeThresholdPercentage="60"
                                containerStyle={{ borderColor: '#13a6ff', borderWidth: 2 }}
                                title={tripDropStatus.permittedNextStatus ? reAdjustTripStatusName(data.trip.new_status.status_name) + " >>" : reAdjustTripStatusName(tripDropStatus.title)}
                                height={50}
                                titleStyle={{ color: 'black', width: '100%' }}
                                circleBackgroundColor="#13a6ff"
                                // circleBackgroundColor="y"
                                underlayStyle={{ backgroundColor: '#13a6ff', borderRadius: 50, opacity: 0.6 }}
                                onComplete={() => {
                                  if (data.trip.new_status.status_name === "Completed") {

                                    call_update_tol_parkir(trip_id, dataForm.tol, dataForm.parkir).then((res) => check_otp(true)
                                    )
                                  } else {
                                    check_otp()
                                  }




                                }}

                              />
                            </View>
                            : ""

                            // <TouchableOpacity onPress={check_otp.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            //   <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>{data.trip.new_status.status_name_ar}</Text>
                            // </TouchableOpacity>
                          }
                        </View>
                        :
                        <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                          <LottieView style={{ flex: 1 }} source={btn_loader} autoPlay loop />
                        </View>
                      }
                    </View>
                  }
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={dialog_visible}
                    onRequestClose={() => {
                      // Alert.alert('Modal has been closed.');
                      setDialogVisible(!dialog_visible);
                    }}>
                    <View style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <View style={{
                        backgroundColor: "white",
                        padding: 20,
                        borderRadius: 12,
                        width: '80%',
                        alignItems: "center",
                      }}>
                        <Text style={{ fontFamily: bold, fontSize: f_m, color: colors.theme_fg_two, marginBottom: 20 }}>Reason to cancel your ride.</Text>
                        <FlatList
                          data={cancellation_reason}
                          renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={call_trip_cancel.bind(this, item.id, item.type)} activeOpacity={1} >
                              <View style={{ padding: 10 }}>
                                <Text style={{ fontFamily: regular, fontSize: f_xs, color: colors.theme_fg_two }}>{item.reason}</Text>
                              </View>
                            </TouchableOpacity>
                          )}
                          keyExtractor={item => item.id}
                        />
                        <Pressable onPress={call_dialog_visible.bind(this)}
                          style={{ fontFamily: 'bold', fontSize: f_m, color: colors.theme_fg_two }}
                        >
                          <Text>Cancel</Text>
                        </Pressable>
                      </View>

                    </View>
                  </Modal>
                  {/* <Dialog.Container
                    visible={dialog_visible}
                  >
                    <Dialog.Title>Reason to cancel your ride.</Dialog.Title>
                    <Dialog.Description>
                      <FlatList
                        data={cancellation_reason}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity onPress={call_trip_cancel.bind(this, item.id, item.type)} activeOpacity={1} >
                            <View style={{ padding: 10 }}>
                              <Text style={{ fontFamily: regular, fontSize: f_xs, color: colors.theme_fg_two }}>{item.reason}</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                      />
                    </Dialog.Description>
                    <Dialog.Button footerStyle={{ fontSize: f_m, color: colors.theme_fg_two, fontFamily: regular }} label="Cancel" onPress={call_dialog_visible.bind(this)} />
                  </Dialog.Container> */}
                </View>
                :
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: regular }}>Loading...</Text>
                </View>
              }
            </View>
          </View>
        )}
      </BottomSheet>
      <DropdownAlert alert={func => (alt = func)} />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
    width: screenWidth,
    backgroundColor: colors.lite_bg
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

function mapStateToProps(state) {
  return {
    change_location: state.change_location.change_location,
    initial_lat: state.booking.initial_lat,
    initial_lng: state.booking.initial_lng,
    initial_region: state.booking.initial_region,
  };
}

export default withTranslation(connect(mapStateToProps, null)(Trip));