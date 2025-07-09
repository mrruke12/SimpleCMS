<template>
  <div class="auth-form">
    <h2>{{ isLoginMode ? 'Вход' : 'Регистрация' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div v-if="!isLoginMode" class="form-group">
        <label for="name">Имя</label>
        <input
          v-model="formData.name"
          type="text"
          id="name"
          required
          placeholder="Ваше имя"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="formData.email"
          type="email"
          id="email"
          required
          placeholder="example@mail.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Пароль</label>
        <input
          v-model="formData.password"
          type="password"
          id="password"
          required
          placeholder="Не менее 6 символов"
          minlength="6"
        />
      </div>

      <div v-if="!isLoginMode" class="form-group">
        <label for="confirmPassword">Подтвердите пароль</label>
        <input
          v-model="formData.confirmPassword"
          type="password"
          id="confirmPassword"
          required
          placeholder="Повторите пароль"
          minlength="6"
        />
        <p v-if="!passwordsMatch" class="error">Пароли не совпадают!</p>
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
      </button>

      <p class="toggle-mode" @click="toggleMode">
        {{ isLoginMode ? 'У меня нет аккаунта' : 'У меня есть аккаунт' }}
      </p>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import api from '../api/axios.js'
import router from '../router/index.js';

const isLoginMode = ref(true);
const isLoading = ref(false);
const error = ref('');

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

onBeforeMount(async () => {
    try {
        await api.get('/users')
        window.location.href = '/'
    } catch (error) {
        console.log(error)
    }
})

const passwordsMatch = computed(() => {
  return formData.value.password === formData.value.confirmPassword;
});

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  error.value = '';
};

const handleSubmit = async () => {
  if (!isLoginMode.value && !passwordsMatch.value) {
    error.value = 'Пароли не совпадают!';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const url = isLoginMode.value
      ? '/auth/login'
      : '/auth/register';

    const payload = isLoginMode.value
      ? { email: formData.value.email, password: formData.value.password }
      : { name: formData.value.name, email: formData.value.email, password: formData.value.password };

    const response = await api.post(url, payload);

    

    if (!isLoginMode.value) {
      formData.value = { name: '', email: '', password: '', confirmPassword: '' };
    }

    if (isLoginMode.value) {
        localStorage.setItem('token', response.data)
    } 

    window.location.reload()
  } catch (err) {
    error.value = err.response?.data?.error || 'Произошла ошибка';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
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

.toggle-mode {
  margin-top: 15px;
  color: #42b983;
  text-decoration: underline;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>