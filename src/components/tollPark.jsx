import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { api_url, prefix, colors } from '../config/Constants';
import withTranslation from '../hook/withTranslation'
import { call_update_tol_parkir } from '../helper';
import { useFormTolParkirStore } from '../reducers/zustand';

const FormTolNParkir = ({ trip_id, permitted, t }) => {
    const [toll, setToll] = useState('');
    const [parking, setParking] = useState('');
    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    const { dataForm: data, setDataFormTolParkir: setData } = useFormTolParkirStore()
    // , setData] = useState({ tol: 0, parkir: 0 })

    // axios.interceptors.request.use(async function (config) {
    //     // Do something before request is sent
    //     // console.log("loading")
    //     setLoading(true);
    //     // setCancelLoading(true);
    //     return config;
    // }, function (error) {
    //     // console.log(error)
    //     setLoading(false);
    //     // setCancelLoading(false);
    //     // console.log("finish loading")
    //     // Do something with request error
    //     return Promise.reject(error);
    // })



    // const call_update_tol_parkir = async (trip_id, tol, parkir) => {
    //     // setLoading(true);
    //     return axios({
    //         method: 'post',
    //         url: api_url + 'driver/update_tolparkir',
    //         data: {
    //             trip_id: trip_id,
    //             tol: tol, parkir: parkir
    //         }
    //     })
    //         .then(async response => {


    //             // setLoading(false);
    //             console.log('update_tolparkir done', response)
    //             // if (response.data.status == 'success') {
    //             //     console.log(response)
    //             // }




    //         })
    //         .catch(error => {
    //             // setLoading(false);
    //             console.log(error)
    //         });
    // }

    const formatCurrency = (value) => {
        // Remove non-digit characters
        const number = value.replace(/[^0-9]/g, '');
        // const number = value
        // Format as currency
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const handleTollChange = (value) => {
        setToll(formatCurrency(value));
        const intValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
        setData({ ...data, tol: intValue })
    };

    const handleParkingChange = (value) => {
        setParking(formatCurrency(value));
        const intValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
        setData({ ...data, parkir: intValue })
    };

    // const handleSubmit = async () => {
    //     // Handle form submission here
    //     console.log('Form submitted:', { url: api_url + 'driver/update_tolparkir', trip_id, toll, parking, data });
    //     // Call the API to update the toll and parking values
    //     await call_update_tol_parkir(trip_id, data.tol, data.parkir);
    //     // Reset form fields
    //     setToll('');
    //     setParking('');
    // };

    useEffect(() => {
        if (toll === 0)
            setToll(formatCurrency(toll));
        if (parking === 0)
            setParking(formatCurrency(parking));
    }, [toll, parking]);

    useEffect(() => {
        // console.log({ tolpark: data })

    }, [data, setData])

    return permitted ? (
        <View style={styles.container}>

            <Text style={styles.heading}>{t('toll_parking_question')}</Text>
            <Text style={styles.label}>{t('toll_fee')}</Text>
            <TextInput
                style={styles.input}
                placeholder="Rp 0"
                value={toll}
                onChangeText={handleTollChange}
                keyboardType='numeric'
            />
            <Text style={styles.label}>{t('parking_fee')}</Text>
            <TextInput
                style={styles.input}
                placeholder="Rp 0"
                value={parking}
                onChangeText={handleParkingChange}
                keyboardType="numeric"
            />

                {/* <TouchableOpacity onPress={handleSubmit.bind(this)} activeOpacity={1} style={{ width: '80%', backgroundColor: '#13a6ff', borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{t('save')}</Text>
            </TouchableOpacity> */}
            {/* <Button title="Submit" onPress={} /> */}
        </View>
    ) : "";
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 2,
        paddingBottom: 10
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#13a6ff',
        borderWidth: 2,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 15,
        borderRadius: 10
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default withTranslation(FormTolNParkir)
