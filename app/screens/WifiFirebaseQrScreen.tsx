import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function WifiFirebaseQrScreen() {
  const [ssid, setSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firebasePassword, setFirebasePassword] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = () => {
    if (!ssid || !wifiPassword || !email || !firebasePassword) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }
    setShowQR(true);
  };

  const qrData = `S:${ssid};P:${wifiPassword};E:${email};F:${firebasePassword}`;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Wi-Fi + Firebase QR</Text>
      <TextInput
        placeholder="Wi-Fi SSID"
        value={ssid}
        onChangeText={setSsid}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Wi-Fi Password"
        secureTextEntry
        value={wifiPassword}
        onChangeText={setWifiPassword}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Firebase Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Firebase Password"
        secureTextEntry
        value={firebasePassword}
        onChangeText={setFirebasePassword}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Button title="Generate QR Code" onPress={handleGenerateQR} />

      {showQR && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <QRCode value={qrData} size={220} />
        </View>
      )}
    </View>
  );
}
