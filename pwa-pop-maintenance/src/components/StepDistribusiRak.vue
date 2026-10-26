<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()

const addMcbRow = () => {
  const nextIndex = store.formData.distribusi_rak.mcbs.length + 1
  store.formData.distribusi_rak.mcbs.push({
    mcb_label: `MCB ${nextIndex}`,
    rak_no: '',
    merk: '',
    kapasitas: '',
    a_terukur: '',
    peruntukan: ''
  })
}

const removeMcbRow = (index) => {
  if (store.formData.distribusi_rak.mcbs.length > 1) {
    store.formData.distribusi_rak.mcbs.splice(index, 1)
    store.formData.distribusi_rak.mcbs.forEach((item, i) => {
      item.mcb_label = `MCB ${i + 1}`
    })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center border-b pb-2">
      <h3 class="text-base font-bold text-slate-800">Distribusi DC Rak</h3>
      <button 
        @click="addMcbRow" 
        type="button" 
        class="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
      >
        <span>+ Tambah Baris MCB</span>
      </button>
    </div>

    <!-- Loop Baris MCB Distribusi DC Rak -->
    <div class="space-y-2">
      <div 
        v-for="(item, idx) in store.formData.distribusi_rak.mcbs" 
        :key="idx" 
        class="p-2.5 border rounded-lg bg-slate-50 space-y-2 relative"
      >
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-sky-700">{{ item.mcb_label }}</span>
          <button 
            v-if="store.formData.distribusi_rak.mcbs.length > 1" 
            @click="removeMcbRow(idx)" 
            type="button" 
            class="text-red-500 hover:text-red-700 text-xs font-semibold"
          >
            Hapus
          </button>
        </div>

        <div class="grid grid-cols-3 gap-1.5">
          <div>
            <label class="text-[10px] text-slate-500 block">RAK No.</label>
            <input v-model="item.rak_no" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="RAK 1" />
          </div>
          <div>
            <label class="text-[10px] text-slate-500 block">Merk</label>
            <input v-model="item.merk" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="Merk" />
          </div>
          <div>
            <label class="text-[10px] text-slate-500 block">Kapasitas (A)</label>
            <input v-model="item.kapasitas" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="10" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-1.5">
          <div>
            <label class="text-[10px] text-slate-500 block">A Terukur</label>
            <input v-model="item.a_terukur" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="2.5" />
          </div>
          <div>
            <label class="text-[10px] text-slate-500 block">Peruntukan</label>
            <input v-model="item.peruntukan" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="Perangkat" />
          </div>
        </div>
      </div>
    </div>

    <!-- Catatan -->
    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea v-model="store.formData.distribusi_rak.comments" class="w-full p-2 text-sm border rounded mt-1 outline-none focus:ring-1 focus:ring-sky-500" rows="2" placeholder="Catatan kondisi Distribusi DC Rak..."></textarea>
    </div>

    <!-- Upload Foto -->
    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi Distribusi DC Rak</label>
      <ImageUploader 
        :photos="store.formData.distribusi_rak.photos" 
        @uploaded="(url) => store.addPhoto('distribusi_rak', url)" 
      />
    </div>
  </div>
</template>