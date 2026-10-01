const express = require('express');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const axios = require('axios');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Helper: Unggah File ke OneDrive via Microsoft Graph API
async function uploadToOneDrive(buffer, fileName) {
  const ONEDRIVE_ACCESS_TOKEN = process.env.ONEDRIVE_ACCESS_TOKEN; // Set di Vercel Environment Variables
  if (!ONEDRIVE_ACCESS_TOKEN) {
    console.warn('ONEDRIVE_ACCESS_TOKEN belum diset.');
    return null;
  }

  try {
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/Laporan_PM/${fileName}:/content`;
    const response = await axios.put(uploadUrl, buffer, {
      headers: {
        'Authorization': `Bearer ${ONEDRIVE_ACCESS_TOKEN}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });

    return response.data.webUrl; // Mengembalikan URL Link File di OneDrive
  } catch (error) {
    console.error('Gagal Unggah ke OneDrive:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Helper: Kirim Notifikasi WA via Gateway (Contoh: Fonnte API)
async function sendWaNotification(targetWa, data, fileUrl) {
  const FONNTE_TOKEN = process.env.FONNTE_TOKEN; // Set di Vercel Environment Variables
  if (!FONNTE_TOKEN) {
    console.warn('FONNTE_TOKEN belum diset.');
    return false;
  }

  const message = 
    `*🔔 NOTIFIKASI LAPORAN PM BARU*\n` +
    `==================================\n` +
    `*ID MR:* ${data.idMr}\n` +
    `*Tanggal:* ${data.tanggal}\n` +
    `*POP:* ${data.namaPop}\n` +
    `*Status:* File Excel berhasil tersimpan ke OneDrive!\n\n` +
    `*Link File OneDrive:*\n${fileUrl || 'Gagal generate link OneDrive'}\n` +
    `==================================`;

  try {
    await axios.post('https://api.fonnte.com/send', {
      target: targetWa,
      message: message,
    }, {
      headers: { 'Authorization': FONNTE_TOKEN }
    });
    return true;
  } catch (error) {
    console.error('Gagal Kirim WA Gateway:', error.message);
    return false;
  }
}

// Endpoint Submit Form
app.post('/api/submit-pm', async (req, res) => {
  try {
    const data = req.body;
    
    // Search Template Path
    const possiblePaths = [
      path.join(__dirname, '..', 'public', 'templates', 'Template_PM_Bandung_Selatan.xlsx'),
      path.join(process.cwd(), 'public', 'templates', 'Template_PM_Bandung_Selatan.xlsx'),
      path.join(process.cwd(), 'public', 'templates', 'BANDUNG_SELATAN_GI_150KV.xlsx'),
      path.join(process.cwd(), 'templates', 'BANDUNG_SELATAN_GI_150KV.xlsx')
    ];

    let templatePath = possiblePaths.find(p => fs.existsSync(p));

    if (!templatePath) {
      return res.status(500).json({
        success: false,
        message: 'File template Excel tidak ditemukan di server.'
      });
    }

    // Load & Mapping Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const sheetCover = workbook.getWorksheet('COVER');
    if (sheetCover) {
      sheetCover.getCell('D8').value = data.idMr || '-';
      sheetCover.getCell('D9').value = data.tanggal || '-';
      sheetCover.getCell('D10').value = data.namaPop || 'GI BANDUNG SELATAN 150KV';
      sheetCover.getCell('D11').value = data.alamatPop || '-';
      sheetCover.getCell('D12').value = data.koordinatPop || '-';
      sheetCover.getCell('D13').value = data.tipePop || 'Super Backbone';
    }

    const sheetKwh = workbook.getWorksheet('KWH');
    if (sheetKwh) {
      sheetKwh.getCell('C3').value = data.plnKapasitas || '-';
      sheetKwh.getCell('C4').value = data.kwhMcbR || '-';
    }

    const sheetRect = workbook.getWorksheet('Rectifier');
    if (sheetRect && data.rectifierData && data.rectifierData.length > 0) {
      const rect1 = data.rectifierData[0];
      sheetRect.getCell('D3').value = rect1.merk || '-';
      sheetRect.getCell('D4').value = rect1.tipe || '-';
    }

    const sheetBattery = workbook.getWorksheet('Battery');
    if (sheetBattery) {
      sheetBattery.getCell('D2').value = data.bateraiMerk || '-';
      sheetBattery.getCell('D4').value = data.bateraiKapasitas ? `${data.bateraiKapasitas}AH` : '-';
    }

    const sheetEnv = workbook.getWorksheet('Environtment');
    if (sheetEnv) {
      sheetEnv.getCell('B1').value = data.suhuRuangan || '-';
      sheetEnv.getCell('D4').value = data.kondisiGedung === 'OK' ? 'V' : '';
      sheetEnv.getCell('F4').value = data.kondisiGedung === 'NOK' ? 'V' : '';
    }

    // Generate Excel Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const cleanPopName = (data.namaPop || 'BANDUNG_SELATAN').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `PM_${cleanPopName}_${Date.now()}.xlsx`;

    // 1. Upload ke OneDrive
    const oneDriveUrl = await uploadToOneDrive(buffer, fileName);

    // 2. Kirim Notifikasi via WA Gateway jika nomor tujuan diisi
    if (data.targetWa) {
      await sendWaNotification(data.targetWa, data, oneDriveUrl);
    }

    return res.status(200).json({
      success: true,
      message: 'Laporan PM berhasil diproses, disimpan ke OneDrive, dan notifikasi WA dikirim!',
      oneDriveUrl: oneDriveUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('Error Processing PM Report:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses Laporan PM di Server.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;