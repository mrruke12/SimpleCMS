<template>
  <div class="create-project">
    <h2>Создать новый проект</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="project-name">Название проекта</label>
        <input
          v-model="projectName"
          type="text"
          id="project-name"
          placeholder="Введите название"
          required
          minlength="3"
          maxlength="50"
        />
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Создание...' : 'Создать проект' }}
      </button>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/axios'; 
import { useRouter } from 'vue-router';

const projectName = ref('');
const error = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  error.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    const response = await api.post('/projects', {
      name: projectName.value.trim(),
    });

    successMessage.value = `Проект "${response.data.name}" успешно создан!`;
    projectName.value = '';
  } catch (err) {
    if (err.response?.status === 400) {
      error.value = err.response.data.error || 'Некорректное название проекта';
    } else {
      error.value = 'Ошибка сервера. Попробуйте позже.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.create-project {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  margin-top: 5px;
}

.success-message {
  color: #42b983;
  margin-top: 10px;
}
</style>