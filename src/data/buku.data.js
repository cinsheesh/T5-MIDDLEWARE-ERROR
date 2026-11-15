const buku = [
    {
        id: 1,
        judul: 'Laskar Pelangi',
        penulis: 'Andrea Hirata',
        tahun: 2005,
        stok: 5,
        kategori: 'novel'
    },
    {
        id: 2,
        judul: 'Bumi Manusia',
        penulis: 'Pramoedya Ananta Toer',
        tahun: 1980,
        stok: 3,
        kategori: 'novel'
    },
    {
        id: 3,
        judul: 'Sapiens',
        penulis: 'Yuval Noah Harari',
        tahun: 2011,
        stok: 4,
        kategori: 'sejarah'
    },
    {
        id: 4,
        judul: 'A Brief History of Time',
        penulis: 'Stephen Hawking',
        tahun: 1988,
        stok: 2,
        kategori: 'sains'
    },
    {
        id: 5,
        judul: 'Cosmos',
        penulis: 'Carl Sagan',
        tahun: 1980,
        stok: 6,
        kategori: 'sains'
    }
];

export function semua() {
    return buku;
}

export function cariById(id) {
    return buku.find(b => b.id === id);
}

export function cariByJudul(judul) {
    return buku.find(b =>
        b.judul.toLowerCase() === judul.toLowerCase()
    );
}

export function simpan(input) {
    const baru = { id: buku.length + 1, ...input };
    buku.push(baru);
    return baru;
}

export function ubah(id, input){
    const index = buku.find(b => b.id === id);
    if (index === 1){
        return null;
    }
    buku[index] = {id: id, ...input};
    return buku[index]
}

export function hapus(id) {
    const index = buku.findIndex(b => b.id === id);
    if (index === -1) {
        return false;
    }

    buku.splice(index, 1);
    return true;
}