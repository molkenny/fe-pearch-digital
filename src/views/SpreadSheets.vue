<template>
    <div class="container-spreadsheet">
      <div v-if="documentData">
        <div style="padding: 10px 20px">
          <b-button size="sm" style="padding: 1px 4px;" variant="danger" @click="$router.go(-1)">
            <b-icon icon="arrow-left"></b-icon>
          </b-button>
          <span class="ml-3"><b>{{documentData.name}}</b></span>
          <b-button size="sm" class="float-right" style="padding: 1px 4px;" variant="primary" @click="guardarDatosEnBD(true)">Guardar</b-button>
          <b-button size="sm" class="float-right mr-4" style="padding: 1px 4px;" v-if="wheatherData"  variant="success" @click="importarDatosTiempo()" :disabled="!cellSelected">Importar datos tiempo</b-button>
        </div>
        <div ref="xspreadsheet" id="xapp"/>
      </div>
      <div v-else class="text-center mt-5">
        No existe ese SpreadSheet
      </div>

      <!-- Modal -->
        <b-modal v-if="wheatherData" ref="modal-weather" hide-footer title="Seleccionar que componente pegar en la celda">
          <div v-for="(data,index) in wheatherData" :key="index" class="mb-1 text-center">
              <b-button size="sm" variant="outline-dark" @click="setDataToCellSelected(data.valid_date)" class="mr-1" style="min-width: 90px">{{data.valid_date}}</b-button>
              <b-button size="sm" variant="outline-dark" @click="setDataToCellSelected(data.app_max_temp)" class="mr-1" style="min-width: 115px">Temp Max: {{data.app_max_temp}}</b-button>
              <b-button size="sm" variant="outline-dark" @click="setDataToCellSelected(data.app_min_temp)" class="mr-1" style="min-width: 115px">Temp Min: {{data.app_min_temp}}</b-button>
          </div>
        </b-modal>
    </div>
</template>

<script>
import Spreadsheet from "x-data-spreadsheet";
import { mapGetters } from 'vuex'
import $ from 'jquery'

export default {
  data(){
    return {
      usuario: this.$store.getters.getUsuario,
      id_spreadsheet: 0,
      documentData: null,
      document : null,
      options : {
        view: {
          height: () => document.documentElement.clientHeight - 102.5,
          width: () => document.documentElement.clientWidth,
        }
      },
      cellSelected: false,
      pageSelected: 0,
      wheatherData: null,
      city: null,
      country_code: null,
      timezone: null,
      saving: null
    }
  },
  computed: {
    ...mapGetters(['getLocation'])
  },
  watch:{
    getLocation(){
      this.getWeather()
    }
  },
  methods:{
    guardarDatosEnBD(click = false){
      if(this.id_spreadsheet){
        this.$http.put(`spreadsheet/${this.id_spreadsheet}`, { data: JSON.stringify(this.document.getData()) } , { headers: { 'Authorization': 'Bearer '+ this.$store.getters.getToken } })
        .then(response => {
            if (response.body && response.body.success) {
              if(click){
                this.$swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Guardado',
                  showConfirmButton: false,
                  timer: 1000
                })
              }
            } else {
                console.log('Error al guardar');
            }
        }, response => {
            let error = response.body.err.message || 'Al conectar con el servidor';
            console.log(error);
        });
      }
    },
    async getUserSpreadSheet(){
      try {
        let response = await this.$http.get(`spreadsheet/${this.id_spreadsheet}`, { headers: { 'Authorization': 'Bearer '+ this.$store.getters.getToken } });
        if (response.body && response.body.success) {
           if(response.body.data){
             this.documentData = response.body.data
           }else{
             this.$swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No existe ese SpreadSheet',
              }).then(()=>{
                this.$router.push({name: 'home'})
              })
           }
        } else {
            console.log('Error al obtener spreadsheet');
        }
      } catch (error) {
        console.log('Al conectar con el servidor');
      }
    },
    async getWeather(){
      if(this.getLocation){
        try {
            const response  = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${this.getLocation.coords.latitude}&lon=${this.getLocation.coords.longitude}&key=${process.env.VUE_APP_WEATHERTBIT_KEY}`)
            const result = await response.json();
            this.city = result.city_name;
            this.country_code = result.country_code;
            this.timezone = result.timezone;
            this.wheatherData = result.data;
        } catch (error) {
          console.log('Error al obtener Weather');
        }
      }
    },
    async importarDatosTiempo(){
      if(this.wheatherData) this.showModal();
    },
    setDataToCellSelected(value){
      this.getActivePage();
      this.document.cellText(this.cellSelected.ri, this.cellSelected.ci ,value, this.getActivePage()).reRender();
      this.hideModal();
    },
    getActivePage(){
      let pages = $('.x-spreadsheet-menu li');
      for (let i = 0; i < pages.length; i++) {
        const element = pages[i];
        if($(element).hasClass('active')) return i - 1
      }
    },
    showModal() {
      this.$refs['modal-weather'].show()
    },
    hideModal() {
      this.$refs['modal-weather'].hide()
    },
  },
  beforeMount(){
    this.getWeather();
  },
  async mounted() {
    this.id_spreadsheet = this.$route.params.id;
    await this.getUserSpreadSheet();
    let datos = [
      {
        name: "Weather"
      }
    ];
    if(this.documentData.data) datos = JSON.parse(this.documentData.data);
    this.document = await new Spreadsheet(this.$refs.xspreadsheet,this.options)
      .loadData(datos)
      .on('cell-selected', (cell, ri, ci) => {this.cellSelected = {ri, ci};})
      .change(() => {
        //console.log(this.document.getData());
      })
  },
  created () {
      this.saving = setInterval(function() { 
          this.guardarDatosEnBD(); 
          console.log('Auto Save');
      }.bind(this), 10000)
  },
  beforeUnmount(){
      clearInterval(this.saving)
  }
}
</script>

<style>
.x-spreadsheet-toolbar{
  width: 100% !important;
}
.x-spreadsheet-sheet{
  width: 100% !important;
}
</style>