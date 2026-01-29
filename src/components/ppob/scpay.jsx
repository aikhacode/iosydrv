import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, Image } from 'react-native';
import { useSpeedcashStore } from '../../reducers/zustand';
import { formatCurrency, formatNumber } from '../../helper';
import { balanceInquiry, binding, bindingInquiry, getToken, userDebit, userDebitCheck } from '../../helpersc';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSCPayStore, useWalletStore } from '../../reducers/wallet';
import { ENV, env } from '../../config/config';

export default function SCPayment({ amount, phone, onSuccess }) {
    const [eMoneyId, setEMoneyId] = useState('');
    const [loading, setLoading] = useState(false);

    // Wallet Store
    const { sc: walletStore, setSC } = useWalletStore();
    const { saldo: scSaldo, active: scIsActivated, merchantId: merchantId } = walletStore;

    // SC Pay Store
    const scPayStore = useSCPayStore();

    // Navigation
    const navigate = useNavigation();
    const isFocused = useIsFocused();

    const activateSpeedcash = useCallback(async () => {

        const bindingInquiryResponse = await bindingInquiry(merchantId)


        const merchantId = bindingInquiryResponse.result.additionalInfo.merchantId

        setSC({
            ...walletStore,
            merchantId: merchantId
        })
        // const bindingResponse = await binding()
        const bindingResponse = await binding(merchantId)

        const url = bindingResponse.result.redirectUrl

        navigate.navigate('WebRender', {
            url: url,
            title: 'Konfirm Speedcash',
        });





    }, [scIsActivated])

    const getSpeedcashBalance = useCallback(async () => {
        try {

            const tokenResponse = await getToken();
            console.log('get token -- ', tokenResponse)
            const balanceResponse = await balanceInquiry(tokenResponse.result.sc_merchant_id, tokenResponse.result.sc_access_token)

            setSC({
                ...walletStore,
                active: tokenResponse.result.sc_access_token !== '',
                saldo: balanceResponse.result.availableBalance.value,
                merchantId: tokenResponse.result.sc_merchant_id,
                regitered: tokenResponse.result.sc_access_token !== '',
                token: tokenResponse.result.sc_access_token
            })
        } catch (error) {
            console.error('Error fetching balance:', error);

        }
    }, [])

    /**
     * Handle payment process
     */

    const handlePayDev = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            onSuccess()
        }, 2000)

    }
    const handlePayProd = useCallback(async () => {
        if (!scIsActivated) {
            await activateSpeedcash()
            return;
        }

        setLoading(true);

        try {
            const tokenResponse = await getToken();
            console.log('Token Response:', tokenResponse);

            const debitResponse = await userDebit(
                merchantId,
                tokenResponse.result.sc_access_token,
                amount,
                'ppob',
                {
                    "phone": phone,
                    "amount": amount,

                }
            );

            console.log('Debit Response:', debitResponse);

            if (debitResponse.result.responseCode === '2005400') {
                console.log('RefNo:', debitResponse.result.refNo);

                scPayStore.setDataSCPay({
                    refNo: debitResponse.result.refNo,
                    merchantId: merchantId
                });

                navigate.navigate('WebRender', {
                    url: debitResponse.result.webRedirectUrl,
                    title: 'Konfirm Speedcash',
                });
            }
        } catch (error) {
            console.error('Payment Error:', error);
            // Alert.alert('Error', 'Failed to process payment. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [amount, scIsActivated, merchantId, navigate, scPayStore]);

    const handlePay = () => ENV.PROD ? handlePayProd() : handlePayDev()

    /**
     * Check payment status when screen is focused
     */
    useEffect(() => {
        if (isFocused && scPayStore.refNo && scPayStore.merchantId) {
            console.log('Checking payment status for refNo:', scPayStore.refNo);

            userDebitCheck(scPayStore.refNo, scPayStore.merchantId)
                .then((rescheck) => {
                    console.log('User Debit Check Result:', rescheck);
                    if (rescheck.status === 'success') {
                        Alert.alert('Success', 'Payment confirmed successfully!');
                        scPayStore.reset();
                        onSuccess();
                    }
                })
                .catch((err) => {
                    console.error('User Debit Check Error:', err);
                    // Alert.alert('Error', 'Failed to check payment status.');
                });
        }

        if (isFocused) {
            getSpeedcashBalance()
        }
    }, [isFocused, scPayStore.refNo, scPayStore.merchantId, onSuccess]);

    /**
     * Get button text based on activation status
     */
    const getButtonText = () => {
        return loading ? 'Processing...' : (scIsActivated ? 'Pay Now' : 'Aktivasi Dulu');
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../assets/img/speedcash.png')} style={{ width: 40, height: 40, marginRight: 10 }} />
                    <Text style={styles.title}>Speedcash</Text>
                </View>
                <Text style={styles.saldo}>{formatCurrency(scSaldo)}</Text>
            </View>

            <Text style={styles.amount}>
                Jumlah Bayar: <Text style={styles.amountValue}>{formatNumber(amount)}</Text>
            </Text>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    (loading) && styles.buttonDisabled,
                ]}
                onPress={handlePay}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{getButtonText()}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#222',
    },
    saldo: {
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 12,
        color: '#222',
    },
    amount: {
        marginTop: 16,
        fontSize: 16,
        marginBottom: 20,
        color: '#555',
    },
    amountValue: {
        fontWeight: '700',
        color: '#000',
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        backgroundColor: '#357ABD',
    },
    buttonDisabled: {
        backgroundColor: '#a0c4f7',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});