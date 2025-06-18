<script setup>

</script>

<template>
  <nav>
    <div>
        <router-link class="link" to="/">Главная</router-link> 
        <router-link class="link" to="/projects">Проекты</router-link> 
        <router-link class="link" to="/auth">Вход</router-link>
    </div>
    
  </nav>
  
  <router-view />
</template>

<style scoped>
nav {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    box-shadow: 0 0 10px black;
    padding: 10px 0;

    div {
        width: 40%;
        display: flex;
        justify-content: space-between;
    }
}

.link {
    color: black;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
}
</style>
