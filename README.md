# Tugas 5 - Middleware & Error Terpusat

## Identitas

- **Nama:** [Cindy Natasya Aulia Putri]
- **NIM:** [F1D0231019]
- **Varian:** A — Perpustakaan

## Cara Menjalankan

1. Buka proyek `T5-MIDDLEWARE-ERROR` menggunakan Visual Studio Code.
2. Buka terminal, kemudian instal seluruh dependency dengan perintah:

   ```bash
   npm install
   ```

3. Jalankan server menggunakan perintah:

   ```bash
   npm run dev
   ```

4. Setelah server berjalan, API dapat diakses melalui:

   ```
   http://localhost:3000
   ```

5. Untuk menjalankan request POST, PUT, dan DELETE, gunakan API key berikut pada header:

   ```
   x-api-key: rahasia123
   ```

6. Pengujian API dapat dilakukan menggunakan REST Client pada file `requests.http` atau melalui Postman.

## Struktur Proyek

```text
T5-MIDDLEWARE-ERROR/
├── src/
│   ├── routes/
│   │   └── buku.routes.js
│   ├── controllers/
│   │   └── buku.controller.js
│   ├── services/
│   │   └── buku.service.js
│   ├── data/
│   │   └── buku.data.js
│   ├── middleware/
│   │   ├── cekApiKey.js
│   │   ├── validasi.js
│   │   ├── logger.js
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   ├── validators/
│   │   └── buku.validator.js
│   └── utils/
│       └── AppError.js
├── screenshot/
├── index.js
├── requests.http
├── package.json
├── package-lock.json
└── README.md
```

Struktur proyek menggunakan arsitektur empat lapis, yaitu **routes, controllers, services, dan data**, dengan tanggung jawab sebagai berikut:

- **Routes:** Menentukan endpoint API dan menghubungkan request dengan middleware serta controller.
- **Controllers:** Menerima request, memanggil service, dan mengirimkan response kepada client.
- **Services:** Menangani proses dan aturan bisnis, seperti pemeriksaan judul duplikat dan keberadaan buku.
- **Data:** Menyimpan serta mengelola data buku menggunakan array.
- **Middleware:** Melakukan pemeriksaan API key, validasi, pencatatan request, dan penanganan error.
- **Validators:** Menentukan aturan validasi data buku menggunakan Joi.
- **Utils:** Menyediakan class AppError untuk membuat objek kesalahan.
- **index.js:** Menjadi file utama untuk menjalankan server dan mendaftarkan router serta middleware.

## Endpoint

| Method | URL | Middleware | Status |
|---|---|---|---|
| GET | `/buku` | logger | 200 |
| GET | `/buku?kategori=sains` | logger | 200 |
| GET | `/buku/:id` | logger | 200, 404 |
| POST | `/buku` | logger, cekApiKey, validasi | 201, 401, 422, 409 |
| DELETE | `/buku/:id` | logger, cekApiKey | 204, 401, 404 |
| PUT | `/buku/:id` | logger, cekApiKey, validasi | 200, 401, 404, 409, 422 |

Endpoint PUT merupakan fitur bonus yang digunakan untuk memperbarui data buku berdasarkan ID.

## Aturan Validasi, Aturan Bisnis, dan Kode Error

### 1. Aturan Validasi Joi

Validasi data dilakukan menggunakan Joi pada file `buku.validator.js`.

| Field | Aturan Validasi |
|---|---|
| judul | String, 3–100 karakter, wajib |
| penulis | String, minimal 3 karakter, wajib |
| tahun | Bilangan bulat, 1900–2026, wajib |
| stok | Bilangan bulat, 0–100, default 1 |
| kategori | Salah satu dari novel, sains, sejarah, agama, wajib |

Validasi menggunakan `abortEarly: false` agar seluruh kesalahan dapat ditampilkan sekaligus. Jika data tidak memenuhi aturan, middleware validasi akan menghasilkan status **422 VALIDATION_ERROR**.

### 2. Aturan Bisnis

Aturan bisnis pada sistem perpustakaan adalah judul buku tidak boleh duplikat, meskipun terdapat perbedaan penggunaan huruf besar dan kecil.

