<template>
  <div class="app">
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
    <div class="app__header">
      <Header>HEADER</Header>
    </div>
    <Card class="app__chart">
      <template #content><CategoryChart></CategoryChart></template>
    </Card>
    <Card class="app__income"
      ><template #title>INCOME </template
      ><template #content> <Skeleton class="mb-2"></Skeleton> </template
    ></Card>
    <Card class="app__expenses"><template #title>EXPENSES</template></Card>
    <Card class="app__categories">
      <template #content>CATEGORIES-SUMMARY</template>
      <!-- <div v-for="category of categoryMetadata.categories">
        <img v-bind:src="category.iconUrl" />
        {{ category.id }}: {{ category.text }}
      </div> -->
    </Card>
    <Card class="app__transactions">
      <template #content><Transactions></Transactions></template>
    </Card>
  </div>
</template>

<script setup lang="ts"></script>

<style>
@import url("./app.css");
</style>
