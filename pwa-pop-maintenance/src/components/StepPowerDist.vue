<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()

const addRectifier = () => {
  const nextNum = store.formData.rectifiers.length + 1
  store.formData.rectifiers.push({
    nama_rectifier: `Rectifier #${nextNum}`,
    merk: '',
    type: '',
    sn: '',
    jumlah_modul: 1,
    moduls: [{ tipe: '', kapasitas: '' }],
    mcbs: [
      { mcb_label: 'MCB 1', merk: 'NADER', kapasitas: '', peruntukan: 'BATT1' }
    ]
  })
}

const removeRectifier = (index) => {
  if (store.formData.rectifiers.length > 1) {
    store.formData.rectifiers.splice(index, 1)
    store.formData.rectifiers.forEach((item, i) => {
      item.nama_rectifier = `Rectifier #${i + 1}`
    })
  }
}

const handleJumlahModulChange = (rect) => {
  const count = parseInt(rect.jumlah_modul) || 0
  const currentLen = rect.moduls.length
  
  if (count > currentLen) {
    for (let i = currentLen; i < count; i++) {
      rect.moduls.push({ tipe: '', kapasitas: '' })
    }
  } else if (count < currentLen && count > 0) {
    rect.moduls = rect.moduls.slice(0, count)
  }
}

const addMcbRow = (rect) => {
  const nextIdx = rect.mcbs.length + 1
  rect.mcbs.push({
    mcb_label: `MCB ${nextIdx}`,
    merk: 'NADER',
    kapasitas: '',
    peruntukan: ''
  })
}

const removeMcbRow = (rect, mcbIndex) => {
  if (rect.mcbs.length > 1) {
    rect.mcbs.splice(mcbIndex, 1)
    rect.mcbs.forEach((m, i) => {
      m.mcb_label = `MCB ${i + 1}`
    })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center border-b pb-2">
      <h3 class="text-base font-bold text-slate-800">Rectifier System</h3>
      <button 
        @click="addRectifier" 
        type="button" 
        class="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm"
      >
        + Tambah Rectifier
      </button>
    </div>

    <!-- Loop Rectifier Units -->
    <div 
      v-for="(rect, rIndex) in store.formData.rectifiers" 
      :key="rIndex"
      class="p-3 border rounded-lg bg-slate-50 space-y-3 relative shadow-sm"
    >
      <div class="flex justify-between items-center bg-sky-100 p-2 rounded">
        <span class="text-xs font-bold text-sky-800">{{ rect.nama_rectifier }}</span>
        <button 
          v-if="store.formData.rectifiers.length > 1" 
          @click="removeRectifier(rIndex)" 
          type="button" 
          class="text-red-600 text-xs font-semibold"
        >
          Hapus Rectifier
        </button>
      </div>

      <!-- General Info -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[10px] text-slate-500">Merk Rectifier</label>
          <input v-model="rect.merk" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="VERTIV" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">Type Rectifier</label>
          <input v-model="rect.type" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="NETSURE 531" />
        </div>
      </div>
      <div>
        <label class="text-[10px] text-slate-500">Serial Number (SN)</label>
        <input v-model="rect.sn" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="SN Rectifier" />
      </div>

      <!-- Jumlah Modul -->
      <div>
        <label class="text-[11px] font-bold text-slate-700">Jumlah Modul</label>
        <input 
          v-model.number="rect.jumlah_modul" 
          @input="handleJumlahModulChange(rect)"
          type="number" 
          min="1" 
          max="10" 
          class="w-full p-1.5 text-xs border rounded bg-white mt-1" 
        />
      </div>

      <!-- Dynamic Modul Rows (Tipe & Kapasitas) -->
      <div class="p-2 border rounded bg-white space-y-2">
        <span class="text-[11px] font-bold text-slate-700">Konfigurasi Modul</span>
        <div 
          v-for="(mod, mIdx) in rect.moduls" 
          :key="mIdx"
          class="grid grid-cols-2 gap-2 items-center pt-1 border-t border-slate-100 text-xs"
        >
          <div>
            <span class="text-[10px] font-medium text-slate-500 block">Modul {{ mIdx + 1 }} Tipe</span>
            <input v-model="mod.tipe" type="text" class="w-full p-1 border rounded bg-slate-50" placeholder="RB2000" />
          </div>
          <div>
            <span class="text-[10px] font-medium text-slate-500 block">Kapasitas (A)</span>
            <input v-model="mod.kapasitas" type="text" class="w-full p-1 border rounded bg-slate-50" placeholder="40" />
          </div>
        </div>
      </div>

      <!-- Output MCB List -->
      <div class="p-2 border rounded bg-white space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-[11px] font-bold text-slate-700">Output MCB</span>
          <button @click="addMcbRow(rect)" type="button" class="text-xs text-sky-600 font-semibold">+ Baris MCB</button>
        </div>

        <div 
          v-for="(mcb, mcIdx) in rect.mcbs" 
          :key="mcIdx"
          class="p-2 border rounded bg-slate-50 space-y-1 relative text-xs"
        >
          <div class="flex justify-between font-bold text-slate-600">
            <span>{{ mcb.mcb_label }}</span>
            <button v-if="rect.mcbs.length > 1" @click="removeMcbRow(rect, mcIdx)" type="button" class="text-red-500 text-[10px]">Hapus</button>
          </div>
          <div class="grid grid-cols-3 gap-1">
            <input v-model="mcb.merk" placeholder="Merk" class="p-1 border rounded bg-white text-[11px]" />
            <input v-model="mcb.kapasitas" placeholder="Kapasitas (A)" class="p-1 border rounded bg-white text-[11px]" />
            <input v-model="mcb.peruntukan" placeholder="Peruntukan" class="p-1 border rounded bg-white text-[11px]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Comments & Upload -->
    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea v-model="store.formData.rectifier_comments" class="w-full p-2 text-sm border rounded mt-1" rows="2" placeholder="Catatan rectifier..."></textarea>
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi Rectifier</label>
      <ImageUploader 
        :photos="store.formData.rectifier_photos" 
        @uploaded="(url) => store.addPhoto('rectifier', url)" 
      />
    </div>
  </div>
</template>