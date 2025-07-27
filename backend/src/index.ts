import app from '@src/app.js';
import { env } from '@src/utils/env.js';

app.listen(env.PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`🚀[PROD] running on ${env.FRONTEND_URL}`);
  } else {
    console.log(`🚀 API running on ${env.API_URL}`);
  }
});
