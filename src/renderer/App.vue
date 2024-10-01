<template>
  <div>
    <FileSelector @selected="runTests"/>
    <TestResult v-if="testResults" :results="testResults"/>
  </div>
</template>

<script>
import FileSelector from './components/FileSelector.vue';
import TestResult from './components/TestResult.vue';
export default {
  data() {
    return {
      testResults: null,
    };
  },
  methods: {
    async runTests(selectedFiles) {
      const result = await window.ipcRenderer.invoke('run-tests', selectedFiles);
      this.testResults = result;
    },
  },
  components: {
    FileSelector,
    TestResult,
  },
};
</script>
