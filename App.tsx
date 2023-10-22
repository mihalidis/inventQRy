import { StatusBar } from 'expo-status-bar';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Platform, SafeAreaView as SafeAreaViewNative } from 'react-native';
import {useFonts} from "expo-font";
import {useCallback} from "react";
import StyledText from './src/components/atoms/StyledText';

SplashScreen.preventAutoHideAsync().then();
const SafeAreaViewComponent = Platform.OS === 'ios' ? SafeAreaViewNative : SafeAreaView

export default function App() {
  const [fontsLoaded] = useFonts({
    'SometypeMono-Regular': require('./assets/fonts/SometypeMono-Regular.ttf'),
    'SometypeMono-Medium': require('./assets/fonts/SometypeMono-Medium.ttf'),
    'SometypeMono-SemiBold': require('./assets/fonts/SometypeMono-SemiBold.ttf'),
    'SometypeMono-Bold': require('./assets/fonts/SometypeMono-Bold.ttf')
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
    <SafeAreaViewComponent style={styles.containerSafe} onLayout={onLayoutRootView}>
      <StyledText weight={500} style={styles.headerText}>Hello</StyledText>
      <StatusBar style="auto" />
    </SafeAreaViewComponent>
  );
}

const styles = StyleSheet.create({
  containerSafe: {
    flex: 1,
    backgroundColor: "#fff"
  },
  headerText: {
    fontSize: 20,
    color: '#3B1765',
    textAlign: "left",
    lineHeight: 28
  }
});
