import Vue from 'vue';
import VueRouter from 'vue-router';

//Components
import LogIn from '../views/LogIn';
import Home from '../views/Home';
import Error from '../views/components/Error';
import Forbidden from '../views/components/Forbidden';
import SpreadSheets from '../views/SpreadSheets';
import Weather from '../views/Weather';


//Middleware
import VueRouteMiddleware from 'vue-route-middleware';
import Auth from './middelwares/auth';
import Guest from './middelwares/guest';
// import Admin from './middelwares/admin';

Vue.use(VueRouter);

const routes = [
    { path: '/login', name: 'login', component: LogIn, meta: { middleware: Guest } },
    { path: '/', name: 'root', component: Home, meta: { middleware: [Auth] } },
    { path: '/home', name: 'home', component: Home, meta: { middleware: [Auth] } },
    { path: '/weather', name: 'weather', component: Weather, meta: { middleware: [Auth] } },
    { path: '/spreadsheet/:id', name: 'spreadsheet', component: SpreadSheets, meta: { middleware: [Auth] } },
    //{ path: '/usuarios', name: 'listUsuarios', component: AdminUsuarios, meta: { middleware: [Auth,Admin] } },
    { path: '/forbidden', name: 'forbidden', component: Forbidden, meta: { middleware: Auth } },
    { path: '*', name: 'error', component: Error, meta: { middleware: Auth } },
];

export const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach(VueRouteMiddleware());