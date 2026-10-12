import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs || {}

const LOGO_PLN_ICON = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_PLN.png/600px-Logo_PLN.png'

async function getBase64ImageFromUrl(imageUrl) {
  try {
    const res = await fetch(imageUrl)
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    return null
  }
}

export async function generatePMPdf(data) {
  const coverData = data?.cover || {}
  const logoBase64 = await getBase64ImageFromUrl(LOGO_PLN_ICON)

  const isSuperBackbone = coverData.tipe_pop === 'Super Backbone' ? '[X]' : '[  ]'
  const isBackbone = coverData.tipe_pop === 'Backbone' ? '[X]' : '[  ]'
  const isDistribusi = coverData.tipe_pop === 'Distribusi' ? '[X]' : '[  ]'

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
  }

  // Ambil foto dari seluruh modul
  const groundingPhotos = data.grounding?.photos || []
  const kwhPhotos = data.kwh?.photos || []
  const gensetPhotos = data.genset?.photos || []
  const envPhotos = data.environment?.photos || []

  const allPhotoUrls = [...groundingPhotos, ...kwhPhotos, ...gensetPhotos, ...envPhotos]
  const imageBlocks = []

  for (const url of allPhotoUrls) {
    const base64Img = await getBase64ImageFromUrl(url)
    if (base64Img) {
      imageBlocks.push({
        image: base64Img,
        width: 150,
        margin: [5, 5, 5, 5]
      })
    }
  }

  const docDefinition = {
    pageSize: 'A4',
    pageMargin: [30, 30, 30, 30],
    content: [
      // HEADER JUDUL & LOGO
      {
        table: {
          widths: ['*'],
          body: [
            [{ text: 'MAINTENANCE RUTIN REPORT', style: 'mainHeader', alignment: 'center' }],
            [
              logoBase64
                ? { image: logoBase64, width: 130, alignment: 'center', margin: [0, 4, 0, 4] }
                : { text: 'PLN Icon Plus', style: 'brandText', alignment: 'center' }
            ]
          ]
        },
        margin: [0, 0, 0, 10]
      },

      // INFORMASI COVER
      {
        table: {
          widths: ['30%', '3%', '67%'],
          body: [
            ['ID MR', ':', coverData.id_mr || '-'],
            ['Tanggal Pelaksanaan', ':', formatTanggal(coverData.tanggal_pelaksanaan)],
            ['Nama POP', ':', coverData.nama_pop || '-'],
            ['Alamat POP', ':', coverData.alamat_pop || '-'],
            ['Koordinat POP', ':', coverData.koordinat_pop || '-'],
            [
              'Tipe POP',
              ':',
              `${isSuperBackbone} Super Backbone   ${isBackbone} Backbone   ${isDistribusi} Distribusi`
            ],
            [
              'Tim Lapangan ICON',
              ':',
              coverData.tim_icon || coverData.tim_lapangan || '-'
            ],
            [
              'Tim Lapangan STI',
              ':',
              coverData.tim_sti || '-'
            ]
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
            ['Bak Kontrol Outdoor', `${data.grounding?.pengukuran_outdoor || '-'} Ohm`],
            ['Bak Kontrol Indoor', `${data.grounding?.pengukuran_indoor || '-'} Ohm`],
            ['Sistem Grounding', data.grounding?.system_grounding || '-']
          ]
        },
        margin: [0, 0, 0, 15]
      },

      // ENVIRONMENT & ALARMS
      { text: '3. Environment & Alarm Ruangan', style: 'sectionHeader' },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            ['Suhu Ruangan', `${data.environment?.suhu || '-'} °C`],
            ['External Alarm', data.environment?.alarms?.external_alarm || 'OK'],
            ['Door Open', data.environment?.alarms?.door_open || 'OK'],
            ['PLN Off', data.environment?.alarms?.pln_off || 'OK'],
            ['High Temp', data.environment?.alarms?.high_temp || 'OK'],
            ['Smoke & Fire', data.environment?.alarms?.smoke_fire || 'OK']
          ]
        },
        margin: [0, 0, 0, 15]
      },

      // DOKUMENTASI FOTO
      { text: '4. Dokumentasi Foto Lapangan', style: 'sectionHeader' },
      imageBlocks.length > 0
        ? { columns: imageBlocks }
        : { text: 'Tidak ada foto dokumentasi yang diunggah.', italic: true, color: '#777777' }
    ],
    styles: {
      mainHeader: { fontSize: 14, bold: true, margin: [0, 4, 0, 4] },
      brandText: { fontSize: 18, bold: true, color: '#00A2E9' },
      sectionHeader: { fontSize: 12, bold: true, color: '#00A2E9', margin: [0, 8, 0, 4] }
    }
  }

  return pdfMake.createPdf(docDefinition)
}