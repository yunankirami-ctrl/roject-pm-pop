const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

// Gunakan direktori sementara sistem (/tmp di Vercel)
const tmpDir = os.tmpdir();

// Konfigurasi Multer untuk mengunggah file ke direktori sementara
const upload = multer({ dest: tmpDir });

// Serve static files dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint untuk menangani submit form
app.post('/api/submit', upload.fields([
    { name: 'fotoBangunan', maxCount: 1 },
    { name: 'fotoLayout', maxCount: 1 },
    { name: 'acFoto', maxCount: 10 },
    { name: 'hidrantFoto', maxCount: 10 },
    { name: 'aparFoto', maxCount: 10 },
    { name: 'pencahayaanFoto', maxCount: 10 },
    { name: 'stopKontakFoto', maxCount: 10 }
]), async (req, res) => {
    try {
        const body = req.body;
        const files = req.files || {};

        // Path ke template Excel di root proyek
        const templatePath = path.join(__dirname, 'BANDUNG SELATAN GI 150KV.xlsx');
        
        if (!fs.existsSync(templatePath)) {
            return res.status(500).json({ error: 'File template Excel tidak ditemukan!' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet(1); // Mengambil sheet pertama

        // 1. Mengisi Data Informasi Umum
        if (body.namaGi) worksheet.getCell('C4').value = body.namaGi;
        if (body.lokasiGi) worksheet.getCell('C5').value = body.lokasiGi;
        if (body.tanggalInspeksi) worksheet.getCell('C6').value = body.tanggalInspeksi;
        if (body.petugasInspeksi) worksheet.getCell('C7').value = body.petugasInspeksi;

        // Helper function untuk memasukkan gambar ke dalam cell
        const addImageToCell = (fileArray, cellRef) => {
            if (fileArray && fileArray.length > 0) {
                const imagePath = fileArray[0].path;
                const imageId = workbook.addImage({
                    filename: imagePath,
                    extension: path.extname(fileArray[0].originalname).substring(1) || 'png',
                });
                worksheet.addImage(imageId, cellRef);
            }
        };

        // Mengisi foto bangunan & layout jika ada
        if (files['fotoBangunan']) addImageToCell(files['fotoBangunan'], 'B9:D15');
        if (files['fotoLayout']) addImageToCell(files['fotoLayout'], 'E9:G15');

        // 2. Helper function untuk mengisi data array / tabel dinamis
        const fillDynamicData = (startRow, merkArray, kondisiArray, fotoArray) => {
            if (!merkArray) return;
            
            const merks = Array.isArray(merkArray) ? merkArray : [merkArray];
            const kondisis = Array.isArray(kondisiArray) ? kondisiArray : [kondisiArray];
            const fotos = fotoArray || [];

            merks.forEach((merk, index) => {
                const currentRow = startRow + index;
                worksheet.getCell(`B${currentRow}`).value = index + 1;
                worksheet.getCell(`C${currentRow}`).value = merk;
                worksheet.getCell(`D${currentRow}`).value = kondisis[index] || '';

                if (fotos[index]) {
                    const imageId = workbook.addImage({
                        filename: fotos[index].path,
                        extension: path.extname(fotos[index].originalname).substring(1) || 'png',
                    });
                    worksheet.addImage(imageId, `E${currentRow}:E${currentRow}`);
                }
            });
        };

        // Mengisi data tabel dinamis
        fillDynamicData(18, body.acMerk, body.acKondisi, files['acFoto']);
        fillDynamicData(25, body.hidrantMerk, body.hidrantKondisi, files['hidrantFoto']);
        fillDynamicData(32, body.aparMerk, body.aparKondisi, files['aparFoto']);
        fillDynamicData(39, body.pencahayaanMerk, body.pencahayaanKondisi, files['pencahayaanFoto']);
        fillDynamicData(46, body.stopKontakMerk, body.stopKontakKondisi, files['stopKontakFoto']);

        // Simpan hasil ke folder temp Vercel/Sistem
        const outputPath = path.join(tmpDir, `Hasil_Inspeksi_${Date.now()}.xlsx`);
        await workbook.xlsx.writeFile(outputPath);

        // Hapus file upload sementara dari folder temp
        Object.keys(files).forEach(key => {
            files[key].forEach(file => {
                fs.unlink(file.path, () => {});
            });
        });

        // Kirimkan file Excel ke client
        res.download(outputPath, 'Hasil_Inspeksi_GI.xlsx', (err) => {
            if (err) console.error("Error saat mendownload file:", err);
            // Hapus file hasil setelah terkirim
            fs.unlink(outputPath, () => {});
        });

    } catch (error) {
        console.error('Error memproses form:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses data.' });
    }
});

// Jalankan server jika dijalankan secara lokal
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
    });
}

// Export app wajib untuk Vercel
module.exports = app;