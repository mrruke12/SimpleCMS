<template>
  <div class="projects-view">
    <h1>Мои проекты</h1>
    <button class="btn" @click="goToCreate">Добавить</button>
    <div v-if="projects.length === 0" class="empty-state">
      <p>У вас пока нет проектов</p>
      <router-link to="/create/projects" class="create-btn">
        Создать первый проект
      </router-link>
    </div>

    <div v-else class="projects-grid">
      <div 
        v-for="project in projects" 
        :key="project._id" 
        class="project-card"
        @click="goToProject(project._id)"
      >
        <div class="project-header">
          <h3>{{ project.name }}</h3>
          <span class="author-badge" v-if="project.author === currentUserId">
            Владелец
          </span>
          <span class="coauthor-badge" v-else>
            Соавтор
          </span>
        </div>
        <p class="content-preview">
          {{ truncateContent(project.content) }}
        </p>
        <div class="project-footer">
          <span class="authors-count">
            {{ project.coAuthors.length + 1 }} участников
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios.js';

const router = useRouter();
const projects = ref([]);
const currentUserId = ref(''); 

const goToCreate = () => {
    router.push('/create/projects')
}

onMounted(async () => {
  try {
    const projectsResponse = await api.get('/projects');
    projects.value = projectsResponse.data;
    const userResponse = await api.get('/users')
    currentUserId.value = userResponse.data._id
  } catch (error) {
    console.error('Ошибка при загрузке проектов:', error);
  }
});

const goToProject = (projectId) => {
  router.push(`/projects/${projectId}`);
};

const truncateContent = (content) => {
    if (!content) return ''
  return content.length > 100 
    ? content.substring(0, 100) + '...' 
    : content;
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};
</script>

<style scoped>
.btn {
    padding: 0.5rem 1rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px 0;
    width: 100%;
    padding: 10px 0;
    font-size: 14px;
}

.projects-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.create-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.create-btn:hover {
  background-color: #3aa876;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-header h3 {
  margin: 0;
  color: #2c3e50;
}

.author-badge, .coauthor-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.author-badge {
  background-color: #e3f2fd;
  color: #1976d2;
}

.coauthor-badge {
  background-color: #e8f5e9;
  color: #388e3c;
}

.content-preview {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
}

.date, .authors-count {
  display: flex;
  align-items: center;
}

.date::before {
  content: "📅";
  margin-right: 0.25rem;
}

.authors-count::before {
  content: "👥";
  margin-right: 0.25rem;
}
</style>