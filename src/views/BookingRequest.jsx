import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { bold, regular, api_url, trip_request_details, img_url, accept, reject, loader, f_l, f_xl, f_s, f_xs, f_m } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { connect } from 'react-redux';
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { callAntrian, formatCurrency } from '../helper';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import database from "@react-native-firebase/database";

// var Sound = require('react-native-sound');

// Sound.setCategory('Playback');

// var whoosh = new Sound('uber.mp3', Sound.MAIN_BUNDLE, (error) => {
//   if (error) {
//     console.log('failed to load the sound', error);
//     return;
//   }
//   // loaded successfully
//   console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

// });

import SoundPlayer from 'react-native-sound-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const playSound = () => {
  try {
    SoundPlayer.playSoundFile('uber', 'mp3');
  } catch (e) {
    console.log('Error playing sound:', e);
  }
};

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

const BookingRequest = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [trip_id, setTripId] = useState(route.params.trip_id);
  const [autobid, setAutobid] = useState(route.params.autobid);
  const [data, setData] = useState('');

  useEffect(() => {
    console.log('trip_id', trip_id)
    call_trip_request_details();
    playSound();

    SoundPlayer.addEventListener('FinishedPlaying', () => playSound());

    const _unblur = navigation.addListener('blur', async () => {
      SoundPlayer.stop();
    });
    return () => {
      _unblur;
      // SoundPlayer.removeEventListener('FinishedPlaying');
    }
  }, []);

  const call_trip_request_details = async () => {
    await axios({
      method: 'post',
      url: api_url + trip_request_details,
      data: { trip_request_id: trip_id }
    })
      .then(async response => {
        console.log('call_trip_request_details', response.data)
        setData(response.data.result);
        setTimeout(() => {
          if (autobid === true) {
            call_accept()
            callAntrian()
          }
        }, 700)

      })
      .catch(error => {

      });
  }

  const call_accept = async () => {
    setLoading(true);
    console.log('calling call_accept...')
    axios({
      method: 'post',
      url: api_url + accept,
      data: { trip_id: trip_id, driver_id: global.id }
    })
      .then(async response => {
        console.log('aceppting....', response.data)
        setLoading(false);
        // whoosh.stop();
        SoundPlayer.stop()
        navigate();
      })
      .catch(error => {
        setLoading(false);
      });
  }

  const call_reject = async () => {
    setLoading(true);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'TRIP REJECT',
      textBody: `Trip rejected oleh driver...`,
    })
    await axios({
      method: 'post',
      url: api_url + reject,
      data: { trip_id: trip_id, driver_id: global.id, from: 1 }
    })
      .then(async response => {
        setLoading(false);
        // whoosh.stop();
        SoundPlayer.stop()
        navigate();
      })
      .catch(error => {
        setLoading(false);
      });
  }

  const navigate = () => {
    navigation.goBack();
    console.log('calling navigate... Home')
    // navigation.goBack()
  }

  const { bottom, top } = useSafeAreaInsets()

  return (
    <TouchableOpacity activeOpacity={1} onPress={call_accept.bind(this)} style={{ display: autobid === 1 ? 'none' : 'flex' }}>


      <StatusBar
        backgroundColor={colors.theme_bg}
      />
      {loading == false ?
        <View style={{ paddingBottom: bottom, paddingTop: top }} >
          <View style={styles.header} >
            <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: f_l }}>Hi, Trip sudah datang. </Text>
            <TouchableOpacity onPress={() => call_reject()} style={{ backgroundColor: 'red', color: 'white', padding: 8, borderRadius: 10 }}>
              <Text style={{ color: 'white', fontSize: f_l }}>Tolak</Text></TouchableOpacity>
          </View>
          <View style={styles.container}>
            <Text style={{ fontSize: f_xl, color: colors.theme_fg, fontFamily: bold }}>Pickup Location</Text>
            <View style={{ margin: 5 }} />
            <Text style={{ fontSize: f_m, color: colors.theme_fg_two, fontFamily: regular }}>{data.pickup_address}</Text>
            <View style={{ margin: 10 }} />
            <CountdownCircleTimer
              isPlaying={1}
              duration={30}
              colors={[colors.theme_bg]}
              onComplete={() => {
                // call_reject();
              }}
            >
              {() => <Image source={{ uri: img_url + data.static_map }} style={{ height: 160, width: 160, borderRadius: 80 }} />}
            </CountdownCircleTimer>

            <View style={{ margin: 10 }} />
            <Text style={{ fontSize: f_xl, color: colors.theme_fg, fontFamily: bold }}>Drop Location</Text>
            <View style={{ margin: 5 }} />
            <Text style={{ fontSize: f_m, color: colors.theme_fg_two, fontFamily: regular }}>{data.drop_address}</Text>
            <View style={{ margin: 10 }} />
            <View style={{ borderColor: colors.theme_fg_two, borderWidth: 0.5, width: '80%' }} />
            <View style={{ margin: 10 }} />
            <Text style={{ fontSize: f_xl, color: colors.theme_fg_two, fontFamily: bold }}>Tarif </Text>
            <View style={{ margin: 3 }} />
            <Text style={{ fontSize: f_s, color: colors.theme_fg_two, fontFamily: bold }}>ID Order: ({trip_id})</Text>
            <View style={{ margin: 3 }} />
            <Text style={{ fontSize: f_xl, color: colors.theme_fg_two, fontFamily: bold }}>{formatCurrency(data.total)}</Text>
            <Text style={{ fontSize: f_xl, color: colors.theme_fg_two, fontFamily: bold }} >{data.vtname}</Text>
          </View>
          <View style={styles.footer} >
            <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: f_xl }}>Terima Order: {data.first_name}</Text>
          </View>
        </View>
        :
        <View style={{ height: '100%', width: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          <LottieView source={loader} style={{ flex: 1 }} autoPlay loop />
        </View>
      }
    </TouchableOpacity >
  );
};

export default BookingRequest;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.theme_bg_three,
    height: '86%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  header: {
    backgroundColor: colors.theme_bg,
    alignItems: 'center',
    justifyContent: 'center',
    height: '7%',
    flexDirection: 'row'
  },
  footer: {
    backgroundColor: colors.theme_bg,
    alignItems: 'center',
    justifyContent: 'center',
    height: '7%'
  },
});
