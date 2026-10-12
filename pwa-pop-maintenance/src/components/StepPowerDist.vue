<script setup>
import { usePmStore } from '../stores/usePmStore'
const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Rectifier & Distribusi Power</h3>
    <div v-for="(rect, idx) in store.formData.powerDist.rectifiers" :key="idx" class="p-3 border rounded bg-slate-50 space-y-2">
      <h4 class="text-xs font-bold text-sky-700">{{ rect.rectifier_name }}</h4>
      <div class="grid grid-cols-2 gap-2">
        <input v-model="rect.merk" type="text" placeholder="Merk" class="p-1.5 text-xs border rounded" />
        <input v-model="rect.type" type="text" placeholder="Type" class="p-1.5 text-xs border rounded" />
      </div>
    </div>
  </div>
</template>