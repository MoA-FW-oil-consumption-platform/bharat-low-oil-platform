import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screen components here
// import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
    Main: undefined;
    Details: { id: string };
};

export type TabParamList = {
    Home: undefined;
    Profile: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else {
                        iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={() => null} />
            <Tab.Screen name="Profile" component={() => null} />
            <Tab.Screen name="Settings" component={() => null} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen 
                name="Main" 
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="Details" 
                component={() => null}
                options={{ title: 'Details' }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;