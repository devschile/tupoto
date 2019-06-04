<template>
  <main>
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="!outputURI"
        class="box box-input"
      >
        <input
          v-model="inputURI"
          type="url"
          :class="checkUrl() === false ? 'error' : ''"
          placeholder="Copia aquí tu URL larga"
        >
        <button
          class="createlink button -position"
          :disabled="!inputURI"
          @click="postURL()"
        >
          Crear URL
        </button>
      </div>
    </transition>
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="outputURI"
        class="box box-output"
      >
        <p class="originalURI">
          URL original: <pre><code>{{ inputURI }}</code></pre>
        </p>
        <input
          id="output_url"
          v-model="outputURI"
          type="url"
          class="success"
        >
        <button
          class="copytext button -position"
          @click="copyURL()"
        >
          Copiar URL
        </button>
        <div class="box box-again">
          <button
            class="-wide -centered button"
            @click="clearURL()"
          >
            Acortar otra URL
          </button>
        </div>
      </div>
    </transition>
  </main>
</template>

<script>

import axios from 'axios'
import isURL from 'validator/lib/isURL'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  name: 'Form',
  data: () => ({
    inputURI: '',
    outputURI: ''
  }),
  methods: {
    // eslint-disable-next-line require-jsdoc
    postURL: function () {
      let options = {
        method: 'POST',
        uri: '/.netlify/functions/post',
        data: {
          uri: this.inputURI
        }
      }

      if (this.inputURI !== '' && this.checkUrl(this.inputURI)) {
        axios(
          {
            method: options.method,
            url: options.uri,
            data: options.data
          })
          .then(response => {
            // eslint-disable-next-line promise/always-return
            if (response && response.status === 201) {
              this.outputURI = response.data
            }
          }).catch(err => {
            if (isProduction) {
              this.$raven.captureException(err)
            } else {
              // eslint-disable-next-line no-console
              console.error(err)
            }
          })
      }
    },
    // eslint-disable-next-line require-jsdoc
    copyURL: function () {
      let outputURI = document.querySelector('#output_url')

      if (this.outputURI !== '') {
        outputURI.select()
        outputURI = document.execCommand('copy')
      }
    },
    // eslint-disable-next-line require-jsdoc
    clearURL: function () {
      this.inputURI = ''
      this.outputURI = ''
    },
    // eslint-disable-next-line require-jsdoc
    checkUrl: function (url) {
      return isURL(url || '')
    }
  }
}

</script>

<style scoped>

input {
  position: relative;
  display: block;
  padding: 25px;
  padding-right: 100px;
  width: 450px;
  line-height: 20px;
  font-size: 20px;
  font-weight: normal;
  letter-spacing: 0em;
  border: 0px;
  transition: all 0.3s cubic-bezier(.55, 0, .1, 1);
}
input.error {
  outline: 2px solid red;
}
input.success {
  outline: 2px solid #46ad79;
}
@media (max-width: 800px) {
  input {
    width: 80%;
  }
}
input:focus {
  outline: none;
}
input:focus~button {
  right: -20px;
}
@media (max-width: 800px) {
  input:focus~button {
    right: 0;
  }
}
::selection {
  color: #2d2d2d;
  background: rgba(94, 223, 158, 0.5);
}
::-moz-selection {
  color: #2d2d2d;
  background: rgba(94, 223, 158, 0.5);
}
.box {
  position: relative;
  margin-top: 30px;
}
.button {
  padding: 10px 30px;
  border: 0px;
  cursor: pointer;
  font-size: 16px;
  color: white;
  background: #5EDF9E;
  line-height: 20px;
  outline: 0;
}
.button[disabled] {
  background: #ccc;
  cursor: default;
}
.button:not([disabled]):hover {
  background-color: #46ad79;
}
.-position {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(25%, -50%);
  transition: all 0.3s cubic-bezier(.55, 0, .1, 1);
  overflow: hidden;
}
.originalURI {
  overflow-x: auto;
}
  .originalURI code {
    padding: .3rem;
    background-color: rgba(255,255,0,0.3);
  }
@media (max-width: 800px) {
  .-position {
    top: 100%;
  }
}
.box-again {
  text-align: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
