import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import { View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { InventoryProvider } from './src/context/InventoryContext';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync().then();

export default function App() {
  const [fontsLoaded] = useFonts({
    'SometypeMono-Regular': require('./assets/fonts/SometypeMono-Regular.ttf'),
    'SometypeMono-Medium': require('./assets/fonts/SometypeMono-Medium.ttf'),
    'SometypeMono-SemiBold': require('./assets/fonts/SometypeMono-SemiBold.ttf'),
    'SometypeMono-Bold': require('./assets/fonts/SometypeMono-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthProvider>
          <InventoryProvider>
            <AppNavigator />
            <StatusBar style="dark" />
          </InventoryProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}
