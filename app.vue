<template>
  <div class="app">
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
    <Card class="app__header">
      <template #content><Header /></template>
    </Card>
    <Card class="app__chart">
      <template #content><CategoryChart /></template>
    </Card>
    <Card class="app__totals"
      ><template #content> <Totals /> </template
    ></Card>
    <Card class="app__transactions">
      <template #content><Transactions /></template>
    </Card>
  </div>
</template>

<script setup lang="ts"></script>

<style>
@import url("./app.css");
</style>
