<template>
  <div>
    <!-- 侧边栏 -->
    <transition name="slide">
      <aside
        v-if="isSidebarOpen || isDesktop"
        class="bg-gray-100 dark:bg-gray-800 w-64 sm:w-64 p-4 shadow-lg fixed sm:relative z-40 transition-transform transform"
        :class="{
          '-translate-x-full': !isSidebarOpen && !isDesktop,
          'translate-x-0': isSidebarOpen || isDesktop,
        }"
      >
        <ul class="space-y-2">
          <li v-for="(item, index) in sidebar" :key="item.link">
            <div
              class="flex items-center cursor-pointer justify-between"
              @click="toggleMenu(index)"
            >
              <div class="flex items-center">
                <img
                  v-if="item.icon"
                  :src="item.icon"
                  alt=""
                  class="w-5 h-5 mr-2"
                />
                <i
                  v-else
                  class="fas fa-folder text-blue-500 w-5 h-5 mr-2"
                ></i>
                <span
                  class="block text-gray-700 dark:text-gray-300 p-2 rounded flex-1"
                >
                  {{ item.text }}
                </span>
              </div>
              <i
                :class="expandedMenu[index] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
                class="text-gray-500"
              ></i>
            </div>
            <transition
              name="drawer"
              @before-enter="beforeEnter"
              @enter="enter"
              @leave="leave"
            >
              <ul
                v-show="expandedMenu[index]"
                class="ml-4 mt-2 space-y-2 submenu-list"
              >
                <li v-for="group in item.items" :key="group.link">
                  <a
                    @click="handleGroupClick(item.link, group.link)"
                    class="submenu-item block text-gray-600 dark:text-gray-400 p-2 rounded-md flex items-center cursor-pointer"
                  >
                    <img
                      v-if="group.icon"
                      :src="group.icon"
                      alt=""
                      class="w-4 h-4 mr-2"
                    />
                    <i
                      v-else
                      class="fas fa-folder-open text-gray-500 w-4 h-4 mr-2"
                    ></i>
                    {{ group.text }}
                  </a>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </aside>
    </transition>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";

export default {
  props: {
    sidebar: {
      type: Array,
      required: true,
    },
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
    toggleSidebar: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const expandedMenu = reactive({});
    const isDesktop = window.innerWidth >= 640;

    // 初始化菜单展开状态
    onMounted(() => {
      props.sidebar.forEach((item, index) => {
        expandedMenu[index] = item.expanded !== undefined ? item.expanded : true;
      });
    });

    return { expandedMenu, isDesktop };
  },
  methods: {
    toggleMenu(index) {
      this.expandedMenu[index] = !this.expandedMenu[index];
    },
    handleGroupClick(parentLink, groupLink) {
      const fullPath = `${parentLink}${groupLink}`;
      if (fullPath.startsWith("http")) {
        window.open(fullPath, "_blank");
      } else {
        this.$router.push(fullPath);
      }
      // 如果是移动端，关闭侧边栏
      if (!this.isDesktop) {
        this.toggleSidebar();
      }
    },
    beforeEnter(el) {
      el.style.maxHeight = "0";
      el.style.opacity = "0";
    },
    enter(el) {
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.opacity = "1";
    },
    leave(el) {
      el.style.maxHeight = "0";
      el.style.opacity = "0";
    },
  },
};
</script>

<style scoped>
.submenu-item {
  transition:
    background 0.3s ease,
    transform 0.3s ease,
    border-radius 0.3s ease;
  border-radius: 0.5rem;
}

.submenu-item:hover {
  background-image: linear-gradient(
    135deg,
    #e0eafc,
    #cfdef3
  );
}

.drawer-enter-active,
.drawer-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
}

.drawer-enter,
.drawer-leave-to {
  max-height: 0;
  opacity: 0;
}

.submenu-list {
  overflow: hidden;
}

@media (max-width: 640px) {
  aside {
    width: 100%;
  }
}

/* 移动端隐藏侧边栏 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>