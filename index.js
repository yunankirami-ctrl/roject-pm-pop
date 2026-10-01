const express = require('express');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 1. Sajikan file HTML statis dari folder public
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// 2. Endpoint API Submit PM Form
app.post('/api/submit-pm', async (req, res) => {
  try {
    const data = req.body;
    
    // Path dinamis mengecek beberapa kemungkinan lokasi file Excel
    let templatePath = path.join(process.cwd(), 'public', 'templates', 'Template_PM_Bandung_Selatan.xlsx');

    // Pengecekan cadangan jika ditaruh di folder lain
    if (!fs.existsSync(templatePath)) {
      templatePath = path.join(process.cwd(), 'public', 'templates', 'BANDUNG_SELATAN_GI_150KV.xlsx');
    }
    if (!fs.existsSync(templatePath)) {
      templatePath = path.join(process.cwd(), 'templates', 'Template_PM_Bandung_Selatan.xlsx');
    }
    if (!fs.existsSync(templatePath)) {
      templatePath = path.join(process.cwd(), 'BANDUNG_SELATAN_GI_150KV.xlsx');
    }

    if (!fs.existsSync(templatePath)) {
      console.error('File template Excel tidak ditemukan!');
      return res.status(500).json({
        success: false,
        message: 'File template Excel tidak ditemukan di server Vercel.'
      });
    }

    // 1. Load Template Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // 2. Mapping Data ke Sheet COVER
    const sheetCover = workbook.getWorksheet('COVER');
    if (sheetCover) {
      sheetCover.getCell('D8').value = data.idMr || '-';
      sheetCover.getCell('D9').value = data.tanggal || '-';
      sheetCover.getCell('D10').value = data.namaPop || 'GI BANDUNG SELATAN 150KV';
      sheetCover.getCell('D11').value = data.alamatPop || '-';
      sheetCover.getCell('D12').value = data.koordinatPop || '-';
      sheetCover.getCell('D13').value = data.tipePop || 'Super Backbone';
    }

    // 3. Mapping Data ke Sheet KWH
    const sheetKwh = workbook.getWorksheet('KWH');
    if (sheetKwh) {
      sheetKwh.getCell('C3').value = data.plnKapasitas || '-';
      sheetKwh.getCell('C4').value = data.kwhMcbR || '-';
      sheetKwh.getCell('C5').value = data.kwhMcbS || '-';
      sheetKwh.getCell('C6').value = data.kwhMcbT || '-';
    }

    // 4. Mapping Data ke Sheet Rectifier
    const sheetRect = workbook.getWorksheet('Rectifier');
    if (sheetRect && data.rectifierData && data.rectifierData.length > 0) {
      const rect1 = data.rectifierData[0];
      sheetRect.getCell('D3').value = rect1.merk || '-';
      sheetRect.getCell('D4').value = rect1.tipe || '-';

      if (rect1.mcbs && Array.isArray(rect1.mcbs)) {
        let mcbStartRow = 16;
        rect1.mcbs.forEach((mcb, idx) => {
          if (mcbStartRow + (idx * 3) <= 30) {
            let rowIdx = mcbStartRow + (idx * 3);
            sheetRect.getCell(`E${rowIdx}`).value = mcb.cap ? `${mcb.cap}A` : '-';
            sheetRect.getCell(`E${rowIdx + 1}`).value = mcb.peruntukan || '-';
          }
        });
      }
    }

    // 5. Mapping Data ke Sheet AIR CONDITIONER
    const sheetAc = workbook.getWorksheet('AIR CONDITIONER');
    if (sheetAc && data.acList && data.acList.length > 0) {
      data.acList.forEach((ac, idx) => {
        let baseRow = 2 + (idx * 6);
        if (baseRow < 25) {
          sheetAc.getCell(`D${baseRow}`).value = ac.merk || '-';
          sheetAc.getCell(`D${baseRow + 1}`).value = ac.kapasitas || '-';
        }
      });
    }

    // 6. Mapping Data ke Sheet Battery
    const sheetBattery = workbook.getWorksheet('Battery');
    if (sheetBattery) {
      sheetBattery.getCell('D2').value = data.bateraiMerk || '-';
      sheetBattery.getCell('D4').value = data.bateraiKapasitas ? `${data.bateraiKapasitas}AH` : '-';
    }

    // 7. Mapping Data ke Sheet Environtment
    const sheetEnv = workbook.getWorksheet('Environtment');
    if (sheetEnv) {
      sheetEnv.getCell('B1').value = data.suhuRuangan || '-';
      sheetEnv.getCell('D4').value = data.kondisiGedung === 'OK' ? 'V' : '';
      sheetEnv.getCell('F4').value = data.kondisiGedung === 'NOK' ? 'V' : '';
    }

    // 8. Generate Excel Buffer untuk Serverless
    const buffer = await workbook.xlsx.writeBuffer();
    const cleanPopName = (data.namaPop || 'BANDUNG_SELATAN').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `PM_${cleanPopName}_${Date.now()}.xlsx`;

    // Kirim langsung sebagai file Download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(buffer);

  } catch (error) {
    console.error('Error Vercel Serverless Excel:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses template Excel di Vercel.' });
  }
});

// Jalankan server lokal jika diuji di localhost
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;