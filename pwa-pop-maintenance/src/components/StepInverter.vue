<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()

const addInverter = () => {
  const nextNum = store.formData.inverters.length + 1
  store.formData.inverters.push({
    nama_inverter: `Inverter #${nextNum}`,
    merk: '',
    type: '',
    sn: '',
    up_link: '',
    kapasitas: '',
    outputs: [
      { label: 'Output 1', merk: '', peruntukan: '' }
    ]
  })
}

const removeInverter = (index) => {
  if (store.formData.inverters.length > 1) {
    store.formData.inverters.splice(index, 1)
    store.formData.inverters.forEach((item, i) => {
      item.nama_inverter = `Inverter #${i + 1}`
    })
  }
}

const addOutputRow = (inv) => {
  const nextIdx = inv.outputs.length + 1
  inv.outputs.push({
    label: `Output ${nextIdx}`,
    merk: '',
    peruntukan: ''
  })
}

const removeOutputRow = (inv, outIdx) => {
  if (inv.outputs.length > 1) {
    inv.outputs.splice(outIdx, 1)
    inv.outputs.forEach((o, i) => {
      o.label = `Output ${i + 1}`
    })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center border-b pb-2">
      <h3 class="text-base font-bold text-slate-800">Inverter System</h3>
      <button 
        @click="addInverter" 
        type="button" 
        class="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm"
      >
        + Tambah Inverter
      </button>
    </div>

    <!-- Loop Inverter Units -->
    <div 
      v-for="(inv, iIndex) in store.formData.inverters" 
      :key="iIndex"
      class="p-3 border rounded-lg bg-slate-50 space-y-3 relative shadow-sm"
    >
      <div class="flex justify-between items-center bg-sky-100 p-2 rounded">
        <span class="text-xs font-bold text-sky-800">{{ inv.nama_inverter }}</span>
        <button 
          v-if="store.formData.inverters.length > 1" 
          @click="removeInverter(iIndex)" 
          type="button" 
          class="text-red-600 text-xs font-semibold"
        >
          Hapus Inverter
        </button>
      </div>

      <!-- General Info -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[10px] text-slate-500">Merk</label>
          <input v-model="inv.merk" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="METAPOWER" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">Type</label>
          <input v-model="inv.type" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="1000K" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[10px] text-slate-500">Serial Number (SN)</label>
          <input v-model="inv.sn" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="SN Inverter" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">Up Link Inverter</label>
          <input v-model="inv.up_link" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="RECTI1" />
        </div>
      </div>

      <div>
        <label class="text-[10px] text-slate-500">Kapasitas Inverter</label>
        <input v-model="inv.kapasitas" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="10000" />
      </div>

      <!-- Output List (Dinamis) -->
      <div class="p-2 border rounded bg-white space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-[11px] font-bold text-slate-700">Output Inverter</span>
          <button @click="addOutputRow(inv)" type="button" class="text-xs text-sky-600 font-semibold">+ Tambah Output</button>
        </div>

        <div 
          v-for="(out, oIdx) in inv.outputs" 
          :key="oIdx"
          class="p-2 border rounded bg-slate-50 space-y-1 relative text-xs"
        >
          <div class="flex justify-between font-bold text-slate-600">
            <span>{{ out.label }}</span>
            <button v-if="inv.outputs.length > 1" @click="removeOutputRow(inv, oIdx)" type="button" class="text-red-500 text-[10px]">Hapus</button>
          </div>
          <div class="grid grid-cols-2 gap-1">
            <input v-model="out.merk" placeholder="Merk (cth: HUAWEI)" class="p-1 border rounded bg-white text-[11px]" />
            <input v-model="out.peruntukan" placeholder="Peruntukan (cth: TWS)" class="p-1 border rounded bg-white text-[11px]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Comments & Upload -->
    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea v-model="store.formData.inverter_comments" class="w-full p-2 text-sm border rounded mt-1" rows="2" placeholder="Catatan inverter..."></textarea>
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi Inverter</label>
      <ImageUploader 
        :photos="store.formData.inverter_photos" 
        @uploaded="(url) => store.addPhoto('inverter', url)" 
      />
    </div>
  </div>
</template>