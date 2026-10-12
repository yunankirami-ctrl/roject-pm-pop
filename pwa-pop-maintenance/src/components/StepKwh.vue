<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'
const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Main AC Power (Panel KWH Meter)</h3>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="text-xs font-medium text-slate-600">ID Customer / Meter</label>
        <input v-model="store.formData.kwh.id_customer" type="text" class="w-full p-2 text-sm border rounded mt-1" />
      </div>
      <div>
        <label class="text-xs font-medium text-slate-600">Daya (KVA)</label>
        <input v-model="store.formData.kwh.daya_kva" type="number" class="w-full p-2 text-sm border rounded mt-1" />
      </div>
    </div>
    <div class="grid grid-cols-3 gap-2">
      <div>
        <label class="text-xs font-medium text-slate-600">Tegangan R-N (V)</label>
        <input v-model="store.formData.kwh.voltage_rn" type="number" class="w-full p-2 text-sm border rounded mt-1" />
      </div>
      <div>
        <label class="text-xs font-medium text-slate-600">Tegangan S-N (V)</label>
        <input v-model="store.formData.kwh.voltage_sn" type="number" class="w-full p-2 text-sm border rounded mt-1" />
      </div>
      <div>
        <label class="text-xs font-medium text-slate-600">Tegangan T-N (V)</label>
        <input v-model="store.formData.kwh.voltage_tn" type="number" class="w-full p-2 text-sm border rounded mt-1" />
      </div>
    </div>
    <div>
      <label class="text-xs font-medium text-slate-600">Tegangan N-G (V)</label>
      <input v-model="store.formData.kwh.voltage_ng" type="number" step="0.1" class="w-full p-2 text-sm border rounded mt-1" />
    </div>
    <ImageUploader :photos="store.formData.kwh.photos" @uploaded="(url) => store.addPhoto('kwh', url)" />
  </div>
</template>