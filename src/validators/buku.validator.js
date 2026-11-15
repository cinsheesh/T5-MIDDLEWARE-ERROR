
import Joi from 'joi';

export const skemaBuku = Joi.object({
    judul: Joi.string().min(3).max(100).required(),
    penulis: Joi.string().min(3).required(),
    tahun: Joi.number().integer().min(1900).max(2026).required(),
    stok: Joi.number().integer().min(0).max(100).default(1),
    kategori: Joi.string().valid('novel', 'sains', 'sejarah', 'agama').required()
});
