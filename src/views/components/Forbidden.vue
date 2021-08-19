<template>
  

    <div class="container m-auto text-center pt-5">
      <img :src="Img403" alt="" class="img-403">
      <br>
      <b-button class="mt-5" variant="danger" size="sm" @click="$router.go(-2)">Volver</b-button>

    </div>
</template>

<script>
export default {
  data() {
    return {
      Img403: require('../../assets/img/error-403-forbidden.png'),
    }
  }
}
</script>

<style scoped>
  .img-403{
    max-width: 80%;
  }
</style>