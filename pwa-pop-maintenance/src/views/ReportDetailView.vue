<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePmStore } from '../stores/usePmStore'
import { generatePMPdf } from '../utils/pdfGenerator'

const store = usePmStore()
const router = useRouter()
const loading = ref(false)

const downloadPDF = async () => {
  try {
    loading.value = true
    const pdfDoc = await generatePMPdf(store.formData)
    pdfDoc.download(`PM_${store.formData.cover?.nama_pop || 'SHELTER'}.pdf`)
  } catch (err) {
    alert('Gagal mengunduh PDF: ' + err.message)
  } finally {
    loading.value = false
  }
}

const sendToWhatsApp = async () => {
  try {
    loading.value = true
    await downloadPDF()
    
    const text = `*LAPORAN PREVENTIVE MAINTENANCE POP*\n` +
                 `*POP:* ${store.formData.cover?.nama_pop || '-'}\n` +
                 `*Tanggal:* ${store.formData.cover?.tanggal_pelaksanaan || '-'}\n` +
                 `*Teknisi ICON:* ${store.formData.cover?.tim_icon || store.formData.cover?.tim_lapangan || '-'}\n\n` +
                 `_File PDF laporan sudah diunduh ke HP. Silakan lampirkan berkas PDF di pesan ini._`

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')
  } catch (err) {
    alert('Gagal memproses ke WhatsApp: ' + err.message)
  } finally {
    loading.value = false
  }
}

const backToForm = () => {
  router.push('/')
}
</script>

<template>
  <div class="max-w-md mx-auto min-h-screen bg-slate-100 p-4 space-y-4">
    <!-- Card Sukses -->
    <div class="bg-white p-6 rounded-xl shadow-sm text-center space-y-3">
      <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold text-2xl">
        ✓
      </div>
      <h2 class="font-bold text-lg text-slate-800">Laporan Berhasil Disimpan!</h2>
      <p class="text-xs text-slate-500 leading-relaxed">
        Data Preventive Maintenance POP {{ store.formData.cover?.nama_pop }} telah tersimpan di Supabase. Anda dapat mengunduh laporan PDF atau mengirimkannya via WhatsApp.
      </p>
    </div>

    <!-- Group Tombol Aksi -->
    <div class="space-y-3">
      <button 
        @click="downloadPDF" 
        :disabled="loading"
        class="w-full py-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span v-if="loading" class="animate-spin">🌀</span>
        <span>{{ loading ? 'Memproses PDF...' : 'Unduh File PDF Laporan' }}</span>
      </button>

      <button 
        @click="sendToWhatsApp" 
        :disabled="loading"
        class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>Kirim Ringkasan & PDF ke WhatsApp</span>
      </button>

      <button 
        @click="backToForm" 
        class="w-full py-3 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition"
      >
        Kembali ke Form Utama
      </button>
    </div>
  </div>
</template>