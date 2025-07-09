<template>
    <div class="project-view">
        <div v-if="!isEditing" class="markdown-body">
            <div class="project-header">
                <h1>{{ project.name }}</h1>
                <div>
                    <button @click="downloadPdf" class="edit-btn">
                        PDF
                    </button>
                    <button v-if="isOwner" @click="goToSettings" class="edit-btn">
                        Настройки
                    </button>
                    <button @click="startEditing" class="edit-btn">
                        Редактировать
                    </button>
                </div>
            </div>

            <div class="project-meta">
                <p class="author">Владелец: {{ project.author.name }}</p>
                <p class="author">Участники:</p>
                <p v-for="coAuthor in project.coAuthors">
                    {{ coAuthor.name }},
                </p>
            </div>

            <div class="markdown-content" v-html="compiledMarkdown"></div>

            <div class="commits-section">
                <h2>История изменений</h2>
                <div class="commits-list">
                    <div v-for="commit in commits" :key="commit._id" class="commit-item"
                        @click="goToCommit(commit._id)">
                        <div class="commit-header">
                            <span class="commit-author">{{ commit.authorId.name }}</span>
                            <span class="commit-date">{{ formatDate(commit.createdAt) }}</span>
                        </div>
                        <div class="commit-message">
                            {{ commitMessagePreview(commit) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="edit-mode">
            <div class="edit-controls">
                <button @click="togglePreview" class="mode-btn">
                    {{ showPreview ? 'Редактировать' : 'Предпросмотр' }}
                </button>
                <div>
                    <button @click="saveChanges" class="save-btn">Сохранить</button>
                    <button @click="cancelEditing" class="cancel-btn">Отмена</button>
                </div>
            </div>

            <textarea v-if="!showPreview" v-model="editableContent" class="markdown-editor"></textarea>

            <div v-else class="markdown-preview markdown-body" v-html="compiledMarkdown"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import 'github-markdown-css/github-markdown.css'

import 'highlight.js/styles/github.css'


const route = useRoute()
const router = useRouter()

const project = ref({
    name: '',
    content: '',
    author: {},
    createdAt: ''
})
const commits = ref([])
const isEditing = ref(false)
const showPreview = ref(false)
const editableContent = ref('')
const isOwner = ref(false)

onMounted(async () => {
    try {
        await loadProject()
        await loadCommits()
    } catch {
        router.push('/projects')
    }
})

const loadProject = async () => {
    const response = await api.get(`/projects/${route.params.id}`)
    const response2 = await api.get('/users')

    project.value = response.data
    editableContent.value = project.value.content
    isOwner.value = project.value.author._id === response2.data._id
}

const loadCommits = async () => {
    const response = await api.get(`/commits/by-project/${route.params.id}`)
    commits.value = response.data
}

const compiledMarkdown = computed(() => {
    return DOMPurify.sanitize(marked(editableContent.value))
})

const downloadPdf = async () => {
    try {
        const response = await api.get(`/projects/${route.params.id}/pdf`, {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'document.pdf')
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        console.error('Conversion error:', error)
        alert('Ошибка при конвертации')
    }
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const commitMessagePreview = (commit) => {
    const diff = commit.newContent.length - commit.oldContent.length
    return `Изменений: ${diff > 0 ? '+' : ''}${diff} символов`
}

const goToCommit = (commitId) => {
    router.push(`/commits/${commitId}`)
}

const startEditing = () => {
    isEditing.value = true
}

const goToSettings = () => {
    router.push(`/projects/${route.params.id}/settings`)
}

const togglePreview = () => {
    showPreview.value = !showPreview.value
}

const cancelEditing = () => {
    isEditing.value = false
    showPreview.value = false
    editableContent.value = project.value.content
}

const saveChanges = async () => {
    try {
        await api.put(`/projects/${route.params.id}/content`, {
            content: editableContent.value
        })
        await loadProject()
        await loadCommits()
        isEditing.value = false
        showPreview.value = false
    } catch (error) {
        console.error('Ошибка сохранения:', error)
    }
}
</script>


<style scoped>
.project-view {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.edit-btn {
    padding: 0.5rem 1rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 10px;
}

.project-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    color: #666;
    font-size: 0.9rem;
    flex-direction: column;
}

.markdown-content {
    margin-bottom: 3rem;
    line-height: 1.6;
}

.commits-section {
    margin-top: 3rem;
}

.commits-list {
    margin-top: 1rem;
}

.commit-item {
    padding: 1rem;
    margin-bottom: 0.5rem;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.commit-item:hover {
    background-color: #f6f8fa;
}

.commit-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.commit-author {
    font-weight: 600;
    color: #24292e;
}

.commit-date {
    color: #6a737d;
}

.commit-message {
    color: #6a737d;
    font-size: 0.85rem;
}

/* Режим редактирования */
.edit-mode {
    margin-top: 1rem;
}

.edit-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    align-items: center;
}

.mode-btn {
    padding: 0.5rem 1rem;
    background-color: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    cursor: pointer;
    color: #24292e;
    font-weight: 500;
}

.save-btn {
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    background-color: #2ea44f;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.cancel-btn {
    padding: 0.5rem 1rem;
    background-color: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    cursor: pointer;
    color: #24292e;
    font-weight: 500;
}

.markdown-editor {
    width: 100%;
    min-height: 400px;
    padding: 1rem;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    resize: vertical;
    background-color: #f6f8fa;
    color: #24292e;
}

.markdown-preview {
    padding: 2rem;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    background-color: white;
}
</style>

<style>
.markdown-body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #24292e;
    word-wrap: break-word;
    background: white;
}

.markdown-body h1,
.markdown-body h2 {
    padding-bottom: 0.3em;
    border-bottom: 1px solid #eaecef;
}

.markdown-body pre {
    /* background-color: #f6f8fa; */
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
}

.markdown-body code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    /* background-color: rgb(27, 31, 35); */
    border-radius: 3px;
    padding: 0.2em 0.4em;
    font-size: 85%;
}

.markdown-body pre code {
    /* background-color: transparent; */
    padding: 0;
    border-radius: 0;
}

.markdown-body blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin-left: 0;
}

@media (max-width: 767px) {
    .markdown-body {
        padding: 15px;
    }
}
</style>






<!-- <template>
    <div class="project-view">
        <div v-if="!isEditing">
            <div class="project-header">
                <h1>{{ project.name }}</h1>

                <div>
                    <button @click="downloadPdf" class="edit-btn">
                        pdf
                    </button>
                    <button v-if="isOwner" @click="goToSettings" class="edit-btn">
                        Настройки
                    </button>
                    <button @click="startEditing" class="edit-btn">
                        Редактировать
                    </button>
                </div>

            </div>

            <div class="project-meta">
                <p class="author">Владелец: {{ project.author.name }}</p>
                <p class="author">Участники:</p>
                <p v-for="coAuthor in project.coAuthors">
                    {{ coAuthor.name }},
                </p>
            </div>

            <div class="markdown-content" v-html="compiledMarkdown"></div>

            <div class="commits-section">
                <h2>История изменений</h2>
                <div class="commits-list">
                    <div v-for="commit in commits" :key="commit._id" class="commit-item"
                        @click="goToCommit(commit._id)">
                        <div class="commit-header">
                            <span class="commit-author">{{ commit.authorId.name }}</span>
                            <span class="commit-date">{{ formatDate(commit.createdAt) }}</span>
                        </div>
                        <div class="commit-message">
                            {{ commitMessagePreview(commit) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="edit-mode">
            <div class="edit-controls">
                <button @click="togglePreview" class="mode-btn">
                    {{ showPreview ? 'Редактировать' : 'Предпросмотр' }}
                </button>
                <div>
                    <button @click="saveChanges" class="save-btn">Сохранить</button>
                    <button @click="cancelEditing" class="cancel-btn">Отмена</button>
                </div>
            </div>

            <textarea v-if="!showPreview" v-model="editableContent" class="markdown-editor"></textarea>

            <div v-else class="markdown-preview" v-html="compiledMarkdown"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api/axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
    breaks: true,
    gfm: true
});

const route = useRoute();
const router = useRouter();

const project = ref({
    name: '',
    content: '',
    author: {},
    createdAt: ''
});
const commits = ref([]);
const isEditing = ref(false);
const showPreview = ref(false);
const editableContent = ref('');
const isOwner = ref(false)


onMounted(async () => {
    await loadProject();
    await loadCommits();
});

const loadProject = async () => {
    const response = await api.get(`/projects/${route.params.id}`);
    const response2 = await api.get('/users')

    project.value = response.data;
    editableContent.value = project.value.content;
    isOwner.value = project.value.author._id === response2.data._id
};

const loadCommits = async () => {
    const response = await api.get(`/commits/by-project/${route.params.id}`);
    commits.value = response.data;
};

const compiledMarkdown = computed(() => {
    return DOMPurify.sanitize(marked(editableContent.value));
});

const downloadPdf = async () => {
    try {
        const response = await api.get(`/projects/${route.params.id}/pdf`, {
            responseType: 'blob' 
        })

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'document.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Conversion error:', error);
        alert('Ошибка при конвертации');
    }
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const commitMessagePreview = (commit) => {
    const diff = commit.newContent.length - commit.oldContent.length;
    return `Изменений: ${diff > 0 ? '+' : ''}${diff} символов`;
};

const goToCommit = (commitId) => {
    router.push(`/commits/${commitId}`);
};

const startEditing = () => {
    isEditing.value = true;
};

const goToSettings = () => {
    router.push(`/projects/${route.params.id}/settings`)
}

const togglePreview = () => {
    showPreview.value = !showPreview.value;
};

const cancelEditing = () => {
    isEditing.value = false;
    showPreview.value = false;
    editableContent.value = project.value.content;
};

const saveChanges = async () => {
    try {
        await api.put(`/projects/${route.params.id}/content`, {
            content: editableContent.value
        });
        await loadProject();
        await loadCommits();
        isEditing.value = false;
        showPreview.value = false;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    }
};
</script>

<style scoped>
.project-view {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.edit-btn {
    padding: 0.5rem 1rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 10px;
}

.project-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    color: #666;
    font-size: 0.9rem;
}

.markdown-content {
    font-size: 12px;
    margin-bottom: 3rem;
    line-height: 1.6;
    border: 1px solid black;
    padding: 10px;
}

.commits-section {
    margin-top: 3rem;
}

.commits-list {
    margin-top: 1rem;
}

.commit-item {
    padding: 1rem;
    margin-bottom: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.commit-item:hover {
    background-color: #f8f9fa;
}

.commit-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.commit-author {
    font-weight: bold;
}

.commit-date {
    color: #666;
}

.commit-message {
    color: #666;
    font-size: 0.85rem;
}

/* Режим редактирования */
.edit-mode {
    margin-top: 1rem;
}

.edit-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.mode-btn {
    padding: 0.5rem 1rem;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}

.save-btn {
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-btn {
    padding: 0.5rem 1rem;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}

.markdown-editor {
    width: 100%;
    min-height: 300px;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: monospace;
    resize: vertical;
}

.markdown-preview {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
}
</style> -->