import firebase from "firebase/app";

import "firebase/messaging";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const { REACT_APP_API_KEY } = process.env;
// const { REACT_APP_AUTH_ADMIN } = process.env;
// const { REACT_APP_PROJECT_ID } = process.env;
// const { REACT_APP_STROAGE_BUCKET } = process.env;
// const { REACT_APP_MESSAGING_SENDER_ID } = process.env;
// const { REACT_APP_APP_ID } = process.env;
// const { REACT_APP_MEASUREMENT_ID } = process.env;

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_API_KEY,
//     authDomain: process.env.REACT_APP_AUTH_ADMIN,
//     databaseURL:process.env.REACT_APP_DATABASE_URL,
//     projectId: process.env.REACT_APP_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_STROAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_APP_ID,
//     measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// };

// const firebaseConfig = {
//     apiKey: "AIzaSyAkLxqOWLX1nATjukG3vBezWwtjkQUAC1M",
//     authDomain: "passionaiari.firebaseapp.com",
//     projectId: "passionaiari",
//     storageBucket: "passionaiari.appspot.com",
//     messagingSenderId: "809187588387",
//     appId: "1:809187588387:web:62f0fa3c0aea6b0722b496",
//     measurementId: "G-VQ3G2ZDW17",
// };


// eco car wash start file

const firebaseConfig = {
    apiKey: "AIzaSyCqruQIr5DnWjGO8kXtfc-8B4wJkAUjoSg",
    authDomain: "eco-carwash-service.firebaseapp.com",
    databaseURL: "https://eco-carwash-service-default-rtdb.firebaseio.com",
    projectId: "eco-carwash-service",
    storageBucket: "eco-carwash-service.appspot.com",
    messagingSenderId: "706589683436",
    appId: "1:706589683436:web:c6f881a613298a710a7fc9",
    measurementId: "G-H30GWNQ9CR"
  };



// end file 

const firebase1 = firebase.initializeApp(firebaseConfig);
let messaging = null;

const publicKey = process.env.REACT_APP_VAPID_KEY;
console.log("REceived Public Keys", publicKey);
if (firebase.messaging.isSupported()) {
    messaging = firebase1.messaging();
    console.error("messaging suppported");
}
export const FCMToken = async () => {
    console.log();
    let token = "";
    try {
        token = await messaging.getToken({
            vapidKey: publicKey,
        });
    } catch (error) {
        console.log("An error occurred while retrieving token. ", error);
        console.log(error.response);
        return null;
    }
    console.log("token", token);
    return token;
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging.onMessage((payload) => {
            console.log("in main", payload);
            resolve(payload);
        });
    });

export default firebase1;
