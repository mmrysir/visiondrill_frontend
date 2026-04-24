<template>
    <div>
        <div class="bg-gray-900 h-screen flex justify-center items-center">
            <div class="px-3 flex flex-col justify-center items-center">
                <div class="w-16 h-16">
                    <span class="flex justify-center items-center text-xl text-white w-full h-full bg-blue-600 rounded-full">
                        <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-lock-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 9a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V9z" />
                            <path fill-rule="evenodd" d="M4.5 4a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z" />
                        </svg>
                    </span>
                </div>
                <!-- <h2 class="mt-6 text-3xl font-bold text-center text-white">This course is exclusive to Visiondrill subscribers.</h2> -->
                <h2 class="mt-6 text-3xl font-bold text-center text-white">Buy this course for $<span class="text-2xl">{{ coursePrice }}</span> and get immediate access to this course content!</h2>
                <!-- <h2 class="mt-3 text-lg text-center text-white">Buy this course for $<span class="text-2xl">{{ coursePrice }}</span> and get immediate access to this course content!</h2> -->
                <div class="mt-6">
                    <a href="#paymentInformation">
                        <button class="py-3 px-10 bg-blue-600 rounded-full text-white focus:outline-none uppercase">Choose a Payment Method</button>
                    </a>
                </div>
            </div>
        </div>

        <div class="flex justify-center items-center" id="paymentInformation">
            <div class="py-6 px-6 w-full px-3 flex flex-col bg-gray-200">
                <h2 class="text-2xl font-bold text-gray-900">Payment Information</h2>

                <div class="mt-4 bg-white border">
                    <div class="p-4 flex grid-cols-2 gap-6">
                        <!-- <div @click="setPaymentMethod('stripe')" class="w-32 h-20 border-2 cursor-pointer border-gray-400 relative" :class="{'border-blue-700': paymentMethod === 'stripe' }">
                            <span class="p-2 flex justify-end" v-if="paymentMethod === 'stripe'">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="text-blue-600 bi bi-check-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                </svg>
                            </span>
                            <span class="absolute inset-0 text-center flex justify-center items-center">
                                <img src="/images/credit-cards.svg" class="w-10">
                            </span>
                        </div> -->
                        <!-- <div @click="setPaymentMethod('mpesa')" class="w-32 h-20 border-2 cursor-pointer border-gray-400 relative" :class="{'border-blue-700': paymentMethod === 'mpesa' }">
                            <span class="p-2 flex justify-end" v-if="paymentMethod === 'mpesa'">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="text-blue-600 bi bi-check-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                </svg>
                            </span>
                            <span class="absolute inset-0 text-center flex justify-center items-center">
                                <img src="/images/mpesa-logo.png" class="p-5">
                            </span>
                        </div> -->
                        <div @click.prevent="setPaymentMethod('paypal')" class="border-2 border-gray-400 w-32 h-20 cursor-pointer relative" :class="{'border-blue-700': paymentMethod === 'paypal' }">
                            <span class="p-2 flex justify-end" v-if="paymentMethod === 'paypal'">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="text-blue-600 bi bi-check-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                </svg>
                            </span>
                            <span class="absolute inset-0 text-center flex justify-center items-center">
                                <img src="/images/paypal.svg" class="w-20">
                            </span>
                        </div>

                        <div @click="setPaymentMethod('mpesa')" class="w-32 h-20 border-2 cursor-pointer border-gray-400 relative" :class="{'border-blue-700': paymentMethod === 'mpesa' }">
                            <span class="p-2 flex justify-end" v-if="paymentMethod === 'mpesa'">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="text-blue-600 bi bi-check-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                </svg>
                            </span>
                            <span class="absolute inset-0 text-center flex justify-center items-center">
                                <!-- <img src="/images/flutterwave.svg" class="w-28"> -->
                                <img src="/images/mpesa-logo.png" class="p-5"/>
                            </span>
                        </div>
                    </div>

                    <div class="pl-4 pb-4" v-if="paymentMethod === 'flutterwave'">
                        <button @click.prevent="payViaFlutterwave()" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150" :disabled="loading">
                        <spinner v-if="loading" />
                      Pay Now
                    </button>
                    </div>

                    <div class="pl-4 pb-4" v-if="paymentMethod === 'paypal'">
                        <button @click.prevent="payViaPayPal()" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150" :disabled="loading">
                        <spinner v-if="loading" />
                      Pay Now
                    </button>
                    </div>

                    <!-- <div class="pl-4 pb-4" v-if="paymentMethod === 'mpesa'">
                        <button @click.prevent="payViaMpesa()" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150" :disabled="loading">
                        <spinner v-if="loading" />
                      Pay Now
                    </button>
                    </div> -->

                    <form class="w-full max-w-lg p-4" v-if="paymentMethod === 'mpesa'">
                        <div class="flex flex-wrap -mx-3 mb-3">
                        <div class="w-full px-3">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Mobile Number
                          </label>
                          <div class="flex justify-center">
                            <div class="block mt-0 bg-gray-200 p-3">+254</div>
                            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="tel" maxlength="16" v-model="mobile_number" />
                          </div>
                        </div>
                      </div>

                      <button @click.prevent="payViaMpesa()" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150" :disabled="loading">
                            <spinner v-if="loading" />
                            Pay Now
                        </button>
                    </form>


                    <form class="w-full max-w-lg p-4" v-if="paymentMethod === 'stripe'">
                      <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full px-3">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Card Number
                          </label>
                          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="tel" maxlength="16" v-model="form.cardNumber">
                        </div>
                      </div>
                      <div class="flex flex-wrap -mx-3 mb-2">
                        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                            Expiration Month
                          </label>
                          <div class="relative">
                            <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" v-model="form.expireMonth">
                              <option v-for="index in 12" :key="index" v-bind:value="index">{{ generateMonthValue(index) }}</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                          </div>
                        </div>

                        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                            Expiration Year
                          </label>
                          <div class="relative">
                            <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" v-model="form.expireYear">
                              <option v-bind:value="$index + minCardYear" v-for="(n, $index) in 12">{{$index + minCardYear}}</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                          </div>
                        </div>

                        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                            CVC
                          </label>
                          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="number" v-model="form.cvv">
                        </div>
                      </div>


                      <button @click.prevent="submitForm()" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150" :disabled="loading">
                            <spinner v-if="loading" />
                            Pay Now
                        </button>
                    </form>


                </div>
            </div>
        </div>

        <notifications group="foo" position="center bottom" />
    </div>