Pemeriksaan dilakukan menggunakan fungsi `cariByJudul()` dengan `toLowerCase()` untuk membandingkan judul buku. Jika judul sudah terdaftar, sistem menghasilkan status **409 Conflict** dengan kode `JUDUL_DUPLIKAT`.

Aturan duplikat ditempatkan pada lapisan service karena memerlukan pemeriksaan terhadap data yang sudah tersimpan. Sementara itu, Joi hanya digunakan untuk memvalidasi format, tipe, dan batas nilai data.

### 3. Kode Error

| Status | Kode Error | Keterangan |
|---|---|---|
| 401 | UNAUTHORIZED | API key tidak valid atau tidak dikirim |
| 404 | NOT_FOUND | Buku tidak ditemukan |
| 404 | ROUTE_NOT_FOUND | Endpoint tidak tersedia |
| 409 | JUDUL_DUPLIKAT | Judul buku sudah terdaftar |
| 422 | VALIDATION_ERROR | Data tidak sesuai aturan validasi Joi |
| 500 | INTERNAL_ERROR | Terjadi kesalahan internal server |

Penanganan error dilakukan secara terpusat menggunakan `AppError`, `notFound`, dan `errorHandler`, dengan format respons:

```json
{
    "error": {
        "pesan": "Pesan kesalahan",
        "kode": "KODE_ERROR"
    }
}
```

Jika terjadi error 500, client hanya menerima pesan umum `Terjadi kesalahan pada server`, sedangkan detail kesalahan ditampilkan pada terminal untuk membantu proses debugging.

## Pengujian

Pengujian REST API dilakukan menggunakan ekstensi REST Client pada Visual Studio Code melalui file `requests.http` dan aplikasi Postman.

### 1. GET Buku Tidak Ditemukan (404)

Pengujian dilakukan dengan mengakses `/buku/999` untuk memastikan sistem menghasilkan status 404 dengan kode `NOT_FOUND` ketika buku tidak tersedia.

![GET Buku Tidak Ditemukan](screenshot/get-404.png)

### 2. URL Tidak Dikenal (404)

Pengujian dilakukan dengan mengakses `/xyz` untuk memastikan middleware `notFound` menghasilkan status 404 dengan kode `ROUTE_NOT_FOUND`.

![URL Tidak Dikenal](screenshot/route-404.png)

### 3. POST Tanpa API Key (401)

Pengujian dilakukan dengan mengirimkan request POST tanpa header `x-api-key`. Server menolak permintaan dengan status 401 dan kode `UNAUTHORIZED`.

![POST Tanpa API Key](screenshot/post-401.png)

### 4. POST Data Tidak Valid (422)

Pengujian dilakukan dengan mengirimkan data buku yang tidak memenuhi aturan Joi, seperti judul terlalu pendek, tahun melebihi batas, dan kategori yang tidak tersedia. Server menghasilkan status 422 dengan kode `VALIDATION_ERROR`.

![POST Data Tidak Valid](screenshot/post-422.png)

### 5. POST Judul Duplikat (409)

Pengujian dilakukan dengan menambahkan buku yang judulnya sudah terdaftar, tetapi menggunakan huruf kecil. Server menghasilkan status 409 dengan kode `JUDUL_DUPLIKAT`.

![POST Judul Duplikat](screenshot/post-409.png)

### 6. POST Berhasil (201)

Pengujian dilakukan dengan mengirimkan data buku baru yang valid menggunakan API key yang benar. Server menghasilkan status 201 dan mengembalikan data buku yang berhasil ditambahkan.

![POST Berhasil](screenshot/post-201.png)

### 7. DELETE Berhasil (204)

Pengujian dilakukan dengan menghapus buku berdasarkan ID yang tersedia. Server menghasilkan status 204 tanpa mengirimkan body respons.

![DELETE Berhasil](screenshot/delete-204.png)

### 8. PUT Berhasil (200) — Bonus

Pengujian dilakukan dengan memperbarui data buku melalui endpoint `PUT /buku/:id`. Server menghasilkan status 200 dan mengembalikan data buku yang sudah diperbarui.

![PUT Berhasil](screenshot/put-200.png)

