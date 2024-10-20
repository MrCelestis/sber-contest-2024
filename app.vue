<template>
  <div class="app">
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
    <div class="app__header">
      <Header>HEADER</Header>
    </div>
    <div class="app__chart">CHART</div>
    <div class="app__income">INCOME</div>
    <div class="app__expenses">EXPENSES</div>
    <div class="app__categories">
      CATEGORIES-SUMMARY
      <div v-for="category of categoryMetadata.categories">
        <img v-bind:src="category.iconUrl" />
        {{ category.id }}: {{ category.text }}
      </div>
    </div>
    <div class="app__transactions">
        <Transactions></Transactions>
    </div>
    <footer class="app__footer">FOOTER</footer>
  </div>
</template>

<script setup lang="ts">
import { useCategoryMetadataStore } from './store/category-metadata';

const categoryMetadata = useCategoryMetadataStore();
await categoryMetadata.fetch();
</script>

<style>
@import url("./app.css");
</style>
