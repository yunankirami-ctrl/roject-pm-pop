import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs || {}

// Helper konversi logo ke Base64
async function getBase64ImageFromUrl(imageUrl) {
  if (!imageUrl) return null
  try {
    const res = await fetch(imageUrl)
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    return null
  }
}

export async function generatePMPdf(data) {
  const cover = data.cover || {}

  // Load Logo dari public/logo-pln.png
  const logoBase64 = await getBase64ImageFromUrl('/logo-pln.png')

  // Simbol centang/box untuk Tipe POP
  const isSuperBackbone = cover.tipe_pop === 'Super Backbone' ? '☑ Super Backbone' : '☐ Super Backbone'
  const isBackbone = cover.tipe_pop === 'Backbone' ? '☑ Backbone' : '☐ Backbone'
  const isDistribusi = cover.tipe_pop === 'Distribusi' ? '☑ Distribusi' : '☐ Distribusi'

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [30, 30, 30, 30],
    content: [
      // ================= PAGE 1: COVER =================
      {
        table: {
          widths: ['100%'],
          body: [
            // HEADER JUDUL
            [
              {
                text: 'MAINTENANCE RUTIN REPORT',
                style: 'coverHeaderTitle',
                alignment: 'center',
                margin: [0, 8, 0, 8]
              }
            ],
            // LOGO PLN ICON PLUS
            [
              logoBase64
                ? { image: logoBase64, width: 160, alignment: 'center', margin: [0, 10, 0, 10] }
                : { text: 'PLN Icon Plus', style: 'brandFallback', alignment: 'center', margin: [0, 15, 0, 15] }
            ]
          ]
        },
        layout: {
          hLineWidth: (i) => (i === 0 || i === 2 ? 1.5 : 1),
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        }
      },

      // TABEL DETAIL COVER
      {
        table: {
          widths: ['28%', '2%', '70%'],
          body: [
            ['ID MR', ':', cover.id_mr || ''],
            ['Tanggal Pelaksanaan', ':', cover.tanggal_pelaksanaan || ''],
            ['Nama POP', ':', cover.nama_pop || ''],
            ['Alamat POP', ':', cover.alamat_pop || ''],
            ['Koordinat POP', ':', cover.koordinat_pop || ''],
            [
              'Tipe POP',
              ':',
              {
                stack: [
                  { text: isSuperBackbone, margin: [0, 1, 0, 1] },
                  { text: isBackbone, margin: [0, 1, 0, 1] },
                  { text: isDistribusi, margin: [0, 1, 0, 1] }
                ]
              }
            ],
            [
              'Tim Lapangan Maintenance Rutin',
              ':',
              {
                table: {
                  widths: ['50%', '50%'],
                  body: [
                    [
                      { text: 'PLN ICON PLUS', alignment: 'center', bold: true },
                      { text: 'PLN STI', alignment: 'center', bold: true }
                    ],
                    [
                      { text: cover.tim_icon || '-', alignment: 'center', margin: [0, 15, 0, 15] },
                      { text: cover.tim_sti || '-', alignment: 'center', margin: [0, 15, 0, 15] }
                    ]
                  ]
                },
                layout: {
                  hLineWidth: () => 1,
                  vLineWidth: () => 1,
                  hLineColor: () => '#000000',
                  vLineColor: () => '#000000'
                }
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0] // Menempelkan dengan tabel header di atas
      },

      { text: '', pageBreak: 'after' } // Pemisah ke Halaman 2 (Grounding)
    ],
    styles: {
      coverHeaderTitle: { fontSize: 14, bold: true, color: '#000000' },
      brandFallback: { fontSize: 18, bold: true, color: '#00A2E9' }
    }
  }

  return pdfMake.createPdf(docDefinition)
}