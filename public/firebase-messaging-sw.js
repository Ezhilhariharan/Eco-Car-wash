// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config

// const { REACT_APP_API_KEY } = process.env;
// const { REACT_APP_AUTH_ADMIN } = process.env;
// const { REACT_APP_PROJECT_ID } = process.env;
// const { REACT_APP_STROAGE_BUCKET } = process.env;
// const { REACT_APP_MESSAGING_SENDER_ID } = process.env;
// const { REACT_APP_APP_ID } = process.env;
// const { REACT_APP_MEASUREMENT_ID } = process.env;

// const firebaseConfig = {
//     apiKey: "AIzaSyAkLxqOWLX1nATjukG3vBezWwtjkQUAC1M",
//     authDomain: "passionaiari.firebaseapp.com",
//     projectId: "passionaiari",
//     storageBucket: "passionaiari.appspot.com",
//     messagingSenderId: "809187588387",
//     appId: "1:809187588387:web:62f0fa3c0aea6b0722b496",
//     measurementId: "G-VQ3G2ZDW17",
// };



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


// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
console.log("firebase init done");

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message ", payload);
    let notificationTitle = null;
    let notificationOptions = {
        body: null,
        icon: "/logo192.png",
    };
    if (payload.hasOwnProperty("notification")) {
        (notificationTitle = payload.notification.title),
            (notificationOptions.body = payload.notification.body);
    } else if (!Object.hasOwnProperty("notification")) {
        (notificationTitle = "sample"),
            (notificationOptions.body = payload.data.default);
    } else {
        alert("payload format not match");
    }

    // eslint-disable-next-line no-restricted-globals
    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});
