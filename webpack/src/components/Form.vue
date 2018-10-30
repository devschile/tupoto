<template>

	<main>
		<div class="box box-input">
			<input id="input_url" type="url" placeholder="Copia aquí tu URL larga" />
			<button type="button" @click="postURL" class="createlink button -position">Crear URL</button>
		</div>
		<div class="box box-output">
			<input id="output_url" type="text" />
			<button type="button" @click="copyURL" class="copytext button -position">Copiar URL</button>
		</div>
			<div class="box box-again">
			<button type="button" @click="clearURL" class="-wide -centered button">Acortar otra URL</button>
		</div>
	</main>

</template>

<script>

export default {
	name: 'Form',
	data: () => ({
	}),
	methods: {
		postURL: function() {
			const inputURL = document.querySelector('#input_url')
			const outputURL = document.querySelector('#output_url')

			let url = inputURL.value
			this.currentSearch = url

			if (url !== '' && checkUrl(url) && outputURL.value === '') {
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
			const outputURL = document.querySelector('#output_url')
			if (outputURL.value !== '') {
				outputURL.select()
				try {
					let successful = null
					successful = document.execCommand('copy')
				} catch (err) {
					// error callback
				}
			}
		},
		clearURL: function () {
			const inputURL = document.querySelector('#input_url')
			const outputURL = document.querySelector('#output_url')
			inputURL.value = ''
			outputURL.value = ''
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
