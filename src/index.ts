import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  'The package "diva-mobile-zebra-scanner" doesn\'t seem to be linked. Make sure: \n\n' +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const DivaMobileZebraScanner = NativeModules.DivaMobileZebraScanner
  ? NativeModules.DivaMobileZebraScanner
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

DivaMobileZebraScanner.startReader = (handler: (data: any) => void) => {
  // Initialize the Zebra scanner
  return DivaMobileZebraScanner.init().then(() => {
    // Subscribe to the BARCODE_READ_SUCCESS event
    return DeviceEventEmitter.addListener(
      DivaMobileZebraScanner.BARCODE_READ_SUCCESS,
      // Pass the event data to the specified handler function
      (data) => handler(data)
    );
  });
};

DivaMobileZebraScanner.stopReader = () => {
  // Finalize the Zebra scanner
  return DivaMobileZebraScanner.finalize().then(() => {
    // Unsubscribe from the event
    return DeviceEventEmitter.removeAllListeners(
      DivaMobileZebraScanner.BARCODE_READ_SUCCESS
    );
  });
};

module.exports = DivaMobileZebraScanner;
