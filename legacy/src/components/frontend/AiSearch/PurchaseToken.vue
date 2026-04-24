<script>
export default {
    data() {
        return {
            currentValue: 0,
            price: '9.99',
            loading: false,
            paymentMethod: 'mpesa',
            mobile_number: '',
        }
    },

    methods: {
        setPaymentMethod(paymentMethod) {
            this.paymentMethod = paymentMethod;
        },

        payViaMpesa() {
            this.loading = true;
            axios.post('/mpesa/purchase-ai-token', {
                'mobile_number': this.mobile_number,
                'token_id': this.currentValue,
            })
                .then((response) => {
                    alert('Please check your phone for a payment notification.');
                    setTimeout(function () {
                        window.location.reload();
                    }, 5000);
                })
                .catch((error) => {
                    this.loading = false;
                    Vue.notify({
                        position: 'top',
                        group: 'foo',
                        type: 'error',
                        title: 'Error!',
                        text: error.response.data.errors.mobile_number[0],
                    })
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },

    computed: {
        getTokenPrice() {
            const priceMap = {
                0: 9.99,
                1: 19.00,
                2: 49.00,
                3: 99.00,
                4: 199.00
            };

            return priceMap[this.currentValue];
        }
    }
}
</script>

<template>
    <div class="mt-2">
        <label for="minmax-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span
                class="text-3xl font-bold">${{ getTokenPrice }}</span></label>
        <input id="minmax-range" type="range" min="0" max="4" v-model="currentValue"
            class="w-full h-3 border border-gray-200 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">

        <div class="flex justify-between">
            <div>100 K </br> Tokens</div>
            <div>200 k </br> Tokens</div>
            <div>500 K </br> Tokens</div>
            <div>1.5 M </br> Tokens</div>
            <div>4 M </br> Tokens</div>
        </div>

        <div class="mt-4 flex grid-cols-2 gap-6">
            <div @click="setPaymentMethod('mpesa')" class="w-32 h-20 border-2 cursor-pointer border-gray relative"
                :class="{ 'border-blue': paymentMethod === 'mpesa' }">
                <span class="p-2 flex justify-end" v-if="paymentMethod === 'mpesa'">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="text-blue-600 bi bi-check-circle"
                        fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path fill-rule="evenodd"
                            d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                    </svg>
                </span>
                <span class="absolute inset-0 text-center flex justify-center items-center">
                    <img src="/images/mpesa-logo.png" class="p-5" />
                </span>
            </div>
        </div>

        <form class="w-full max-w-lg" v-if="paymentMethod === 'mpesa'">
            <div class="flex flex-wrap -mx-3 mb-3">
                <div class="mt-4 w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                        Mobile Number
                    </label>
                    <div class="flex justify-center">
                        <div class="block mt-0 bg-gray-200 p-3">+254</div>
                        <input
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-password" type="tel" maxlength="16" v-model="mobile_number" />
                    </div>
                </div>
            </div>

            <button @click.prevent="payViaMpesa()" type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                :disabled="loading">
                <spinner v-if="loading" />
                Pay Now
            </button>
        </form>
        <notifications group="foo" position="center bottom" />
    </div>
</template>
