import { genTitle } from '../library/title';

function getTitle(vm) {
  const { title } = vm.$options;
  if (title) {
    return typeof title === 'function' ? title.call(vm) : title;
  }
}

const serverTitleMixin = {
  created() {
    const title = getTitle(this);
    if (title) {
      this.$ssrContext.title = genTitle(title);
    }
  },
};

const clientTitleMixin = {
  mounted() {
    const title = getTitle(this);
    if (title) {
      document.title = genTitle(title);
    }
  },
};

export default process.server ? serverTitleMixin : clientTitleMixin;
