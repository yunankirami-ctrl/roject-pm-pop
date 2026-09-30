const express = require('express');
const ExcelJS = require('exceljs');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'tmp/' });

app.use(express.static('public'));

// Gunakan environment variable untuk keamanan
const WA_API_KEY = process.env.WA_API_KEY || 'API_KEY_FONNTE_ANDA'; 
// Gunakan format 62xxx untuk Fonnte
const TARGET_WA = process.env.TARGET_WA || '6281234567890'; 

const multiUpload = upload.fields([
  { name: 'fotoCover', maxCount: 1 },
  { name: 'fotoGrounding', maxCount: 1 },
  { name: 'fotoKwh', maxCount: 1 },
  { name: 'fotoGenset', maxCount: 1 },
  { name: 'fotoAcpdb', maxCount: 1 },
  { name: 'fotoRectifier', maxCount: 1 },
  { name: 'fotoInverter', maxCount: 1 },
  { name: 'fotoAc', maxCount: 1 },
  { name: 'fotoBattery', maxCount: 1 },
  { name: 'fotoDcpdb', maxCount: 1 },
  { name: 'fotoRak', maxCount: 1 },
  { name: 'fotoEnv', maxCount: 1 },
  { name: 'fotoDenah', maxCount: 1 }
]);

function insertImageToSheet(workbook, sheet, fileField, cellRange) {
  if (sheet && fileField && fileField[0]) {
    const ext = path.extname(fileField[0].originalname).replace('.', '') || 'png';
    const imgId = workbook.addImage({ 
      filename: fileField[0].path, 
      extension: ext === 'jpg' ? 'jpeg' : ext 
    });
    sheet.addImage(imgId, cellRange);
  }
}

