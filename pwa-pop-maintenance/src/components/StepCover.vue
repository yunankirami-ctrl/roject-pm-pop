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
      <input v-model="store.formData.cover.nama_pop" type="text" class="w-full p-2 text-sm border rounded mt-1" placeholder="SHELTER GI RANCAEKEK 150KV" />
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600">Alamat POP</label>
      <textarea v-model="store.formData.cover.alamat_pop" class="w-full p-2 text-sm border rounded mt-1" rows="2" placeholder="Jl. Cibungur, Jatimukti, Kec. Jatinangor, Kab Sumedang"></textarea>
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600">Koordinat POP</label>
      <input v-model="store.formData.cover.koordinat_pop" type="text" class="w-full p-2 text-sm border rounded mt-1" placeholder="-6.938123, 107.77123" />
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600">Tipe POP</label>
      <select v-model="store.formData.cover.tipe_pop" class="w-full p-2 text-sm border rounded mt-1">
        <option value="Super Backbone">Super Backbone</option>
        <option value="Backbone">Backbone</option>
        <option value="Distribusi">Distribusi</option>
      </select>
    </div>

    <div class="p-3 border rounded bg-slate-50 space-y-2">
      <h4 class="text-xs font-bold text-slate-700">Tim Lapangan Maintenance Rutin</h4>
      <div>
        <label class="text-xs text-slate-600">PLN ICON PLUS</label>
        <input v-model="store.formData.cover.tim_icon" type="text" class="w-full p-2 text-sm border rounded mt-1 bg-white" placeholder="Nama Petugas ICON" />
      </div>
      <div>
        <label class="text-xs text-slate-600">PLN STI</label>
        <input v-model="store.formData.cover.tim_sti" type="text" class="w-full p-2 text-sm border rounded mt-1 bg-white" placeholder="Nama Petugas STI" />
      </div>
    </div>
  </div>
</template>