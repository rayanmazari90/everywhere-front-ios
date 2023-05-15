import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

import Home from "../screens/Home";
import Mapcomp from "../screens/Mapcomp";
import Profile from "../screens/profile";
import Events from '../screens/Events';
import ChatsScreen from "../screens/ChatsScreen";
import TicketScreen from "../screens/TicketsPage";
//import Profile from "../screens/Profile";
const Tab = createBottomTabNavigator();
const CustomTabBarButton= ({children, onPress}) =>(
    <TouchableOpacity
    style= {{
        top:-30,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow
    }}
    onPress={onPress}
    >
        <View style= {{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#4d84e2'
        }}>
            {children}
        </View>
    </TouchableOpacity>
)

const TabNavigator = () => {
    const navigation = useNavigation();
  return (
    <Tab.Navigator screenOptions={{
        
        
        tabBarStyle: { 
            position: "absolute",
            borderRadius: 10,
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: "#FFFF",
            height: 90,
            ...styles.shadow, // make sure styles.shadow is defined or imported properly
          },
          tabBarLabel: () => null,
        
    }}>
      <Tab.Screen name="Home" component={Profile} options={{
         title: '',
         headerShown: true,
         headerTransparent: true,
        tabBarIcon: ({focused}) => (
            <View style= {{alignItems: 'center', justifyContent: 'center', top: 10}}>
                <Image 
                source={require('../assets/icons/profile.png')}
                resizeMode= "contain"
                style={{
                    width: 30,
                    height: 30,
                    tintColor: focused ? '#4d84e2' : '#748c94'
                }}
                />
                <Text
                style={{ color: focused ? '#4d84e2' : '#748c94' , fontSize: 16}}
                > 
                    
                    Profile
                </Text>
            </View>
            
        ),
      }}/>

        <Tab.Screen name="Events" component={Events} options={{
             headerShown: false,
            tabBarIcon: ({focused}) => (
                <View style= {{alignItems: 'center', justifyContent: 'center', top: 10}}>
                    <Image 
                    source={require('../assets/icons/fire.png')}
                    resizeMode= "contain"
                    style={{
                        width: 30,
                        height: 30,
                        tintColor: focused ? '#4d84e2' : '#748c94'
                    }}
                    />
                    <Text
                    style={{ color: focused ? '#4d84e2' : '#748c94' , fontSize: 16}}
                    > 
                    Events
                    </Text>
                </View>
            
        ),
      }}/>


      <Tab.Screen name="Imbox" component={Mapcomp} options={{
         title: '',
         headerShown: true,
         headerTransparent: true,
        tabBarIcon: ({focused}) => (
                <Image 
                source={require('../assets/icons/mapcursor.png')}
                resizeMode= "contain"
                style={{
                    width: 40,
                    height: 40,
                    tintColor: focused ? '#FFFF' : '#748c94'
                }}
                />
        ),
        tabBarButton: (props) => (
            <CustomTabBarButton {...props}/>
        ),
        headerStyle: { backgroundColor: "whitesmoke" },
        tabBarLabel: () => null,
        headerRight: () => (
            <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('Addfriends')}>
                <FontAwesome name="user-plus" size={24} color="white" />
            </TouchableOpacity>
        ),
      }}
      
      />
      <Tab.Screen name="Chats" component={ChatsScreen} options={{
        tabBarIcon: ({focused}) => (
            <View style= {{alignItems: 'center', justifyContent: 'center', top: 10}}>
                <Image 
                source={require('../assets/icons/chat.png')}
                resizeMode= "contain"
                style={{
                    width: 30,
                    height: 30,
                    tintColor: focused ? '#4d84e2' : '#748c94'
                }}
                />
                <Text
                style={{ color: focused ? '#4d84e2' : '#748c94' , fontSize: 16}}
                >
                    Chat
                </Text>
            </View>
            
        ),
      }}/>
      <Tab.Screen name="Settings" component={TicketScreen} options={{
       
        tabBarIcon: ({focused}) => (
            <View style= {{alignItems: 'center', justifyContent: 'center', top: 10}}>
                <Image 
                source={require('../assets/icons/settings.png')}
                resizeMode= "contain"
                style={{
                    width: 30,
                    height: 30,
                    tintColor: focused ? '#4d84e2' : '#748c94'
                }}
                />
                <Text
                style={{ color: focused ? '#4d84e2' : '#748c94' , fontSize: 16}}
                > 
                    
                    Settings
                </Text>
            </View>
            
        ),
      }}/>

      


    </Tab.Navigator>
  );
};


const styles= StyleSheet.create({
    shadow: {
        shadowColor: "#7F5DF0",
        shadowOffset:{
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }
    
})

export default TabNavigator;

