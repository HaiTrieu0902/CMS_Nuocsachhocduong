import { ETOKEN } from '@/constants/enum';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

// Request permissions and get token
async function requestUserPermission() {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BAns7L-faGDXGAJtePIUKEotaNOjYQdjWmJ2diuEZiA5Ae7D8aDzbA7QyynGTuX1rghZlQlkRovitBeKYp8mboE',
    });
    if (currentToken) {
      localStorage.setItem(ETOKEN.TOKEN_DEVICES, currentToken);
      console.log('currentToken', currentToken);
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }
}

// Listen to messages when the app is in the foreground
function setupOnMessageListener() {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('cek', messaging, payload);
      resolve(payload);
    });
  }).catch(() => {
    console.log('errr');
  });

// Initial setup
export function initializeFCM() {
  requestUserPermission();
  setupOnMessageListener();
}
