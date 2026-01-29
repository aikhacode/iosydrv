import React, { useState, useRef, useCallback, useEffect } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    TextInput,
    View,
    FlatList,

} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from '../../assets/css/Colors';
import Icon, { Icons } from '../../components/Icons';
import { connect } from 'react-redux';
import { Checkbox } from 'react-native-paper';

import { bold, regular, api_url, vehicle_update, btn_loader, f_xl, f_xs, f_m, f_s } from '../../config/Constants';
import { updateVehicleFitureType } from "../../actions/VehicleDetailActions";
import { useRegistrationStore } from "../../reducers/zustand";


const VehiclePickFormDefault = (props) => {

    const navigation = useNavigation()
    const navigate = (route) => {
        navigation.navigate(route);
    }


    const { vehicleType, vehicleName, vehicleBrand, vehicleColor, vehicleNumber,
        setVehicleName, setVehicleType, setVehicleBrand, setVehicleColor } = useRegistrationStore()

    const VehicleInputContainer = () => {
        const [vehicleFiturLbl, setVehicleFiturLbl] = useState('')
        return (
            <View style={{ width: '90%' }}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: bold }}>Merk Kendaraan</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateVehicleBrand')} style={{ flexDirection: 'row' }}>
                        <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.MaterialIcons} name="branding-watermark" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                editable={false}
                                value={vehicleBrand}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                placeholder="Merk Kendaraan"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: bold }}>Tipe Kendaraan</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateVehicleName')} style={{ flexDirection: 'row' }}>
                        <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.MaterialIcons} name="drive-file-rename-outline" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                editable={false}
                                value={vehicleName}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                placeholder="Tipe Kendaraan"
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: bold }}>Warna Kendaraan</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateVehicleColor')} style={{ flexDirection: 'row' }}>
                        <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.Ionicons} name="color-palette" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                editable={false}
                                value={vehicleColor}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                placeholder="Warna Kendaraan"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: bold }}>Nopol</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateVehicleNumber')} style={{ flexDirection: 'row' }}>
                        <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.Octicons} name="number" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                editable={false}
                                value={vehicleNumber}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                placeholder="Nopol"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: bold }}>Fitur Layanan</Text>
                    <View style={{ margin: 5 }} />
                    <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, 'CreateVehicleType')} style={{ flexDirection: 'row' }}>
                        <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
                            <Icon type={Icons.FontAwesome} name="car" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                        </View>
                        <View style={{ width: '85%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
                            <TextInput
                                editable={false}
                                value={vehicleFiturLbl}
                                placeholderTextColor={colors.grey}
                                style={styles.textinput}
                                placeholder="fitur layanan"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const VehicleMainType = () => {
        // const [pick, setPick] = useState('MOBIL_AIRPORT')
        const { vehicleType: pick, setVehicleType: setPick, vehiclePicks: data, setVehiclePicks: setData } = useRegistrationStore()


        const renderItem = ({ item }) => (
            <TouchableOpacity onPress={() => update_vehicle_type(item.id, item.stateId)} style={{ flexDirection: 'row' }} >

                <View style={{ width: '15%', alignSelf: 'center', justifyContent: 'center' }}>
                    <Checkbox
                        // status={vehicle_type === item.id ? 'checked' : 'unchecked'}
                        status={item.status ? 'checked' : 'unchecked'}
                        // onPress={() => update_vehicle_type(item.id)}
                        color={colors.btn_color}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"

                    />
                </View>
                <View style={{ width: '80%', alignSelf: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontFamily: regular }}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )

        const update_vehicle_type = (id, stateId) => {
            const newData = data.map((a) => {
                a.status = a.id === id
                if (a.status) {
                    setPick(stateId)
                    // setVehicleType(stateId)
                }
                console.log(`a.id:${a.id} id:${id}`)
                return a
            })
            // setPick(stateId)
            setData(newData)
            // setVehicleType(pick)

        }

        const nextFLow = () => {
            setVehicleType(pick)
            props.onvalid(true)
        }

        useEffect(() => {
            console.log('newData last', data, vehicleType)
        }, [data])

        return (
            <View style={{ marginLeft: 70, marginRight: 70, flexDirection: 'column', height: 180 }}>

                <FlatList

                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    initialNumToRender={3}
                    getItemLayout={(data, index) => ({ length: 3, offset: 3 * index, index })}
                />
                <TouchableOpacity activeOpacity={0.2} onPress={nextFLow.bind(this)} style={{ marginLeft: 0, backgroundColor: colors.btn_color, borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center', marginRight: 0, marginTop: 20 }}
                >
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>Next</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // const data = [
    //     { id: 1, name: 'Mobil Airport', status: true },
    //     { id: 2, name: 'Mobil Reguler', status: false },
    //     { id: 3, name: 'Motor', status: false },
    // ];

    // const Item = React.memo(({ item, onPress }) => (
    //     <View style={styles.itemContainer}>
    //         <View style={styles.checkboxContainer}>
    //             <Checkbox
    //                 status={item.status ? 'checked' : 'unchecked'}
    //                 onPress={() => onPress(item.id)}
    //                 color={colors.btn_color}
    //                 checkedIcon="dot-circle-o"
    //                 uncheckedIcon="circle-o"
    //             />
    //         </View>
    //         <View style={styles.textContainer}>
    //             <Text style={styles.itemText}>{item.name}</Text>
    //         </View>
    //     </View>
    // ));

    // const VehicleMainType = () => {
    //     const [vehicleData, setVehicleData] = useState(data);

    //     const updateVehicleType = useCallback((id) => {
    //         const newData = vehicleData.map(item => ({
    //             ...item,
    //             status: item.id === id,
    //         }));
    //         setVehicleData(newData);
    //     }, [vehicleData]);

    //     const renderItem = useCallback(({ item }) => (
    //         <Item item={item} onPress={updateVehicleType} />
    //     ), [updateVehicleType]);

    //     return (
    //         <FlatList
    //             data={vehicleData}
    //             renderItem={renderItem}
    //             keyExtractor={item => item.id.toString()}
    //         // initialNumToRender={5}
    //         // getItemLayout={(data, index) => (
    //         //     { length: 50, offset: 50 * index, index }
    //         // )}
    //         />
    //     );
    // };


    return (
        <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>Tambah Kendaraan </Text>
            <View style={{ margin: 20 }} />
            {!props.valid ? <VehicleMainType /> : <VehicleInputContainer />}


        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.lite_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textinput: {
        fontSize: f_m,
        color: colors.grey,
        fontFamily: regular,
        height: 60,
        backgroundColor: colors.text_container_bg,
        width: '100%'
    },
    itemContainer: {
        flexDirection: 'row',
        width: '100%',
        marginLeft: 70,
    },
    checkboxContainer: {
        width: '10%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    itemText: {
        color: colors.theme_fg_two,
        fontSize: 16,
        fontFamily: 'regular',
    },
});


function mapStateToProps(state) {
    return {
        vehicle_name: state.vehicle.vehicle_name,
        vehicle_brand: state.vehicle.vehicle_brand,
        vehicle_color: state.vehicle.vehicle_color,
        vehicle_number: state.vehicle.vehicle_number,
        vehicle_type: state.vehicle.vehicle_type,
        vehicle_type_lbl: state.vehicle.vehicle_type_lbl,
        vehicle_type_multi: state.vehicle.vehicle_type_multi,
        vehicle_fiture_type: state.vehicle.vehicle_fiture_type,
    };
}

const mapDispatchToProps = (dispatch) => ({

    updateVehicleFitureType: (data) => dispatch(updateVehicleFitureType(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(VehiclePickFormDefault)