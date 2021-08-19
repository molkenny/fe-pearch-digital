import { store } from '../../store/store';

export default (to, from, next) => {

    let permisos = store.getters.getPermisos || false;

    if (permisos !== 1) {
        return next({ name: 'forbidden' });
    }
    return next();
};