<template>
  <section class="wrapper -center">
    <Header />
    <Form />
    <Footer />
  </section>
</template>

<script>
import Header from './Header'
import Form from './Form'
import Footer from './Footer'

export default {
  name: 'Home',
  components: {
    Header,
    Form,
    Footer
  },
  data: () => ({})
}
</script>

<style>
[v-cloak] {
  display: none;
}
html {
  overflow: hidden;
}
body,
input {
  font-family: 'Oxygen Mono', monospace;
}
body {
  height: 100vh;
  background: rgba(255, 255, 255, 0.2);
  background: linear-gradient(
      to top,
      white,
      rgba(255, 255, 255, 0.2) 48%,
      transparent 100%
    ),
    linear-gradient(to left, #eee, #ccc);
}
.wrapper {
  width: 650px;
  margin: 0 auto;
}
@media (max-width: 800px) {
  body {
    background: #ddd;
  }
  .wrapper {
    width: 90%;
  }
}
.-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
a {
  color: #46ad79;
}
</style>
