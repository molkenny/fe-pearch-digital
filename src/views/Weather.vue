<template>
    <div class="container p-3 text-center">
        <div v-if="loading" class="mt-3">
            <b-icon icon="arrow-counterclockwise" animation="spin-reverse" font-scale="4"></b-icon>
        </div>
        <div class="weather-card" v-else> 
            <b-card header-tag="header" >
              <template #header>
                <b-button class="float-left mr-3" @click="$router.go(-1)" variant="danger" size="sm">
                    <b-icon icon="arrow-left-short" font-scale="1"></b-icon>
                </b-button>
                <div class="float-left table-panel-title">
                    Wheather for {{city}} ({{country_code}})
                </div>
                  
              </template>
              
              <div>
                <b-card-group deck>
                  <b-card
                    v-for="(day, index) in wheatherData"
                    :key="index"
                    border-variant="secondary"
                    :header="day.valid_date"
                    header-border-variant="secondary"
                    align="center"
                    class="mb-2"
                  >
                    <div>
                      <span>Temp max: {{day.high_temp}}</span>
                      <br>
                      <span>Temp min: {{day.min_temp}}</span>
                    </div>
                  </b-card>
                  </b-card-group >
              </div>
            </b-card>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data(){
    return {
      loading: true,
      location: this.getLocation,
      wheatherData: null,
      city: null,
      country_code: null,
      timezone: null
    }
  },
  computed: {
    ...mapGetters(['getLocation'])
  },
  watch:{
    async getLocation(){
      this.location = this.getLocation;
      await this.getWeather();
      this.loading = false;
    }
  },
  methods:{
    async getWeather(){
      if(this.location){
        console.log('lat: ',this.location.coords.latitude);
        console.log('long: ',this.location.coords.longitude);
        fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${this.location.coords.latitude}&lon=${this.location.coords.longitude}&key=${process.env.VUE_APP_WEATHERTBIT_KEY}`)
                    .then(response => response.json())
                    .then((data) => {
                      this.city = data.city_name;
                      this.country_code = data.country_code;
                      this.timezone = data.timezone;
                      this.wheatherData = data.data;
                        console.log(data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
      }
    }
  },
  async beforeMount(){
    this.location = this.getLocation;
    await this.getWeather();
    this.loading = false;
  }
}
</script>

<style scope>
.weather-card .card {
    min-width: 350px !important;
    max-width: 100% !important;
}
.card-header{
  width: 100% !important
}
.table-panel-title {
      line-height: 30.8px;
      font-size: 18px;
      font-weight: bold;
  }
</style>