<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'
const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Main AC Power (Genset)</h3>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="text-xs font-medium text-slate-600">Merk Genset</label>
        <input v-model="store.formData.genset.merk" type="text" class="w-full p-2 text-sm border rounded mt-1" />
      </div>
      <div>
        <label class="text-xs font-medium text-slate-600">Kapasitas (KVA)</label>
        <input v-model="store.formData.genset.kapasitas_kva" type="number" class="w-full p-2 text-sm border rounded mt-1" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="text-xs font-medium text-slate-600">Fuel Level (Liter)</label>
        <input v-model="store.formData.genset.fuel_level_liter" type="number" class="w-full p-2 text-sm border rounded mt-1" />
      </div>
      <div>
        <label class="text-xs font-medium text-slate-600">Hour Meter (Hour)</label>
        <input v-model="store.formData.genset.hour_meter" type="number" class="w-full p-2 text-sm border rounded mt-1" />
      </div>
    </div>
    <div>
      <label class="text-xs font-medium text-slate-600">Switch Mode</label>
      <select v-model="store.formData.genset.switch_mode" class="w-full p-2 text-sm border rounded mt-1">
        <option>Automatic</option>
        <option>Manual</option>
      </select>
    </div>
    <ImageUploader :photos="store.formData.genset.photos" @uploaded="(url) => store.addPhoto('genset', url)" />
  </div>
</template>