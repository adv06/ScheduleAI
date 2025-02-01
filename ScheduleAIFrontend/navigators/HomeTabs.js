import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DailyReview from '../screens/dailyReview';
import CalenderCreation from '../screens/calenderCreation';
import gptChat from '../screens/gptChat';
import googleAuth from '../screens/googleAuth';
import {Context, Provider} from '../screens/Context';
import Predictions from '../screens/Predictions';
import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const {token, setToken} = useContext(Context);
  return (
    
    
      <Tab.Navigator 
        screenOptions={ ({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === 'Review') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Predictions') {
              iconName = focused ? 'podium' : 'podium-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabel: ({children, color, focused}) => (
              <Text style ={{
                  color,
                  fontWeight: focused ? 'bold' : 'normal', 
                  fontSize: 11
              }}>{children}</Text>
          ),
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarActiveBackgroundColor: 'transparent',
          tabBarInactiveBackgroundColor: 'transparent', 
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: styles.headerStyle,
          tabBarLabelStyle: {
              fontSize: 12,  // Adjust label font size globally
              fontWeight: 'normal',  // Default label weight
              marginBottom: 5,  // Space between icon and label
            },
          keyboardHandlingEnabled: true,
          headerShown : false,
        })}
      >
        <Tab.Screen name="Calendar" component={CalenderCreation} />
        <Tab.Screen name="Chat" component={token ? gptChat : googleAuth} />
        <Tab.Screen name="Review" component={googleAuth} />
        <Tab.Screen name="Predictions" component={Predictions} />
      </Tab.Navigator>
    
   
  );
};

const styles = StyleSheet.create({
    tabBarStyle: {
        height: 80,

        backgroundColor: 'black',
        borderTopColor: 'black',
        marginHorizontal: 40,
        paddingTop: 5,
        position: 'absolute',
        bottom: 30,
        borderRadius: 50,
        borderTopWidth: 0,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        justifyContent: 'center',
        elevation: 5,
        
    },
    tabBarItemStyle: {
        
        paddingVertical: 10,
        margin: 10,
        borderRadius: 40,
        display: 'flex',
        paddingVertical: 1,
    },
    headerStyle: {
        
        borderBottomWidth: 0,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    }
})
export default HomeTabs;