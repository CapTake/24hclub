<template>
  <div id="app">
    <div class="flex flex-col justify-center items-center h-screen">
      <div class="flex flex-col bg-gray-800 mx-4 rounded overflow-hidden shadow-lg">
        <div class="flex flex-col justify-end w-80 h-80 sm:w-96 sm:h-96 relative bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400" :style="style">
          <div class="flex flex-row text-white justify-between items-center text-3xl sm:text-4xl font-time p-8 sm:p-10 font-bold" style="text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.55);">
            <div>{{ domain }}</div>
            <div class="w-12 text-center">{{seconds}}</div>
          </div>
        </div>
        <div class="flex flex-row items-center gap-4 justify-center py-4 z-10 bg-gray-800">
          <a v-if="twitter" :href="twitter" target="_blank" rel="noopener nofollow" class="flex justify-center items-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 4 50 40" class="h-6 w-6 md:w-8 md:h-8">
              <path d="M 50.0625 10.4375 C 48.214844 11.257813 46.234375 11.808594 44.152344 12.058594 C 46.277344 10.785156 47.910156 8.769531 48.675781 6.371094 C 46.691406 7.546875 44.484375 8.402344 42.144531 8.863281 C 40.269531 6.863281 37.597656 5.617188 34.640625 5.617188 C 28.960938 5.617188 24.355469 10.21875 24.355469 15.898438 C 24.355469 16.703125 24.449219 17.488281 24.625 18.242188 C 16.078125 17.8125 8.503906 13.71875 3.429688 7.496094 C 2.542969 9.019531 2.039063 10.785156 2.039063 12.667969 C 2.039063 16.234375 3.851563 19.382813 6.613281 21.230469 C 4.925781 21.175781 3.339844 20.710938 1.953125 19.941406 C 1.953125 19.984375 1.953125 20.027344 1.953125 20.070313 C 1.953125 25.054688 5.5 29.207031 10.199219 30.15625 C 9.339844 30.390625 8.429688 30.515625 7.492188 30.515625 C 6.828125 30.515625 6.183594 30.453125 5.554688 30.328125 C 6.867188 34.410156 10.664063 37.390625 15.160156 37.472656 C 11.644531 40.230469 7.210938 41.871094 2.390625 41.871094 C 1.558594 41.871094 0.742188 41.824219 -0.0585938 41.726563 C 4.488281 44.648438 9.894531 46.347656 15.703125 46.347656 C 34.617188 46.347656 44.960938 30.679688 44.960938 17.09375 C 44.960938 16.648438 44.949219 16.199219 44.933594 15.761719 C 46.941406 14.3125 48.683594 12.5 50.0625 10.4375 Z"/>
            </svg>
          </a>
          <a :href="site" target="_blank" rel="noopener nofollow" class="flex justify-center items-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:w-14 md:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </a>
        </div>
      </div>
      <div class="py-4 text-2xl text-gray-500  font-body">
        Tezos 24h club
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const REGISTRY = '1264'

const ipfsLink = (uri) => uri.startsWith('ipfs://') ? `https://cloudflare-ipfs.com/ipfs/${uri.replace('ipfs://','')}` : uri

const str2hex = (str) => {
    let result = ''
    for (let i = 0; i < str.length; i++) {
        result += ('0' + str.charCodeAt(i).toString(16)).slice(-2)
    }
    return result.toLowerCase()
}
// const hex2str = (hex) => {
//     let str = ''
//     for (var i = 0; i < hex.length; i += 2) {
//         str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
//     }
//     return str
// }

export default {
  name: 'tez24h',
  computed: {
    domain () {
      const hour = ('0' + this.h).slice(-2)
      const minutes = ('0' + this.m).slice(-2)
      return `${hour}h${minutes}.tez`
    },
    seconds () {
      return `0${this.s}`.slice(-2)
    },
    domainBuyLink () {
      return this.domainNft ? `https://objkt.com/asset/tezosdomains/${this.domainNft}` : ''
    },
    twitter () {
      return this.owner.twitter ? `https://twitter.com/${this.owner.twitter}` : ''
    },
    site () {
      return this.owner.site || (this.address ? `https://objkt.com/profile/${this.address}/created` : `https://app.tezos.domains/domain/${this.domain}`)
    },
    token () {
      if (this.art.length === 0) return
      const delay = 60 / this.art.length
      const { contract, tokenId, metadata } = this.art[Math.floor(this.s / delay)]
      return {
        tokenId,
        contract,
        uri: ipfsLink(metadata.displayUri || metadata.thumbnailUri),
        name: metadata.name || ''
      }
    },
    style () {
      if (!this.token) return {}
      return {
        'background-image': `url('${this.token.uri}')`,
        'background-position': 'center center',
        'background-size': 'cover'
      }
    }
  },
  watch: {
    m: {
      handler () {
        this.load()
      },
      immediate: true
    }
  },
  data () {
    return {
      init: false,
      h: 0,
      m: 0,
      s: 0,
      art: [],
      domainNft: 0,
      address: '',
      owner: {}
    }
  },
  created () {
    const tick = () => {
      const d = new Date()
      this.h = d.getHours()
      this.m = d.getMinutes(),
      this.s = d.getSeconds(),
      this.init = true
      setTimeout(tick, 1000)
    }
    tick()
  },
  methods: {
    async load () {
      if (!this.init) return
      const domain = this.domain
      this.art.splice(0)
      let params = {
        active: true,
        'select.values': 'value',
        limit: 1,
        key: str2hex(domain)
      }
      const { data } = await axios.get(`https://api.tzkt.io/v1/bigmaps/${REGISTRY}/keys`, { params })
      this.domainNft = data.tzip12_token_id || 0
      this.address = data[0]?.address || ''
      if (!this.address) {
        return
      }
      params = {
        account: this.address,
        'token.metadata.decimals': 0,
        'balance.gt': 0,
        'select': 'token',
        limit: 6,
      }
      let res = await axios.get(`https://api.tzkt.io/v1/tokens/balances`, { params })
      console.log(res.data)
      this.$set(this, 'art', res.data.filter(token => !!token.metadata?.artifactUri))
      res = await axios.get(`https://api.tzkt.io/v1/accounts/${this.address}/metadata`)
      this.$set(this, 'owner', res.data || {})
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
