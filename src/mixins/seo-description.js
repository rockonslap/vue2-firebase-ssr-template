function getSEODescription(vm) {
  const { seoDescription } = vm.$options;
  if (seoDescription) {
    return typeof seoDescription === 'function' ? seoDescription.call(vm) : seoDescription;
  }
}

const serverSEODescriptionMixin = {
  created() {
    const seoDescription = getSEODescription(this);
    if (seoDescription !== undefined) {
      this.$ssrContext.description = seoDescription;
    }
  },
};

const clientSEODescriptionMixin = {
  mounted() {
    const seoDescription = getSEODescription(this);
    if (seoDescription !== undefined) {
      $('meta[name="description"]').attr('content', seoDescription);
      $('meta[property="og:description"]').attr('content', seoDescription);
    }
  },
};

export default process.server ? serverSEODescriptionMixin : clientSEODescriptionMixin;
