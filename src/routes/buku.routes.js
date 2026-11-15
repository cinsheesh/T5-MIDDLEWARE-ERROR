import express from 'express';
import * as ctrl from '../controllers/buku.controller.js';
import { cekApiKey } from '../middleware/cekApiKey.js';
import { validasi } from '../middleware/validasi.js';
import { skemaBuku } from '../validators/buku.validator.js';

const router = express.Router();

router.use((req, res, next) => {
    console.log('[buku]', req.method, req.originalUrl);
    next();
});

router.get('/', ctrl.daftar);
router.get('/:id', ctrl.detail);
router.post('/', cekApiKey, validasi(skemaBuku), ctrl.buat);
router.put('/:id', cekApiKey, validasi(skemaBuku), ctrl.ubah);
router.delete('/:id', cekApiKey, ctrl.hapus);

export default router;
