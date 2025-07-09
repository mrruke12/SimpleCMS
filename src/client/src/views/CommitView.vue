<template>
  <div class="commit-view">
    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else>
      <div class="commit-header">
        <h1>Изменения в коммите</h1>
        <router-link :to="`/projects/${commit.projectId}`" class="back-link">
          ← Назад к проекту
        </router-link>
      </div>

      <div class="commit-meta">
        <div class="author-info">
          <span class="label">Автор:</span>
          <span class="value">{{ commit.authorId.name }}</span>
        </div>
        <div class="date-info">
          <span class="label">Дата:</span>
          <span class="value">{{ formatDate(commit.createdAt) }}</span>
        </div>
      </div>

      <div class="diff-container">
        <h2>Изменения</h2>
        <div class="diff-content">
          <span 
            v-for="(change, index) in processedDiff" 
            :key="index" 
            class="diff-block"
            :class="{
              'deleted': change.operation === -1,
              'inserted': change.operation === 1,
              'unchanged': change.operation === 0
            }"
          >
            {{ change.text }}
          </span>
        </div>
      </div>

      <div class="versions-comparison">
        <div class="version old-version">
          <h3>Предыдущая версия</h3>
          <pre>{{ commit.oldContent }}</pre>
        </div>
        <div class="version new-version">
          <h3>Новая версия</h3>
          <pre>{{ commit.newContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api/axios';

const route = useRoute();
const commit = ref({
  projectId: {},
  authorId: {},
  oldContent: '',
  newContent: '',
  createdAt: ''
});
const diff = ref([]);
const loading = ref(true);

const processedDiff = computed(() => {
  const result = [];
  let currentBlock = { operation: null, text: '' };

  diff.value.forEach(([operation, text]) => {
    if (operation !== currentBlock.operation) {
      if (currentBlock.text) {
        result.push({ ...currentBlock });
      }
      currentBlock = { operation, text: text || '' };
    } else {
      currentBlock.text += text || '';
    }
  });

  if (currentBlock.text) {
    result.push({ ...currentBlock });
  }

  return result;
});

onMounted(async () => {
  try {
    const commitResponse = await api.get(`/commits/by-id/${route.params.id}`);
    commit.value = commitResponse.data;

    const diffResponse = await api.get(`/commits/diff/${route.params.id}`);
    diff.value = diffResponse.data;

  } catch (error) {
    console.error('Ошибка загрузки коммита:', error);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.commit-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.commit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  color: #42b983;
  text-decoration: none;
}

.commit-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.author-info,
.date-info {
  display: flex;
  gap: 0.5rem;
}

.label {
  font-weight: bold;
}

.diff-container {
  margin: 3rem 0;
}

.diff-content {
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  padding: 1rem;
  background-color: #f6f8fa;
  white-space: pre-wrap;
  font-family: monospace;
  line-height: 1.5;
  font-size: 12px;
}

.diff-block {
  white-space: pre-wrap;
  word-break: break-word;
}

.deleted {
  background-color: #ffebe9;
  text-decoration: line-through;
}

.inserted {
  background-color: #e6ffec;
}

.unchanged {
  background-color: transparent;
}

.versions-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
}

.version {
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  padding: 1rem;
}

.version h3 {
  margin-top: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e1e4e8;
}

.version pre {
  white-space: pre-wrap;
  font-family: monospace;
  margin: 0;
  background-color: #f6f8fa;
  padding: 1rem;
  border-radius: 4px;
}
</style>