<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()

const addAcUnit = () => {
  const nextNum = store.formData.ac.length + 1
  store.formData.ac.push({
    kode_ac: `AC-${nextNum}`,
    merk: '',
    pk: '',
    sn: '',
    mcb: '',
    beban: '',
    tahun_instalasi: ''
  })
}

const removeAcUnit = (index) => {
  if (store.formData.ac.length > 1) {
    store.formData.ac.splice(index, 1)
    // Re-index kode_ac
    store.formData.ac.forEach((unit, i) => {
      unit.kode_ac = `AC-${i + 1}`
    })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center border-b pb-2">
      <h3 class="text-base font-bold text-slate-800">Air Conditioner (AC)</h3>
      <button 
        @click="addAcUnit" 
        type="button" 
        class="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
      >
        <span>+ Tambah AC</span>
      </button>
    </div>

    <!-- Loop Unit AC -->
    <div 
      v-for="(unit, idx) in store.formData.ac" 
      :key="idx" 
      class="p-3 border rounded-lg bg-slate-50 space-y-2 relative"
    >
      <div class="flex justify-between items-center">
        <h4 class="text-xs font-bold text-sky-700">{{ unit.kode_ac }}</h4>
        <button 
          v-if="store.formData.ac.length > 1" 
          @click="removeAcUnit(idx)" 
          type="button" 
          class="text-red-500 hover:text-red-700 text-xs font-semibold"
        >
          Hapus
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[10px] text-slate-500">Merk</label>
          <input 
            v-model="unit.merk" 
            type="text" 
            placeholder="DAIKIN THAI" 
            class="w-full p-1.5 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-sky-500" 
          />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">PK</label>
          <input 
            v-model="unit.pk" 
            type="text" 
            placeholder="1.5" 
            class="w-full p-1.5 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-sky-500" 
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[10px] text-slate-500">Serial Number (SN)</label>
          <input 
            v-model="unit.sn" 
            type="text" 
            placeholder="E002146" 
            class="w-full p-1.5 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-sky-500" 
          />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">Tahun Instalasi</label>
          <input 
            v-model="unit.tahun_instalasi" 
            type="text" 
            placeholder="2020.6" 
            class="w-full p-1.5 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-sky-500" 
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[10px] text-slate-500">Kapasitas MCB</label>
          <input 
            v-model="unit.mcb" 
            type="text" 
            placeholder="6A" 
            class="w-full p-1.5 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-sky-500" 
          />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">Beban (A)</label>
          <input 
            v-model="unit.beban" 
            type="text" 
            placeholder="4.2" 
            class="w-full p-1.5 text-xs border rounded bg-white outline-none focus:ring-1 focus:ring-sky-500" 
          />
        </div>
      </div>
    </div>

    <!-- Catatan / Comments -->
    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea 
        v-model="store.formData.ac_comments" 
        class="w-full p-2 text-sm border rounded mt-1 outline-none focus:ring-1 focus:ring-sky-500" 
        rows="2" 
        placeholder="Masukkan catatan AC..."
      ></textarea>
    </div>

    <!-- Upload Foto Dokumentasi AC -->
    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi AC</label>
      <ImageUploader 
        :photos="store.formData.ac_photos" 
        @uploaded="(url) => store.addPhoto('ac', url)" 
      />
    </div>
  </div>
</template>