### 9. Pengujian Error 500

Pengujian dilakukan dengan sengaja mengganti method `push()` menjadi `dorong()` pada file `buku.data.js`, kemudian mengirimkan request POST dengan data valid.

Client menerima status 500 dengan pesan umum, sedangkan terminal menampilkan detail error `TypeError`. Setelah pengujian selesai, kode dikembalikan menjadi `push()`.

**Hasil pada REST Client:**

![Error 500 Client](screenshot/error-500-client.png)

**Hasil pada terminal server:**

![Error 500 Terminal](screenshot/error-500-terminal.png)

### 10. Pengujian Logger

Middleware logger mencatat method, URL, status respons, dan waktu pemrosesan setiap request. Pengujian dilakukan untuk memastikan status 404, 401, 422, 201, dan 204 tercatat pada terminal.

![Logger Terminal](screenshot/logger.png)

### 11. File requests.http

Seluruh pengujian endpoint disimpan dalam file `requests.http` agar dapat dijalankan kembali menggunakan ekstensi REST Client.

![Requests HTTP](screenshot/requests-http.png)

## Deklarasi Penggunaan AI

Dalam pengerjaan tugas ini, saya menggunakan ChatGPT sebagai alat bantu dalam pembuatan data awal buku perpustakaan dan penyusunan dokumentasi proyek.

| Bagian | Alat AI | Dipakai untuk Apa | Cara Saya Memeriksa Hasilnya |
|---|---|---|---|
| Data Buku | ChatGPT | Membantu membuat lima contoh data awal buku perpustakaan dengan atribut id, judul, penulis, tahun, stok, dan kategori | Memeriksa kelengkapan atribut dan menguji data menggunakan GET `/buku` |
| Dokumentasi | ChatGPT | Membantu menyusun README.md sesuai format dan ketentuan tugas | Mencocokkan dokumentasi dengan struktur proyek, kode program, dan hasil pengujian |

### Contoh Prompt

"Buatkan lima data buku perpustakaan dengan atribut id, judul, penulis, tahun, stok, dan kategori."

### Pernyataan

Saya menggunakan AI pada bagian yang tercantum dalam tabel sebagai alat bantu pembuatan data awal dan penyusunan dokumentasi. Hasil yang diperoleh diperiksa kembali agar sesuai dengan kebutuhan dan ketentuan tugas.

## Kesimpulan & Kendala

### Kesimpulan

Pada tugas ini, REST API Perpustakaan berhasil dikembangkan menggunakan Node.js, Express.js, dan Joi dengan struktur empat lapis, yaitu routes, controllers, services, dan data. Sistem menyediakan fitur untuk menampilkan, mencari, menambahkan, mengubah, dan menghapus data buku.

Penggunaan middleware memungkinkan proses pemeriksaan API key, validasi data, serta pencatatan aktivitas request dilakukan secara terpisah. Penanganan error terpusat menggunakan `AppError` dan `errorHandler` juga membuat format respons kesalahan lebih konsisten.

Sebelum menggunakan error terpusat, setiap endpoint dapat menangani kesalahan dengan caranya masing-masing sehingga berpotensi menghasilkan respons yang berbeda. Setelah menggunakan error terpusat, seluruh kesalahan ditangani melalui satu middleware dengan format JSON yang seragam.

### Kendala dan Solusi

1. **Library Joi tidak ditemukan.** Masalah terjadi karena Joi belum terinstal pada project baru. Kendala diselesaikan dengan menjalankan `npm install joi`.

2. **Endpoint GET /buku tidak ditemukan.** Permintaan awal menghasilkan `ROUTE_NOT_FOUND`. Masalah diselesaikan dengan memeriksa pendaftaran router pada `index.js` dan memastikan server menjalankan project yang benar.

3. **GET detail menghasilkan error 500.** Kendala ditelusuri melalui pesan error pada terminal, kemudian kode diperiksa hingga endpoint dapat menghasilkan respons sesuai ketentuan.

4. **Penanganan error server.** Pengujian error 500 dilakukan dengan sengaja membuat kesalahan pada method array untuk memastikan detail kesalahan hanya ditampilkan pada terminal, bukan kepada client.