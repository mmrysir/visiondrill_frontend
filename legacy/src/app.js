/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

require('alpinejs');

import Vue from 'vue'
window.Vue = Vue;

import VueRouter from 'vue-router'
import VueLazyload from 'vue-lazyload'
Vue.use(VueRouter)
Vue.use(VueLazyload, {
    loading: 'https://d2xtmqj21ep9ul.cloudfront.net/vd-image-loader.gif',
})
Vue.use(require('vue-moment'));
Vue.component('pagination', require('laravel-vue-pagination'));

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
window.Swal = Swal

import Notifications from 'vue-notification'
Vue.use(Notifications, {
    duration: 10000,
    position: 'bottom right',
})

let routes = [{
    path: '/instructor/courses/:courseId/curriculum/lectures/:sectionId/video',
    name: 'eueu',
    component: require('./components/frontend/instructor/quiz/create-question.vue')
}]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

import VueChatScroll from 'vue-chat-scroll'
import VueTimeago from 'vue-timeago';

import { VTooltip, VPopover, VClosePopover } from 'v-tooltip';
Vue.use(VTooltip);
Vue.directive('close-popover', VClosePopover)
Vue.component('v-popover', VPopover);

Vue.use(VueChatScroll);

Vue.component('chat-room', function (resolve) {
    require(['./components/laravel-video-chat/ChatRoom.vue'], resolve)
})
Vue.component('group-chat-room', function (resolve) {
    require(['./components/laravel-video-chat/GroupChatRoom.vue'], resolve)
})
Vue.component('video-section', function (resolve) {
    require(['./components/laravel-video-chat/VideoSection.vue'], resolve)
})
Vue.component('file-preview', function (resolve) {
    require(['./components/laravel-video-chat/FilePreview.vue'], resolve)
})

// Backend components
Vue.component('business-list', function (resolve) {
    require(['./components/backend/BusinessList.vue'], resolve)
})

Vue.component('school-list', function (resolve) {
    require(['./components/backend/SchoolList.vue'], resolve)
})

// Business Components
Vue.component('conference-list', function (resolve) {
    require(['./components/business/conference/List.vue'], resolve)
})

Vue.component('instructor-conference-list', function (resolve) {
    require(['./components/frontend/instructor/conference/List.vue'], resolve)
})

Vue.component('instructor-list-meetings', function (resolve) {
    require(['./components/instructor/zoom/ListMeetings'], resolve)
})

Vue.component('instructor-list-discussions', function (resolve) {
    require(['./components/instructor/discussions/ListDiscussion'], resolve)
})

Vue.component("agora-chat", require("./components/AgoraChat.vue").default);

Vue.component("audioroom", require("./components/frontend/AudioRoom/Index.vue").default);

Vue.component('purchase-token', require("./components/frontend/AiSearch/PurchaseToken.vue").default);
Vue.component('search-page', require("./components/frontend/AiSearch/Index.vue").default);
Vue.component('ai-instant-search', require("./components/frontend/AiSearch/InstantSearch.vue").default);

Vue.component('ai-course-create', require("./components/instructor/ai/courses/Create.vue").default);

Vue.component('course-creator', require('./components/course-creator/Index.vue').default);

// Vue.use(VueTimeago, { name: 'timeago', locale: 'en-US', locales: { 'en-US': [ "just now", ["%s second ago", "%s seconds ago"], ["%s minute ago", "%s minutes ago"], ["%s hour ago", "%s hours ago"], ["%s day ago", "%s days ago"], ["%s week ago", "%s weeks ago"], ["%s month ago", "%s months ago"], ["%s year ago", "%s years ago"] ] } });
Vue.use(VueTimeago, {
    locale: 'en',
    locales: {
        //   'zh-CN': require('date-fns/locale/zh_cn')
    }
})

import { Datetime } from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'
Vue.use(Datetime)
Vue.component('datetime', Datetime);

Vue.component('dismissable-alert', function (resolve) {
    require(['./components/DismissableAlert.vue'], resolve)
})

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));

Vue.component('course-voting', function (resolve) {
    require(['./components/CourseVoting.vue'], resolve)
})

//instructor
Vue.component('create-question', function (resolve) {
    require(['./components/frontend/instructor/quiz/create-question.vue'], resolve)
})
Vue.component('curriculum-section', function (resolve) {
    require(['./components/frontend/instructor/section/curriculum-section.vue'], resolve)
})
Vue.component('lecture-title', function (resolve) {
    require(['./components/frontend/instructor/lecture/LectureTitle.vue'], resolve)
})
Vue.component('delete-course', function (resolve) {
    require(['./components/frontend/instructor/course/DeleteCourse.vue'], resolve)
})
Vue.component('like-dislike', function (resolve) {
    require(['./components/LikeDislike.vue'], resolve)
})

Vue.component('quiz', function (resolve) {
    require(['./components/frontend/student/quiz/quiz.vue'], resolve)
})
Vue.component('quiz-question', function (resolve) {
    require(['./components/frontend/student/quiz/question.vue'], resolve)
})
Vue.component('bookmark', function (resolve) {
    require(['./components/frontend/WhishList.vue'], resolve)
})
Vue.component('threads', function (resolve) {
    require(['./components/frontend/messaging/threads.vue'], resolve)
})

Vue.component('messages', function (resolve) {
    require(['./components/frontend/messaging/messages.vue'], resolve)
})

Vue.component('question', function (resolve) {
    require(['./components/frontend/instructor/quiz/Question.vue'], resolve)
})

Vue.component('take-a-quiz', function (resolve) {
    require(['./components/frontend/student/TakeAQuiz.vue'], resolve)
})

Vue.component('rating-and-review', function (resolve) {
    require(['./components/frontend/RatingAndReview.vue'], resolve)
})

Vue.component('download-certificate', function (resolve) {
    require(['./components/frontend/DownloadCertificate.vue'], resolve)
})

Vue.component('loading', function (resolve) {
    require(['./components/Loading.vue'], resolve)
})
Vue.component('credit-card-form', function (resolve) {
    require(['./components/frontend/CreditCardForm.vue'], resolve)
})
Vue.component('spinner', function (resolve) {
    require(['./components/Spinner.vue'], resolve)
})

Vue.component('curriculum-container', function (resolve) {
    require(['./components/instructor/curriculum/CurriculumContainer.vue'], resolve)
})

Vue.component('affiliate-banner', function (resolve) {
    require(['./components/AffiliateBanner.vue'], resolve)
})

Vue.component('course-card', function (resolve) {
    require(['./components/CourseCard.vue'], resolve)
})

Vue.component('course-creator-landing-page', function (resolve) {
    require(['./components/course-creator/LandingPage.vue'], resolve)
})

const app = new Vue({
    el: '#app'
});


if (document.getElementById("downloadCertificate")) {
    new Vue({
        el: '#downloadCertificate'
    });
}
