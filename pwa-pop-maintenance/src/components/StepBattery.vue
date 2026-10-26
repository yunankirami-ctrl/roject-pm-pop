<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()

const addRectifierBattery = () => {
  const nextNum = store.formData.batteries.length + 1
  store.formData.batteries.push({
    nama_recty: `BATTERY RECTY ${nextNum}`,
    banks: [
      {
        nama_bank: 'Bank#1',
        merk: '',
        type: '',
        kapasitas: '',
        sn: '',
        cells: [
          { cell_label: 'Cell#1', tegangan: '' }
        ]
      }
    ]
  })
}

const removeRectifierBattery = (rIndex) => {
  if (store.formData.batteries.length > 1) {
    store.formData.batteries.splice(rIndex, 1)
    store.formData.batteries.forEach((item, i) => {
      item.nama_recty = `BATTERY RECTY ${i + 1}`
    })
  }
}

const addBank = (rect) => {
  const nextBankNum = rect.banks.length + 1
  rect.banks.push({
    nama_bank: `Bank#${nextBankNum}`,
    merk: '',
    type: '',
    kapasitas: '',
    sn: '',
    cells: [
      { cell_label: 'Cell#1', tegangan: '' }
    ]
  })
}

const removeBank = (rect, bIndex) => {
  if (rect.banks.length > 1) {
    rect.banks.splice(bIndex, 1)
    rect.banks.forEach((b, i) => {
      b.nama_bank = `Bank#${i + 1}`
    })
  }
}

const addCell = (bank) => {
  const nextCellNum = bank.cells.length + 1
  bank.cells.push({
    cell_label: `Cell#${nextCellNum}`,
    tegangan: ''
  })
}

const removeCell = (bank, cIndex) => {
  if (bank.cells.length > 1) {
    bank.cells.splice(cIndex, 1)
    bank.cells.forEach((c, i) => {
      c.cell_label = `Cell#${i + 1}`
    })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center border-b pb-2">
      <h3 class="text-base font-bold text-slate-800">Bank Battery System</h3>
      <button 
        @click="addRectifierBattery" 
        type="button" 
        class="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm"
      >
        + Tambah Recty Battery
      </button>
    </div>

    <!-- Loop Rectifier Batteries -->
    <div 
      v-for="(rect, rIdx) in store.formData.batteries" 
      :key="rIdx"
      class="p-3 border rounded-lg bg-slate-50 space-y-3 relative shadow-sm border-sky-200"
    >
      <div class="flex justify-between items-center bg-sky-600 text-white p-2 rounded">
        <span class="text-xs font-bold">{{ rect.nama_recty }}</span>
        <button 
          v-if="store.formData.batteries.length > 1" 
          @click="removeRectifierBattery(rIdx)" 
          type="button" 
          class="text-red-200 hover:text-white text-xs font-semibold"
        >
          Hapus Recty
        </button>
      </div>

      <div class="flex justify-between items-center pt-1">
        <span class="text-xs font-bold text-slate-700">Daftar Bank Battery</span>
        <button @click="addBank(rect)" type="button" class="text-xs text-sky-600 font-semibold">+ Tambah Bank</button>
      </div>

      <!-- Loop Banks -->
      <div 
        v-for="(bank, bIdx) in rect.banks" 
        :key="bIdx"
        class="p-2.5 border rounded bg-white space-y-2 shadow-sm"
      >
        <div class="flex justify-between items-center bg-slate-100 p-1.5 rounded">
          <span class="text-xs font-bold text-slate-700">{{ bank.nama_bank }}</span>
          <button v-if="rect.banks.length > 1" @click="removeBank(rect, bIdx)" type="button" class="text-red-500 text-[10px]">Hapus Bank</button>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[10px] text-slate-500">Merk</label>
            <input v-model="bank.merk" type="text" class="w-full p-1.5 text-xs border rounded bg-slate-50" placeholder="NARADA" />
          </div>
          <div>
            <label class="text-[10px] text-slate-500">Type</label>
            <input v-model="bank.type" type="text" class="w-full p-1.5 text-xs border rounded bg-slate-50" placeholder="48NPFC100XV" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[10px] text-slate-500">Kapasitas (Ah)</label>
            <input v-model="bank.kapasitas" type="text" class="w-full p-1.5 text-xs border rounded bg-slate-50" placeholder="100" />
          </div>
          <div>
            <label class="text-[10px] text-slate-500">Serial Number (SN)</label>
            <input v-model="bank.sn" type="text" class="w-full p-1.5 text-xs border rounded bg-slate-50" placeholder="SN Battery" />
          </div>
        </div>

        <!-- Tegangan Cell Dinamis -->
        <div class="p-2 border rounded bg-slate-50 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-[11px] font-bold text-slate-700">Tegangan Cell (Volt)</span>
            <button @click="addCell(bank)" type="button" class="text-xs text-sky-600 font-semibold">+ Tambah Cell</button>
          </div>

          <div 
            v-for="(cell, cIdx) in bank.cells" 
            :key="cIdx"
            class="flex items-center gap-2 text-xs"
          >
            <span class="w-16 font-medium text-slate-600">{{ cell.cell_label }}</span>
            <input v-model="cell.tegangan" type="text" class="flex-1 p-1 border rounded bg-white text-xs" placeholder="Cth: 48 / 2.1" />
            <button v-if="bank.cells.length > 1" @click="removeCell(bank, cIdx)" type="button" class="text-red-500 text-[10px]">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments & Upload -->
    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea v-model="store.formData.battery_comments" class="w-full p-2 text-sm border rounded mt-1" rows="2" placeholder="Catatan battery..."></textarea>
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi Battery</label>
      <ImageUploader 
        :photos="store.formData.battery_photos" 
        @uploaded="(url) => store.addPhoto('battery', url)" 
      />
    </div>
  </div>
</template>