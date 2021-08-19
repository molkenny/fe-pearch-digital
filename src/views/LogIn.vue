<template>
    <div class="container pt-5">
        <div class="row">
            <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div class="card card-signin my-5">
                    <div class="card-body">
                        <h5 class="card-title text-center"><b>Log In</b></h5>

                        <form 
                            class="form-signin"
                            id="logInForm"
                            @submit.prevent="submitLogInForm"
                        >
                            <div class="form-label-group">
                                <input 
                                    type="text" 
                                    name="usuario" 
                                    v-model.trim="formdata.usuario"
                                    @blur="$v.formdata.usuario.$touch()"
                                    :class="{error : $v.formdata.usuario.$error}"
                                    class="form-control" 
                                    placeholder="Usuario" 
                                    autofocus 
                                >
                                <div class="errorLabel" v-if="$v.formdata.usuario.$error">
                                    <small v-if="!$v.formdata.usuario.required">Este campo es obligatorio</small>
                                    <small v-else-if="!$v.formdata.usuario.minLength">Este campo debe tener al menos 4 caracteres</small>
                                </div>
                            </div>


                            <div class="form-label-group">
                                <input 
                                    type="password" 
                                    name="password" 
                                    v-model.trim="formdata.password"
                                    @blur="$v.formdata.password.$touch()"
                                    class="form-control" 
                                    placeholder="Password" 
                                    :class="{error : $v.formdata.password.$error}"
                                >
                                <div class="errorLabel" v-if="$v.formdata.password.$error">
                                    <small v-if="!$v.formdata.password.required">Este campo es obligatorio</small>
                                    <small v-else-if="!$v.formdata.password.minLength">Este campo debe tener al menos 4 caracteres</small>
                                </div>
                            </div>

                            <br class="my-5">
                            <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit" v-if="!loading">Entrar</button>
                            <button class="btn btn-lg btn-primary btn-block" type="button" disabled v-else>
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const { required, minLength } = require('vuelidate/lib/validators')

export default {
    data(){
        return {
            loading: false,
            formdata: {
                usuario: '',
                password: ''
            }
        }
    },
    validations: {
        formdata:{
            usuario: {
                required,
                minLength: minLength(4)
            },
            password: {
                required
            }
        }
    },
    methods:{
        submitLogInForm(){
            this.$v.$touch();
            if(!this.$v.$invalid){
                this.loading = true;
                this.$http.post('login', { mail: this.formdata.usuario, password: this.formdata.password })
                    .then(response => {
                        console.log('Response: ', response);
                        if (response.body && response.body.success) {
                            this.$store.commit('setToken',response.body.data.token);
                            this.$router.push({name:'home'});
                        } else {
                            throw new Error('Al enviar credenciales');
                        }
                    }, response => {
                        this.loading = false;
                        let error = 'Al conectar con el servidor';
                        if (response.body && !response.body.success) {
                            error = response.body.err.message || 'Al conectar con el servidor';
                        }
                        console.log(error);
                    });
            }
            return false;
        }
    }
}
</script>

<style>

.card-signin {
    border: 1px solid;
    border-radius: 1rem;
    box-shadow: 3px 3px 18px #888888;
    margin: auto;
}

.card-signin .card-title {
    margin-bottom: 2rem;
    font-weight: 300;
    font-size: 1.5rem;
}

.card-signin .card-body {
    padding: 2rem;
}

.form-signin {
    width: 100%;
}

.form-signin .btn {
    font-size: 80%;
    border-radius: 5rem;
    letter-spacing: .1rem;
    font-weight: bold;
    padding: 1rem;
    transition: all 0.2s;
}

.form-label-group {
    position: relative;
    margin-bottom: 1rem;
}

.form-label-group input {
    height: auto;
    border-radius: 2rem;
}

.form-label-group>input,
.form-label-group>label {
    padding: 10px 25px;
}

.form-label-group>label {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    margin-bottom: 0;
    line-height: 1.5;
    color: #495057;
    border: 1px solid transparent;
    border-radius: .25rem;
    transition: all .1s ease-in-out;
}

.form-label-group input::-webkit-input-placeholder {
    color: #495057;
}

.form-label-group input:-ms-input-placeholder {
    color: #495057;
}

.form-label-group input::-ms-input-placeholder {
    color: #495057;
}

.form-label-group input::-moz-placeholder {
    color: #495057;
}

.form-label-group input::placeholder {
    color: #495057;
}

.btn-google {
    color: white;
    background-color: #ea4335;
}

.btn-facebook {
    color: white;
    background-color: #3b5998;
}


/* Fallback for Edge
-------------------------------------------------- */

@supports (-ms-ime-align: auto) {
    .form-label-group>label {
        display: none;
    }
    .form-label-group input::-ms-input-placeholder {
        color: #777;
    }
}


/* Fallback for IE
-------------------------------------------------- */

@media all and (-ms-high-contrast: none),
(-ms-high-contrast: active) {
    .form-label-group>label {
        display: none;
    }
    .form-label-group input:-ms-input-placeholder {
        color: #777;
    }
}

.error {
    border: 1px solid red !important;
}
</style>