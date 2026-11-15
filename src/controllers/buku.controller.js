
import * as service from '../services/buku.service.js';

export async function daftar(req, res) {
    const hasil = await service.daftarBuku(req.query);
    res.json({ data: hasil, meta: { total: hasil.length } });
}

export async function detail(req, res) {
    const b = await service.detailBuku(req.params.id);
    res.json({ data: b });
}

export async function buat(req, res) {
    const baru = await service.buatBuku(req.body);
    res.status(201).json({ data: baru });
}

export async function ubah(req, res) {
    const hasil = await service.ubahBuku(
        req.params.id, req.body
    );
    res.status(200).json({ data: hasil });
}

export async function hapus(req, res) {
    await service.hapusBuku(req.params.id);
    res.status(204).end();
}
