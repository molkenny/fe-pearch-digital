<template>
    <div class="container-list-spreadsheet p-3">
      <div class="text-right mb-4" >
        <b-button variant="primary" @click="addNewSpreadSheet">Agregar</b-button>
      </div>
      <b-card-group class="spreadsheet-cards" deck>
        <b-card :title="doc.name" v-for="(doc,index) in documents" :key="index" class="mb-3" >
          <b-card-body class="text-center pointer" @click="verSpreadSheet(doc.id)">
            <img :src="Img" alt="Img Spreadsheet" class="card-img img-fluid"/>
          </b-card-body>
             

          <template #footer>
            <small class="text-muted">Editado {{doc.updatedAt}}</small>

            <b-button size="sm" class="float-right ml-1" variant="danger" @click="deleteSpreadSheet(doc.id)">
              <b-icon icon="trash" font-scale="1" ></b-icon>
            </b-button>

            <b-button size="sm" class="float-right" variant="warning" @click="editNewSpreadSheet(doc.id,doc.name)">
              <b-icon icon="pencil" font-scale="1" ></b-icon>
            </b-button>
            
          </template>
        </b-card>
      </b-card-group>
    </div>
</template>

<script>
export default {
  data(){
    return {
      usuario: this.$store.getters.getUsuario,
      Img: require('@/assets/img/spreadsheet.png'),
      documents : []
    }
  },
  methods:{
    async getUserSpreadSheets(){
      try {
        let response = await this.$http.get(`spreadsheet`, { headers: { 'Authorization': 'Bearer '+ this.$store.getters.getToken } });
        console.log('Response Spread');
        if (response.body && response.body.success) {
          this.documents = response.body.data;
        } else {
            console.log('Error al obtener spreadsheet');
        }
      } catch (error) {
        console.log('Al conectar con el servidor');
      }
    },
    addNewSpreadSheet(){
      this.$swal.fire({
        title: 'Agregar Nueva SpreadSheet',
        input: 'text',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        inputPlaceholder: "Ingresar Nombre",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.$http.post(`spreadsheet`, { name: result.value} , { headers: { 'Authorization': 'Bearer '+ this.$store.getters.getToken } })
            .then(response => {
                if (response.body && response.body.success) {
                    this.documents = response.body.data;
                } else {
                    console.log('Error al guardar');
                }
            }, response => {
                let error = response.body.err.message || 'Al conectar con el servidor';
                console.log(error);
            });
        }
      })
    },
    deleteSpreadSheet(id){
      this.$swal.fire({
        title: 'Esta seguro de borrar el spreadSheet?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http.delete(`spreadsheet/${id}`, { headers: { 'Authorization': 'Bearer '+ this.$store.getters.getToken } })
            .then(response => {
                if (response.body && response.body.success) {
                    this.documents = response.body.data;
                } else {
                    console.log('Error al borrar');
                }
            }, response => {
                let error = response.body.err.message || 'Al conectar con el servidor';
                console.log(error);
            });
        }
      })
    },
    editNewSpreadSheet(id,name){
      this.$swal.fire({
        title: 'Editar nombre SpreadSheet',
        input: 'text',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        inputValue: name,
        inputPlaceholder: "Ingresar Nombre",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.$http.put(`spreadsheet/${id}`, { name: result.value} , { headers: { 'Authorization': 'Bearer '+ this.$store.getters.getToken } })
            .then(response => {
                if (response.body && response.body.success) {
                    this.documents = response.body.data;
                } else {
                    console.log('Error al guardar');
                }
            }, response => {
                let error = response.body.err.message || 'Al conectar con el servidor';
                console.log(error);
            });
        }
      })
    },
    verSpreadSheet(id){
      this.$router.push({ name: 'spreadsheet', params: { id } })
    }
  },
  async beforeMount(){
     await this.getUserSpreadSheets();
  },
  
  
}
</script>

<style scope>
.spreadsheet-cards .card{
  min-width: 350px !important;
  max-width: 350px !important;
}
.card-title{
  text-align: center;
}
.card-img{
  max-width: 180px !important;
}
</style>