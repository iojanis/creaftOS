<template>
  <div class="">
    <div class="absolute top-0 bottom-0 left-0 right-0 pt-12 md:pt-28 z-20 text-center flex justify-center">
      <div class="masthead">
        <h1 class="text-3xl ui inverted header" style="color: #fbbd08!important;">
          {{ $config.serverName }}
        </h1>
        <h2 style="font-family: MinecraftiaRegular; margin-top: -0.5em;">
          {{ $config.serverDescriptionShort }}
        </h2>
        <div class="ui text container mx-auto pt-8 ">
          <p class="mx-auto relative text-xl text-center max-w-sm mb-2">
            {{  $config.serverDescriptionLong }}
          </p>
<!--          <p class="text-justify mb-4">-->
<!--            We could use some help! This Minecraft server is meant to be collaborative. Think of it as a micro-society managed by an intelligent computer system. Creaft is open source and provides the website you are on and a Minecraft server connected to it. Through it, you can trade items, buy properties via a map, chat, and more.-->
<!--          </p>-->

          <p class="text-center mt-8">
            What are you waiting for? Connect to <span class="bg-gray-500/30 rounded-sm px-2 py-1 mr-1 select-all">{{ $config.serverUrl }}</span>!
          </p>
<!--                  <iframe class="w-full mt-12 mb-4 shadow-xl rounded-md aspect-video" src="https://youtube.com/embed/u9RHrXgy-i0?autoplay=1"></iframe>-->

          <div v-if="!$auth.loggedIn" class="item mt-2">
            You can
            <nuxt-link to="/login">
              <span style="color: #ffffff;  margin-top: 8px"> Login</span>
            </nuxt-link>
            or
            <nuxt-link to="/join">
              <span style="color: #ffffff;  margin-top: 8px">Create an Account</span>
            </nuxt-link>
          </div>
          <div class="m-2 p-4">
            <a href="https://github.com/iojanis/CraftOS" target="_blank" class="item ui inverted basic large button">
              Read the Handbook!
            </a>
          </div>
          <div class="mt-4">
            <nuxt-link to="chat" class="item ui inverted basic button mt-2">
              Chat
            </nuxt-link>
            <a href="https://discord.gg/UHyU5ptRcG" target="_blank" style="background: #5865F2!important;" class="item ui inverted basic button mt-2">
              Discord
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="ui center aligned home">
      <div class="ui vertical inverted masthead bg texshad center aligned segment second blurred" />
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  data () {
    return {
      stats: [],
    }
  }
}
</script>

<style>
.masthead.segment {
  min-height: 600px;
  padding: 1em 0em;
}
.masthead h1.ui.header {
  font-size: 4em;
  font-weight: normal;
}
.masthead h2 {
  font-size: 1.7em;
  font-weight: normal;
}

.ui.vertical.stripe {
  padding: 8em 0em;
}

@media only screen and (max-width: 700px) {
  .masthead.segment {
    min-height: 350px;
  }
  .masthead h1.ui.header {
    font-size: 2em;
    margin-top: 1.5em;
  }
  .masthead h2 {
    margin-top: 0.5em;
    font-size: 1.5em;
  }
}

#logo:hover svg:first-child {
  fill: #fff !important;
}

.bg {
  text-shadow: 5px 5px 13px rgba(0, 0, 0, 1);
  -webkit-text-shadow: 5px 5px 13px rgba(0, 0, 0, 1);
  -moz-text-shadow: 5px 5px 13px rgba(0, 0, 0, 1);
  width: 100%;
  height: 100vh;
  overflow: hidden;

  background-color: #000033;
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -o-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  transform-style: preserve-3d;

  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);

  -ms-transition: background-color 3s ease-in-out 2s;
  -moz-transition: background-color 3s ease-in-out 2s;
  -webkit-transition: background-color 3s ease-in-out 2s;
  transition: background-color 3s ease-in-out 2s;

  -webkit-perspective: 2000px;
  -moz-perspective: 2000px;
  -o-perspective: 2000px;
  -ms-perspective: 2000px;
  perspective: 2000px;
}
.bg:after {
  position: absolute;
  z-index: -100;
  width: 135%;
  height: 170%;
  top: 0%;
  left: 0;
  bottom: 0;
  content: "";
  opacity: 0.25 !important;
  background: url("Minecraft_Items.jpg");
  background-position: right;

  -moz-transform-origin: 50% 50%;
  -o-transform-origin: 50% 50%;
  -ms-transform-origin: 50% 50%;
  transform-origin: 50% 50%;

  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -o-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  transform-style: preserve-3d;

  -webkit-animation-name: splash;
  -moz-animation-name: splash;
  -o-animation-name: splash;
  animation-name: splash;

  -ms-transition: opacity 3s ease-in-out, transform 5s ease-in-out;
  -webkit-transition: opacity 3s ease-in-out, transform 5s ease-in-out;
  -moz-transition: opacity 3s ease-in-out, transform 5s ease-in-out;
  transition: opacity 3s ease-in-out, transform 5s ease-in-out;

  -webkit-animation-duration: 25s;
  -moz-animation-duration: 25s;
  -ms-animation-duration: 25s;
  -o-animation-duration: 25s;
  animation-duration: 25s;

  -webkit-animation-fill-mode: both;
  -moz-animation-fill-mode: both;
  -ms-animation-fill-mode: both;
  -o-animation-fill-mode: both;
  animation-fill-mode: both;

  animation-timing-function: linear;
  -webkit-animation-timing-function: linear;

  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;

  -webkit-transform: rotateX(50deg) rotateZ(0deg) rotateY(0deg) translateY(-14%)
    translateX(-14%) translateZ(370px);
  -moz-transform: rotateX(50deg) rotateZ(0deg) rotateY(0deg) translateY(-14%)
    translateX(-14%) translateZ(370px);
  transform: rotateX(50deg) rotateZ(0deg) rotateY(0deg) translateY(-14%)
    translateX(-14%) translateZ(370px);
}

@keyframes splash {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% -941px;
  }
}

@-moz-keyframes splash {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% -941px;
  }
}

@-webkit-keyframes splash {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% -941px;
  }
}

@-ms-keyframes splash {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% -941px;
  }
}

@-o-keyframes splash {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% -941px;
  }
}
</style>
