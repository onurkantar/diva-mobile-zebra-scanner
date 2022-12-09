import {
  DeviceEventEmitter,
  EmitterSubscription,
  NativeModules,
  Platform,
} from 'react-native';

const LINKING_ERROR =
  `The package 'diva-mobile-zebra-scanner' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

let activeBarcodeListener: EmitterSubscription;

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

DivaMobileZebraScanner.allowedEvents = [
  DivaMobileZebraScanner.BARCODE_READ_SUCCESS,
];

/**
 * Listen for available events
 * @param  {String} eventName Name of event one of barcodeReadSuccess, barcodeReadFail
 * @param  {Function} handler Event handler
 */
DivaMobileZebraScanner.on = (eventName: any, handler: any) => {
  if (!DivaMobileZebraScanner.allowedEvents.includes(eventName)) {
    throw new Error(`Event name ${eventName} is not a supported event.`);
  }
  if (!activeBarcodeListener) {
    activeBarcodeListener = DeviceEventEmitter.addListener(eventName, handler);
  }
};

/**
 * Stop listening for event
 * @param  {String} eventName Name of event one of barcodeReadSuccess, barcodeReadFail
 * @param  {Function} handler Event handler
 */
DivaMobileZebraScanner.off = () => {
  activeBarcodeListener.remove();
};

module.exports = DivaMobileZebraScanner;
