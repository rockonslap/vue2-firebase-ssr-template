function getSEOImage(vm) {
  const { seoImage } = vm.$options;
  if (seoImage) {
    return typeof seoImage === 'function' ? seoImage.call(vm) : seoImage;
  }
}

const serverSEOImageMixin = {
  created() {
    const seoImage = getSEOImage(this);
    if (seoImage !== undefined) {
      this.$ssrContext.image = seoImage;
    }
  },
};

export default process.server ? serverSEOImageMixin : {};
