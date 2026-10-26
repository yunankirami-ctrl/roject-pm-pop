<script setup>
import { usePmStore } from '../stores/usePmStore'
import ImageUploader from './ImageUploader.vue'

const store = usePmStore()
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-bold text-slate-800 border-b pb-2">Main AC Power (Genset)</h3>

    <!-- 1. GENERAL -->
    <div class="p-3 border rounded-lg bg-slate-50 space-y-3">
      <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">1. General</h4>
      
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[11px] font-medium text-slate-600">Merk Genset</label>
          <input 
            v-model="store.formData.genset.merk" 
            type="text" 
            class="w-full p-2 text-xs border rounded bg-white mt-0.5 outline-none focus:ring-1 focus:ring-sky-500" 
            placeholder="YANMAR" 
          />
        </div>
        <div>
          <label class="text-[11px] font-medium text-slate-600">Kapasitas (KVA)</label>
          <input 
            v-model="store.formData.genset.kapasitas_kva" 
            type="text" 
            class="w-full p-2 text-xs border rounded bg-white mt-0.5 outline-none focus:ring-1 focus:ring-sky-500" 
            placeholder="20" 
          />
        </div>
      </div>

      <div>
        <label class="text-[11px] font-medium text-slate-600">Serial Number (SN)</label>
        <input 
          v-model="store.formData.genset.sn" 
          type="text" 
          class="w-full p-2 text-xs border rounded bg-white mt-0.5 outline-none focus:ring-1 focus:ring-sky-500" 
          placeholder="82052" 
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[11px] font-medium text-slate-600">Fuel Level (Liter)</label>
          <input 
            v-model="store.formData.genset.fuel_level_liter" 
            type="text" 
            class="w-full p-2 text-xs border rounded bg-white mt-0.5 outline-none focus:ring-1 focus:ring-sky-500" 
            placeholder="20" 
          />
        </div>
        <div>
          <label class="text-[11px] font-medium text-slate-600">Hour Meter (Hour)</label>
          <input 
            v-model="store.formData.genset.hour_meter" 
            type="text" 
            class="w-full p-2 text-xs border rounded bg-white mt-0.5 outline-none focus:ring-1 focus:ring-sky-500" 
            placeholder="150" 
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[11px] font-medium text-slate-600">Engine Condition</label>
          <input 
            v-model="store.formData.genset.engine_status" 
            type="text" 
            class="w-full p-2 text-xs border rounded bg-white mt-0.5 outline-none focus:ring-1 focus:ring-sky-500" 
            placeholder="Baik / Normal" 
          />
        </div>
        <div>
          <label class="text-[11px] font-medium text-slate-600">Accu Condition</label>
          <input 
            v-model="store.formData.genset.accu_status" 
            type="text" 
            class="w-full p-2 text-xs border rounded bg-white mt-0.5 outline-none focus:ring-1 focus:ring-sky-500" 
            placeholder="OK / 12V" 
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[11px] font-medium text-slate-600">Switch Mode</label>
          <select 
            v-model="store.formData.genset.switch_mode" 
            class="w-full p-2 text-xs border rounded bg-white mt-0.5 outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        <div>
          <label class="text-[11px] font-medium text-slate-600">Temperatur (°C)</label>
          <input 
            v-model="store.formData.genset.temperatur" 
            type="text" 
            class="w-full p-2 text-xs border rounded bg-white mt-0.5 outline-none focus:ring-1 focus:ring-sky-500" 
            placeholder="28" 
          />
        </div>
      </div>
    </div>

    <!-- 2. PENGUKURAN -->
    <div class="p-3 border rounded-lg bg-slate-50 space-y-3">
      <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">2. Pengukuran</h4>

      <!-- Beban -->
      <div class="space-y-1">
        <label class="text-[11px] font-bold text-slate-600">Dengan Beban</label>
        <div class="grid grid-cols-2 gap-2">
          <input 
            v-model="store.formData.genset.beban_voltage" 
            type="text" 
            class="p-1.5 text-xs border rounded bg-white outline-none" 
            placeholder="Voltage (cth: 220)" 
          />
          <input 
            v-model="store.formData.genset.beban_ampere" 
            type="text" 
            class="p-1.5 text-xs border rounded bg-white outline-none" 
            placeholder="Ampere (cth: 10)" 
          />
        </div>
      </div>

      <!-- Tanpa Beban -->
      <div class="space-y-1">
        <label class="text-[11px] font-bold text-slate-600">Tanpa Beban</label>
        <div class="grid grid-cols-2 gap-2">
          <input 
            v-model="store.formData.genset.tanpa_beban_voltage" 
            type="text" 
            class="p-1.5 text-xs border rounded bg-white outline-none" 
            placeholder="Voltage (cth: 220)" 
          />
          <input 
            v-model="store.formData.genset.tanpa_beban_ampere" 
            type="text" 
            class="p-1.5 text-xs border rounded bg-white outline-none" 
            placeholder="Ampere (cth: 0)" 
          />
        </div>
      </div>
    </div>

    <!-- 3. TERM (Kondisi Ruangan Genset) -->
    <div class="p-3 border rounded-lg bg-slate-50 space-y-2">
      <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">3. Term (Kondisi Ruangan Genset)</h4>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[11px] font-medium text-slate-600">Kebersihan</label>
          <select v-model="store.formData.genset.kebersihan" class="w-full p-2 text-xs border rounded bg-white mt-0.5">
            <option value="Bersih">Bersih</option>
            <option value="Kotor">Kotor</option>
          </select>
        </div>
        <div>
          <label class="text-[11px] font-medium text-slate-600">Suhu Ruangan</label>
          <input 
            v-model="store.formData.genset.suhu_ruangan" 
            type="text" 
            class="w-full p-2 text-xs border rounded bg-white mt-0.5" 
            placeholder="Normal / 26°C" 
          />
        </div>
      </div>
    </div>

    <!-- CATATAN / COMMENTS -->
    <div>
      <label class="text-xs font-medium text-slate-600">Catatan / Comments</label>
      <textarea 
        v-model="store.formData.genset.comments" 
        class="w-full p-2 text-sm border rounded mt-1 outline-none focus:ring-1 focus:ring-sky-500" 
        rows="2" 
        placeholder="Contoh: TIDAK ADA GENSET / Genset Beroperasi Normal"
      ></textarea>
    </div>

    <!-- UPLOAD FOTO DOKUMENTASI -->
    <div>
      <label class="text-xs font-medium text-slate-600 block mb-1">Unggah Foto Dokumentasi</label>
      <ImageUploader 
        :photos="store.formData.genset.photos" 
        @uploaded="(url) => store.addPhoto('genset', url)" 
      />
    </div>
  </div>
</template>