app.post('/api/submit', multiUpload, async (req, res) => {
  const b = req.body;
  const f = req.files;

  // Sesuaikan nama berkas template dengan yang ada di folder
  const templatePath = path.join(__dirname, 'BANDUNG SELATAN GI 150KV_2.xlsx');
  const outputPath = path.join(__dirname, `Laporan_${b.namaPop ? b.namaPop.replace(/\s+/g, '_') : 'POP'}_${Date.now()}.xlsx`);

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // 1. COVER
    const sCover = workbook.getWorksheet('COVER');
    if (sCover) {
      sCover.getCell('D8').value = b.idMr;
      sCover.getCell('D9').value = b.tanggal;
      sCover.getCell('D10').value = b.namaPop;
      sCover.getCell('D11').value = b.alamatPop;
      sCover.getCell('D12').value = b.koordinat;
      sCover.getCell('D13').value = b.tipePop;
      insertImageToSheet(workbook, sCover, f['fotoCover'], 'B16:F30');
    }

    // 2. GROUNDING
    const sGround = workbook.getWorksheet('Grounding');
    if (sGround) {
      if (b.groundOutdoor) sGround.getCell('B2').value = `${b.groundOutdoor} Ohm`;
      if (b.groundIndoor) sGround.getCell('B3').value = `${b.groundIndoor} Ohm`;
      if (b.groundSystem) sGround.getCell('B4').value = b.groundSystem;
      insertImageToSheet(workbook, sGround, f['fotoGrounding'], 'A6:D15');
    }

    // 3. KWH
    const sKwh = workbook.getWorksheet('KWH');
    if (sKwh) {
      sKwh.getCell('B2').value = b.kwhId;
      sKwh.getCell('B3').value = b.kwhNama;
      sKwh.getCell('B4').value = b.kwhPhasa;
      sKwh.getCell('B5').value = b.kwhDaya;
      sKwh.getCell('B6').value = b.kwhMcbR;
      sKwh.getCell('C6').value = b.kwhMcbS;
      sKwh.getCell('D6').value = b.kwhMcbT;
      sKwh.getCell('B7').value = b.kwhVoltR;
      sKwh.getCell('C7').value = b.kwhVoltS;
      sKwh.getCell('D7').value = b.kwhVoltT;
      sKwh.getCell('B8').value = b.kwhAmpR;
      sKwh.getCell('C8').value = b.kwhAmpS;
      sKwh.getCell('D8').value = b.kwhAmpT;
      sKwh.getCell('B9').value = b.kwhStand;
      insertImageToSheet(workbook, sKwh, f['fotoKwh'], 'A12:E26');
    }

    // 4. GENSET
    const sGenset = workbook.getWorksheet('Genset');
    if (sGenset) {
      sGenset.getCell('E2').value = b.gensetMerk;
      sGenset.getCell('E4').value = b.gensetKva;
      sGenset.getCell('E9').value = b.gensetFuel;
      sGenset.getCell('E11').value = b.gensetHour;
      insertImageToSheet(workbook, sGenset, f['fotoGenset'], 'A15:G30');
    }

    // 5. ACPDB
    const sAcpdb = workbook.getWorksheet('ACPDB');
    if (sAcpdb && b.acpdbLabel) {
      const labels = Array.isArray(b.acpdbLabel) ? b.acpdbLabel : [b.acpdbLabel];
      const amperes = Array.isArray(b.acpdbAmpere) ? b.acpdbAmpere : [b.acpdbAmpere];
      labels.forEach((label, idx) => {
        const startRow = 4 + idx;
        sAcpdb.getCell(`A${startRow}`).value = label;
        sAcpdb.getCell(`B${startRow}`).value = amperes[idx] || '';
      });
      insertImageToSheet(workbook, sAcpdb, f['fotoAcpdb'], 'A15:E28');
    }

    // 6. RECTIFIER & BREAKOUT MCB
    const sRect = workbook.getWorksheet('Rectifier');
    if (sRect) {
      if (b.rectMerk) {
        const merks = Array.isArray(b.rectMerk) ? b.rectMerk : [b.rectMerk];
        const types = Array.isArray(b.rectType) ? b.rectType : [b.rectType];
        const moduls = Array.isArray(b.rectModul) ? b.rectModul : [b.rectModul];

        merks.forEach((merk, idx) => {
          const rowNum = 3 + idx;
          sRect.getCell(`A${rowNum}`).value = merk;
          sRect.getCell(`B${rowNum}`).value = types[idx] || '';
          sRect.getCell(`C${rowNum}`).value = moduls[idx] || '';
        });
      }

      if (b.rectMcbCap) {
        const caps = Array.isArray(b.rectMcbCap) ? b.rectMcbCap : [b.rectMcbCap];
        const peruntukans = Array.isArray(b.rectMcbPeruntukan) ? b.rectMcbPeruntukan : [b.rectMcbPeruntukan];
        const loads = Array.isArray(b.rectMcbLoad) ? b.rectMcbLoad : [b.rectMcbLoad];

        sRect.getCell('A8').value = 'KAPASITAS MCB';
        sRect.getCell('B8').value = 'PERUNTUKAN';
        sRect.getCell('C8').value = 'LOAD TERUKUR';

        caps.forEach((cap, idx) => {
          const rowNum = 9 + idx;
          sRect.getCell(`A${rowNum}`).value = cap;
          sRect.getCell(`B${rowNum}`).value = peruntukans[idx] || '';
          sRect.getCell(`C${rowNum}`).value = loads[idx] || '';
        });
      }
      insertImageToSheet(workbook, sRect, f['fotoRectifier'], 'A18:E32');
    }

    // 7. INVERTER
    const sInv = workbook.getWorksheet('Inverter');
    if (sInv) {
      sInv.getCell('B2').value = b.invMerk;
      sInv.getCell('B3').value = b.invKva;
      insertImageToSheet(workbook, sInv, f['fotoInverter'], 'A8:D20');
    }

    // 8. AIR CONDITIONER
    const sAc = workbook.getWorksheet('AIR CONDITIONER');
    if (sAc && b.acMerk) {
      const merks = Array.isArray(b.acMerk) ? b.acMerk : [b.acMerk];
      const pks = Array.isArray(b.acPk) ? b.acPk : [b.acPk];
      const statuses = Array.isArray(b.acStatus) ? b.acStatus : [b.acStatus];

      merks.forEach((merk, idx) => {
        const startRow = 3 + idx;
        sAc.getCell(`A${startRow}`).value = merk;
        sAc.getCell(`B${startRow}`).value = pks[idx] || '';
        sAc.getCell(`C${startRow}`).value = statuses[idx] || '';
      });
      insertImageToSheet(workbook, sAc, f['fotoAc'], 'A12:E25');
    }

    // 9. BATTERY
    const sBat = workbook.getWorksheet('Battery');
    if (sBat && b.batMerk) {
      const merks = Array.isArray(b.batMerk) ? b.batMerk : [b.batMerk];
      const types = Array.isArray(b.batType) ? b.batType : [b.batType];
      const ahs = Array.isArray(b.batAh) ? b.batAh : [b.batAh];
      merks.forEach((merk, idx) => {
        const startRow = 3 + idx;
        sBat.getCell(`A${startRow}`).value = merk;
        sBat.getCell(`B${startRow}`).value = types[idx] || '';
        sBat.getCell(`C${startRow}`).value = ahs[idx] || '';
      });
      insertImageToSheet(workbook, sBat, f['fotoBattery'], 'A15:E28');
    }

    // 10. DCPDB
    const sDcpdb = workbook.getWorksheet('DCPDB');
    if (sDcpdb && b.dcpdbLabel) {
      const labels = Array.isArray(b.dcpdbLabel) ? b.dcpdbLabel : [b.dcpdbLabel];
      const amperes = Array.isArray(b.dcpdbAmpere) ? b.dcpdbAmpere : [b.dcpdbAmpere];
      labels.forEach((label, idx) => {
        const startRow = 4 + idx;
        sDcpdb.getCell(`A${startRow}`).value = label;
        sDcpdb.getCell(`B${startRow}`).value = amperes[idx] || '';
      });
      insertImageToSheet(workbook, sDcpdb, f['fotoDcpdb'], 'A15:E28');
    }

    // 11. DISTRIBUSI RAK
    const sRak = workbook.getWorksheet('Distribusi Rak');
    if (sRak && b.rakNama) {
      const rakNamas = Array.isArray(b.rakNama) ? b.rakNama : [b.rakNama];
      const mcbs = Array.isArray(b.rakMcbA) ? b.rakMcbA : [b.rakMcbA];
      const loads = Array.isArray(b.rakLoadA) ? b.rakLoadA : [b.rakLoadA];
      rakNamas.forEach((nama, idx) => {
        const startRow = 3 + idx;
        sRak.getCell(`A${startRow}`).value = nama;
        sRak.getCell(`B${startRow}`).value = mcbs[idx] || '';
        sRak.getCell(`C${startRow}`).value = loads[idx] || '';
      });
      insertImageToSheet(workbook, sRak, f['fotoRak'], 'A15:E28');
    }

    // 12. ENVIRONTMENT
    const sEnv = workbook.getWorksheet('Environtment');
    if (sEnv) {
      sEnv.getCell('B2').value = b.envSuhu;
      sEnv.getCell('B3').value = b.envServiceAc;
      insertImageToSheet(workbook, sEnv, f['fotoEnv'], 'A10:E22');
    }

    // 13. DOKUMENTASI
    const sDok = workbook.getWorksheet('Dokumentasi');
    if (sDok) {
      insertImageToSheet(workbook, sDok, f['fotoDenah'], 'A3:F20');
    }

    await workbook.xlsx.writeFile(outputPath);

    const form = new FormData();
    form.append('target', TARGET_WA);
    form.append('message', `*LAPORAN PENDATAAN POP*\nNama POP: ${b.namaPop || '-'}\nTanggal: ${b.tanggal || '-'}`);
    form.append('file', fs.createReadStream(outputPath));

    await axios.post('https://api.fonnte.com/send', form, {
      headers: { ...form.getHeaders(), 'Authorization': WA_API_KEY }
    });

    res.json({ success: true, message: 'Laporan berhasil disimpan dan dikirim via WhatsApp!' });

  } catch (err) {
    console.error('Error processing report:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses file Excel.' });
  } finally {
    // Selalu bersihkan file temporary baik sukses maupun gagal
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    if (f) {
      Object.keys(f).forEach(k => {
        if (f[k][0] && fs.existsSync(f[k][0].path)) fs.unlinkSync(f[k][0].path);
      });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));