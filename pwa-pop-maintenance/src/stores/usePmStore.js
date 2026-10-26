import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePmStore = defineStore('pmReport', () => {
  const formData = ref({
    cover: {
      id_mr: '',
      tanggal_pelaksanaan: new Date().toISOString().split('T')[0],
      nama_pop: '',
      alamat_pop: '',
      koordinat_pop: '',
      tipe_pop: 'Backbone',
      tim_icon: '',
      tim_sti: ''
    },
    grounding: {
      pengukuran_outdoor: '',
      pengukuran_indoor: '',
      system_grounding: 'Single',
      comments: '',
      photos: []
    },
    kwh: {
      id_customer: '',
      phasa: '3',
      daya_kva: '',
      mcb_r_ampere: '',
      mcb_s_ampere: '',
      mcb_t_ampere: '',
      voltage_rn: '',
      voltage_sn: '',
      voltage_tn: '',
      voltage_ng: '',
      ampere_r: '',
      ampere_s: '',
      ampere_t: '',
      cos_phi_status: 'Ada',
      cos_phi_tipe: 'Legend',
      arester_status: 'Ada',
      arester_tipe: 'Phon.x',
      kabel_r_warna: 'Merah',
      kabel_r_mm: '16',
      kabel_s_warna: 'Kuning',
      kabel_s_mm: '16',
      kabel_t_warna: 'Hitam',
      kabel_t_mm: '16',
      kabel_n_warna: 'Hijau',
      kabel_n_mm: '16',
      kabel_g_warna: 'Kuning Hijau',
      kabel_g_mm: '16',
      comments: '',
      photos: []
    },
    genset: {
      merk: '',
      kapasitas_kva: '',
      sn: '',
      fuel_level_liter: '',
      hour_meter: '',
      engine_status: 'OK',
      accu_status: 'OK',
      switch_mode: 'Automatic',
      temperatur: '',
      beban_voltage: '220',
      beban_ampere: '',
      tanpa_beban_voltage: '220',
      tanpa_beban_ampere: '0',
      kebersihan: 'Bersih',
      suhu_ruangan: 'Normal',
      comments: '',
      photos: []
    },
    ac: [
      {
        kode_ac: 'AC-1',
        merk: '',
        pk: '',
        sn: '',
        mcb: '',
        beban: '',
        tahun_instalasi: ''
      }
    ],
    ac_comments: '',
    ac_photos: [],
    acpdb: {
      mcbs: [
        { mcb_label: 'MCB 1', phasa: 'R', merk: 'SCHNEIDER', kapasitas: '25', a_terukur: '', peruntukan: 'SPARE' }
      ],
      arester_tipe: '',
      arester_warna: 'Hijau',
      comments: '',
      photos: []
    },
    rectifiers: [
      {
        nama_rectifier: 'Rectifier #1',
        merk: '',
        type: '',
        sn: '',
        jumlah_modul: 3,
        moduls: [
          { tipe: 'RB2000', kapasitas: '40' },
          { tipe: 'RB2000', kapasitas: '40' },
          { tipe: 'RB2000', kapasitas: '40' }
        ],
        mcbs: [
          { mcb_label: 'MCB 1', merk: 'NADER', kapasitas: '63', peruntukan: 'BATT1' }
        ]
      }
    ],
    rectifier_comments: '',
    rectifier_photos: [],
    inverters: [
      {
        nama_inverter: 'Inverter #1',
        merk: '',
        type: '',
        sn: '',
        up_link: '',
        kapasitas: '',
        outputs: [
          { label: 'Output 1', merk: '', peruntukan: '' }
        ]
      }
    ],
    inverter_comments: '',
    inverter_photos: [],
    batteries: [
      {
        nama_recty: 'BATTERY RECTY 1',
        banks: [
          {
            nama_bank: 'Bank#1',
            merk: 'NARADA',
            type: '48NPFC100XV',
            kapasitas: '100',
            sn: '',
            cells: [
              { cell_label: 'Cell#1', tegangan: '48' },
              { cell_label: 'Cell#2', tegangan: '48' }
            ]
          }
        ]
      }
    ],
    battery_comments: '',
    battery_photos: [],
    dcpdb: {
  mcbs: [
    { mcb_label: 'MCB 1', phasa: '', merk: '', kapasitas: '', a_terukur: '', peruntukan: '' }
  ],
  comments: '',
  photos: []
},
distribusi_rak: {
  mcbs: [
    { mcb_label: 'MCB 1', rak_no: '', merk: '', kapasitas: '', a_terukur: '', peruntukan: '' }
  ],
  comments: '',
  photos: []
},
  })
  

  // Action tunggal penambahan foto dokumentasi
  const addPhoto = (moduleName, url) => {
    if (moduleName === 'ac') {
      formData.value.ac_photos.push(url)
    } else if (moduleName === 'rectifier') {
      formData.value.rectifier_photos.push(url)
    } else if (moduleName === 'inverter') {
      formData.value.inverter_photos.push(url)
    } else if (moduleName === 'battery') {
      formData.value.battery_photos.push(url)
      } else if (moduleName === 'dcpdb') {
    formData.value.dcpdb.photos.push(url)
    } else if (moduleName === 'distribusi_rak') {
    formData.value.distribusi_rak.photos.push(url)
    } else if (formData.value[moduleName] && Array.isArray(formData.value[moduleName].photos)) {
      formData.value[moduleName].photos.push(url)
    }
  }

  return {
    formData,
    addPhoto
  }
})