// src/app.js
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import clientsRoutes from './routes/clients.routes.js';
import productsRoutes from './routes/products.routes.js';
import servicesRoutes from './routes/services.routes.js';
import proposalsRoutes from './routes/proposals.routes.js';
import reportsRoutes from './routes/reports.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);        // login/profile
app.use('/api/users', userRoutes);       // admin
app.use('/api/clients', clientsRoutes);  // técnicos/admin
app.use('/api/products', productsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/reports', reportsRoutes);

export default app;
