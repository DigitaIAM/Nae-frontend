<template>
  <div class="web-camera-container">
    <q-btn @click="takePhoto" icon="photo_camera" v-if="isCameraOpen && !isLoading" />
    <q-btn @click="uploadImage" label="upload" v-if="isPhotoTaken && isCameraOpen" />

    <div v-if="error">{{ error }}</div>

    <!-- <div class="camera-button">
      <button type="button" class="button is-rounded" :class="{ 'is-primary' : !isCameraOpen, 'is-danger' : isCameraOpen}" @click="toggleCamera">
        <span v-if="!isCameraOpen">Open Camera</span>
        <span v-else>Close Camera</span>
      </button>
    </div> -->

    <div v-show="isCameraOpen && isLoading" class="camera-loading">
      <ul class="loader-circle">
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>

    <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash' : isShotPhoto }">
      
      <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>
        
      <video v-show="!isPhotoTaken" ref="camera" :width="450" :height="337.5" autoplay></video>
      
      <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="450" :height="337.5"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { axios } from 'boot/axios'

const props = defineProps({
  url: String,
})

const emit = defineEmits(['uploaded'])

const error = ref(undefined)

const camera = ref(null);
const canvas = ref(null);

const isCameraOpen = ref(false)
const isPhotoTaken = ref(false)
const isShotPhoto = ref(false)
const isLoading = ref(false)

const toggleCamera = () => {
  if (isCameraOpen.value) {
    isCameraOpen.value = false;
    isPhotoTaken.value = false;
    isShotPhoto.value = false;
    stopCameraStream();
  } else {
    isCameraOpen.value = true;
    createCameraElement();
  }
}
    
const createCameraElement = () => {
  isLoading.value = true;
  
  const constraints = (window.constraints = {
    audio: false,
    video: true
  });

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      isLoading.value = false;
      camera.value.srcObject = stream;
    })
    .catch(error => {
      console.log('error', error)
      isLoading.value = false;
      alert("May the browser didn't support or there is some errors.");
    });
}
    
const stopCameraStream = () => {
  error.value = undefined
  let tracks = camera.value.srcObject.getTracks();

  tracks.forEach(track => {
    track.stop();
  });
}
    
const takePhoto = () => {
  error.value = undefined
  if(!isPhotoTaken.value) {
    isShotPhoto.value = true;

    const FLASH_TIMEOUT = 50;

    setTimeout(() => {
      isShotPhoto.value = false;
    }, FLASH_TIMEOUT);
  }
  
  isPhotoTaken.value = !isPhotoTaken.value;
  
  const context = canvas.value.getContext('2d');
  context.drawImage(camera.value, 0, 0, 450, 337.5);
}
    
const uploadImage = () => {
  const data = document.getElementById("photoTaken").toDataURL("image/jpeg")

  fetch(data)
    .then(res => {
      res.blob().then(blob => {
        const formData = new FormData();
        formData.append('img', blob, 'picture.jpg');

        axios.post(props.url, formData).then(() => emit('uploaded')).catch(e => error.value = e);
      })
    })
    .then(console.log)
}

onMounted(() => toggleCamera())
onBeforeUnmount(() => stopCameraStream())

</script>

<style lang="sass" scoped>
.web-camera-container
  max-width: 500px
  
  .camera-box
    .camera-shutter
      opacity: 0
      width: 450px
      height: 337.5px
      background-color: #fff
      position: absolute
      
      &.flash
        opacity: 1
  
  .camera-loading
    overflow: hidden
    height: 100%
    position: absolute
    width: 100%
    min-height: 150px
    margin: 3rem 0 0 -1.2rem
    
    ul
      height: 100%
      position: absolute
      width: 100%
      z-index: 999999
      margin: 0
    
    .loader-circle
      display: block
      height: 14px
      margin: 0 auto
      top: 50%
      left: 100%
      transform: translateY(-50%)
      transform: translateX(-50%)
      position: absolute
      width: 100%
      padding: 0
      
      li
        display: block
        float: left
        width: 10px
        height: 10px
        line-height: 10px
        padding: 0
        position: relative
        margin: 0 0 0 4px
        background: #999
        animation: preload 1s infinite
        top: -50%
        border-radius: 100%
        
        &:nth-child(2)
          animation-delay: .2s
        
        &:nth-child(3)
          animation-delay: .4s

  @keyframes preload
    0%
      opacity: 1
    50%
      opacity: .4
    100%
      opacity: 1
</style>