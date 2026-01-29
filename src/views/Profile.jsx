//Fixed
import React, { useState, useEffect, useCallback } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, regular, api_url, get_profile, profile_picture_upload, profile_picture_update, img_url, f_xl, f_xs, f_m } from '../config/Constants';
import axios from 'axios';
import * as ImagePicker from "react-native-image-picker";
// import RNFetchBlob from "rn-fetch-blob";
import RNFetchBlob from 'react-native-blob-util'
import ImgToBase64 from 'react-native-image-base64';
import { updateFirstName, updateLastName, updateEmail } from '../actions/RegisterActions';
import { connect } from 'react-redux';
import { useProfileStore } from "../reducers/zustand";

const options = {
    title: 'Select a photo',
    takePhotoButtonTitle: 'Take a photo',
    chooseFromLibraryButtonTitle: 'Choose from gallery',
    base64: true,
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
};

const Profile = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [on_load, setOnLoad] = useState(0);
    const [data, setData] = useState("");

    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            call_get_profile();
        });

        return (
            unsubscribe
        );
    }, []);


    const setDataProfileImageUrl = useProfileStore((state) => state.setDataProfileImageUrl)
    const call_get_profile = () => {
        axios({
            method: 'post',
            url: api_url + get_profile,
            data: { driver_id: global.id, lang: global.lang }
        })
            .then(async response => {
                setLoading(false);
                setData(response.data.result);
                console.log('drv get profile', response.data.result)
                setDataProfileImageUrl(img_url + response.data.result.profile_picture)
                props.updateFirstName(response.data.result.first_name);
                props.updateLastName(response.data.result.last_name);
                props.updateEmail(response.data.result.email);
                setOnLoad(1);
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const navigate = (route) => {
        navigation.navigate(route);
    }

    const select_photo = async () => {
        ImagePicker.launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = response.assets[0].uri;
                await ImgToBase64.getBase64String(response.assets[0].uri)
                    .then(async base64String => {
                        call_profile_picture_upload(base64String);
                    }).catch(err => console.log(err));
            }
        });
    }

    const call_profile_picture_upload = (data_img) => {
        setLoading(true);
        RNFetchBlob.fetch('POST', api_url + profile_picture_upload, {
            'Content-Type': 'multipart/form-data',
        }, [
            {
                name: 'image',
                filename: 'image.png',
                data: data_img
            }
        ]).then(async (resp) => {
            setLoading(false);
            let data = await JSON.parse(resp.data);
            if (data.result) {
                call_profile_picture_update(data.result);
            }
        }).catch((err) => {
            setLoading(false);
            alert('Error on while upload try again later.')
        })
    }

    const call_profile_picture_update = async (data) => {
        setLoading(true);
        await axios({
            method: 'post',
            url: api_url + profile_picture_update,
            data: { id: global.id, profile_picture: data }
        })
            .then(async response => {
                setLoading(false);
                if (response.data.status == 1) {
                    alert("Your Profile Picture Update Successfully")
                    call_get_profile();
                } else {
                    alert(response.data.message)
                }
            })
            .catch(error => {
                setLoading(false);
                alert("Sorry something went wrong")
            });
    }

    const [profileData, setProfileData] = useState([])


    useEffect(() => {
        setProfileData([
            {
                title: 'First Name',
                nav: 'EditFirstName',
                icon: 'person',
                iconType: 'material',
                field: 'first_name',
                value: data.first_name
            },
            {
                title: 'Last Name',
                nav: 'EditLastName',
                icon: 'person',
                iconType: 'material',
                field: 'last_name',
                value: data.last_name
            },
            {
                title: 'Email',
                nav: 'EditEmail',
                icon: 'email',
                iconType: 'material',
                field: 'email',
                value: data.email
            },
            {
                title: 'Plat Nomer',
                nav: 'EditPlatNo',
                icon: 'book',
                iconType: 'material',
                field: 'platno',
                value: data.platno
            },
            {
                title: 'Phone',
                nav: 'EditPhoneNumber',
                icon: 'smartphone',
                iconType: 'material',
                field: 'phone_with_code',
                value: data.phone_with_code
            },
            {
                title: 'Nama Bank',
                nav: 'EditBankName',
                icon: 'bank-outline',
                iconType: 'community',
                field: 'bank_name',
                value: data.bank_details ? data.bank_details.bank_name : ''
            },
            {
                title: 'Nama Pemilik Rekening Bank',
                nav: 'EditAccountName',
                icon: 'bank-plus',
                iconType: 'community',
                field: 'bank_account_name',
                value: data.bank_details ? data.bank_details.bank_account_name : ''
            },
            {
                title: 'Rekening Bank',
                nav: 'EditAccountNumber',
                icon: 'bank-plus',
                iconType: 'community',
                field: 'bank_account_number',
                value: data.bank_details ? data.bank_details.bank_account_number : ''
            }
        ])
    }, [data])

    const ProfileItem = useCallback(({ item, data }) => {
        /*
        { title, nav,icon,value
        }
        */

        return (
            <View style={{ marginBottom: 20 }}>

                {/* <View style={{ margin: 5 }} /> */}
                <TouchableOpacity activeOpacity={0.8} onPress={navigate.bind(this, item.nav)} style={{ flexDirection: 'row', }}>
                    <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                        <Icon type={item.iconType === 'material' ? Icons.MaterialIcons : Icons.MaterialCommunityIcons} name={item.icon} color={colors.theme_fg_two} style={{ fontSize: 20 }} />
                    </View>
                    <View style={{ width: '80%', alignItems: 'flex-start', paddingLeft: 10, paddingTop: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                        <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: bold }}>{item.title}</Text>
                        <TextInput
                            editable={false}
                            value={item.value}
                            placeholderTextColor={colors.grey}
                            style={styles.textinput}
                        />
                    </View>
                    <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                        <Icon type={Icons.MaterialIcons} name="arrow-forward" color={colors.theme_fg_two} style={{ fontSize: 20 }} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }, [data])

    return (
        <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>Edit Profile</Text>
                </View>
            </View>
            <ScrollView>
                {on_load == 1 &&
                    <View>
                        <TouchableOpacity activeOpacity={1} onPress={select_photo.bind(this)} style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderRadius: 65, padding: 2, width: 130, height: 130, borderColor: colors.grey, borderStyle: 'dotted', alignSelf: 'center', margin: 20 }}>
                            <View style={{ width: 120, height: 120 }} >
                                <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 60 }} source={{ uri: img_url + data.profile_picture }} />
                            </View>
                        </TouchableOpacity>
                        <ScrollView>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>Informasi data diri</Text>
                                <Text style={{ marginTop: 8, color: colors.theme_fg_two, fontSize: f_xs, fontFamily: regular }}>Foto setengah badan, tanpa kacamata. </Text>
                                <Text style={{ marginTop: 8, color: 'red', fontSize: f_xs, fontFamily: regular, fontWeight: 'bold', }}>Perubahan data profile atas persetujuan admin</Text>

                                <View style={{ margin: 20 }} />
                                <View style={{ width: '90%' }}>

                                    {profileData.map((item, index) => (
                                        <ProfileItem item={item} data={data} key={index} />
                                    ))}

                                    <View style={{ margin: 20 }} />
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.theme_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textinput: {
        fontSize: f_xs,
        color: colors.grey,
        fontFamily: regular,
        height: 35,
        backgroundColor: 'transparent',
        width: '100%'
    },
});

const mapDispatchToProps = (dispatch) => ({
    updateEmail: (data) => dispatch(updateEmail(data)),
    updateFirstName: (data) => dispatch(updateFirstName(data)),
    updateLastName: (data) => dispatch(updateLastName(data)),
});

export default connect(null, mapDispatchToProps)(Profile);