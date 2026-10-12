<script setup>
import { usePmStore } from '../stores/usePmStore'
import { generatePMPdf } from '../utils/pdfGenerator'

const store = usePmStore()

const downloadPDF = () => {
  const pdfDoc = generatePMPdf(store.formData)
  pdfDoc.download(`PM_${store.formData.cover.nama_pop || 'SHELTER'}.pdf`)
}

const sendToWhatsApp = () => {
  downloadPDF()
  
  const text = `*LAPORAN PREVENTIVE MAINTENANCE POP*\n` +
               `*POP:* ${store.formData.cover.nama_pop || '-'}\n` +
               `*Tanggal:* ${store.formData.cover.tanggal_pelaksanaan}\n` +
               `*Teknisi:* ${store.formData.cover.tim_lapangan || '-'}\n\n` +
               `_File PDF laporan sudah diunduh ke HP. Silakan lampirkan berkas PDF di pesan ini._`

  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(waUrl, '_blank')
}
</script>

<template>
  <div class="max-w-md mx-auto min-h-screen bg-slate-50 p-4 space-y-4">
    <div class="bg-white p-4 rounded-lg shadow text-center space-y-2">
      <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold text-xl">✓</div>
      <h2 class="font-bold text-slate-800">Laporan Berhasil Disimpan!</h2>
      <p class="text-xs text-slate-500">Anda dapat mengunduh dokumen PDF atau membagikannya langsung ke WhatsApp.</p>
    </div>

    <div class="space-y-2">
      <button @click="downloadPDF" class="w-full py-2.5 bg-sky-600 text-white font-bold text-xs rounded-lg shadow">
        Unduh File PDF Laporan
      </button>

      <button @click="sendToWhatsApp" class="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-2">
        Kirim Ringkasan & PDF ke WhatsApp
      </button>
    </div>
  </div>
</template>