<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Main AC Power (Panel KWH Meter)</h3>

    <!-- Basic Info -->
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="text-xs font-medium text-slate-600">ID Customer / Meter</label>
        <input 
          v-model="store.formData.kwh.id_customer" 
          type="text" 
          class="w-full p-2 text-sm border rounded mt-1 focus:ring-1 focus:ring-sky-500 outline-none" 
          placeholder="534884873268" 
        />
      </div>
      <div>
        <label class="text-xs font-medium text-slate-600">Daya (KVA)</label>
        <input 
          v-model="store.formData.kwh.daya_kva" 
          type="text" 
          class="w-full p-2 text-sm border rounded mt-1 focus:ring-1 focus:ring-sky-500 outline-none" 
          placeholder="16500" 
        />
      </div>
    </div>

    <!-- Phasa & Kapasitas MCB -->
    <div class="p-3 border rounded bg-slate-50 space-y-2">
      <div class="flex justify-between items-center">
        <label class="text-xs font-bold text-slate-700">Kapasitas MCB (Ampere)</label>
        <div class="flex items-center gap-1">
          <span class="text-xs text-slate-500">Phasa:</span>
          <input v-model="store.formData.kwh.phasa" type="number" class="w-12 p-1 text-xs border rounded bg-white" placeholder="3" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="text-[10px] text-slate-500">R (A)</label>
          <input v-model="store.formData.kwh.mcb_r_ampere" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="25" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">S (A)</label>
          <input v-model="store.formData.kwh.mcb_s_ampere" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="25" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">T (A)</label>
          <input v-model="store.formData.kwh.mcb_t_ampere" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="25" />
        </div>
      </div>
    </div>

    <!-- Pengukuran Tegangan Phasa -->
    <div class="p-3 border rounded bg-slate-50 space-y-2">
      <label class="text-xs font-bold text-slate-700">Pengukuran Phasa Tegangan (Volt)</label>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="text-[10px] text-slate-500">R - N (V)</label>
          <input v-model="store.formData.kwh.voltage_rn" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="223" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">S - N (V)</label>
          <input v-model="store.formData.kwh.voltage_sn" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="225" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">T - N (V)</label>
          <input v-model="store.formData.kwh.voltage_tn" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="227" />
        </div>
      </div>
      <div>
        <label class="text-[10px] text-slate-500">N - G (V)</label>
        <input v-model="store.formData.kwh.voltage_ng" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="4,6" />
      </div>
    </div>

    <!-- Pengukuran Arus Phasa -->
    <div class="p-3 border rounded bg-slate-50 space-y-2">
      <label class="text-xs font-bold text-slate-700">Pengukuran Phasa Arus (Ampere)</label>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="text-[10px] text-slate-500">R Ampere</label>
          <input v-model="store.formData.kwh.ampere_r" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="10" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">S Ampere</label>
          <input v-model="store.formData.kwh.ampere_s" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="5" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500">T Ampere</label>
          <input v-model="store.formData.kwh.ampere_t" type="text" class="w-full p-1.5 text-xs border rounded bg-white" placeholder="5" />
        </div>
      </div>
    </div>

    <!-- COS & Arester -->
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="text-xs font-medium text-slate-600">COS Status / Tipe</label>
        <div class="flex gap-1 mt-1">
          <input v-model="store.formData.kwh.cos_phi_status" type="text" class="w-1/2 p-1.5 text-xs border rounded" placeholder="Ada" />
          <input v-model="store.formData.kwh.cos_phi_tipe" type="text" class="w-1/2 p-1.5 text-xs border rounded" placeholder="Legend" />
        </div>
      </div>
      <div>
        <label class="text-xs font-medium text-slate-600">Arester Status / Tipe</label>
        <div class="flex gap-1 mt-1">
          <input v-model="store.formData.kwh.arester_status" type="text" class="w-1/2 p-1.5 text-xs border rounded" placeholder="Ada" />
          <input v-model="store.formData.kwh.arester_tipe" type="text" class="w-1/2 p-1.5 text-xs border rounded" placeholder="Phon.x" />
        </div>
      </div>
    </div>

    <!-- Kabel Output KWH -->
    <div class="p-3 border rounded bg-slate-50 space-y-2">
      <label class="text-xs font-bold text-slate-700">Kabel Output KWH (Luas Penampang mm²)</label>
      <div class="grid grid-cols-5 gap-1">
        <div>
          <label class="text-[10px] text-slate-500 block text-center">R (Merah)</label>
          <input v-model="store.formData.kwh.kabel_r_mm" type="text" class="w-full p-1 text-xs border rounded bg-white text-center" placeholder="16" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500 block text-center">S (Kuning)</label>
          <input v-model="store.formData.kwh.kabel_s_mm" type="text" class="w-full p-1 text-xs border rounded bg-white text-center" placeholder="16" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500 block text-center">T (Hitam)</label>
          <input v-model="store.formData.kwh.kabel_t_mm" type="text" class="w-full p-1 text-xs border rounded bg-white text-center" placeholder="16" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500 block text-center">N (Hijau)</label>
          <input v-model="store.formData.kwh.kabel_n_mm" type="text" class="w-full p-1 text-xs border rounded bg-white text-center" placeholder="16" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500 block text-center">G (Kng/Hj)</label>
          <input v-model="store.formData.kwh.kabel_g_mm" type="text" class="w-full p-1 text-xs border rounded bg-white text-center" placeholder="16" />
        </div>
      </div>
    </div>

    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea v-model="store.formData.kwh.comments" class="w-full p-2 text-sm border rounded mt-1 focus:ring-1 focus:ring-sky-500 outline-none" rows="2" placeholder="Masukkan catatan..."></textarea>
    </div>

    <!-- Upload Foto -->
    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi</label>
      <ImageUploader 
        :photos="store.formData.kwh.photos" 
        @uploaded="(url) => store.addPhoto('kwh', url)" 
      />
    </div>
  </div>
</template>