<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand :to="{name:'home'}" class="mr-5">Pearch Digital</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item :to="{name:'home'}">Home</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav>
                    <b-nav-item :to="{name:'weather'}">Weather</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template #button-content>
                            <em>{{getUsuario.name}} </em>
                        </template>
                        <b-dropdown-item @click="mostrarCambioPassword">Cambiar Password</b-dropdown-item>
                        <b-dropdown-item @click="logOut">Log Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data(){
        return {
            permisos: null,
            usuario: null,
        }
    },
    methods: {
        showErrorModal(error){
            this.$swal.fire({
                icon: 'error',
                title: "ERROR!",
                text: error,
                timer: 5500
            })
        },
        mostrarCambioPassword(){      
            this.$swal.fire({
                title: 'Cambiar Password',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: `Cancelar`,
                confirmButtonText: `Guardar`,
                reverseButtons: true,
                html:
                    '<input id="passwordAnt" type="password" class="swal2-input" placeholder="Password Actual">' +
                    '<input id="passwordNew" type="password" class="swal2-input" placeholder="Password Nuevo">' +
                    '<input id="passwordNew2" type="password" class="swal2-input" placeholder="Confirmar Password">',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    let passwordAnt = document.getElementById('passwordAnt').value.trim();
                    let passwordNew = document.getElementById('passwordNew').value.trim();
                    let passwordNew2 = document.getElementById('passwordNew2').value.trim();
                    
                    if(passwordAnt == passwordNew){
                        this.showErrorModal("El nuevo password debe ser diferente al anterior");
                    }else if(passwordNew != passwordNew2){
                        this.showErrorModal("La confirmacion debe ser igual al password nuevo");
                    }else{
                        this.cambioPassword(passwordAnt,passwordNew);
                    }
                }
            })
        },
        cambioPassword(passwordAnt,passwordNew){
            this.$http.put(`user/password`, {password_anterior:passwordAnt ,password:passwordNew}, { headers: { 'Authorization': 'Bearer '+ this.$store.getters.getToken } })
                .then(response => {
                    if (response.body && response.body.success) {
                        this.$swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'El password fue cambiado',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else {
                        throw new Error('Al cambiar password.');
                    }
                }, response => {
                    let error = 'Al conectar con el servidor';
                    if (response.body && !response.body.success) {
                        error = response.body.err.message || 'Al conectar con el servidor';
                    }
                    this.showErrorModal(error);
                });
        },
        logOut(){
            this.$store.commit('removeToken');
            this.$router.push({name: 'login'});
        }
    },
    computed:{
        ...mapGetters([
            'getUsuario',
            'getPermisos'
        ])
    },
    beforeMount(){
        this.permisos = this.getPermisos;
        this.usuario = this.getUsuario;
    }
}
</script>

<style scoped>
    .navbar{
        min-width: 411px;
    }
    .router-link-active{
        color: white !important;
    }
</style>