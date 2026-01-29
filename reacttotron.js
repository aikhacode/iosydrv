import Reactotron from 'reactotron-react-native';

// Change port & ensure host is correct for Android emulator
Reactotron.configure()
    // .useReactNative()
    .connect();

// Optional: log to console as well
console.tron = Reactotron;

export default Reactotron;
