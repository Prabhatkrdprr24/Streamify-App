import express from 'express';
import "dotenv/config";
import authRoute from './routes/auth.route.js';
import {connectDB} from './lib/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('api/users', userRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Streamify!');
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
})