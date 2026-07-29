import 'dotenv/config';
import app from './app.js';
import { connectDb } from './db.js';

const port = process.env.PORT || 4000;

connectDb()
  .then(() => {
    app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
