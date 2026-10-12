<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'
const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Environment & External Alarm</h3>
    <div>
      <label class="text-xs font-medium text-slate-600">Suhu Ruangan (°C)</label>
      <input v-model="store.formData.environment.suhu" type="number" class="w-full p-2 text-sm border rounded mt-1" />
    </div>
    <div class="space-y-2">
      <label class="text-xs font-bold text-slate-700">Status External Alarms</label>
      <div v-for="(val, key) in store.formData.environment.alarms" :key="key" class="flex justify-between items-center text-xs border-b py-1">
        <span class="capitalize">{{ key.replace('_', ' ') }}</span>
        <select v-model="store.formData.environment.alarms[key]" class="p-1 border rounded text-xs">
          <option>OK</option>
          <option>NOT OK</option>
        </select>
      </div>
    </div>
    <ImageUploader :photos="store.formData.environment.photos" @uploaded="(url) => store.addPhoto('environment', url)" />
  </div>
</template>