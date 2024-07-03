import { ETOKEN } from '@/constants/enum';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

// Request permissions and get token
async function requestUserPermission() {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BC1WxgAbydOTTsBD6KnX2eeQoMMV1uyZlBG2GRFUB64GTAEhdxgcCU1kVwo9Y6oY-2CG5CrczcWvSVwdf80xUQI',
    });
    if (currentToken) {
      console.log('📢 [fcmService.ts:11]', currentToken);
      localStorage.setItem(ETOKEN.TOKEN_DEVICES, currentToken);
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
