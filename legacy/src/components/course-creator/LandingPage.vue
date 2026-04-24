<script>
import Iconclock from '../icons/Iconclock.vue';
import Iconusers from '../icons/Iconusers.vue';
import Iconpersonrunning from '../icons/Iconpersonrunning.vue';
import Iconcalendar from '../icons/Iconcalendar.vue';
import Typewriter from 'typewriter-effect/dist/core';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
    components: {
        Iconclock,
        Iconusers,
        Iconpersonrunning,
        Iconcalendar,
    },

    mounted() {
        new Typewriter('#typewriter', {
            strings: ['Courses', 'Books', 'Content'],
            autoStart: true,
            loop: true,
        });
        AOS.init();
    }
}
</script>
<template>
   <div class="h-full bg-gradient-to-l from-purple-500 to-slate-900 ">
        <!-- nav section start -->
        <nav class="px-20 md:px-8 lg:px-16 py-8 md:flex justify-between items-center lg:flex justify-between items-center">
            <div class="flex justify-center items-center md:justify-start lg:justify-start">
                <img src="/images/course-creator/logo.png" class="" />
            </div>
            <div class="mt-4 lg:mt-0 flex justify-center items-center md:justify-start lg:justify-start">
                <a href="/login">
                    <button class="px-6 py-1 font-normal text-lg text-white transform active:scale-95 transition-transform">
                        Log In
                    </button>
                </a>
                <a href="/instructor/register">
                    <button class="px-5 py-1 font-normal text-lg text-white rounded bg-blue-600 outline-none focus:ring-4 shadow-lg transform active:scale-95 transition-transform">
                        Sign Up
                    </button>
                </a>
            </div>
        </nav>
        <!-- nav section end -->
        <!-- main section start -->
        <div class="px-6 md:px-10 lg:px-16 md:flex lg:flex mt-6 gap-4">
           <div class="md:w-5/12 lg:w-5/12 lg:mt-16">
                <h1 class="text-3xl md:text-3xl lg:text-5xl font-extrabold text-white tracking-wide">
                Generate <span id="typewriter">Courses</span> <br>
                <div class="mt-4 lg:mt-6 font-samibold border-b-4 pb-1 w-36 lg:w-52">Using AI</div>
                </h1>
                <p class="mt-6 lg:mt-10 md:text-lg lg:text-xl text-white font-medium leading-normal tracking-wide">
                Are you an instructor, writer, or publisher looking to create high-quality
                educational content? We transform simple course descriptions into robust
                curriculums in just minutes!
                </p>
                <a href="/instructor/register">
                    <button class="mt-6 lg:mt-10 px-6 lg:px-8 py-3 lg:py-4 font-medium lg:text-xl text-white rounded-lg bg-blue-600 shadow-xl shadow-gray-700 outline-none focus:ring-4 shadow-lg transform active:scale-95 transition-transform">
                        Generate Now
                    </button>
                </a>
           </div>
           <div class="mt-16 md:mt-0 lg:mt-0 md:w-7/12 lg:w-7/12 h-full" data-aos="zoom-in">
                <img src="/images/course-creator/image.png" class="" />
           </div>
        </div>
        <!-- main section end -->
        <!-- Content Creation start -->
        <div class="mt-28 px-6 md:px-12 lg:px-20 flex flex-col justify-center items-center" data-aos="zoom-in">
            <div class="text-4xl font-bold text-white tracking-wider">Content Creation</div>
            <p class="lg:w-7/12 text-center mt-10 text-xl text-white font-medium leading-normal tracking-wide">
                Are you an instructor, writer, or publisher looking to create high-quality
                educational content? We transform simple course descriptions into robust
                curriculums in just minutes!
            </p>
            <div class="mt-16 grid grid-cols-1 gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
                <div class="flex flex-col items-center bg-blue-600 text-white gap-6 shadow-xl rounded-t-3xl rounded-br-3xl px-8 w-80 py-8" data-aos="zoom-in">
                    <Iconclock />
                    <span class="text-4xl font-bold">
                        2-5 mins
                    </span>
                    <span>
                        For content generation
                    </span>
                </div>
                <div class="flex flex-col items-center bg-blue-600 text-white gap-6 shadow-xl rounded-t-3xl rounded-br-3xl px-8 w-80 py-8" data-aos="zoom-in">
                    <Iconusers />
                    <span class="text-4xl font-bold">
                        200
                    </span>
                    <span>
                        Course Creators
                    </span>
                </div>
                <div class="flex flex-col items-center bg-blue-600 text-white gap-6 shadow-xl rounded-t-3xl rounded-br-3xl px-8 w-80 py-8" data-aos="zoom-in">
                    <Iconclock />
                    <span class="text-4xl font-bold">
                        24/hrs
                    </span>
                    <span>
                        Uptime
                    </span>
                </div>
            </div>
        </div>
        <!-- Content Creation end -->
        <!-- Edit and Resell start -->
        <div class="mt-28 px-6 lg:px-40 flex flex-col justify-center items-center">
            <div class="text-4xl font-bold text-white tracking-wider">Edit and Resell</div>
           <div class="mt-16 lg:mt-24 md:flex lg:flex">
                <div class="md:w-7/12 lg:w-7/12 text-white">
                    <div class="mb-16">
                        <h2 class="text-2xl font-semibold tracking-wide">Real-time Edits</h2>
                        <p class="mt-6 text-xl leading-relaxed">
                            Edit your courses an unlimited number of times to keep
                            them fresh and relevant. You can invite others to edit
                            with you too!
                        </p>
                    </div>
                    <div class="">
                        <h2 class="text-2xl font-semibold tracking-wide">Make Money from Reselling</h2>
                        <p class="mt-6 text-xl leading-relaxed">
                            Generated content be used as a video script for courses, which can be sold
                            on Udemy, Skillshare, or other self-paced learning platforms.
                        </p>
                    </div>
                </div>
                <div class="mt-16 md:mt-0 lg:mt-0 md:w-6/12 lg:w-6/12 h-full">
                    <img src="/images/course-creator/image 2.png" class="animate-bounce" />
                </div>
           </div>
        </div>
        <!-- Edit and Resell end -->
        <!-- Trusted By start -->
        <div class="mt-28 px-6 lg:px-40 flex flex-col justify-center items-center">
            <div class="text-4xl font-bold text-white tracking-wider">Trusted By</div>
            <div class="mt-20 flex flex-col items-center md:flex-row gap-16">
                <img src="/images/course-creator/mastercard.png" class="" data-aos="zoom-in" />
                <img src="/images/course-creator/kepsa.png" class="h-36 w-36" data-aos="zoom-in" />
                <img src="/images/course-creator/ajira.png" class=" h-36 " data-aos="zoom-in" />
            </div>
        </div>
        <!-- Trusted By end -->
        <!-- Secure Your Early access spot! start -->
        <div class="mt-28 px-6 lg:px-40 flex flex-col justify-center items-center" data-aos="zoom-in">
            <Iconpersonrunning />
            <div class="my-8 text-4xl font-bold text-white text-center tracking-wide">Secure Your Early access spot!</div>
                <p class="md:5/12 lg:w-7/12 text-center text-xl text-white font-medium leading-relaxed tracking-wide">
                    Just 500 businesses & instructors get early access to Visiondrill. Sign up and unlock a minimum of 1 course to gain early access.
                </p>
                <a href="/instructor/register">
                    <button class="mt-6 lg:mt-10 px-6 lg:px-8 py-3 lg:py-4 font-medium lg:text-xl text-white rounded-lg bg-blue-600 shadow-xl shadow-gray-700 outline-none focus:ring-4 shadow-lg transform active:scale-95 transition-transform">
                        Sign Up Now
                    </button>
                </a>
        </div>
         <!-- Secure Your Early access spot! end -->
          <!-- Book Demo start -->
        <div class="mt-28 pb-24 px-6 lg:px-40 flex flex-col justify-center items-center" data-aos="zoom-in">
            <Iconcalendar />
            <div class="my-8 text-4xl font-bold text-white tracking-wide">Book Demo</div>
                <p class="lg:w-4/12 text-center text-xl text-white font-medium leading-relaxed tracking-wide">
                    If you don't believe in miracles, get ready to see one!
                </p>
                <a href="/contact-us">
                    <button class="mt-6 lg:mt-10 px-6 lg:px-8 py-3 lg:py-4 font-medium lg:text-xl text-white rounded-lg bg-blue-600 shadow-xl shadow-gray-700 outline-none focus:ring-4 shadow-lg transform active:scale-95 transition-transform">
                        I'm Ready
                    </button>
                </a>
        </div>
        <!-- Book Demo end -->
         <!-- footer start -->
        <footer class="bg-purple-700">
            <div class="p-5 text-white text-sm flex justify-center">
                © 2023 Visiondrill Technology LLC. All rights reserved
            </div>
        </footer>
         <!-- footer end -->
   </div>
</template>
