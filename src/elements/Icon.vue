<template>
  <!-- bell -->
  <svg v-if="type === 'bell'" class="icon" width="20px" xmlns="http://www.w3.org/2000/svg" id="Layer_1"  viewBox="0 0 20 20">
    <defs />
    <path class="fil" fill="#ffca05" d="M10.83 17.5a.83.83 0 0 1-1.66 0v-.83H7.5v.83a2.5 2.5 0 0 0 5 0v-.83h-1.67zM19.17 13.33H17.5V6.67A6.66 6.66 0 0 0 10.83 0H9.17A6.66 6.66 0 0 0 2.5 6.67v6.66H.83a.84.84 0 0 0-.83.84.83.83 0 0 0 .83.83h18.34a.83.83 0 0 0 .83-.83.84.84 0 0 0-.83-.84zm-3.34 0H4.17V7.5a5.83 5.83 0 0 1 11.66 0z" />
  </svg>
</template>


<script>
  export default {
    props: {
      type: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style lang="less">
  @import "../assets/less/_mixin.less";
  @import "../assets/less/_variable.less";
</style>
