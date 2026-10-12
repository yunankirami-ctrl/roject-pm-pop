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
      <input v-model="store.formData.grounding.pengukuran_outdoor" type="text" class="w-full p-2 text-sm border rounded mt-1" placeholder="Contoh: 0.5" />
    </div>
    <div>
      <label class="text-xs font-medium text-slate-600">On Bak Kontrol Indoor (Ohm)</label>
      <input v-model="store.formData.grounding.pengukuran_indoor" type="text" class="w-full p-2 text-sm border rounded mt-1" placeholder="Contoh: 0.43" />
    </div>
    <div>
      <label class="text-xs font-medium text-slate-600">System Grounding</label>
      <select v-model="store.formData.grounding.system_grounding" class="w-full p-2 text-sm border rounded mt-1">
        <option>Single</option>
        <option>Mesh</option>
      </select>
    </div>
    <ImageUploader :photos="store.formData.grounding.photos" @uploaded="(url) => store.addPhoto('grounding', url)" />
  </div>
</template>