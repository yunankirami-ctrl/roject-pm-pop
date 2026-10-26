<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()

const addMcbRow = () => {
  const nextIndex = store.formData.acpdb.mcbs.length + 1
  store.formData.acpdb.mcbs.push({
    mcb_label: `MCB ${nextIndex}`,
    phasa: 'R',
    merk: 'SCHNEIDER',
    kapasitas: '',
    a_terukur: '',
    peruntukan: 'SPARE'
  })
}

const removeMcbRow = (index) => {
  if (store.formData.acpdb.mcbs.length > 1) {
    store.formData.acpdb.mcbs.splice(index, 1)
    store.formData.acpdb.mcbs.forEach((item, i) => {
      item.mcb_label = `MCB ${i + 1}`
    })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center border-b pb-2">
      <h3 class="text-base font-bold text-slate-800">Panel ACPDB</h3>
      <button 
        @click="addMcbRow" 
        type="button" 
        class="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
      >
        <span>+ Tambah Baris MCB</span>
      </button>
    </div>

    <!-- Loop Baris MCB ACPDB -->
    <div class="space-y-2">
      <div 
        v-for="(item, idx) in store.formData.acpdb.mcbs" 
        :key="idx" 
        class="p-2.5 border rounded-lg bg-slate-50 space-y-2 relative"
      >
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-sky-700">{{ item.mcb_label }}</span>
          <button 
            v-if="store.formData.acpdb.mcbs.length > 1" 
            @click="removeMcbRow(idx)" 
            type="button" 
            class="text-red-500 hover:text-red-700 text-xs font-semibold"
          >
            Hapus
          </button>
        </div>

        <div class="grid grid-cols-3 gap-1.5">
          <div>
            <label class="text-[10px] text-slate-500 block">Phasa</label>
            <select v-model="item.phasa" class="w-full p-1.5 text-xs border rounded bg-white">
              <option value="R">R</option>
              <option value="S">S</option>
              <option value="T">T</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] text-slate-500 block">Merk</label>
            <input v-model="item.merk" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="SCHNEIDER" />
          </div>
          <div>
            <label class="text-[10px] text-slate-500 block">Kapasitas (A)</label>
            <input v-model="item.kapasitas" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="25" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-1.5">
          <div>
            <label class="text-[10px] text-slate-500 block">A Terukur</label>
            <input v-model="item.a_terukur" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="1.6" />
          </div>
          <div>
            <label class="text-[10px] text-slate-500 block">Peruntukan</label>
            <input v-model="item.peruntukan" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="SPARE / MAIN / RECTI-1" />
          </div>
        </div>
      </div>
    </div>

    <!-- Arester ACPDB -->
    <div class="p-3 border rounded-lg bg-slate-50 space-y-2">
      <h4 class="text-xs font-bold text-slate-700">Arester ACPDB</h4>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[10px] text-slate-500 block">Tipe Arester</label>
          <input v-model="store.formData.acpdb.arester_tipe" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="Phon.x" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500 block">Warna Indikator</label>
          <input v-model="store.formData.acpdb.arester_warna" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="Hijau" />
        </div>
      </div>
    </div>

    <!-- Catatan -->
    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea v-model="store.formData.acpdb.comments" class="w-full p-2 text-sm border rounded mt-1 outline-none focus:ring-1 focus:ring-sky-500" rows="2" placeholder="Catatan kondisi ACPDB..."></textarea>
    </div>

    <!-- Upload Foto -->
    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi ACPDB</label>
      <ImageUploader 
        :photos="store.formData.acpdb.photos" 
        @uploaded="(url) => store.addPhoto('acpdb', url)" 
      />
    </div>
  </div>
</template>