import { ETOKEN } from '@/constants/enum';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

// Request permissions and get token
async function requestUserPermission() {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BKz-E3NZap64pyDC-iGtWKH-xvZuyxBvs0I_H00BwC4N-2003WvBASO7XTXBeEnhDn0_LKPFYVg4UN69IUC54cs',
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

// Initial setup
export function initializeFCM() {
  requestUserPermission();
  setupOnMessageListener();
}
