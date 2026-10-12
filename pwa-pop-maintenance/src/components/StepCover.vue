<script setup>
import { usePmStore } from '../stores/usePmStore'
const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Informasi POP (Cover)</h3>
    <div>
      <label class="text-xs font-medium text-slate-600">ID MR</label>
      <input v-model="store.formData.cover.id_mr" type="text" class="w-full p-2 text-sm border rounded mt-1" placeholder="Masukkan ID MR" />
    </div>
    <div>
      <label class="text-xs font-medium text-slate-600">Tanggal Pelaksanaan</label>
      <input v-model="store.formData.cover.tanggal_pelaksanaan" type="date" class="w-full p-2 text-sm border rounded mt-1" />
    </div>
    <div>
      <label class="text-xs font-medium text-slate-600">Nama POP / Shelter</label>
      <input v-model="store.formData.cover.nama_pop" type="text" class="w-full p-2 text-sm border rounded mt-1" placeholder="Contoh: SHELTER GI RANCAEKEK 150KV" />
    </div>
    <div>
      <label class="text-xs font-medium text-slate-600">Alamat POP</label>
      <textarea v-model="store.formData.cover.alamat_pop" class="w-full p-2 text-sm border rounded mt-1" rows="2"></textarea>
    </div>
    <div>
      <label class="text-xs font-medium text-slate-600">Tipe POP</label>
      <select v-model="store.formData.cover.tipe_pop" class="w-full p-2 text-sm border rounded mt-1">
        <option>Super Backbone</option>
        <option>Backbone</option>
        <option>Distribusi</option>
      </select>
    </div>
    <div>
      <label class="text-xs font-medium text-slate-600">Tim Lapangan Maintenance</label>
      <input v-model="store.formData.cover.tim_lapangan" type="text" class="w-full p-2 text-sm border rounded mt-1" placeholder="Nama Petugas" />
    </div>
  </div>
</template>