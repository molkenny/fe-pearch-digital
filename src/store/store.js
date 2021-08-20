import Vue from 'vue';
import Vuex from 'vuex';
import jwt_decode from "jwt-decode";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        usuario: null,
        exp: null,
        token: null,
        permisos: null,
        document: null,
        location: null,
        error: null
    },
    getters: {
        getUsuario(state) {
            return state.usuario;
        },
        getToken(state) {
            return state.token;
        },
        getPermisos(state) {
            return state.permisos;
        },
        getDocument(state) {
            return state.document;
        },
        getLocation(state) {
            return state.location;
        },
    },
    actions: {
        setCurrentLocation({ commit }) {
            console.log('Set current Location');
            commit('setLocation', location);
        }
    },
    mutations: {
        setToken(state, token) {
            localStorage.setItem('jwt-token', token);
            let datosToken = jwt_decode(token);
            state.exp = datosToken.exp;
            state.token = token;
            state.permisos = datosToken.user.id_group;
            state.usuario = datosToken.user;
        },
        removeToken(state) {
            localStorage.removeItem('jwt-token');
            state.exp = null;
            state.token = null;
            state.permisos = null;
            state.usuario = null;
        },
        checkStoreToken(state) {
            let token = localStorage.getItem('jwt-token');
            if (token) {
                let datosToken = jwt_decode(token);
                state.exp = datosToken.exp;
                state.token = token;
                state.permisos = datosToken.user.id_group;
                state.usuario = datosToken.user;
            }
        },
        setDocument(state, document) {
            state.document = document;
        },
        setLocation(state) {
            if (!("geolocation" in navigator)) {
                state.error = 'Geolocation is not available.';
            }
            navigator.geolocation.getCurrentPosition(location => {
                state.location = location;
            }, () => {
                state.error = 'Geolocation is not available.';
            });
        }
    },
    plugins: [createPersistedState()]
});