<template>

  <main>
    <div class="box box-input" v-if="!outputURI">
      <input type="url" v-model="inputURI" placeholder="Copia aquí tu URL larga" />
      <button class="createlink button -position" @click="postURL()">Crear URL</button>
    </div>
    <div class="box box-output" v-if="outputURI">
      <input v-model="outputURI" type="text" id="output_url" />
      <button class="copytext button -position" @click="copyURL()">Copiar URL</button>
    </div>
    <div class="box box-again" v-if="outputURI">
      <button class="-wide -centered button" @click="clearURL()">Acortar otra URL</button>
    </div>
  </main>

</template>

<script>

import axios from 'axios'

const environment = process.env.NODE_ENV

export default {
  name: 'Form',
  data: () => ({
    inputURI: '',
    outputURI: ''
  }),
  methods: {
    postURL: function() {

      let options = {
        method: 'POST',
        uri: '/.netlify/functions/post',
        data: {
          uri: this.inputURI
        }
      }

      if (environment === 'development') {
        options = {
          method: 'GET',
          uri: 'http://localhost:3000/uri',
          data: {
            uri: this.inputURI
          }
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
          if (response && response.status === 200) {
            this.outputURI = `${window.location.protocol}//${window.location.host}${response.data}`
          }
        })
        .catch(error => {
          console.error(error)
        })
      }
    },
    copyURL: function () {
      let successful = null

      if (this.outputURI !== '') {
        const outputURL = document.querySelector('#output_url')
        outputURI.select()
        successful = document.execCommand('copy')
      }
    },
    clearURL: function () {
      this.inputURI = ''
      this.outputURI = ''
    },
    checkUrl: function (url) {
      // eslint-disable-next-line
      return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url)
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
.button:hover {
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
@media (max-width: 800px) {
  .-position {
    top: 100%;
  }
}
.box-again {
  text-align: center;
}
</style>
