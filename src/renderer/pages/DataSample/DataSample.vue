<template>
  <div class="card">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Form</Tab>
        <Tab value="1">Text</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <DataFormInput />
        </TabPanel>
        <TabPanel value="1">
          <DataTextInput />
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

