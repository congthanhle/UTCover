<template>
  <div class="card">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Text</Tab>
        <Tab value="1">Form</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <DataTextInput />
        </TabPanel>
        <TabPanel value="1">
          <DataFormInput />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import DataFormInput from '@pages/DataSample/DataFormInput.vue';
import DataTextInput from '@pages/DataSample/DataTextInput.vue';

</script>

<style scoped></style>