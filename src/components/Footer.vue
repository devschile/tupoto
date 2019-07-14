<template>
  <footer class="box-foot">
    <p>
      © 2017 - {{ currentYear }} por y para
      <a href="https://www.devschile.cl/">devsChile</a>.
      <a href="https://github.com/devschile/tupoto/">GitHub</a>. Licencia:
      <a href="https://opensource.org/licenses/MIT">MIT</a>.
    </p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data: () => ({
    currentYear: new Date().getFullYear()
  })
}
</script>

<style scoped>
.box-foot p {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: #666;
}
@media (max-width: 800px) {
  .box-foot p {
    margin-top: 60px;
  }
}
</style>
