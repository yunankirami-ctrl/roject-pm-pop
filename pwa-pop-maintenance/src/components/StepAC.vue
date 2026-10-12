<script setup>
import { usePmStore } from '../stores/usePmStore'
const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Air Conditioner (AC)</h3>
    <div v-for="(unit, idx) in store.formData.ac" :key="idx" class="p-3 border rounded-lg bg-slate-50 space-y-2">
      <h4 class="text-xs font-bold text-sky-700">{{ unit.kode_ac }}</h4>
      <div class="grid grid-cols-2 gap-2">
        <input v-model="unit.merk" type="text" placeholder="Merk (misal DAIKIN)" class="p-1.5 text-xs border rounded" />
        <input v-model="unit.pk" type="text" placeholder="PK (misal 1.5)" class="p-1.5 text-xs border rounded" />
      </div>
      <input v-model="unit.sn" type="text" placeholder="Serial Number" class="w-full p-1.5 text-xs border rounded" />
    </div>
  </div>
</template>