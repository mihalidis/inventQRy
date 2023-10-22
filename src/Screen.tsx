import React, {useState, useEffect} from 'react';
import QRCode from 'react-native-qrcode-svg';
import StyledText from './components/atoms/StyledText';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

const App = () => {
    const [inputText, setInputText] = useState('');
    const [qrvalue, setQrvalue] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.qrWrapper}>
                <QRCode
                    value={qrvalue ? qrvalue : 'NA'}
                    size={250}
                    color="#192655"
                    backgroundColor="#F3F0CA"
                />
            </View>
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
                onPress={() => setQrvalue(inputText)}>
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
});
