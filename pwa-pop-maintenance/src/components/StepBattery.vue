<script setup>
import { usePmStore } from '../stores/usePmStore'
const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Bank Battery</h3>
    <div v-for="(bat, idx) in store.formData.battery" :key="idx" class="p-3 border rounded bg-slate-50 space-y-2">
      <h4 class="text-xs font-bold text-sky-700">{{ bat.rectifier_target }} - {{ bat.bank_name }}</h4>
      <div class="grid grid-cols-2 gap-2">
        <input v-model="bat.merk" type="text" placeholder="Merk (misal NARADA)" class="p-1.5 text-xs border rounded" />
        <input v-model="bat.kapasitas" type="number" placeholder="Kapasitas (Ah)" class="p-1.5 text-xs border rounded" />
      </div>
    </div>
  </div>
</template>