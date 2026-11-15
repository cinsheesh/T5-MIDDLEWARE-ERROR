
import express from 'express';
import bukuRoutes from './src/routes/buku.routes.js';
import { logger } from './src/middleware/logger.js';
import { notFound } from './src/middleware/notFound.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.send('Halo dari express!');
});

app.use('/buku', bukuRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
