import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

// Inisialisasi VFS Fonts untuk pdfMake
pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs || {}

// Helper fungsi konversi URL Gambar ke Base64 (aman dengan Timeout & Catch)
async function getBase64ImageFromUrl(imageUrl) {
  if (!imageUrl) return null
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000) // Timeout 4 detik

    const res = await fetch(imageUrl, { signal: controller.signal, mode: 'cors' })
    clearTimeout(timeoutId)
    
    if (!res.ok) return null
    const blob = await res.blob()

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.warn('Gagal mengubah foto ke Base64 untuk PDF:', err)
    return null
  }
}

export async function generatePMPdf(data) {
  const coverData = data?.cover || {}

  const isSuperBackbone = coverData.tipe_pop === 'Super Backbone' ? '[X]' : '[  ]'
  const isBackbone = coverData.tipe_pop === 'Backbone' ? '[X]' : '[  ]'
  const isDistribusi = coverData.tipe_pop === 'Distribusi' ? '[X]' : '[  ]'

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
    } catch {
      return dateStr
    }
  }

  // Kumpulkan semua URL Foto Dokumentasi
  const groundingPhotos = data.grounding?.photos || []
  const kwhPhotos = data.kwh?.photos || []
  const gensetPhotos = data.genset?.photos || []
  const envPhotos = data.environment?.photos || []

  const allPhotoUrls = [...groundingPhotos, ...kwhPhotos, ...gensetPhotos, ...envPhotos]
  const imageBlocks = []

  // Process foto satu per satu secara paralel
  const imagePromises = allPhotoUrls.map(url => getBase64ImageFromUrl(url))
  const base64Results = await Promise.all(imagePromises)

  base64Results.forEach(base64Img => {
    if (base64Img) {
      imageBlocks.push({
        image: base64Img,
        width: 140,
        margin: [5, 5, 5, 5]
      })
    }
  })

  // Buat Definisi Dokumen PDF
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [30, 30, 30, 30],
    content: [
      // HEADER JUDUL
      {
        table: {
          widths: ['*'],
          body: [
            [{ text: 'MAINTENANCE RUTIN REPORT', style: 'mainHeader', alignment: 'center' }],
            [{ text: 'PLN ICON PLUS', style: 'brandText', alignment: 'center', margin: [0, 2, 0, 4] }]
          ]
        },
        margin: [0, 0, 0, 15]
      },

      // INFORMASI COVER / POP
      {
        text: '1. Informasi Umum POP',
        style: 'sectionHeader'
      },
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
            ['Tim Lapangan ICON', ':', coverData.tim_icon || coverData.tim_lapangan || '-'],
            ['Tim Lapangan STI', ':', coverData.tim_sti || '-']
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
      mainHeader: { fontSize: 14, bold: true, margin: [0, 4, 0, 2] },
      brandText: { fontSize: 16, bold: true, color: '#00A2E9' },
      sectionHeader: { fontSize: 11, bold: true, color: '#00A2E9', margin: [0, 6, 0, 4] }
    }
  }

  return pdfMake.createPdf(docDefinition)
}