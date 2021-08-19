import { store } from '../../store/store';

export default (to, from, next) => {
    store.commit('checkStoreToken');
    let token = store.getters.getToken || false;
    let permisos = store.getters.getPermisos || false;
    let exp = store.state.exp || false;

    //Verifico si tengo exp y si ya vencio
    if (exp && exp >= Math.floor(Date.now() / 1000)) {
        if (token && permisos) {
            return next({ name: 'home' });
        }
    }
    return next();
};