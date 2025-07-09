<template>
  <div class="home-view">
    <div v-if="isAuthenticated" class="user-data">
      <h1>Добро пожаловать!</h1>
      <div v-if="user !== null">
        <h2>Текущий пользователь:</h2>
        <ul>
          <li>{{ user.email }}</li>
          <li>{{ user.name }}</li>
        </ul>
        <button class="login-button" @click="logout">
            Выйти
        </button>
      </div>
      <p v-else>Загрузка данных...</p>
    </div>

    <div v-else class="auth-prompt">
      <h1>Вы не авторизованы</h1>
      <button @click="goToAuth" class="login-button">Войти</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios.js';

const user = ref(null);
const isAuthenticated = ref(false); 
const router = useRouter();

onMounted(async () => {
  try {
    const response = await api.get('/users');
    user.value = response.data;
    isAuthenticated.value = true;
  } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
  }
});

const goToAuth = () => {
  window.location.href = '/auth'
};

const logout = () => {
    localStorage.removeItem('token')
    isAuthenticated.value = false
}
</script>

<style scoped>
.home-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.user-data ul {
  list-style: none;
  padding: 0;
}

.user-data li {
  margin: 10px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
}

.login-button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.login-button:hover {
  background: #369f6b;
}
</style>