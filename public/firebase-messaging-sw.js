// // Import scripts
//importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId
firebase.initializeApp({
  apiKey: 'AIzaSyA-7nlM2TFCBfs--V2lRr2CXsrYgIyNRYs',
  authDomain: 'nuocsachhocduong-977b6.firebaseapp.com',
  projectId: 'nuocsachhocduong-977b6',
  storageBucket: 'nuocsachhocduong-977b6.appspot.com',
  messagingSenderId: '19688520247',
  appId: '1:19688520247:web:74438eb6d8e17c7b5d9db2',
  measurementId: 'G-B1RN8ZXYGM',
});

// // Retrieve an instance of Firebase Messaging so that it can handle background messages
 const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
 console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
   body: payload.notification.body,
 };
   self.registration.showNotification(notificationTitle, notificationOptions);
});





// const firebaseConfig = {
//    apiKey: 'AIzaSyA-7nlM2TFCBfs--V2lRr2CXsrYgIyNRYs',
//   authDomain: 'nuocsachhocduong-977b6.firebaseapp.com',
//   projectId: 'nuocsachhocduong-977b6',
//   storageBucket: 'nuocsachhocduong-977b6.appspot.com',
//   messagingSenderId: '19688520247',
//   appId: '1:19688520247:web:74438eb6d8e17c7b5d9db2',
//   measurementId: 'G-B1RN8ZXYGM',
// };

// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// // const messaging = firebase.messaging();

// if (firebase.messaging.isSupported()) {
//  const messaging = firebase.messaging();
//  try {
//    const channel = new BroadcastChannel('notifications');
//    messaging.onBackgroundMessage(function (payload) {
//      console.log("payloadpayloadpayloadpayload", payload);
//      channel.postMessage(payload);
//    });

//    self.addEventListener('notificationclick', function (event) {
//      const body = event.notification;
//      body.close();
//      event.waitUntil(
//        clients.openWindow('https://www.youtube.com/')
//      );
//    });

//  } catch (error) {
//    console.error("Error:", error);
//  }
// }


