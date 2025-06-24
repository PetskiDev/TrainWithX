import app from '@backend/app';
import { env } from '@backend/utils/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${env.PORT}`);
});
