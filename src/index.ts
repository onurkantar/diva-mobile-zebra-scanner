import {
  DeviceEventEmitter,
  EmitterSubscription,
  NativeModules,
  Platform,
} from 'react-native';

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

/**
 * Listen for available events
 * @param  {Function} handler Event handler
 */
DivaMobileZebraScanner.startReader = (handler: any) => {
  return DivaMobileZebraScanner.init().then(() => {
    return DeviceEventEmitter.addListener(
      DivaMobileZebraScanner.BARCODE_READ_SUCCESS,
      handler
    );
  });
};

/**
 * Stop listening for event
 * @param  {EmitterSubscription} subscription that is to be closed
 */
DivaMobileZebraScanner.stopReader = (subscription: EmitterSubscription) => {
  if (!subscription) {
    throw new Error(`There is no subscription`);
  }

  return DivaMobileZebraScanner.finalize().then(() => subscription.remove());
};

module.exports = DivaMobileZebraScanner;
