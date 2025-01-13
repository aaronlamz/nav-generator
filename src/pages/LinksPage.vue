<template>
  <div class="p-4 sm:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <h1 class="text-2xl sm:text-4xl font-bold mb-6 dark:text-white text-center sm:text-left">
      {{ title }}
    </h1>
    <div class="space-y-8">
      <div
        v-for="group in items"
        :key="group.link"
        :id="group.link.substring(1)"
        class="group-container bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
      >
        <h2 class="text-lg sm:text-2xl font-semibold mb-4 dark:text-gray-200">
          {{ group.text }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="item in group.items"
            :key="item.link"
            class="card bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition"
          >
            <img
              v-if="item.icon"
              :src="item.icon"
              alt=""
              class="w-10 h-10 flex-shrink-0"
            />
            <i
              v-else
              class="fas fa-folder text-green-500 w-10 h-10 flex-shrink-0"
            ></i>
            <a
              :href="item.link"
              target="_blank"
              class="flex-1 text-sm sm:text-base text-gray-800 dark:text-gray-200"
            >
              <div class="font-medium">{{ item.text }}</div>
              <p class="text-gray-500 dark:text-gray-400">
                {{ item.description || 'No description available.' }}
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue'

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },
  watch: {
    $route(to) {
      this.scrollToAnchor(to.hash)
    },
  },
  mounted() {
    this.scrollToAnchor(this.$route.hash)
  },
  methods: {
    scrollToAnchor(hash) {
      if (hash) {
        const decodedHash = decodeURIComponent(hash)
        nextTick(() => {
          const element = document.getElementById(decodedHash.replace('#', ''))
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        })
      }
    },
  },
}
</script>

<style scoped>
.card {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  background-image: linear-gradient(135deg, #ff7e5f, #feb47b);
}

/* 针对小屏幕的优化样式 */
.group-container {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.group-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 640px) {
  .card {
    flex-direction: column;
    text-align: center;
  }
}
</style>