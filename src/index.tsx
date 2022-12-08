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

export const allowedEvents = [
  DivaMobileZebraScanner.BARCODE_READ_SUCCESS,
  DivaMobileZebraScanner.BARCODE_READ_FAIL,
];

let listeners = new Map<string, EmitterSubscription>();

/**
 * Listen for available events
 * @param  {String} eventName Name of event one of barcodeReadSuccess, barcodeReadFail
 * @param  {Function} handler Event handler
 */
DivaMobileZebraScanner.on = (eventName: any, handler: any) => {
  if (!allowedEvents.includes(eventName)) {
    throw new Error(`Event name ${eventName} is not a supported event.`);
  }
  listeners.set(eventName, DeviceEventEmitter.addListener(eventName, handler));
};

/**
 * Stop listening for event
 * @param  {String} eventName Name of event one of barcodeReadSuccess, barcodeReadFail
 * @param  {Function} handler Event handler
 */
DivaMobileZebraScanner.off = (eventName: any) => {
  if (!allowedEvents.includes(eventName)) {
    throw new Error(`Event name ${eventName} is not a supported event.`);
  }

  const eventSubscription = listeners.get(eventName);

  if (eventSubscription) {
    eventSubscription.remove();
  }
};
