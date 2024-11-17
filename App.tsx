import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Button, Text } from 'react-native';
import ChatScreen from './ChatScreen';

// Definir os tipos de navegação
type RootStackParamList = {
  Home: undefined;
  Chat: { protocol: 'tcp' | 'udp' };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {({ navigation }) => (
            <View>
              <Text>Escolha o protocolo:</Text>
              <Button
                title="TCP"
                onPress={() => navigation.navigate('Chat', { protocol: 'tcp' })}
              />
              <Button
                title="UDP"
                onPress={() => navigation.navigate('Chat', { protocol: 'udp' })}
              />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
