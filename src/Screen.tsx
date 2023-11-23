import React, {useEffect, useRef, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';
import StyledText from './components/atoms/StyledText';
import { Shelves } from './types/Shelves'

import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

const App = () => {
    const [inputText, setInputText] = useState<string>('');
    const [qrValue, setQrValue] = useState<string>('');
    const [imageURI, setImageURI] = useState<string>('');
    const [shelves, setShelves] = useState<Shelves[]>([]);
    const viewRef = useRef<View>(null);

    const saveQrCode = async () => {
       await captureView()
    }

    const createQrCode = async () => {
        setQrValue(inputText)
    }

    const captureView = async () => {
        try {
            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 1,
            });
            const base64Image = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setImageURI(`'data:image/png;base64,${base64Image}`);
        } catch (error) {
            console.error('Error while capturing: ', error);
        }
    };

    useEffect(() => {
        console.log(shelves)
    }, [shelves])

    useEffect(() => {
        setShelves(prev => [...prev, {qrCode: imageURI, value: qrValue}])
    }, [imageURI])

    return (
        <View style={styles.container}>
            <View style={styles.qrWrapper} ref={viewRef}>
                {qrValue && <QRCode
                    value={qrValue}
                    size={250}
                    color="#192655"
                />}
            </View>
            {
                qrValue && <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => saveQrCode()}>
                <StyledText weight={500} style={styles.buttonTextStyle}>Save QR Code</StyledText>
              </TouchableOpacity>
            }
            <StyledText weight={500} style={styles.textStyle}>Please insert any value to generate QR code</StyledText>
            <TextInput
                style={styles.textInputStyle}
                onChangeText={
                    (inputText) => setInputText(inputText)
                }
                placeholder="Enter Shelf Name"
                value={inputText}
            />
            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => createQrCode()}>
                <StyledText weight={500} style={styles.buttonTextStyle}>Generate QR Code</StyledText>
            </TouchableOpacity>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F0CA',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
    },
    qrWrapper: {
        borderWidth: 1,
        borderColor: '#192655',
        padding: 6,
        borderRadius: 8,
    },
    titleStyle: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    textStyle: {
        textAlign: 'center',
        marginTop: 20,
    },
    textInputStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    buttonStyle: {
        backgroundColor: '#3876BF',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#3876BF',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 30,
        padding: 10,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    logo: {
        backgroundColor: '#001B79',
        color: '#fff',
        padding: 8,
        borderRadius: 12
    }
});
