import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, regular, logo, menus, f_s, f_xs, img_url } from '../config/Constants';
import Dialog from "react-native-dialog";
import { connect } from 'react-redux';
import { useProfileStore } from "../reducers/zustand";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const More = (props) => {
  const navigation = useNavigation();
  const [dialog_visible, setDialogVisible] = useState(false);
  const insets = useSafeAreaInsets()

  const navigate = (route) => {
    if (route == 'Logout') {
      showDialog();
    } else {
      navigation.navigate(route);
    }
  }

  const showDialog = () => {
    setDialogVisible(true);
  }

  const closeDialog = () => {
    setDialogVisible(false);
  }

  const handleCancel = () => {
    setDialogVisible(false)
  }

  const handleLogout = async () => {
    closeDialog();
    navigation.navigate('Logout');
  }
  const profile_picture_url = useProfileStore((state) => state.profile_image_url)

  const dataView = [
    {
      id: 'kfdhjskhfdiu-987hjhw-ewhrhew8888'
    }
  ]

  return (
    <View style={{ backgroundColor: colors.theme_bg_three, flex: 1, top: insets.top }}>
      <StatusBar
        backgroundColor={colors.theme_bg}
      />
      <FlatList
        data={dataView}
        keyExtractor={item => item.id}
        renderItem={() =>
          <View>
            <Dialog.Container visible={dialog_visible}>
              <Dialog.Title>Konfirmasi</Dialog.Title>
              <Dialog.Description>
                Apakah ingin logout?
              </Dialog.Description>
              <Dialog.Button label="Yes" onPress={handleLogout} />
              <Dialog.Button label="No" onPress={handleCancel} />
            </Dialog.Container>
            <View style={{ margin: 15, alignItems: 'center' }}>
              <View style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderRadius: 55, padding: 2, width: 110, borderColor: colors.grey, borderStyle: 'dotted', alignSelf: 'center' }}>
                <View style={{ width: 100, height: 100 }} >
                  <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 75 }} source={{ uri: profile_picture_url }} />
                </View>
              </View>
              <View style={{ margin: 5 }} />
              <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: bold }}>{global.first_name}</Text>
              <View style={{ margin: 2 }} />
              <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: regular }}>{global.email}</Text>
              <View style={{ margin: 5 }} />
              <TouchableOpacity onPress={() => navigate('Profile')} style={{ backgroundColor: colors.theme_bg, padding: 7, borderRadius: 10 }}>
                <Text style={{ color: colors.theme_fg_three, fontSize: f_xs, fontFamily: bold }}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: colors.lite_bg, padding: 10 }}>
              <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: regular }}>Menu</Text>
            </View>
            <View style={{ margin: 5 }} />
            <FlatList
              data={menus}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => navigate(item.route)} style={{ flexDirection: 'row', width: '100%', padding: 15 }}>
                  <View style={{ width: '80%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <View style={{ width: 50 }}>
                      <Icon type={Icons.FontAwesome5} name={item.icon} color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                    </View>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: regular }}>{item.menu_name}</Text>
                  </View>
                  <View style={{ width: '20%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <Icon type={Icons.FontAwesome5} name="chevron-right" color={colors.text_grey} style={{ fontSize: 18 }} />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.menu_name}
            />
            <View style={{ margin: 40 }} />
          </View>
        }
      />


    </View>
  );
};

const styles = StyleSheet.create({

});

function mapStateToProps(state) {
  return {
    first_name: state.register.first_name,
    last_name: state.register.last_name,
    email: state.register.email,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateEmail: (data) => dispatch(updateEmail(data)),
  updateFirstName: (data) => dispatch(updateFirstName(data)),
  updateLastName: (data) => dispatch(updateLastName(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(More);