import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your stack parameters
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  // Add other screens here
};

// Define the navigation prop type
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
