import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text } from 'react-native';
import { RootStackParamList, BottomTabParamList } from '../types/inventory';

import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ShelvesScreen from '../screens/ShelvesScreen';
import ItemsScreen from '../screens/ItemsScreen';
import ShelfDetailScreen from '../screens/ShelfDetailScreen';
import AddShelfScreen from '../screens/AddShelfScreen';
import SearchScreen from '../screens/SearchScreen';
import PrintQRScreen from '../screens/PrintQRScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⌂',
    Scan: '⎕',
    Shelves: '▤',
    Items: '◉',
  };
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icons[label] ?? '•'}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#4A7BF7',
        tabBarInactiveTintColor: '#8E9196',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Shelves" component={ShelvesScreen} />
      <Tab.Screen name="Items" component={ItemsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#F5F7FA' },
          headerTintColor: '#2A3342',
          headerTitleStyle: { fontFamily: 'SometypeMono-SemiBold', fontSize: 17 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F5F7FA' },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShelfDetail"
          component={ShelfDetailScreen}
          options={({ route }) => ({
            title: 'Shelf Details',
          })}
        />
        <Stack.Screen
          name="AddShelf"
          component={AddShelfScreen}
          options={{ title: 'New Shelf' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'Search' }}
        />
        <Stack.Screen
          name="PrintQR"
          component={PrintQRScreen}
          options={{ title: 'QR Code' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E8EBF0',
    borderTopWidth: 1,
    paddingTop: 6,
  },
  tabLabel: {
    fontFamily: 'SometypeMono-Medium',
    fontSize: 11,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#8E9196',
  },
  iconFocused: {
    color: '#4A7BF7',
  },
});
