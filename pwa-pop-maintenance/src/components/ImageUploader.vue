<script setup>
import { ref } from 'vue'
import { supabase } from '../utils/supabaseClient'

const props = defineProps(['photos'])
const emit = defineEmits(['uploaded'])
const uploading = ref(false)

const handleUpload = async (event) => {
  try {
    uploading.value = true
    const file = event.target.files[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('pm-photos')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('pm-photos').getPublicUrl(fileName)
    emit('uploaded', data.publicUrl)
  } catch (err) {
    alert('Gagal unggah foto: ' + err.message)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="mt-2">
    <label class="block text-xs font-semibold text-slate-600 mb-1">Unggah Foto Dokumentasi</label>
    <input 
      type="file" 
      accept="image/*" 
      capture="environment"
      @change="handleUpload" 
      :disabled="uploading"
      class="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
    />
    <p v-if="uploading" class="text-xs text-amber-600 mt-1 animate-pulse">Mengunggah gambar...</p>
    
    <!-- Thumbnail Preview -->
    <div v-if="photos && photos.length > 0" class="flex flex-wrap gap-2 mt-2">
      <div v-for="(img, idx) in photos" :key="idx" class="relative w-16 h-16 border rounded overflow-hidden">
        <img :src="img" class="w-full h-full object-cover" />
      </div>
    </div>
  </div>
</template>