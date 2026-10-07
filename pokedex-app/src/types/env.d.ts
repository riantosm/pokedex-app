import 'react-native-config';

declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL?: string;
  }
}
