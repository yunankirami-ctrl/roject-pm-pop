const express = require('express');
const path = path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const axios = require('axios');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sajikan file statis frontend dari folder public
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Helper: Kirim Pesan / Notifikasi via WhatsApp Gateway
async function sendWaNotification(targetWa, data) {
  const WA_API_KEY = process.env.WA_API_KEY; // Dari Environment Variables Vercel
  const DEFAULT_TARGET = process.env.TARGET_WA; // Dari Environment Variables Vercel

  const destinationNumber = targetWa || DEFAULT_TARGET;

  if (!WA_API_KEY) {
    console.warn('WA_API_KEY belum diset di Vercel Environment Variables.');
    return false;
  }

  const rectMerk = (data.rectifierData && data.rectifierData[0] && data.rectifierData[0].merk) || '-';
  const rectTipe = (data.rectifierData && data.rectifierData[0] && data.rectifierData[0].tipe) || '-';

  const message = 
    `*📊 LAPORAN PREVENTIVE MAINTENANCE BARU*\n` +
    `==================================\n\n` +
    `*📋 [COVER / GENERAL]*\n` +
    `• ID MR: ${data.idMr || '-'}\n` +
    `• Tanggal PM: ${data.tanggal || '-'}\n` +
    `• Nama POP: ${data.namaPop || '-'}\n` +
    `• Alamat: ${data.alamatPop || '-'}\n` +
    `• Tipe POP: ${data.tipePop || 'Super Backbone'}\n\n` +

    `*⚡ [KWH / PLN]*\n` +
    `• Kapasitas PLN: ${data.plnKapasitas || '-'}\n` +
    `• MCB Phase R: ${data.kwhMcbR || '-'} A\n\n` +

    `*🔌 [RECTIFIER]*\n` +
    `• Merk: ${rectMerk}\n` +
    `• Tipe: ${rectTipe}\n\n` +

    `*🔋 [BATTERY]*\n` +
    `• Merk: ${data.bateraiMerk || '-'}\n` +
    `• Kapasitas: ${data.bateraiKapasitas ? data.bateraiKapasitas + ' AH' : '-'}\n\n` +

    `*🌡️ [ENVIRONMENT]*\n` +
    `• Suhu Ruangan: ${data.suhuRuangan || '-'}\n` +
    `• Kondisi Gedung: ${data.kondisiGedung || '-'}\n\n` +
    `==================================\n` +
    `_✅ Data laporan PM di atas telah berhasil diproses oleh sistem._`;

  try {
    await axios.post('https://api.fonnte.com/send', {
      target: destinationNumber,
      message: message,
    }, {
      headers: { 'Authorization': WA_API_KEY }
    });
    return true;
  } catch (error) {
    console.error('Gagal Kirim Notifikasi WA:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Endpoint Submit Form PM
app.post('/api/submit-pm', async (req, res) => {
  try {
    const data = req.body;
    
    // Pencarian path file template Excel
    const possiblePaths = [
      path.join(__dirname, '..', 'public', 'templates', 'Template_PM_Bandung_Selatan.xlsx'),
      path.join(process.cwd(), 'public', 'templates', 'Template_PM_Bandung_Selatan.xlsx'),
      path.join(process.cwd(), 'public', 'templates', 'BANDUNG_SELATAN_GI_150KV.xlsx'),
      path.join(process.cwd(), 'templates', 'BANDUNG_SELATAN_GI_150KV.xlsx')
    ];

    let templatePath = possiblePaths.find(p => fs.existsSync(p));

    if (!templatePath) {
      console.error('File template Excel tidak ditemukan pada lokasi:', possiblePaths);
      return res.status(500).json({
        success: false,
        message: 'File template Excel tidak ditemukan di server Vercel.'
      });
    }

    // Load & Mapping data ke Template Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // 1. Mapping Cover
    const sheetCover = workbook.getWorksheet('COVER');
    if (sheetCover) {
      sheetCover.getCell('D8').value = data.idMr || '-';
      sheetCover.getCell('D9').value = data.tanggal || '-';
      sheetCover.getCell('D10').value = data.namaPop || 'GI BANDUNG SELATAN 150KV';
      sheetCover.getCell('D11').value = data.alamatPop || '-';
      sheetCover.getCell('D12').value = data.koordinatPop || '-';
      sheetCover.getCell('D13').value = data.tipePop || 'Super Backbone';
    }

    // 2. Mapping KWH
    const sheetKwh = workbook.getWorksheet('KWH');
    if (sheetKwh) {
      sheetKwh.getCell('C3').value = data.plnKapasitas || '-';
      sheetKwh.getCell('C4').value = data.kwhMcbR || '-';
    }

    // 3. Mapping Rectifier
    const sheetRect = workbook.getWorksheet('Rectifier');
    if (sheetRect && data.rectifierData && data.rectifierData.length > 0) {
      const rect1 = data.rectifierData[0];
      sheetRect.getCell('D3').value = rect1.merk || '-';
      sheetRect.getCell('D4').value = rect1.tipe || '-';
    }

    // 4. Mapping Battery
    const sheetBattery = workbook.getWorksheet('Battery');
    if (sheetBattery) {
      sheetBattery.getCell('D2').value = data.bateraiMerk || '-';
      sheetBattery.getCell('D4').value = data.bateraiKapasitas ? `${data.bateraiKapasitas}AH` : '-';
    }

    // 5. Mapping Environtment
    const sheetEnv = workbook.getWorksheet('Environtment');
    if (sheetEnv) {
      sheetEnv.getCell('B1').value = data.suhuRuangan || '-';
      sheetEnv.getCell('D4').value = data.kondisiGedung === 'OK' ? 'V' : '';
      sheetEnv.getCell('F4').value = data.kondisiGedung === 'NOK' ? 'V' : '';
    }

    // Proses pengiriman notifikasi ke WA
    const targetWa = data.targetWa || process.env.TARGET_WA;
    const isWaSent = await sendWaNotification(targetWa, data);

    return res.status(200).json({
      success: true,
      message: isWaSent 
        ? 'Laporan PM berhasil diproses dan notifikasi telah dikirimkan ke WhatsApp!' 
        : 'Laporan PM berhasil diproses, namun notifikasi WA gagal terkirim (Cek WA_API_KEY).'
    });

  } catch (error) {
    console.error('Error Vercel Serverless PM:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses Laporan PM di Server.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;