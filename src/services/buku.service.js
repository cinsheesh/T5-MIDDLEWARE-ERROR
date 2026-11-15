import * as data from '../data/buku.data.js';
import { AppError } from '../utils/AppError.js';

export async function daftarBuku({ kategori }) {
    const semua = data.semua();
    return kategori
        ? semua.filter(b => b.kategori === kategori)
        : semua;
}

export async function detailBuku(id) {
    const b = data.cariById(Number(id));
    if (!b) {
        throw new AppError(404, 'Buku tidak ditemukan', 'NOT_FOUND');
    }
    return b;
}

export async function buatBuku(input) {
    if (data.cariByJudul(input.judul)) {
        throw new AppError(409, `Judul ${input.judul} sudah terdaftar`,'JUDUL_DUPLIKAT');
    }
    return data.simpan(input);
}

export async function ubahBuku(id, input) {
    const buku = data.cariById(Number(id));
    if (!buku) {
        throw new AppError(404,'Buku tidak ditemukan', 'NOT_FOUND');
    }

    const duplikat = data.cariByJudul(input.judul);

    if (duplikat && duplikat.id !== Number(id)) {
        throw new AppError(409,`Judul ${input.judul} sudah terdaftar`,'JUDUL_DUPLIKAT');
    }
    return data.ubah(Number(id), input);
}

export async function hapusBuku(id) {
    const berhasil = data.hapus(Number(id));

    if (!berhasil) {
        throw new AppError(404,'Buku tidak ditemukan','NOT_FOUND');
    }
}