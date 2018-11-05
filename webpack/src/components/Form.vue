<template>

	<main>
		<div class="box box-input">
			<input type="url" v-model="inputURI" placeholder="Copia aquí tu URL larga" />
			<button class="createlink button -position" @click="postURL()">Crear URL</button>
		</div>
		<div class="box box-output">
			<input v-model="outputURI" type="text" />
			<button class="copytext button -position" @click="copyURL()">Copiar URL</button>
		</div>
			<div class="box box-again">
			<button class="-wide -centered button" @click="clearURL()">Acortar otra URL</button>
		</div>
	</main>

</template>

<script>

export default {
	name: 'Form',
	data: () => ({
		inputURI: null,
		outputURI: null
	}),
	methods: {
		postURL: function() {

			if (this.inputURI !== '' && this.checkUrl(this.inputURI) && this.outputURI === '') {
				this.$http.post('/.netlify/functions/post', {
					uri: url
				}).then(response => {
					this.returnedData = response.body
					outputURL.value = this.returnedData
					outputURL.focus()
					outputURL.select()
					this.currentSearch = ''
				}, response => {
					// error callback
				})
			}
		},
		copyURL: function () {
			let successful = null

			if (this.outputURI !== '') {
				this.outputURI.select()
				successful = document.execCommand('copy')
			}
		},
		clearURL: function () {
			this.inputURI = ''
			this.outputURI = ''
		},
      	checkUrl: function (url) {
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
