import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs || {}

export function generatePMPdf(data) {
  const docDefinition = {
    pageSize: 'A4',
    pageMargin: [30, 30, 30, 30],
    content: [
      { text: 'LAPORAN PREVENTIVE MAINTENANCE POP SHELTER', style: 'header', alignment: 'center' },
      { text: `POP: ${data.cover.nama_pop || '-'} | Tanggal: ${data.cover.tanggal_pelaksanaan}`, style: 'subheader', alignment: 'center' },
      { text: '----------------------------------------------------------------------------------------------------------------', margin: [0, 5, 0, 15] },

      // COVER INFO
      { text: '1. Informasi Umum POP', style: 'sectionHeader' },
      {
        table: {
          widths: ['30%', '70%'],
          body: [
            ['ID MR', data.cover.id_mr || '-'],
            ['Nama POP', data.cover.nama_pop || '-'],
            ['Alamat POP', data.cover.alamat_pop || '-'],
            ['Tipe POP', data.cover.tipe_pop || '-'],
            ['Tim Lapangan', data.cover.tim_lapangan || '-']
          ]
        },
        margin: [0, 0, 0, 15]
      },

      // GROUNDING
      { text: '2. Pengukuran Grounding System', style: 'sectionHeader' },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            ['Bak Kontrol Outdoor', `${data.grounding.pengukuran_outdoor || '-'} Ohm`],
            ['Bak Kontrol Indoor', `${data.grounding.pengukuran_indoor || '-'} Ohm`],
            ['Sistem Grounding', data.grounding.system_grounding || '-']
          ]
        },
        margin: [0, 0, 0, 15]
      },

      // KWH METER
      { text: '3. Main AC Power Information (KWH Meter)', style: 'sectionHeader' },
      {
        table: {
          widths: ['33%', '33%', '34%'],
          body: [
            ['ID Customer: ' + (data.kwh.id_customer || '-'), 'Phasa: ' + data.kwh.phasa, 'Daya: ' + (data.kwh.daya_kva || '-') + ' KVA'],
            ['Tegangan R-N: ' + (data.kwh.voltage_rn || '-') + ' V', 'Tegangan S-N: ' + (data.kwh.voltage_sn || '-') + ' V', 'Tegangan T-N: ' + (data.kwh.voltage_tn || '-') + ' V'],
            ['Arus R: ' + (data.kwh.ampere_r || '-') + ' A', 'Arus S: ' + (data.kwh.ampere_s || '-') + ' A', 'Arus T: ' + (data.kwh.ampere_t || '-') + ' A'],
            ['Tegangan N-G: ' + (data.kwh.voltage_ng || '-') + ' V', 'COS Phi: ' + data.kwh.cos_phi_status, 'Arester: ' + data.kwh.arester_status]
          ]
        },
        margin: [0, 0, 0, 15]
      },

      // ENVIRONMENT
      { text: '4. Environment & Alarm Ruangan', style: 'sectionHeader' },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            ['Suhu Ruangan', `${data.environment.suhu || '-'} °C`],
            ['External Alarm', data.environment.alarms.external_alarm],
            ['Door Open', data.environment.alarms.door_open],
            ['PLN Off', data.environment.alarms.pln_off],
            ['High Temp', data.environment.alarms.high_temp],
            ['Smoke & Fire', data.environment.alarms.smoke_fire]
          ]
        },
        margin: [0, 0, 0, 15]
      }
    ],
    styles: {
      header: { fontSize: 16, bold: true },
      subheader: { fontSize: 11, color: '#555555', margin: [0, 2, 0, 5] },
      sectionHeader: { fontSize: 12, bold: true, color: '#00A2E9', margin: [0, 8, 0, 4] }
    }
  }

  return pdfMake.createPdf(docDefinition)
}