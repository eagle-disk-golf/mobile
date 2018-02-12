## Environment setup

For setting up the development enviroment refer to the docs (building projects with native code) 
https://facebook.github.io/react-native/docs/getting-started.html

After cloning the repository

<code>yarn install</code>  
<code>react-native link</code>

copy <code>env.example</code> as <code>.env</code> in your root directory and fill in the variables (from google console or ask colleague)

And run the application,

<code>react-native run-ios</code> 
or 
<code>react-native run-android</code>


### Developing with google maps on android emulator.

Due to bug https://github.com/react-community/react-native-maps/issues/1399, using maps is REALLY slow on emulator.

Changing the file <code>AirMapView.java</code>, located in <code>./node_modules/react-native-maps/lib/android/src/main/java/com/airbnb/android/react/maps/AirMapView.java</code>

Starting on line 102:
<pre><code>
 private static Context getNonBuggyContext(ThemedReactContext reactContext,
      ReactApplicationContext appContext) {
    Context superContext = reactContext;
    if (!contextHasBug(appContext.getCurrentActivity())) {
      superContext = appContext.getCurrentActivity();
    } else if (contextHasBug(superContext)) {
      // we have the bug! let's try to find a better context to use
      if (!contextHasBug(reactContext.getCurrentActivity())) {
        superContext = reactContext.getCurrentActivity();
      } else if (!contextHasBug(reactContext.getApplicationContext())) {
        superContext = reactContext.getApplicationContext();
      } else {
        // ¯\_(ツ)_/¯
      }
    }
    return superContext;
  }
</code></pre>

to

<pre><code>
 private static Context getNonBuggyContext(ThemedReactContext reactContext,
      ReactApplicationContext appContext) {
    Context superContext = reactContext;
      if (contextHasBug(superContext)) {
          // we have the bug! let's try to find a better context to use
      if (!contextHasBug(reactContext.getCurrentActivity())) {
        superContext = reactContext.getCurrentActivity();
      } else if (!contextHasBug(reactContext.getApplicationContext())) {
        superContext = reactContext.getApplicationContext();
      } else {
        // ¯\_(ツ)_/¯
      }
    }
    return superContext;
  }
</code></pre>

allows you to actually use the map when developing.


