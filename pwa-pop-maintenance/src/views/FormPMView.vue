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
import StepPowerDist from '../components/StepPowerDist.vue'
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
  { name: 'Power', comp: StepPowerDist },
  { name: 'Battery', comp: StepBattery },
  { name: 'Env', comp: StepEnvironment }
]

const submitReport = async () => {
  try {
    loading.value = true
    
    // 1. Simpan ke Supabase pm_reports
    const { data: repData, error: repErr } = await supabase
      .from('pm_reports')
      .insert([store.formData.cover])
      .select()

    if (repErr) throw repErr
    const reportId = repData[0].id

    // 2. Simpan Detail Grounding
    await supabase.from('pm_grounding').insert([{ ...store.formData.grounding, report_id: reportId }])

    // Redirect ke preview
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
    <!-- Header -->
    <header class="bg-sky-600 text-white p-4 font-bold text-center text-sm shadow">
      PWA PREVENTIVE MAINTENANCE POP
    </header>

    <!-- Stepper Navigation -->
    <div class="flex overflow-x-auto bg-slate-100 p-2 border-b text-xs space-x-1">
      <button 
        v-for="(st, idx) in steps" 
        :key="idx" 
        @click="currentStep = idx"
        :class="[currentStep === idx ? 'bg-sky-600 text-white font-bold' : 'bg-white text-slate-600']"
        class="px-3 py-1.5 rounded-full shrink-0 border"
      >
        {{ st.name }}
      </button>
    </div>

    <!-- Step Component Content -->
    <main class="p-4 flex-1">
      <component :is="steps[currentStep].comp" />
    </main>

    <!-- Bottom Navigation -->
    <footer class="p-4 border-t flex justify-between bg-slate-50">
      <button 
        @click="currentStep--" 
        :disabled="currentStep === 0" 
        class="px-4 py-2 text-xs bg-slate-200 rounded disabled:opacity-50"
      >
        Kembali
      </button>

      <button 
        v-if="currentStep < steps.length - 1" 
        @click="currentStep++" 
        class="px-4 py-2 text-xs bg-sky-600 text-white font-bold rounded"
      >
        Lanjut
      </button>

      <button 
        v-else 
        @click="submitReport" 
        :disabled="loading"
        class="px-4 py-2 text-xs bg-emerald-600 text-white font-bold rounded"
      >
        {{ loading ? 'Menyimpan...' : 'Submit Laporan' }}
      </button>
    </footer>
  </div>
</template>