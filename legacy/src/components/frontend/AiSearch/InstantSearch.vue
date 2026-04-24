<script>
let MarkdownIt = require('markdown-it');

export default {
    props: ['selectedNote', 'clearSearch', 'authenticated'],
    data() {
        return {
            usagePercentage: 0,
            usageType: 'free',
            remainingAiTokens: null,
            responseText: '',
            searchTerm: '',
            md: new MarkdownIt(),
            loading: false,
            courses: [],
        }
    },
    methods: {
        handleSubmit() {
            if (this.loading) {
                return;
            }

            this.loading = true;
            this.courses = [];
            this.$emit('update:google-search', this.searchTerm);
            axios.post('/api/stream-ai', {
                searchTerm: this.searchTerm,
                selectedNote: this.selectedNote,
            })
                .then((response) => {
                    this.$emit('disable:clear-search');
                    if (response.data.courses) {
                        console.log('here');
                        this.courses = response.data.courses.data;
                        this.loading = false;
                    } else {
                        const eventSource = new EventSource(`/api/ai-search?usagePercentage=${this.usagePercentage}&searchTerm=${this.searchTerm}&selectedNote=${this.selectedNote}`);
                        this.responseText = '';
                        eventSource.onmessage = (e) => {
                            console.log('here');
                            if (e.data == "[DONE]") {
                                this.loading = false;
                                eventSource.close();
                            } else {
                                let txt = JSON.parse(e.data).choices[0].delta.content;
                                if (txt != undefined) {
                                    this.responseText += txt;
                                }
                            }
                        }

                        eventSource.onerror = function (e) {
                            console.log(e);
                            eventSource.close();
                        }
                    }
                })
                .finally(() => {
                    this.getUsagePercentage();
                })
        },

        startTypingContent() {
            const outputDiv = document.getElementById("output");
            const responseText = this.responseText;
            outputDiv.innerHTML = '';

            let i = 0;
            const timer = setInterval(function () {
                outputDiv.innerHTML += responseText.charAt(i);
                i++;
                if (i > responseText.length) {
                    clearInterval(timer);
                    const markdown = new MarkdownIt();
                    outputDiv.innerHTML = markdown.render(responseText);
                }
            }, 5);
        },

        getUsagePercentage() {
            axios.get('/api/ai-token-usage')
                .then((response) => {
                    this.usagePercentage = response.data.usage_percentage;
                    this.usageType = response.data.usage_type;
                    this.remainingAiTokens = response.data.remaining_ai_tokens;
                });
        }
    },
    mounted() {
        // this.handleSubmit();
    },
    created() {
        this.getUsagePercentage();
        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams(url.search);
        this.searchTerm = searchParams.get('search');
        // this.handleSubmit();
        this.$emit('update:search-term', this.searchTerm);
    }
}
</script>

<template>
    <div>
        <div v-if="authenticated && usageType === 'free'">
            <!-- <h4>Free Usage (Based on 20K free <v-popover style="display: inline !important">
                    <button class="focus:outline-none"><u>tokens</u>)</button>

                    <template slot="popover">
                        <a v-close-popover>You can think of tokens as pieces of words, where 1,000 tokens is about 750
                            words. This paragraph is 35 tokens.</a>
                    </template>
                </v-popover>
            </h4> -->

            <!-- <div class="mt-4 text-sm flex justify-between"><span>0%</span><span>100%</span></div>
            <div class="mb-4 bg-gray-300 border border-blue h-4 rounded-lg overflow-hidden">
                <div class="bg-blue text-xs leading-none py-1 text-center text-white"
                    :style="{ width: `${usagePercentage}%` }">{{ usagePercentage }}%</div>
            </div> -->
        </div>

        <!-- <div v-if="usageType === 'paid'" class="mb-4">
            You are using the premium AI search feature. Remaining <v-popover style="display: inline !important">
                <button class="focus:outline-none"><u>Tokens</u></button>

                <template slot="popover">
                    <a v-close-popover>You can think of tokens as pieces of words, where 1,000 tokens is about 750 words.
                        This paragraph is 35 tokens.</a>
                </template>
            </v-popover>: {{ remainingAiTokens }}
        </div> -->

        <form @submit.prevent="handleSubmit" class="border border-blue rounded flex items-center">
            <input v-model="searchTerm" type="text" class="focus:outline-none px-2 py-2 w-full"
                placeholder="Search to learn Via AI" autofocus />
            <div v-if="loading" class="loading-dots mr-2">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        </form>

        <div v-if="courses.length > 0" class="col-sm-12 col-lg-9">
            <div class="grid grid-cols-1 gap-6 mt-5 md:grid-cols-2 lg:grid-cols-3">
                <div v-for="course in courses">
                    <course-card :course="course" :key="course.id" />
                </div>
            </div>
            <div class="mt-4">
                <!-- <pagination :data="courses.data" @pagination-change-page="getCourses"></pagination> -->
            </div>
        </div>

        <div v-if="usagePercentage < 100" class="prose">
            <div v-if="loading">
                <!-- <div class="loading-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div> -->
                <!-- <div class="bg-white p-6 rounded-lg">
                    <div class="w-full h-5 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                    <div class="w-1/2 h-5 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                    <div class="w-3/4 h-5 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                </div>

                <div class="mt-12 bg-white p-6 rounded-lg mb-4">
                    <div class="w-full h-5 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                    <div class="w-1/2 h-5 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                    <div class="w-3/4 h-5 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                </div> -->
            </div>

            <div v-if="!clearSearch">
                <div v-if="authenticated">
                    <!-- <div id="output"></div> -->
                    <!-- <div id="output"></div> -->
                    <div v-if="responseText" v-html="md.render(responseText)"></div>
                </div>
                <div v-else>
                    <!-- <div id="output"></div> -->
                    <!-- <span v-if="responseText">...</span> -->
                    <div v-if="responseText" v-html="md.render(responseText + '....')"></div>
                </div>
            </div>
        </div>

        <div v-if="usagePercentage >= 100" class="my-4 w-full">
            <p class="font-semibold">{{ usageType.charAt(0).toUpperCase() + usageType.slice(1) }} usage limit is exceeded.
                Please upgrade your account:</p>
            <purchase-token />
        </div>
    </div>
</template>

<style>
.bg-gray-200 {
    background-color: #edf2f7;
}

@keyframes pulse {
    0% {
        opacity: 0.3;
    }

    100% {
        opacity: 1;
    }
}

.animate-pulse {
    animation: pulse 1s ease-in-out infinite;
}


.tooltip {
    display: block !important;
    z-index: 10000;
}

.tooltip .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
}

.tooltip[x-placement^="top"] {
    margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
    border-width: 5px 5px 0 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
    margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
    border-width: 0 5px 5px 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-top-color: transparent !important;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
    margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
    border-width: 5px 5px 5px 0;
    border-left-color: transparent !important;
    border-top-color: transparent !important;
    border-bottom-color: transparent !important;
    left: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
}

.tooltip[x-placement^="left"] {
    margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
    border-width: 5px 0 5px 5px;
    border-top-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    right: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
}

.tooltip.popover .popover-inner {
    background: #000000;
    color: #ffffff;
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
    border-color: #000000;
}

.tooltip[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
}

@keyframes loading {
    0% {
        opacity: 0.2;
    }

    20% {
        opacity: 1;
    }

    100% {
        opacity: 0.2;
    }
}

.loading-dots {
    display: flex;
    justify-content: center;
}

.dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 4px;
    border-radius: 50%;
    background-color: #000;
    animation: loading 1s infinite;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}
</style>
