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
  kabel_r_warna: 'Merah', kabel_r_mm: '16',
  kabel_s_warna: 'Kuning', kabel_s_mm: '16',
  kabel_t_warna: 'Hitam', kabel_t_mm: '16',
  kabel_n_warna: 'Hijau', kabel_n_mm: '16',
  kabel_g_warna: 'Kuning Hijau', kabel_g_mm: '16',
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
    // Di dalam state store:
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

// Helper penambahan foto khusus AC pada mutasi store:
addPhoto(moduleName, url) {
  if (moduleName === 'ac') {
    this.formData.ac_photos.push(url)
  } else if (this.formData[moduleName]) {
    this.formData[moduleName].photos.push(url)
  }
},
    battery: [
      { rectifier_target: 'BATTERY RECTY 1', bank_name: 'Bank#1', merk: 'NARADA', type: '48NPFC100XV', kapasitas: '100', sn: '', cell_voltages: { cell1: '48', cell2: '48', cell3: '48', cell4: '48' }, photos: [] }
    ],
    environment: {
      suhu: '',
      tgl_pembersihan_ac_terakhir: '',
      alarms: {
        external_alarm: 'OK',
        door_open: 'OK',
        pln_off: 'OK',
        high_temp: 'OK',
        genset_fail: 'OK',
        modul_rectifier: 'OK',
        smoke_fire: 'OK',
        battery: 'OK'
      },
      photos: []
    }
  })

  function addPhoto(section, url) {
    if (Array.isArray(formData.value[section].photos)) {
      formData.value[section].photos.push(url)
    }
  }

  function resetForm() {
    localStorage.removeItem('pm_draft')
    window.location.reload()
  }

  return { formData, addPhoto, resetForm }
})