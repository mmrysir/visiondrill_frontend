<script>
import TrashIcon from '../../icons/TrashIcon.vue';

let MarkdownIt = require('markdown-it');

export default {
    props: ["categories", "authenticated"],
    data() {
        return {
            aiNotes: [],
            showNote: false,
            noteHistory: [],
            md: new MarkdownIt(),
            selectedNote: null,
            showAddNote: false,
            noteTitle: "",
            clearSearch: false,
            googleResults: [],
            loading: false,
            showGoogleResults: false,
        };
    },
    methods: {
        getAiNotes() {
            axios.get("/api/ai-notes")
                .then((response) => {
                    this.aiNotes = response.data.data;
                    this.selectedNote = response.data.data[0].id;
                });
        },
        viewNote(id) {
            this.clearSearch = true;
            axios.get(`/api/ai-notes/${id}`)
                .then((response) => {
                    this.noteHistory = response.data;
                })
                .finally(() => {
                    //
                });
        },
        markNoteAsSelected(id) {
            this.selectedNote = id;
            this.viewNote(id);
        },
        addNewNote() {
            this.showAddNote = !this.showAddNote;
        },
        handleSaveNote() {
            axios.post("/api/ai-notes", {
                note_title: this.noteTitle
            })
                .then(() => {
                    this.noteTitle = "";
                    this.showAddNote = false;
                    this.getAiNotes();
                });
        },

        deleteNote(id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                console.log('here is the result', result);
                if (result.value) {
                    axios.delete(`/api/ai-notes/${id}`)
                        .then((response) => {
                            this.aiNotes = this.aiNotes.filter(note => note.id !== id);
                            Swal.fire(
                                'Deleted!',
                                'Your note has been deleted.',
                                'success'
                            )
                        });
                }
            })
        },

        changeAiNoteGroup(userQueryId, aiNoteId) {
            axios.patch(`/api/user-queries/${userQueryId}/edit`, {
                ai_note_id: aiNoteId
            })
            .then((response) => {
                Swal.fire('Note title switched successfully!');
            })
        },

        updateSearchTerm(term) {
            this.searchTerm = term;
        },
        updateGoogleSearch(term) {
            this.googleResults = [];
            this.searchTerm = term;
            this.showGoogleResults = false;
        },

        toggleGoogleSearch() {
            this.showGoogleResults = ! this.showGoogleResults;
            if (this.googleResults.length <= 0) {
                this.performGoogleSearch();
            }
        },

        async performGoogleSearch() {
            this.loading = true;
            await axios.get("https://www.googleapis.com/customsearch/v1", {
                params: {
                    key: "AIzaSyDa_3UBYra-rjxzk_JXEH912i9nH0gEmEo",
                    cx: "c409e36105905407d",
                    q: this.searchTerm,
                }
            })
            .then((response) => {
                this.googleResults = response.data.items;
            })
            .finally(() => {
                this.loading = false;
            });
        }
    },
    created() {
        this.getAiNotes();
    },
    components: { TrashIcon }
}
</script>

