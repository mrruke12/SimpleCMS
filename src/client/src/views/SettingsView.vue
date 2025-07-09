<template>
  <div class="coauthors-view">
    <div class="header">
      <h1>Настройки</h1>
      
      <router-link :to="`/projects/${projectId}`" class="back-link">
        ← Назад к проекту
      </router-link>
    </div>

    <button class="remove-project-btn" @click="removeProject">
        Удалить проект
    </button>

    <div class="current-coauthors">
      <h2>Текущие соавторы ({{ coAuthors.length }}/10)</h2>
      <ul v-if="coAuthors.length > 0">
        <li v-for="user in coAuthors" :key="user._id" class="coauthor-item">
          <span>{{ user.name }} ({{ user.email }})</span>
          <button @click="removeCoAuthor(user._id)" class="remove-btn">
            Удалить
          </button>
        </li>
      </ul>
      <p v-else class="empty-message">Нет добавленных соавторов</p>
    </div>

    <div class="add-coauthor-form">
      <h2>Добавить нового соавтора</h2>
      <form @submit.prevent="addCoAuthor">
        <div class="form-group">
          <label for="email">Email пользователя</label>
          <input
            v-model="emailInput"
            type="email"
            id="email"
            placeholder="Введите email"
            required
          />
          <button type="submit" :disabled="isAdding" class="add-btn">
            {{ isAdding ? 'Добавление...' : 'Добавить' }}
          </button>
        </div>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api/axios';
import router from '../router';

const route = useRoute();
const projectId = route.params.id;
const coAuthors = ref([]);
const emailInput = ref('');
const isAdding = ref(false);
const error = ref('');
const successMessage = ref('');

onMounted(async () => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    coAuthors.value = response.data.coAuthors || [];
  } catch (err) {
    error.value = 'Не удалось загрузить список соавторов';
  }
});

const addCoAuthor = async () => {
  if (coAuthors.value.length >= 10) {
    error.value = 'Достигнут лимит соавторов (10)';
    return;
  }

  isAdding.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const email = emailInput.value.trim();
    const userResponse = await api.get(`/users/${email}`);
    const user = userResponse.data;

    if (coAuthors.value.some(u => u._id === user._id)) {
      error.value = 'Этот пользователь уже является соавтором';
      return;
    }

    const updatedCoAuthors = [...coAuthors.value, user];
    await api.put(`/projects/${projectId}/coauthors`, {
      coAuthors: updatedCoAuthors.map(u => u._id)
    });

    coAuthors.value = updatedCoAuthors;
    emailInput.value = '';
    successMessage.value = `${user.name} добавлен как соавтор`;
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = 'Пользователь с таким email не найден';
    } else {
      error.value = 'Ошибка при добавлении соавтора';
    }
  } finally {
    isAdding.value = false;
  }
};

const removeCoAuthor = async (userId) => {
  try {
    
    const updatedCoAuthors = coAuthors.value.filter(u => u._id !== userId);
    await api.put(`/projects/${projectId}/coauthors`, {
      coAuthors: updatedCoAuthors.map(u => u._id)
    });
    coAuthors.value = updatedCoAuthors;
    successMessage.value = 'Соавтор удален';
  } catch (err) {
    error.value = 'Ошибка при удалении соавтора';
  }
};

const removeProject = async () => {
    try {
         if (confirm('Вы уверены, что хотите удалить этот проект?')) {
            await api.delete(`/projects/${projectId}`)
            router.push('/projects')
         }
    } catch (error) {
        error.value = 'Ошибка при удалении'
    }
}
</script>

<style scoped>
.coauthors-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  color: #42b983;
  text-decoration: none;
}

.current-coauthors {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.coauthor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e1e4e8;
}

.coauthor-item:last-child {
  border-bottom: none;
}

.remove-project-btn {
    padding: 1rem 0.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
    width: 100%;
}

.remove-btn {
  padding: 0.25rem 0.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty-message {
  color: #666;
}

.add-coauthor-form {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.form-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.form-group input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-btn {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  margin-top: 1rem;
}

.success-message {
  color: #42b983;
  margin-top: 1rem;
}
</style>