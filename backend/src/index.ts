import app from '@src/app';
import { env } from '@src/utils/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${env.PORT}`);
});