<template>
    <div class="mt-4 px-4 lg:px-20 lg:flex justify-between" id="app">
        <div class="lg:w-8/12 mr-2 mb-4">
            <nav class="mb-4" aria-label="breadcrumb" style="color: blue !important;">
                <ol class="flex">
                    <li class="mr-3 text-black"><a href="/">Home / </a></li>
                    <li class="mr-3 text-black"><a href="/courses">AI Search </a></li>
                    <li class="mr-3" aria-current="page"></li>
                </ol>
            </nav>

            <div class="col-sm-12 col-lg-9">
                <div class="grid grid-cols-1 gap-6 mt-5 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <!-- <course-card :course="{{ $course }}" :key="{{ $course->id }}" /> -->
                    </div>
                </div>
                <div class="mt-4">
                    <!-- {!! $courses->links('pagination::tailwind') !!} -->
                </div>
            </div>


            <div>
                <ai-instant-search :selectedNote="selectedNote" :clearSearch="clearSearch" :authenticated="authenticated"
                    v-on:disable:clear-search="clearSearch = false" v-on:update:search-term="updateSearchTerm"
                    v-on:update:google-search="updateGoogleSearch">
                </ai-instant-search>
            </div>

            <div class="prose">
                <div v-for="note in noteHistory">
                    <h3>You: {{ note.query }}</h3>
                    <h3>Answer from AI:</h3>
                    <div v-if="note.ai_response">
                        <div v-html="md.render(note.ai_response.response)"></div>
                        <div>
                            <span>Saved on:</span>
                            <select @change="changeAiNoteGroup(note.id, $event.target.value)" class="rounded px-1">
                                <option v-for="item in aiNotes" :selected="item.id === note.ai_note_id" :value="item.id" :key="item.id">{{ item.title }}</option>
                            </select>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>

            <div v-if="!authenticated">
                <h3 class="mt-2 text-lg">Unlock the power of AI-based search by <a href="/login"
                        class="text-blue border-b">signing in</a> or <a href="/register" class="text-blue border-b">creating
                        an account</a>.</h3>
            </div>

            <div class="my-4 w-full">
                <!-- <p class="font-semibold cursor-pointer" @click="toggleGoogleSearch" id="toggle-google-search">Click here for
                    Google search resultb:</p> -->
                <div id="google-search-results" style="display: none !important;">
                    <div class="gcse-searchresults-only"></div>
                </div>
                <span v-if="loading">Loading...</span>
                <div class="mt-4" v-if="showGoogleResults && googleResults.length > 0">
                    <div v-for="item in googleResults" :key="item.title" class="mb-4">
                        <a :href="item.link" target="_blank" class="text-blue">{{ item.title }}</a><br />
                        <span>{{ item.snippet }}</span>
                        <a v-bind:href="item.link" target="_blank"> {{ item.link }} </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="ml-2 rounded-lg lg:w-4/12">
            <div v-if="authenticated" class="shadow-lg">
                <div class="bg-blue px-4 py-2 text-white rounded-t-lg font-semibold">
                    <div class="flex justify-between items-center">
                        <span>Notes</span>
                        <button @click="addNewNote" class="border px-2 py-1 rounded text-sm focus:outline-none" style="cursor:pointer;">
                            Add Note
                        </button>
                    </div>
                </div>
                <ul class="py-2">
                    <form v-if="showAddNote" class="px-4 flex" @submit.prevent="handleSaveNote">
                        <input type="text" v-model="noteTitle" placeholder="Note Title"
                            class="mr-1 px-2 py-1 w-full rounded border border-blue focus:outline-none" required />
                        <button type="submit" class="rounded border border-blue px-2">Save</button>
                    </form>
                    <template v-for="note in aiNotes">
                        <li class="px-4 py-2" :class="{ 'bg-blue text-white': selectedNote === note.id }"
                            @click.prevent="markNoteAsSelected(note.id)">
                            <div class="flex justify-between items-center cursor-pointer">
                                <div class="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    <span>{{ note.title }}</span>
                                </div>
                                <div @click.stop.prevent="deleteNote(note.id)">
                                    <TrashIcon />
                                </div>
                                <!-- <div @click.prevent="viewNote(note.id)" class="text-sm hover:underline" style="cursor:pointer;">View</div> -->
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="mt-4 shadow-lg">
                <div class="bg-blue px-6 py-2 text-white rounded-t-lg font-semibold">
                    ALL CATEGORIES
                </div>
                <ul class="py-2">
                    <li v-for="category in categories" class="px-4 py-2">
                        <a class="flex items-center" :href="`/course/category/${category.slug}`">
                            <img :src="category.icon_path" alt="" class="mr-3" style="height: 35px;">
                            <span>{{ category.name }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.w-6 {
    width: 1rem;
}

.h-6 {
    width: 1rem;
}

.border-l-0 {
    border-left-width: 0px;
}
.border-r-0 {
    border-right-width: 0px;
}
</style>
