<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Pengukuran Grounding System</h3>
    
    <div>
      <label class="text-xs font-medium text-slate-600">On Bak Kontrol Outdoor (Ohm)</label>
      <input 
        v-model="store.formData.grounding.pengukuran_outdoor" 
        type="text" 
        class="w-full p-2 text-sm border rounded mt-1 focus:ring-1 focus:ring-sky-500 outline-none" 
        placeholder="Contoh: 0.5" 
      />
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600">On Bak Kontrol Indoor (Ohm)</label>
      <input 
        v-model="store.formData.grounding.pengukuran_indoor" 
        type="text" 
        class="w-full p-2 text-sm border rounded mt-1 focus:ring-1 focus:ring-sky-500 outline-none" 
        placeholder="Contoh: 0.43" 
      />
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600">System Grounding</label>
      <select 
        v-model="store.formData.grounding.system_grounding" 
        class="w-full p-2 text-sm border rounded mt-1 focus:ring-1 focus:ring-sky-500 outline-none bg-white"
      >
        <option value="Single">Single</option>
        <option value="Mesh">Mesh</option>
      </select>
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea 
        v-model="store.formData.grounding.comments" 
        class="w-full p-2 text-sm border rounded mt-1 focus:ring-1 focus:ring-sky-500 outline-none" 
        rows="2" 
        placeholder="Masukkan komentar atau catatan khusus..."
      ></textarea>
    </div>

    <!-- Upload Foto Dokumentasi Grounding -->
    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi</label>
      <ImageUploader 
        :photos="store.formData.grounding.photos" 
        @uploaded="(url) => store.addPhoto('grounding', url)" 
      />
    </div>
  </div>
</template>