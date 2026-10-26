import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs || {}

// Helper konversi logo / foto ke Base64 (dengan timeout aman)
async function getBase64ImageFromUrl(imageUrl) {
  if (!imageUrl) return null
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)
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
    return null
  }
}

export async function generatePMPdf(data) {
  const cover = data?.cover || {}
  const grounding = data?.grounding || {}
  const kwh = data?.kwh || {}
  const genset = data?.genset || {}
  const acList = data?.ac || []
  const acpdb = data?.acpdb || {}
  const acpdbMcbs = acpdb.mcbs || []
  const rectList = data?.rectifiers || []
  const rectPhotos = data?.rectifier_photos || []
  const rectComments = data?.rectifier_comments || ''

  // 1. Load Logo PLN Icon Plus
  const logoBase64 = await getBase64ImageFromUrl('/logo-pln.png')

  // 2. Simbol centang/box untuk Tipe POP
  const isSuperBackbone = cover.tipe_pop === 'Super Backbone' ? '☑ Super Backbone' : '☐ Super Backbone'
  const isBackbone = cover.tipe_pop === 'Backbone' ? '☑ Backbone' : '☐ Backbone'
  const isDistribusi = cover.tipe_pop === 'Distribusi' ? '☑ Distribusi' : '☐ Distribusi'

  // 3. Process Foto Grounding
  const groundingImages = []
  if (grounding.photos && grounding.photos.length > 0) {
    for (const url of grounding.photos) {
      const b64 = await getBase64ImageFromUrl(url)
      if (b64) {
        groundingImages.push({ image: b64, width: 200, alignment: 'center', margin: [0, 5, 0, 5] })
      }
    }
  }

  // 4. Process Foto KWH
  const kwhImages = []
  if (kwh.photos && kwh.photos.length > 0) {
    for (const url of kwh.photos) {
      const b64 = await getBase64ImageFromUrl(url)
      if (b64) {
        kwhImages.push({ image: b64, width: 180, alignment: 'center', margin: [0, 5, 0, 5] })
      }
    }
  }

  // 5. Process Foto Genset
  const gensetImages = []
  if (genset.photos && genset.photos.length > 0) {
    for (const url of genset.photos) {
      const b64 = await getBase64ImageFromUrl(url)
      if (b64) {
        gensetImages.push({ image: b64, width: 180, alignment: 'center', margin: [0, 5, 0, 5] })
      }
    }
  }

  // 6. Process Foto AC
  const acImages = []
  if (data?.ac_photos && data.ac_photos.length > 0) {
    for (const url of data.ac_photos) {
      const b64 = await getBase64ImageFromUrl(url)
      if (b64) {
        acImages.push({ image: b64, width: 180, alignment: 'center', margin: [0, 5, 0, 5] })
      }
    }
  }

  // 7. Process Foto ACPDB
  const acpdbImages = []
  if (acpdb.photos && acpdb.photos.length > 0) {
    for (const url of acpdb.photos) {
      const b64 = await getBase64ImageFromUrl(url)
      if (b64) {
        acpdbImages.push({ image: b64, width: 180, alignment: 'center', margin: [0, 5, 0, 5] })
      }
    }
  }

  // 8. Process Foto Rectifier
  const rectImages = []
  if (rectPhotos.length > 0) {
    for (const url of rectPhotos) {
      const b64 = await getBase64ImageFromUrl(url)
      if (b64) {
        rectImages.push({ image: b64, width: 180, alignment: 'center', margin: [0, 5, 0, 5] })
      }
    }
  }

  // Checkbox simbol helper Genset
  const isAuto = genset.switch_mode === 'Automatic' ? '☑ Automatic   ☐ Manual' : '☐ Automatic   ☑ Manual'

  // Susun Baris Tabel Unit AC
  const acTableRows = []
  acList.forEach((unit) => {
    acTableRows.push([
      { text: unit.kode_ac || 'AC', alignment: 'center', bold: true, margin: [0, 15, 0, 0] },
      {
        table: {
          widths: ['40%', '60%'],
          body: [
            ['Merk', unit.merk || '-'],
            ['PK', unit.pk || '-'],
            ['SN', unit.sn || '-'],
            ['Kapasitas MCB', unit.mcb || '-'],
            ['Beban', unit.beban || '-'],
            ['Tahun Instalasi', unit.tahun_instalasi || '-']
          ]
        },
        layout: 'noBorders'
      }
    ])
  })

  // Susun Baris Tabel MCB ACPDB
  const acpdbRows = [
    [
      { text: '', bold: true, alignment: 'center' },
      { text: 'Phasa', bold: true, alignment: 'center' },
      { text: 'Merk', bold: true, alignment: 'center' },
      { text: 'Kapasitas', bold: true, alignment: 'center' },
      { text: 'A terukur', bold: true, alignment: 'center' },
      { text: 'Peruntukan', bold: true, alignment: 'center' }
    ]
  ]

  acpdbMcbs.forEach((row) => {
    acpdbRows.push([
      { text: row.mcb_label || 'MCB', bold: true, alignment: 'center' },
      { text: row.phasa || '-', alignment: 'center' },
      { text: row.merk || '-', alignment: 'center' },
      { text: row.kapasitas || '-', alignment: 'center' },
      { text: row.a_terukur || '-', alignment: 'center' },
      { text: row.peruntukan || '-', alignment: 'center' }
    ])
  })

  // Susun Baris Rectifier Dinamis
  const rectContentRows = []
  rectList.forEach((rect) => {
    const modulTipeRows = (rect.moduls || []).map((m, i) => [`Modul ${i + 1}`, `: ${m.tipe || '-'}`])
    const modulKapRows = (rect.moduls || []).map((m, i) => [`Modul ${i + 1}`, `${m.kapasitas || '-'}`])

    const mcbRows = (rect.mcbs || []).map((mcb, i) => [
      { text: mcb.mcb_label || `MCB ${i+1}`, bold: true, alignment: 'center' },
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            ['Merk', mcb.merk || '-'],
            ['Kapasitas', mcb.kapasitas || '-'],
            ['Peruntukan', mcb.peruntukan || '-']
          ]
        },
        layout: 'noBorders'
      }
    ])

    rectContentRows.push(
      [
        { text: 'Description', bold: true },
        { text: rect.nama_rectifier || 'Rectifier #1', bold: true, alignment: 'center', fillColor: '#f2f2f2' }
      ],
      [
        'Rectifier',
        {
          table: {
            widths: ['35%', '65%'],
            body: [
              ['Merk', rect.merk || '-'],
              ['Type', rect.type || '-'],
              ['SN', rect.sn || '-']
            ]
          },
          layout: 'noBorders'
        }
      ],
      ['Jumlah Modul', rect.jumlah_modul || (rect.moduls ? rect.moduls.length : 1)],
      [
        'TIPE MODUL',
        { table: { widths: ['35%', '65%'], body: modulTipeRows.length > 0 ? modulTipeRows : [['-', '-']] }, layout: 'noBorders' }
      ],
      [
        'Kapasitas/module (Ampere)',
        { table: { widths: ['35%', '65%'], body: modulKapRows.length > 0 ? modulKapRows : [['-', '-']] }, layout: 'noBorders' }
      ],
      [
        'Output',
        {
          table: {
            widths: ['25%', '75%'],
            body: mcbRows.length > 0 ? mcbRows : [['-', '-']]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc'
          }
        }
      ]
    )
  })

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [30, 30, 30, 30],
    content: [
      // ================= PAGE 1: COVER =================
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: 'MAINTENANCE RUTIN REPORT',
                style: 'coverHeaderTitle',
                alignment: 'center',
                margin: [0, 8, 0, 8]
              }
            ],
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
        margin: [0, -1, 0, 0]
      },

      { text: '', pageBreak: 'after' },

      // ================= PAGE 2: GROUNDING SYSTEM =================
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: 'Grounding System',
                style: 'sectionTitleHeader',
                alignment: 'center',
                fillColor: '#808080',
                color: '#ffffff',
                bold: true,
                margin: [0, 4, 0, 4]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1.5,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        }
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              { text: 'Pengukuran On Bak Kontrol Outdoor', bold: true },
              { text: `${grounding.pengukuran_outdoor || '...'} Ohm`, alignment: 'right', bold: true }
            ],
            [
              { text: 'Pengukuran On Bak Kontrol Indoor', bold: true },
              { text: `${grounding.pengukuran_indoor || '...'} Ohm`, alignment: 'right', bold: true }
            ],
            [
              { text: 'System Grounding', bold: true },
              { text: grounding.system_grounding || 'Single', alignment: 'center', bold: true }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['20%', '80%'],
          body: [
            [
              { text: 'Photos :', bold: true, margin: [0, 10, 0, 0] },
              groundingImages.length > 0
                ? { stack: groundingImages }
                : { text: '(Tidak ada foto)', italic: true, margin: [0, 10, 0, 0] }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: `Comments : ${grounding.comments || ''}`,
                bold: true,
                margin: [0, 5, 0, 25]
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
        margin: [0, -1, 0, 0]
      },

      { text: '', pageBreak: 'after' },

      // ================= PAGE 3: MAIN AC POWER (KWH METER) =================
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: 'Main AC Power Information (Panel KWH Meter)',
                style: 'sectionTitleHeader',
                alignment: 'center',
                fillColor: '#808080',
                color: '#ffffff',
                bold: true,
                margin: [0, 4, 0, 4]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1.5,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        }
      },
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            ['Id Customer / Id Meter', kwh.id_customer || ''],
            ['Phasa', kwh.phasa || '3'],
            ['Daya (KVA)', kwh.daya_kva || ''],
            [
              'Kapasitas MCB',
              `R (ampere) : ${kwh.mcb_r_ampere || ''}\nS (ampere) : ${kwh.mcb_s_ampere || ''}\nT (ampere) : ${kwh.mcb_t_ampere || ''}`
            ],
            [
              'Pengukuran Phasa',
              {
                table: {
                  widths: ['50%', '50%'],
                  body: [
                    [
                      `R - N voltage : ${kwh.voltage_rn || ''}\nS - N voltage : ${kwh.voltage_sn || ''}\nT - N voltage : ${kwh.voltage_tn || ''}\nN - G voltage : ${kwh.voltage_ng || ''}`,
                      `R Ampere : ${kwh.ampere_r || ''}\nS Ampere : ${kwh.ampere_s || ''}\nT Ampere : ${kwh.ampere_t || ''}`
                    ]
                  ]
                },
                layout: 'noBorders'
              }
            ],
            [
              'COS',
              {
                table: {
                  widths: ['50%', '50%'],
                  body: [[kwh.cos_phi_status || 'Ada', `Tipe : ${kwh.cos_phi_tipe || ''}`]]
                },
                layout: 'noBorders'
              }
            ],
            [
              'Arester',
              {
                table: {
                  widths: ['50%', '50%'],
                  body: [[kwh.arester_status || 'Ada', `Tipe : ${kwh.arester_tipe || ''}`]]
                },
                layout: 'noBorders'
              }
            ],
            [
              'Kabel output KWH',
              {
                table: {
                  widths: ['50%', '50%'],
                  body: [
                    [
                      `Warna :\nR : ${kwh.kabel_r_warna || 'Merah'}\nS : ${kwh.kabel_s_warna || 'Kuning'}\nT : ${kwh.kabel_t_warna || 'Hitam'}\nN : ${kwh.kabel_n_warna || 'Hijau'}\nG : ${kwh.kabel_g_warna || 'Kuning Hijau'}`,
                      `Luas Penampang Kabel :\nR (mm) : ${kwh.kabel_r_mm || ''}\nS (mm) : ${kwh.kabel_s_mm || ''}\nT (mm) : ${kwh.kabel_t_mm || ''}\nN (mm) : ${kwh.kabel_n_mm || ''}\nG (mm) : ${kwh.kabel_g_mm || ''}`
                    ]
                  ]
                },
                layout: 'noBorders'
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
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['20%', '80%'],
          body: [
            [
              { text: 'Photos :', bold: true, margin: [0, 10, 0, 0] },
              kwhImages.length > 0
                ? { stack: kwhImages }
                : { text: '(Tidak ada foto)', italic: true, margin: [0, 10, 0, 0] }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: `Comments : ${kwh.comments || ''}`,
                bold: true,
                margin: [0, 5, 0, 20]
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
        margin: [0, -1, 0, 0]
      },

      { text: '', pageBreak: 'after' },

      // ================= PAGE 4: GENSET =================
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: 'Main AC Power Information (Genset)',
                style: 'sectionTitleHeader',
                alignment: 'center',
                fillColor: '#808080',
                color: '#ffffff',
                bold: true,
                margin: [0, 4, 0, 4]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1.5,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        }
      },
      {
        table: {
          widths: ['5%', '20%', '75%'],
          body: [
            [
              { text: '1', alignment: 'center', bold: true, margin: [0, 25, 0, 0] },
              { text: 'General', alignment: 'center', bold: true, margin: [0, 25, 0, 0] },
              {
                table: {
                  widths: ['30%', '70%'],
                  body: [
                    ['Merk', genset.merk || '-'],
                    ['Kapasitas', `${genset.kapasitas_kva || '-'} KVA`],
                    ['SN', genset.sn || '-'],
                    ['Fuel Level', `${genset.fuel_level_liter || '-'} liter`],
                    ['Hour Meter', `${genset.hour_meter || '-'} hour`],
                    ['Engine', genset.engine_status || '-'],
                    ['Accu', genset.accu_status || '-'],
                    ['Switch', isAuto],
                    ['Temperatur', `${genset.temperatur || '-'} °C`]
                  ]
                },
                layout: 'noBorders'
              }
            ],
            [
              { text: '2', alignment: 'center', bold: true, margin: [0, 20, 0, 0] },
              { text: 'Pengukuran', alignment: 'center', bold: true, margin: [0, 20, 0, 0] },
              {
                table: {
                  widths: ['30%', '70%'],
                  body: [
                    [{ text: 'Beban', bold: true }, `Voltage: ${genset.beban_voltage || '-'} V\nAmpere: ${genset.beban_ampere || '-'} A`],
                    [{ text: 'Tanpa Beban', bold: true }, `Voltage: ${genset.tanpa_beban_voltage || '-'} V\nAmpere: ${genset.tanpa_beban_ampere || '-'} A`]
                  ]
                },
                layout: 'noBorders'
              }
            ],
            [
              { text: '3', alignment: 'center', bold: true, margin: [0, 10, 0, 0] },
              { text: 'Term', alignment: 'center', bold: true, margin: [0, 10, 0, 0] },
              {
                table: {
                  widths: ['100%'],
                  body: [
                    [`Kondisi Ruangan Genset:\n• Kebersihan: ${genset.kebersihan || 'Bersih'}\n• Temperatur/Suhu: ${genset.suhu_ruangan || 'Normal'}`]
                  ]
                },
                layout: 'noBorders'
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
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['20%', '80%'],
          body: [
            [
              { text: 'Photos :', bold: true, margin: [0, 10, 0, 0] },
              gensetImages.length > 0
                ? { stack: gensetImages }
                : { text: '(Tidak ada foto)', italic: true, margin: [0, 10, 0, 0] }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: `Comments : ${genset.comments || 'TIDAK ADA GENSET'}`,
                bold: true,
                margin: [0, 5, 0, 20]
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
        margin: [0, -1, 0, 0]
      },

      { text: '', pageBreak: 'after' },

      // ================= PAGE 5: AIR CONDITIONER =================
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: 'AIR CONDITIONER',
                style: 'sectionTitleHeader',
                alignment: 'center',
                fillColor: '#808080',
                color: '#ffffff',
                bold: true,
                margin: [0, 4, 0, 4]
              }
            ],
            [
              {
                text: `JUMLAH AC ICON : ${acList.length}`,
                bold: true,
                margin: [2, 2, 0, 2]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1.5,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        }
      },
      {
        table: {
          widths: ['20%', '80%'],
          body: acTableRows.length > 0 ? acTableRows : [[{ text: 'Tidak ada data AC', colSpan: 2, alignment: 'center' }, '']]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['20%', '80%'],
          body: [
            [
              { text: 'Photos :', bold: true, margin: [0, 10, 0, 0] },
              acImages.length > 0
                ? { stack: acImages }
                : { text: '(Tidak ada foto)', italic: true, margin: [0, 10, 0, 0] }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: `Comments : ${data?.ac_comments || ''}`,
                bold: true,
                margin: [0, 5, 0, 20]
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
        margin: [0, -1, 0, 0]
      },

      { text: '', pageBreak: 'after' },

      // ================= PAGE 6: ACPDB =================
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: 'ACPDB',
                style: 'sectionTitleHeader',
                alignment: 'center',
                fillColor: '#808080',
                color: '#ffffff',
                bold: true,
                margin: [0, 4, 0, 4]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1.5,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        }
      },
      {
        table: {
          widths: ['15%', '10%', '25%', '15%', '15%', '20%'],
          body: acpdbRows
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['20%', '80%'],
          body: [
            [
              { text: 'Arester', bold: true },
              `Tipe : ${acpdb.arester_tipe || '-'}\nWarna indikator : ${acpdb.arester_warna || '-'}`
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['20%', '80%'],
          body: [
            [
              { text: 'Photos :', bold: true, margin: [0, 10, 0, 0] },
              acpdbImages.length > 0
                ? { stack: acpdbImages }
                : { text: '(Tidak ada foto)', italic: true, margin: [0, 10, 0, 0] }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: `Comments : ${acpdb.comments || ''}`,
                bold: true,
                margin: [0, 5, 0, 20]
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
        margin: [0, -1, 0, 0]
      },

      { text: '', pageBreak: 'after' },

      // ================= PAGE 7: RECTIFIER =================
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: 'RECTIFIER',
                style: 'sectionTitleHeader',
                alignment: 'center',
                fillColor: '#808080',
                color: '#ffffff',
                bold: true,
                margin: [0, 4, 0, 4]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1.5,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        }
      },
      {
        table: {
          widths: ['30%', '70%'],
          body: rectContentRows.length > 0 ? rectContentRows : [['-', '-']]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['20%', '80%'],
          body: [
            [
              { text: 'Photos :', bold: true, margin: [0, 10, 0, 0] },
              rectImages.length > 0
                ? { stack: rectImages }
                : { text: '(Tidak ada foto)', italic: true, margin: [0, 10, 0, 0] }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1.5,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, -1, 0, 0]
      },
      {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                text: `Comments : ${rectComments}`,
                bold: true,
                margin: [0, 5, 0, 20]
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
        margin: [0, -1, 0, 0]
      }
    ],
    styles: {
      coverHeaderTitle: { fontSize: 14, bold: true, color: '#000000' },
      brandFallback: { fontSize: 18, bold: true, color: '#00A2E9' },
      sectionTitleHeader: { fontSize: 13, bold: true }
    }
  }

  return pdfMake.createPdf(docDefinition)
}
// ================= PAGE INVERTER =================
const inverterList = data?.inverters || []
const inverterPhotos = data?.inverter_photos || []
const inverterComments = data?.inverter_comments || ''

const inverterImages = []
if (inverterPhotos.length > 0) {
  for (const url of inverterPhotos) {
    const b64 = await getBase64ImageFromUrl(url)
    if (b64) {
      inverterImages.push({ image: b64, width: 180, alignment: 'center', margin: [0, 5, 0, 5] })
    }
  }
}

const inverterContentRows = []
inverterList.forEach((inv) => {
  const outputRows = (inv.outputs || []).map((out, i) => [
    { text: out.label || `Output ${i+1}`, bold: true, alignment: 'center' },
    {
      table: {
        widths: ['50%', '50%'],
        body: [
          ['Merk', out.merk || '-'],
          ['Peruntukan', out.peruntukan || '-']
        ]
      },
      layout: 'noBorders'
    }
  ])

  inverterContentRows.push(
    [
      { text: 'Description', bold: true },
      { text: inv.nama_inverter || 'Inverter #1', bold: true, alignment: 'center', fillColor: '#f2f2f2' }
    ],
    [
      'Inverter',
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            ['Merk', inv.merk || '-'],
            ['Type', inv.type || '-'],
            ['SN', inv.sn || '-']
          ]
        },
        layout: 'noBorders'
      }
    ],
    ['Up Link Inverter', inv.up_link || '-'],
    ['Kapasitas Inverter', inv.kapasitas || '-'],
    [
      'Output',
      {
        table: {
          widths: ['25%', '75%'],
          body: outputRows.length > 0 ? outputRows : [['-', '-']]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#cccccc',
          vLineColor: () => '#cccccc'
        }
      }
    ]
  )
})

// Masukkan ke array content docDefinition:
docDefinition.content.push(
  { text: '', pageBreak: 'after' },
  {
    table: {
      widths: ['100%'],
      body: [
        [
          {
            text: 'INVERTER',
            style: 'sectionTitleHeader',
            alignment: 'center',
            fillColor: '#808080',
            color: '#ffffff',
            bold: true,
            margin: [0, 4, 0, 4]
          }
        ]
      ]
    },
    layout: { hLineWidth: () => 1.5, vLineWidth: () => 1.5, hLineColor: () => '#000000', vLineColor: () => '#000000' }
  },
  {
    table: {
      widths: ['30%', '70%'],
      body: inverterContentRows.length > 0 ? inverterContentRows : [['-', '-']]
    },
    layout: { hLineWidth: () => 1, vLineWidth: () => 1.5, hLineColor: () => '#000000', vLineColor: () => '#000000' },
    margin: [0, -1, 0, 0]
  },
  {
    table: {
      widths: ['20%', '80%'],
      body: [
        [
          { text: 'Photos :', bold: true, margin: [0, 10, 0, 0] },
          inverterImages.length > 0 ? { stack: inverterImages } : { text: '(Tidak ada foto)', italic: true, margin: [0, 10, 0, 0] }
        ]
      ]
    },
    layout: { hLineWidth: () => 1, vLineWidth: () => 1.5, hLineColor: () => '#000000', vLineColor: () => '#000000' },
    margin: [0, -1, 0, 0]
  },
  {
    table: {
      widths: ['100%'],
      body: [
        [{ text: `Comments : ${inverterComments}`, bold: true, margin: [0, 5, 0, 20] }]
      ]
    },
    layout: { hLineWidth: () => 1, vLineWidth: () => 1.5, hLineColor: () => '#000000', vLineColor: () => '#000000' },
    margin: [0, -1, 0, 0]
  }
)