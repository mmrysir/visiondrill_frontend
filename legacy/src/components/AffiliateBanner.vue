<template>
    <div></div>
</template>

<script>
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
    export default {
        data() {
            return {
                via: new URL(location.href).searchParams.get('via'),
                affiliate: false
            }
        },

        mounted() {
            if (! this.via) return

            axios
                .post(`/api/affiliate/${encodeURIComponent(this.via)}`)
                .then(response => {
                    this.affiliate = response.data
                    console.log(response.data)
                    if (! Vue.$cookies.isKey('visiondrill_affiliate')) {
                        Vue.$cookies.set('visiondrill_affiliate', response.data, { expires: '60d', domain: 'https://visiondrill.com', secure: true, sameSite: 'lax'})
                    }
                })
                .catch (error => {
                    if (! error.response || error.response.status !== 400) throw error

                    console.log('Referral does not exist. Register for our affiliate program here:\nhttps://visiondrill.com/affiliate')
                })
        }
    }
</script>
