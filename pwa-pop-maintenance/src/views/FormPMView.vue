<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePmStore } from '../stores/usePmStore'
import { supabase } from '../utils/supabaseClient'

import StepCover from '../components/StepCover.vue'
import StepGrounding from '../components/StepGrounding.vue'
import StepKwh from '../components/StepKwh.vue'
import StepGenset from '../components/StepGenset.vue'
import StepAC from '../components/StepAC.vue'
import StepAcpdb from '../components/StepAcpdb.vue'
import StepPowerDist from '../components/StepPowerDist.vue'
import StepInverter from '../components/StepInverter.vue'
import StepBattery from '../components/StepBattery.vue'
import StepEnvironment from '../components/StepEnvironment.vue'

const store = usePmStore()
const router = useRouter()
const currentStep = ref(0)
const loading = ref(false)

const steps = [
  { name: 'Cover', comp: StepCover },
  { name: 'Grounding', comp: StepGrounding },
  { name: 'KWH', comp: StepKwh },
  { name: 'Genset', comp: StepGenset },
  { name: 'AC', comp: StepAC },
  { name: 'ACPDB', comp: StepAcpdb },
  { name: 'Rectifier', comp: StepPowerDist },
  { name: 'Inverter', comp: StepInverter },
  { name: 'Battery', comp: StepBattery },
  { name: 'DCPDB', comp: StepDcpdb },
  { name: 'Env', comp: StepEnvironment }
]

const submitReport = async () => {
  try {
    loading.value = true

    // 1. Simpan Cover ke pm_reports
    const { data: repData, error: repErr } = await supabase
      .from('pm_reports')
      .insert([store.formData.cover])
      .select()

    if (repErr) throw repErr
    const reportId = repData[0].id

    // 2. Simpan Detail Modul secara Paralel (Termasuk Inverter & Battery)
    await Promise.all([
      supabase.from('pm_grounding').insert([{ ...store.formData.grounding, report_id: reportId }]),
      supabase.from('pm_kwh').insert([{ ...store.formData.kwh, report_id: reportId }]),
      supabase.from('pm_genset').insert([{ ...store.formData.genset, report_id: reportId }]),
      supabase.from('pm_ac').insert([{ units: store.formData.ac, report_id: reportId }]),
      supabase.from('pm_acpdb').insert([{ ...store.formData.acpdb, report_id: reportId }]),
      supabase.from('pm_inverter').insert([{ inverters: store.formData.inverters, comments: store.formData.inverter_comments, photos: store.formData.inverter_photos, report_id: reportId }]),
      supabase.from('pm_battery').insert([{ batteries: store.formData.batteries, comments: store.formData.battery_comments, photos: store.formData.battery_photos, report_id: reportId }])
      supabase.from('pm_dcpdb').insert([{ ...store.formData.dcpdb, report_id: reportId }])
    ])

    router.push('/report-detail')
  } catch (err) {
    alert('Gagal submit laporan: ' + err.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto min-h-screen bg-white shadow-md flex flex-col">
    <!-- Header Utama PWA -->
    <header class="bg-sky-600 text-white p-3 shadow flex items-center justify-center gap-3">
      <img src="/logo-pln.png" alt="Logo PLN Icon Plus" class="h-9 bg-white p-1 rounded object-contain" />
      <span class="font-bold text-xs sm:text-sm tracking-wide">
        PWA PREVENTIVE MAINTENANCE POP
      </span>
    </header>

    <!-- Navigation Stepper Tabs -->
    <div class="flex overflow-x-auto bg-slate-100 p-2 border-b text-xs space-x-1 scrollbar-none">
      <button
        v-for="(step, index) in steps"
        :key="index"
        @click="currentStep = index"
        :class="[
          'px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition',
          currentStep === index 
            ? 'bg-sky-600 text-white shadow-sm' 
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        ]"
      >
        {{ step.name }}
      </button>
    </div>

    <!-- Area Komponen Form per Step -->
    <main class="p-4 flex-1">
      <component :is="steps[currentStep].comp" />
    </main>

    <!-- Bottom Action Bar -->
    <footer class="p-4 border-t flex justify-between bg-slate-50">
      <button
        @click="currentStep--"
        :disabled="currentStep === 0"
        class="px-4 py-2 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 transition"
      >
        Kembali
      </button>

      <button
        v-if="currentStep < steps.length - 1"
        @click="currentStep++"
        class="px-4 py-2 text-xs bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition"
      >
        Lanjut
      </button>

      <button
        v-else
        @click="submitReport"
        :disabled="loading"
        class="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-1"
      >
        <span v-if="loading" class="animate-spin">🌀</span>
        <span>{{ loading ? 'Menyimpan...' : 'Submit Laporan' }}</span>
      </button>
    </footer>
  </div>
</template>