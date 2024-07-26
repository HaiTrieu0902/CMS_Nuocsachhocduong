import { ETOKEN } from '@/constants/enum';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

// Request permissions and get token
async function requestUserPermission() {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BDEcfeiVKABugqeFAxcFKIUK8iusZtdzOCGD-_os7f83BFeo4Pms3fiz6L9Z3Jf7AFAI2u2dVrFLokwWnc4W_4E',
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
      resolve(payload);
    });
  });

// Initial setup
export function initializeFCM() {
  requestUserPermission();
  setupOnMessageListener();
}
