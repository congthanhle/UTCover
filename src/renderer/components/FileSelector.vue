<template>
  <div>
    <h2>Select Files to Test</h2>
    <ul>
      <li v-for="file in files" :key="file">
        <input type="checkbox" :value="file" v-model="selectedFiles"/> {{ file }}
      </li>
    </ul>
    <button @click="submit">Run Tests</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [], // List files from project folder (to be fetched from main process)
      selectedFiles: [],
    };
  },
  mounted() {
    this.fetchFiles();
  },
  methods: {
    fetchFiles() {
      // Fetch files from backend (Electron main process)
      window.ipcRenderer.invoke('get-files').then((files) => {
        this.files = files;
      });
    },
    submit() {
      this.$emit('selected', this.selectedFiles);
    },
  },
};
</script>
