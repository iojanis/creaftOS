<template>
  <div class="ui inverted container normal-font pt-16 pb-32">
    <div class="ui inverted middle aligned list">
      <div class="item" style="margin-top: 1em; padding-bottom: 1em;">
        <div class="header content">
          <strong>USER RELATED INFORMATION</strong>
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          {{ $store.state.username }}
        </div>
        <div class="content">
          Username
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          {{ $store.state.isConnected }}
        </div>
        <div class="content">
          Socket Connection
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          {{ $store.state.isOnline }}
        </div>
        <div class="content">
          Game Connection
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          {{ ($store.state.currentExp).toFixed(2) }}°
        </div>
        <div class="content">
          currentExp
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          {{ $store.state.bountyStatus }}
        </div>
        <div class="content">
          bountyStatus
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          {{ $store.state.currentTeam }}
        </div>
        <div class="content">
          currentTeam
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          <div class="ui inverted input">
            <!-- eslint-disable-next-line -->
            <textarea>{{ json($store.state.currentItems) }}</textarea>
          </div>
        </div>
        <div class="content">
          currentItems
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          <div class="ui inverted input">
            <!-- eslint-disable-next-line -->
            <textarea>{{ json($store.state.currentMarketItems) }}</textarea>
          </div>
        </div>
        <div class="content">
          currentMarketItems
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          <div class="ui inverted input">
            <!-- eslint-disable-next-line -->
            <textarea>{{ json($store.state.onlinePlayers) }}</textarea>
          </div>
        </div>
        <div class="content">
          onlinePlayers
        </div>
      </div>
      <div class="item">
        <div class="right floated content">
          <div class="ui inverted input">
            <!-- eslint-disable-next-line -->
            <textarea>{{ json($store.state.latestMessages) }}</textarea>
          </div>
        </div>
        <div class="content">
          latestMessages
        </div>
      </div>

      <div class="item" style="margin-top: 1em; padding-bottom: 1em;">
        <div class="header content">
          <strong>USER RELATED COMMANDS</strong>
        </div>
      </div>

      <div class="inverted item">
        <form class="ui inverted form" @submit.prevent="sendChatMessage">
          <div class="right floated content">
            <div class="ui inverted input">
              <button class="ui inverted icon basic button" type="submit">
                <i class="bolt icon"/>
              </button>
            </div>
          </div>
          <div class="white content">
            <span style="color: white">send-chat-message</span>
            <div class="ui inverted input">
              <input v-model="chatMessage" placeholder="message">
            </div>
          </div>
        </form>
      </div>

      <div class="inverted item">
        <div class="right floated content">
          <div class="ui inverted input">
            <button class="ui inverted icon basic button" type="submit" @click="uploadExp">
              <i class="arrow up icon"/> 11°
            </button>
            <button class="ui inverted icon basic button" type="submit" @click="downloadExp">
              <i class="arrow down icon"/> 11°
            </button>
          </div>
        </div>
        <div class="content">
          <span style="color: white">upload-exp / download-exp</span>
        </div>
      </div>

      <div class="inverted item">
        <form class="ui inverted form" @submit.prevent="transferExp">
          <div class="right floated content">
            <div class="ui inverted input">
              <button class="ui inverted icon basic button" type="submit">
                <i class="bolt icon"/>
              </button>
            </div>
          </div>
          <div class="white content">
            <span style="color: white">transfer-exp</span>
            <div class="ui inverted input">
              <input v-model="expReceiver" placeholder="receiver">
            </div>
            <div class="ui inverted input">
              <input v-model="expAmount" placeholder="amount">
            </div>
          </div>
        </form>
      </div>

      <div class="inverted item">
        <form class="ui inverted form" @submit.prevent="createTeam">
          <div class="right floated content">
            <div class="ui inverted input">
              <button class="ui inverted icon basic button" type="submit">
                <i class="bolt icon"/>
              </button>
            </div>
          </div>
          <div class="white content">
            <span style="color: white">create-team</span>
            <div class="ui inverted input">
              <input v-model="teamName" placeholder="Team Name">
            </div>
          </div>
        </form>
      </div>

      <div class="inverted item">
        <form class="ui inverted form" @submit.prevent="changeTeam">
          <div class="right floated content">
            <div class="ui inverted input">
              <button class="ui inverted icon basic button" type="submit">
                <i class="bolt icon"/>
              </button>
            </div>
          </div>
          <div class="white content">
            <span style="color: white">change-team</span>
            <div class="ui inverted input">
              <input v-model="teamName" placeholder="Team Name">
            </div>
          </div>
        </form>
      </div>

      <div class="inverted item">
        <form class="ui inverted form" @submit.prevent="joinTeam">
          <div class="right floated content">
            <div class="ui inverted input">
              <button class="ui inverted icon basic button" type="submit">
                <i class="bolt icon"/>
              </button>
            </div>
          </div>
          <div class="white content">
            <span style="color: white">joinTeam</span>
            <div class="ui inverted input">
              <input v-model="teamName" placeholder="Team Name">
            </div>
          </div>
        </form>
      </div>

      <div class="inverted item">
        <form class="ui inverted form" @submit.prevent="leaveTeam">
          <div class="right floated content">
            <div class="ui inverted input">
              <button class="ui inverted icon basic button" type="submit">
                <i class="bolt icon"/>
              </button>
            </div>
          </div>
          <div class="white content">
            <span style="color: white">leaveTeam</span>
          </div>
        </form>
      </div>

      <div class="inverted item">
        <form class="ui inverted form" @submit.prevent="addToTeam">
          <div class="right floated content">
            <div class="ui inverted input">
              <button class="ui inverted icon basic button" type="submit">
                <i class="bolt icon"/>
              </button>
            </div>
          </div>
          <div class="white content">
            <span style="color: white">addToTeam</span>
            <div class="ui inverted input">
              <input v-model="teamPlayer" placeholder="Team Player">
            </div>
          </div>
        </form>
      </div>

      <div class="inverted item">
        <form class="ui inverted form" @submit.prevent="removeFromTeam">
          <div class="right floated content">
            <div class="ui inverted input">
              <button class="ui inverted icon basic button" type="submit">
                <i class="bolt icon"/>
              </button>
            </div>
          </div>
          <div class="white content">
            <span style="color: white">removeFromTeam</span>
            <div class="ui inverted input">
              <input v-model="teamPlayer" placeholder="Team Player">
            </div>
          </div>
        </form>
      </div>

      <div class="inverted item">
        <form class="ui inverted form" @submit.prevent="createZone">
          <div class="right floated content">
            <div class="ui inverted input">
              <button class="ui inverted icon basic button" type="submit">
                <i class="bolt icon"/>
              </button>
            </div>
          </div>
          <div class="white content">
            <span style="color: white">createZone</span>
            <div class="ui inverted input">
              <input v-model="zoneName" placeholder="Zone Name">
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  auth: true,
  layout: 'default',
  data() {
    return {
      chatMessage: '',
      teamName: '',
      zoneName: '',
      teamPlayer: '',
      expAmount: '',
      expReceiver: ''
    }
  },
  mounted() {

  },
  methods: {
    json(input) {
      return JSON.stringify(input)
    },
    sendChatMessage() {
      this.$socket.emit('send-chat-message', this.chatMessage)
      this.chatMessage = ''
    },
    uploadExp() {
      this.$socket.emit('upload-exp')
    },
    downloadExp() {
      this.$socket.emit('download-exp')
    },
    transferExp() {
      this.$socket.emit('transfer-exp', this.expReceiver, this.expAmount)
    },
    createTeam() {
      this.$socket.emit('create_team', this.teamName)
    },
    joinTeam() {
      this.$socket.emit('join_team', this.teamName)
    },
    leaveTeam() {
      this.$socket.emit('leave_team')
    },
    changeTeam() {
      this.$socket.emit('change_team', this.teamName)
    },
    addToTeam() {
      this.$socket.emit('add_to_team', this.teamPlayer)
    },
    removeFromTeam() {
      this.$socket.emit('remove_from_team', this.teamPlayer)
    },
    createZone() {
      this.$socket.emit('create_zone', this.zoneName)
    }
  }
}
</script>
