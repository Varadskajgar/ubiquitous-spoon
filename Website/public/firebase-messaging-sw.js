/* Replace this config with your Firebase web app config. Configure VAPID in the client. */
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"YOUR_API_KEY",authDomain:"YOUR_PROJECT.firebaseapp.com",projectId:"YOUR_PROJECT_ID",messagingSenderId:"YOUR_SENDER_ID",appId:"YOUR_APP_ID"});
const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{const title=payload.notification?.title||"Realistic Mart";self.registration.showNotification(title,{body:payload.notification?.body||"You have an update.",icon:"/icon.png"});});
