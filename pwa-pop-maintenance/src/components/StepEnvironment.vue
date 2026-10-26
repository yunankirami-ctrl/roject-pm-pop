<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <div class="border-b pb-2">
      <h3 class="text-base font-bold text-slate-800">Form Pengecekan Ruangan / Environment</h3>
    </div>

    <!-- Suhu & Pembersihan AC Terakhir -->
    <div class="p-3 border rounded-lg bg-slate-50 space-y-3">
      <div>
        <label class="text-xs font-semibold text-slate-700 block">Suhu Ruangan (°C)</label>
        <input 
          v-model="store.formData.environment.suhu" 
          type="text" 
          class="w-full p-2 text-xs border rounded bg-white mt-1" 
          placeholder="Cth: 24" 
        />
      </div>

      <div>
        <label class="text-xs font-semibold text-slate-700 block">Pembersihan AC Terakhir</label>
        <input 
          v-model="store.formData.environment.pembersihan_ac" 
          type="date" 
          class="w-full p-2 text-xs border rounded bg-white mt-1" 
        />
      </div>
    </div>

    <!-- Checklist External Alarm -->
    <div class="p-3 border rounded-lg bg-slate-50 space-y-2">
      <h4 class="text-xs font-bold text-slate-700 border-b pb-1">External Alarm Status</h4>
      
      <div 
        v-for="(alarm, key) in store.formData.environment.alarms" 
        :key="key"
        class="flex justify-between items-center py-1.5 border-b border-slate-200 text-xs"
      >
        <span class="font-medium text-slate-700 capitalize">{{ key.replace(/_/g, ' ') }}</span>
        <div class="flex gap-4">
          <label class="flex items-center gap-1 cursor-pointer">
            <input type="radio" :name="key" value="OK" v-model="store.formData.environment.alarms[key]" class="text-sky-600" />
            <span>OK</span>
          </label>
          <label class="flex items-center gap-1 cursor-pointer">
            <input type="radio" :name="key" value="NOT OK" v-model="store.formData.environment.alarms[key]" class="text-red-600" />
            <span>NOT OK</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Catatan -->
    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea v-model="store.formData.environment.comments" class="w-full p-2 text-sm border rounded mt-1 outline-none focus:ring-1 focus:ring-sky-500" rows="2" placeholder="Catatan kondisi environment..."></textarea>
    </div>

    <!-- Upload Foto -->
    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi Environment</label>
      <ImageUploader 
        :photos="store.formData.environment.photos" 
        @uploaded="(url) => store.addPhoto('environment', url)" 
      />
    </div>
  </div>
</template>