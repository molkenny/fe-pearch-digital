<template>
    <div class="container-spreadsheet">
      <div v-if="documentData">
        <div style="padding: 10px 20px">
          <b-button size="sm" style="padding: 1px 4px;" variant="danger" @click="$router.go(-1)">
            <b-icon icon="arrow-left"></b-icon>
          </b-button>
          <span class="ml-3"><b>{{documentData.name}}</b></span>
          <b-button size="sm" class="float-right" style="padding: 1px 4px;" variant="primary" @click="guardarDatosEnBD(true)">Guardar</b-button>
        </div>
        <div ref="xspreadsheet" id="xapp"/>
      </div>
      <div v-else class="text-center mt-5">
        No existe ese SpreadSheet
      </div>
    </div>
</template>

<script>
import Spreadsheet from "x-data-spreadsheet";

export default {
  data(){
    return {
      usuario: this.$store.getters.getUsuario,
      id_spreadsheet: 0,
      documentData: null,
      document : null,
      options : {
        showToolbar: false,
        view: {
          height: () => document.documentElement.clientHeight - 102.5,
          width: () => document.documentElement.clientWidth,
        }
      }
    }
  },
  methods:{
    stox(data) {
      let out = [];
      data.forEach(function(dataSheet) {
        var o = {name:dataSheet.name, rows:{}};
        for ( const [key,value] of Object.entries( dataSheet.rows ) ) {
          o.rows[key] = value
        }
        out.push(o);
      });
      return out;
    },
    guardarDatosEnBD(click = false){
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
    },
    async getUserSpreadSheet(){
      try {
        let response = await this.$http.get(`spreadsheet/${this.id_spreadsheet}`, { headers: { 'Authorization': 'Bearer '+ this.$store.getters.getToken } });
        console.log('Response Spread');
        if (response.body && response.body.success) {
           if(response.body.data){
             console.log(response.body.data);
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

  },
  async mounted() {
    this.id_spreadsheet = this.$route.params.id;
    await this.getUserSpreadSheet();
    let datos = {};
    if(this.documentData.data) datos = this.stox(JSON.parse(this.documentData.data));
    this.document = new Spreadsheet(this.$refs.xspreadsheet,this.options)
      .loadData(datos)
      .change(() => {
      });

    if(this.documentData){
        setInterval(() => { 
              this.guardarDatosEnBD();
        }, 10000)
    }
    
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