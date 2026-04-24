<script>
import Iconsearch from '../icons/IconSearch.vue';
import ClipboardJS from 'clipboard/dist/clipboard';
let MarkdownIt = require('markdown-it');

export default {
    components: {
        Iconsearch,
    },

    data() {
        return {
            courseTitle: '',
            course: '',
            step: 1,
            isLoading: false,
            isUnlocked: false,
            totalSections: '',
            totalLessons: '',
            includeQuiz: '',
            // md: new MarkdownIt(),
        }
    },
    methods: {
        generateCourse() {
            this.isLoading = true;
            this.course = '';
            this.isUnlocked = false;
            this.progressSteps();
            axios.post('/generate-course', {
                courseTitle: this.courseTitle,
                totalSections: this.totalSections,
                totalLessons: this.totalLessons,
                includeQuiz: this.includeQuiz,
            })
                .then((response) => {
                    this.course = response.data.course;
                })
                .catch((error) => {
                    Swal.fire(
                        'Course Creation Failed!',
                        "Sorry, the course didn't get created. Please try again.",
                        'error'
                    );
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        unlockCourse() {
            axios.post('course/is-paid', {
                courseId: this.course.id,
            })
                .then((response) => {
                    if (response.data.hasPaid) {
                        Swal.fire(
                            'Course Unlocked!',
                            'Course is unlocked. You can view the full content now',
                            'success'
                        )
                        this.isUnlocked = true;
                    } else {
                        window.open(`/payment/?course_id=${this.course.id}`, '_blank');
                    }
                });
            // window.open(`/payment/?course_id=${this.course.id}`, '_blank');
            // window.location.href = `/payment/?course_id=${this.course.id}`;
            // Swal.fire(
            //     'Course Unlocked!',
            //     'Course is unlocked. You can view the full content now',
            //     'success'
            // )
            // this.isUnlocked = true;
        },

        async copyToClipboard(section) {
            if (!section) return;
            const textToCopy = `${section.title}\n${section.lessons.map(lesson => lesson.title).join('\n')}${section.lessons.map(lesson => lesson.content.body).join('\n')}`;
            try {
                await navigator.clipboard.writeText(textToCopy);
                Swal.fire(
                    'Content Copied!',
                    'Content copied to the clipboard successfully!',
                    'success'
                )
            } catch (err) {
                console.error('Failed to copy', err);
            }
        },

        copyToClipboardError() {
            Swal.fire(
                'Content Not Copied!',
                'Please unlock the course to copy the content!',
                'error'
            )
        },

        progressSteps() {
            const steps = [1, 2, 3, 4, 5];
            let index = 1;

            const interval = setInterval(() => {
                if (index < steps.length) {
                    this.step = steps[index];
                    index++;
                } else {
                    clearInterval(interval);
                    this.steps = 8;
                }
            }, 6000);
        }
    },
    computed: {
        md() {
            const instance = new MarkdownIt();

            const defaultRender = instance.renderer.rules.link_open || function (tokens, idx, options, env, self) {
                return self.renderToken(tokens, idx, options);
            };

            instance.renderer.rules.link_open = function (tokens, idx, options, env, self) {
                const aIndex = tokens[idx].attrIndex('target');

                if (aIndex < 0) {
                    tokens[idx].attrPush(['target', '_blank']);
                } else {
                    tokens[idx].attrs[aIndex][1] = '_blank';
                }

                return defaultRender(tokens, idx, options, env, self);
            };

            return instance;
        }
    },
    mounted() {
        // axios.get('test-ai-course')
        //     .then((response) => {
        //         this.isUnlocked = true;
        //         this.course = response.data.course;
        //     });
    }
}
</script>
<template>
    <div class="py-24 bg-gradient-to-b from-blue-600 to-purple-500 flex flex-col"
        :class="{ 'h-screen': course == '' && isLoading == false }">
        <div class="px-4 lg:px-0 md:px-0 md:flex lg:flex justify-center items-center w-full">
            <div class="flex md:w-7/12 lg:w-7/12">
                <input v-model="courseTitle" type="text" placeholder="Enter Course Title..."
                    class="py-4 pl-4 pr-2 w-full text-xl border-l border-y rounded-l focus:outline-none" />
                <span class="pr-4 flex items-center text-center bg-white border-r border-y rounded-r ">
                    <Iconsearch />
                </span>
            </div>

            <div class="mt-3 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 text-center">
                <button @click="generateCourse"
                    class="px-6 py-4 text-lg text-blue-600 font-semibold rounded bg-blue-100 outline-none focus:ring-4 shadow-lg transform active:scale-95 transition-transform">
                    GENERATE COURSE
                </button>
            </div>
        </div>
        <div class="mt-4 px-4 lg:px-0 md:px-0 md:flex lg:flex justify-center items-center w-full space-x-4">
            <select v-model="totalSections" class="px-2 py-4 rounded outline-none focus:ring-2">
                <option value="">How many sections?</option>
                <option value="2">2 Sections</option>
                <option value="3">3 Sections</option>
                <option value="4">4 Sections</option>
            </select>

            <select v-model="totalLessons" class="px-2 py-4 rounded outline-none focus:ring-2">
                <option value="">How many lessons?</option>
                <option value="2">2 Lessons</option>
                <option value="3">3 Lessons</option>
                <option value="4">4 Lessons</option>
            </select>

            <select v-model="includeQuiz" class="px-2 py-4 rounded outline-none focus:ring-2">
                <option value="">Include Quiz?</option>
                <option value="true">Yes: Include Quiz</option>
                <option value="false">No: Don't Include Quiz</option>
            </select>

            <!-- <select class="py-4">
                <option value="">Include Homework?</option>
                <option value="yes">Yes: Include Homework</option>
                <option value="no">No: Don't Include</option>
            </select> -->
        </div>
        <div class="mt-10 px-4 md:px-0 lg:px-0 flex flex-col justify-center items-center">
            <div v-if="isLoading" class="mb-4 col-sm-12 h2 text-white text-lg"
                style="height: 100%; display: flex; align-items: center; justify-content: center;">
                <div v-if="step === 1">
                    <p>Generating course name and description... (10%)</p>
                </div>
                <div v-else-if="step === 2">
                    <p>Generating course sections... (20%)</p>
                </div>
                <div v-else-if="step === 3">
                    <p>Generating course lessons... (40%)</p>
                </div>
                <div v-else-if="step === 4">
                    <p>Almost ready... (60%)</p>
                </div>
                <div v-else>
                    <p>Processing complete! Please Wait ... (80%)</p>
                </div>
                <div class="ml-4" v-if="step !== 5">
                    <div class="loading-indicator text-white"></div>
                </div>
            </div>

            <template v-if="isLoading">
                <div v-for="n in 3" class="mb-10 py-4 border rounded md:w-10/12 lg:w-9/12 bg-blue-100 animate-pulse">
                    <div class="px-6 pb-3 border-b-2 border-blue-600 flex justify-between">
                        <h2 class="w-1/2 h-6 bg-gray-300"></h2>
                        <a href="#" class="w-1/6 h-6 bg-gray-300"></a>
                    </div>
                    <div class="px-6 py-6">
                        <span class="w-2/3 h-6 bg-gray-300"></span>
                        <p class="mt-3 w-full h-4 bg-gray-300"></p>
                    </div>
                </div>
            </template>
            <div v-if="course != ''" class="mb-10 py-4 border rounded  md:w-10/12 lg:w-9/12 bg-blue-100">
                <div class="px-6 pb-3 text-2xl border-b-2 border-blue-600">Course Overview</div>
                <div class="px-6 py-6 prose">
                    <p class="ml-6 mt-3  text-lg" v-html="md.render(course.description)">
                    </p>
                </div>
            </div>
            <!-- <div class="mb-10 py-4 border rounded  md:w-10/12 lg:w-9/12 bg-blue-100">
                <div class="px-6 pb-3 border-b-2 border-blue-600 flex justify-between">
                    <h2 class="text-2xl">1. section title</h2>
                    <a href="#" @click="copyToClipboardError()">Copy</a>
                </div>
                <div class="px-6 py-6">
                    <span class="text-xl font-bold">0.1) Lesson Title</span>
                    <p class="ml-6 mt-3  text-lg">
                        Here goes the long content
                    </p>
                </div>
            </div> -->
            <template v-if="isUnlocked">
                <div v-for="(section, sectionIndex) in course.sections"
                    class="mb-10 py-4 border rounded  md:w-10/12 lg:w-9/12 bg-blue-100">
                    <div class="px-6 pb-3 border-b-2 border-blue-600 flex justify-between">
                        <h2 class="text-2xl">{{ sectionIndex + 1 }}. {{ section.title }}</h2>
                        <a href="#" @click.prevent="copyToClipboard(section)">Copy</a>
                    </div>
                    <div v-for="(lesson, lessonIndex) in section.lessons" class="px-6 py-6 prose">
                        <span class="text-xl font-bold">{{ `${sectionIndex + 1}.${lessonIndex}` }}) {{ lesson.title
                        }}</span>
                        <p class="ml-6 mt-3  text-lg" v-html="md.render(lesson.content.body)"></p>
                        <div>
                            <p v-if="lesson.quiz_questions">
                            <div v-for="(quizQuestion, index) in lesson.quiz_questions">
                                <span class="text-xl font-bold">{{ index + 1 }} {{ quizQuestion.question }}</span>
                                <ul v-for="answer in quizQuestion.answers">
                                    <li class="flex items-center">
                                        <span class="mr-2">{{ answer.answer }}</span>
                                        <svg v-if="answer.correct" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="text-green-600 w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </li>
                                </ul>
                            </div>
                            </p>
                        </div>
                    </div>
                </div>
            </template>

            <template v-if="!isUnlocked && course.sections">
                <div v-for="(section, sectionIndex) in course.sections"
                    class="mb-10 py-4 border rounded  md:w-10/12 lg:w-9/12 bg-blue-100">
                    <div class="px-6 pb-3 border-b-2 border-blue-600 flex justify-between">
                        <h2 class="text-2xl">{{ sectionIndex + 1 }}. {{ section.title }}</h2>
                        <a href="#" @click.prevent="copyToClipboardError()">Copy</a>
                    </div>
                    <div v-for="(lesson, lessonIndex) in section.lessons" class="px-6 py-6 prose">
                        <span class="text-xl font-bold">{{ `${sectionIndex + 1}.${lessonIndex}` }}) {{ lesson.title
                        }}</span>
                        <p v-if="sectionIndex === 0" class="ml-6 mt-3  text-lg" v-html="md.render(lesson.content.body)">
                        </p>
                        <p v-else class="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            <span>Content Locked</span>
                        </p>
                    </div>
                </div>
            </template>
        </div>
        <!-- <div class="flex justify-center items-center mt-2"> -->
        <div v-if="!isUnlocked && course.sections" class="flex justify-center items-center mt-2">
            <button @click="unlockCourse"
                class="mt-4 px-24 py-4 text-lg text-white font-semibold rounded-lg bg-blue-600 border outline-none focus:ring-4 shadow-lg transform active:scale-95 transition-transform">
                UNLOCK FULL COURSE
            </button>
        </div>

        <!-- <div class="mt-8 flex justify-center">
            <div class="max-w-sm w-full mx-4 bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="px-6 py-4">
                    <h2 class="text-2xl font-semibold text-gray-800">One Off</h2>
                    <p class="mt-2 text-gray-600">Pay for individual courses</p>
                </div>
                <div class="border-t border-gray-300">
                    <div class="px-6 py-4">
                        <h3 class="text-lg font-semibold text-gray-800">Bronze</h3>
                        <p class="mt-2 text-gray-600">1 course</p>
                        <p class="mt-2 text-gray-800">$99.99</p>
                    </div>
                    <div class="px-6 py-4">
                        <h3 class="text-lg font-semibold text-gray-800">Silver</h3>
                        <p class="mt-2 text-gray-600">3 courses</p>
                        <p class="mt-2 text-gray-800">$269.99</p>
                    </div>
                    <div class="px-6 py-4">
                        <h3 class="text-lg font-semibold text-gray-800">Gold</h3>
                        <p class="mt-2 text-gray-600">5 courses</p>
                        <p class="mt-2 text-gray-800">$399.99</p>
                    </div>
                </div>
            </div>
            <div class="max-w-sm w-full mx-4 bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="px-6 py-4">
                    <h2 class="text-2xl font-semibold text-gray-800">Annual</h2>
                    <p class="mt-2 text-gray-600">20% discount over ala-carte</p>
                </div>
                <div class="border-t border-gray-300">
                    <div class="px-6 py-4">
                        <h3 class="text-lg font-semibold text-gray-800">Bronze</h3>
                        <p class="mt-2 text-gray-600">1 course per month</p>
                        <p class="mt-2 text-gray-800">$959.99/yr</p>
                    </div>
                    <div class="px-6 py-4">
                        <h3 class="text-lg font-semibold text-gray-800">Silver</h3>
                        <p class="mt-2 text-gray-600">3 courses per month</p>
                        <p class="mt-2 text-gray-800">$2592.99/yr</p>
                    </div>
                    <div class="px-6 py-4">
                        <h3 class="text-lg font-semibold text-gray-800">Gold</h3>
                        <p class="mt-2 text-gray-600">5 courses per month</p>
                        <p class="mt-2 text-gray-800">$3839.99/yr</p>
                    </div>
                </div>
            </div>
        </div> -->
    </div></template>
