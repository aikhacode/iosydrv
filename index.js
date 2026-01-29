if (__DEV__) {
	require("./reacttotron");
}
/**
 * @format
 */
import './gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { legacy_createStore as createStore } from 'redux';
import allReducers from './src/reducers/index.js';
import { Provider } from 'react-redux';
import { ENV } from './src/config/config.js';
// import InternetConnectionAlert from "react-native-internet-connection-alert";


// console.log = (...args) => {
// 	// console.log(...args)
// }

console.log('env', ENV.PROD, ENV.DEV)
const isFabricEnabled = !!global._IS_FABRIC;
console.log("Fabric enabled?", isFabricEnabled);

const store = createStore(allReducers);
const ReduxApp = () => (
	<Provider store={store}>
		{/* <InternetConnectionAlert 
		onChange={(connectionState) => {
			console.log("Connection State: ", connectionState);
		}}> */}
		<App />
		{/* </InternetConnectionAlert> */}
	</Provider>
)

AppRegistry.registerComponent(appName, () => ReduxApp);
// LogBox.ignoreAllLogs();
