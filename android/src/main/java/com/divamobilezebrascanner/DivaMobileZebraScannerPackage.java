package com.divamobilezebrascanner;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


public class DivaMobileZebraScannerPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        if (android.os.Build.MANUFACTURER.contains("Zebra Technologies")) {
            modules.add(new DivaMobileZebraScannerModule(reactContext));
        }
        return modules;
    }

    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return null;
    }
}
