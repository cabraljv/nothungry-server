import path from 'path';

import { Storage } from '@google-cloud/storage';

const serviceKey = path.join(__dirname, '..', '..', 'keys.json');

export default new Storage({
  autoRetry: true,
  projectId: 'nothungry',
  keyFilename: serviceKey,
});
