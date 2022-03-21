<template>
  <transition name="slideLeft">
    <div v-if="$store.state.NotificationDrawer" class="ui left notification-bar vertical inverted sidebar visible" style="padding: 0.5em; z-index: 105">
      <h3 class="ui white header">
        <!--        <span style="background: #cccccc; padding-left: 0.3em; padding-right: 0.2em"> NOTIFICATIONS? </span><br>-->
        <!--        <span style="background: #cccccc; padding-left: 0.3em; padding-right: 0.2em"> YET UNAVAILABLE. </span>-->
      </h3>
      <div v-if="false" class="ui small inverted feed">
        <div class="event">
          <div class="content">
            <div class="summary">
              You posted on your friend <a>Stevie Feliciano's</a> wall.
              <div class="date">
                Today
              </div>
            </div>
          </div>
        </div>
        <div class="event">
          <div class="content">
            <div class="summary">
              You posted on your friend <a>Stevie Feliciano's</a> wall.
              <div class="date">
                Today
              </div>
            </div>
          </div>
        </div>
        <div class="event">
          <div class="content">
            <div class="summary">
              You posted on your friend <a>Stevie Feliciano's</a> wall.
              <div class="date">
                Today
              </div>
            </div>
          </div>
        </div>
        <div class="event">
          <div class="content">
            <div class="summary">
              You posted on your friend <a>Stevie Feliciano's</a> wall.
              <div class="date">
                Today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AppNotifications'
}
</script>

<style scoped>

.notification-bar {
    background: rgba(3, 1, 25, 0.8) !important;
    border-right: 2px solid rgba(255, 255, 255, 0.2) !important;;
}

</style>