</template>

<script>
import { Form, HasError, AlertError } from 'vform'
    export default {
        props: ['courseId', 'coursePrice'],
        data() {
            return {
                form: new Form({
                    cardNumber: '',
                    expireMonth: '',
                    expireYear: '',
                    cvv: '',
                    courseId: this.courseId,
                }),
                loading: false,
                paymentMethod: 'mpesa',
                card: '',
                minCardYear: new Date().getFullYear(),
                mobile_number: '',
            }
        },

        methods: {
            generateMonthValue (n) {
              return n < 10 ? `0${n}` : n
            },

            setPaymentMethod(paymentMethod) {
                this.paymentMethod = paymentMethod;
            },

            submitForm() {
                this.loading = true;
                this.form.post('/paytostripe')
                .then(() => {
                    this.form.reset();
                    this.loading = false;
                    Vue.notify({
                        group: 'foo',
                        type: 'success',
                        title: 'Success!',
                        text: 'Payment Successful. You are redirecting now...'
                    })
                    setTimeout(function() {window.location.reload()} , 1000)
                })
                .catch((error) => {
                    this.form.reset();
                    this.loading = false;
                    Vue.notify({
                        position: 'top',
                        group: 'foo',
                        type: 'error',
                        title: 'Error!',
                        text: error.response.data.message,
                    })
                });
            },

            payViaPayPal() {
                this.loading = true;
                window.location.href = `/payment/?course_id=${this.courseId}`;
            },

            payViaFlutterwave() {
                this.loading = true;
                document.getElementById('paymentForm').submit();
            },

            payViaMpesa() {
                this.loading = true;
                axios.post(`/mpesa/initiate`, {
                    course_id: this.courseId,
                    mobile_number: this.mobile_number,
                })
                .then((response) => {
                    window.location.href = `/mpesa/payment-success?amount=${response.data.amount}&transaction_id=${response.data.transaction_id}`;
                })
                .catch((error) => {
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
        }
    }
</script>

<style>
    .w-28 {
        width: 7rem;
    }
</style>
