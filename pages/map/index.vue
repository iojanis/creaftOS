<template>
  <div
    class="ui terminal inverted fluid container padded"
    style="padding-top: 7em!important;"
  >
    <div class="overlay">
      <div class="center">
        <div style="min-width: 300px;">
          <h3 class="ui white header">
            <span style="background: rgba(204,204,204,0.09); padding-left: 0.3em; padding-right: 0.2em"> MAP IS UNAVAILABLE.</span>
          </h3>
          <p>THE MAP IS UNDER DEVELOPMENT.</p>
          <p>PLEASE USE TEAMS FOR PROPERTY MANAGEMENT.</p>
          <p>THANK YOU FOR UNDERSTANDING.</p>
        </div>
      </div>
    </div>
    <!--<div class="ui top horizontal fixed inverted labeled sidebar overlay visible menu boldcraft second blurred" aria-haspopup="" style="position: fixed; width: 100%; z-index: 100;top: 3.4em!important; border-bottom: rgba(255, 255, 255, 0.07) 2px solid!important;">-->
    <!--<div class="ui container item" style="border: none!important; ">-->
    <!--<div class="ui form" style="width: 100%;">-->
    <!--<div class="ui big fluid transparent input" >-->
    <!--<div class="ui small inverted basic button">-->
    <!--<i class="plus icon light" style="margin-top: 0.3em; color: rgba(0, 0, 0, 0.34); margin-right: 0.5em;"/>-->
    <!--Buy Property-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

    <div id="mcmap" />
  </div>
</template>

<script>
/* eslint-disable */

export default {
  auth: false,
  data() {
    return {
      gx: 0,
      gz: 0,
      gy: 0
    }
  },
  mounted() {

  }
}
      // const Mapcrafter = new MapcrafterUI(CONFIG)
      //
      // Mapcrafter.init()
      // // Mapcrafter.addControl(new MapSelectControl(), "topright", 1);
      // // Mapcrafter.addControl(new RotationSelectControl(), "bottomright", 1);
      // Mapcrafter.addControl(new MousePosControl(), "bottomleft", 1);
      //
      // const MAPCRAFTER_MARKERS = [
      //   // just one example marker group
      //   {
      //     // id of the marker group, without spaces/other special chars
      //     'id': 'signs',
      //     // name of the marker group, displayed in the webinterface
      //     'name': 'Signs',
      //     // icon of the markers belonging to that group (optional)
      //     'icon': 'sign.png',
      //     // size of that icon
      //     'iconSize': [32, 32],
      //     // whether this marker group is shown by default (optional)
      //     'showDefault': true,
      //     // markers of this marker group...
      //     'markers': {
      //       // ...in the world "world"
      //       'creaft': [
      //         // example marker, pretty format:
      //         // // more markers:
      //         // {"pos" : [100, 100, 64], "title" : "Test1"},
      //         // {"pos" : [100, 200, 64], "title" : "Test2"},
      //         { 'pos': [Math.round(this.gx), Math.round(this.gz), 64], 'title': 'LAST JOIN POSITION', 'icon': 'compass.png' }
      //       ]
      //     }
      //   },
      //   // you can also add more complicated markers using the Leaflet API
      //   // just specify a function which creates the Leaflet API marker objects
      //   {
      //     'id': 'test',
      //     'name': 'Test',
      //     'createMarker': function (ui, groupInfo, markerInfo) {
      //       const latlngs = []
      //       // use the ui.mcToLatLng-function to convert Minecraft coords to LatLngs
      //       latlngs.push(ui.mcToLatLng(markerInfo.p1[0], markerInfo.p1[1], 64))
      //       latlngs.push(ui.mcToLatLng(markerInfo.p2[0], markerInfo.p2[1], 64))
      //       latlngs.push(ui.mcToLatLng(markerInfo.p3[0], markerInfo.p3[1], 64))
      //       latlngs.push(ui.mcToLatLng(markerInfo.p4[0], markerInfo.p4[1], 64))
      //       latlngs.push(ui.mcToLatLng(markerInfo.p1[0], markerInfo.p1[1], 64))
      //
      //       return L.polyline(latlngs, { 'color': markerInfo.color })
      //     },
      //     'markers': {
      //       'creaft': [
      //       ]
      //     }
      //     }
      //   }
      // ]

      // this.zones.forEach(function (doc) {
      //   const zoneObj = {
      //     'p1': doc.p1,
      //     'p2': doc.p2,
      //     'p3': doc.p3,
      //     'p4': doc.p4,
      //     'color': 'white'
      //   }
      //   MAPCRAFTER_MARKERS[1].markers.creaft.push(zoneObj)
      // })
      //
      // this.zones.forEach(function (doc) {
      //   const zoneObj = {
      //     'pos': [Math.round(doc.cx), Math.round(doc.cz), 64],
      //     'title': doc.name + ': ' + doc.username + ' owns this property.'
      //   }
      //   MAPCRAFTER_MARKERS[0].markers.creaft.push(zoneObj)
      // })

      //   const cx = Math.round(this.gx) // center positions
      //   const cy = Math.round(this.gy)
      //   const cz = Math.round(this.gz)
      //   const ox = Math.round(cx - 127) // origin positions
      //   const oy = 0
      //   const oz = Math.round(cz - 127)
      //   const nx = Math.round(cx + 129) // next positions
      //   const ny = 0
      //   const nz = Math.round(cz - 127)
      //   const mx = Math.round(cx - 127) // more positions
      //   const my = 0
      //   const mz = Math.round(cz + 129)
      //   const dx = Math.round(cx + 129) // destination positions
      //   const dy = 256
      //   const dz = Math.round(cz + 129)
      //
      //   console.dir(MAPCRAFTER_MARKERS[1].markers.creaft)
      //
      //   MAPCRAFTER_MARKERS[1].markers.creaft.push({ 'p1': [nx, nz], 'p2': [ox, oz], 'p3': [mx, mz], 'p4': [dx, dz], 'color': 'white' })
      //
      //   console.dir(MAPCRAFTER_MARKERS[1].markers.creaft)
      //
      //   const markers = []
      //
      //   if (typeof MAPCRAFTER_MARKERS !== 'undefined') {
      //     // eslint-disable-next-line no-var
      //     for (var i = 0; i < MAPCRAFTER_MARKERS.length; i++) { markers.push(MAPCRAFTER_MARKERS[i]) }
      //   }
      //   if (typeof MAPCRAFTER_MARKERS_GENERATED !== 'undefined') {
      //     // eslint-disable-next-line no-var
      //     for (var i = 0; i < MAPCRAFTER_MARKERS_GENERATED.length; i++) { markers.push(MAPCRAFTER_MARKERS_GENERATED[i]) }
      //   }
      //   // only create marker control if marker groups exist
      //   if (markers.length > 0) { Mapcrafter.addControl(new MarkerControl(markers), 'topright', 2) }
      // }
      // }

</script>

<style scoped>
.fluid.container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.overlay {
  backdrop-filter: blur(5px) !important;
  /* Height & width depends on how you want to reveal the overlay (see JS below) */
  height: 100vh;
  width: 100vw;
  position: fixed; /* Stay in place */
  left: 0;
  top: 0;
  text-align: center;
  z-index: 100;
  background-color: rgba(6, 7, 50, 0.95); /* Black w/opacity */
  overflow-x: hidden; /* Disable horizontal scroll */
}

#mcmap {
  z-index: 99;
  position: absolute !important;
  width: 100%;
  height: 100%;
  top: 0;
}

.control-wrapper {
}

.control-wrapper-panel {
  background-color: white;
}

.control-wrapper-panel .panel-heading,
.control-wrapper-panel .panel-body,
.control-wrapper-panel .panel-footer {
  padding: 7px 10px;
}

.control-wrapper-invisible {
  margin: 5px;
  padding: 4px;
}

.dropdown-menu {
  cursor: pointer;
}

#control-wrapper-marker .list-group-item .right-padding {
  /* because of the floating badge */
  padding-right: 30px;
}

/*
    #control-wrapper-marker .btn {
    width: 100%;
    }
    #control-wrapper-marker input, #control-wrapper-marker label {
    margin:0;
    }
    #control-wrapper-marker label {
    padding-left: 5px;
    }

    #control-wrapper-marker div div {
    padding-bottom: 5px;
    }
    */

#control-wrapper-map-select {
  z-index: initial !important;
}

#control-wrapper-rotation-select img {
  width: 30px;
  margin: 3px;
}

/* required styles */

.leaflet-map-pane,
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-tile-pane,
.leaflet-tile-container,
.leaflet-overlay-pane,
.leaflet-shadow-pane,
.leaflet-marker-pane,
.leaflet-popup-pane,
.leaflet-overlay-pane svg,
.leaflet-zoom-box,
.leaflet-image-layer,
.leaflet-layer {
  position: absolute;
  left: 0;
  top: 0;
}
.leaflet-container {
  overflow: hidden;
  -ms-touch-action: none;
}
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}
.leaflet-marker-icon,
.leaflet-marker-shadow {
  display: block;
}
/* map is broken in FF if you have max-width: 100% on tiles */
.leaflet-container img {
  max-width: none !important;
}
/* stupid Android 2 doesn't understand "max-width: none" properly */
.leaflet-container img.leaflet-image-layer {
  max-width: 15000px !important;
}
.leaflet-tile {
  filter: inherit;
  visibility: hidden;
}
.leaflet-tile-loaded {
  visibility: inherit;
}
.leaflet-zoom-box {
  width: 0;
  height: 0;
}
/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */
.leaflet-overlay-pane svg {
  -moz-user-select: none;
}

.leaflet-tile-pane {
  z-index: 2;
}
.leaflet-objects-pane {
  z-index: 3;
}
.leaflet-overlay-pane {
  z-index: 4;
}
.leaflet-shadow-pane {
  z-index: 5;
}
.leaflet-marker-pane {
  z-index: 6;
}
.leaflet-popup-pane {
  z-index: 7;
}

.leaflet-vml-shape {
  width: 1px;
  height: 1px;
}
.lvml {
  behavior: url(#default#VML);
  display: inline-block;
  position: absolute;
}

/* control positioning */

.leaflet-control {
  position: relative;
  z-index: 7;
  pointer-events: auto;
}
.leaflet-top,
.leaflet-bottom {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
}
.leaflet-top {
  top: 0;
}
.leaflet-right {
  right: 0;
}
.leaflet-bottom {
  bottom: 0;
}
.leaflet-left {
  left: 0;
}
.leaflet-control {
  float: left;
  clear: both;
}
.leaflet-right .leaflet-control {
  float: right;
}
.leaflet-top .leaflet-control {
  margin-top: 10px;
}
.leaflet-bottom .leaflet-control {
  margin-bottom: 10px;
}
.leaflet-left .leaflet-control {
  margin-left: 10px;
}
.leaflet-right .leaflet-control {
  margin-right: 10px;
}

/* zoom and fade animations */

.leaflet-fade-anim .leaflet-tile,
.leaflet-fade-anim .leaflet-popup {
  opacity: 0;
  -webkit-transition: opacity 0.2s linear;
  -moz-transition: opacity 0.2s linear;
  -o-transition: opacity 0.2s linear;
  transition: opacity 0.2s linear;
}
.leaflet-fade-anim .leaflet-tile-loaded,
.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {
  opacity: 1;
}

.leaflet-zoom-anim .leaflet-zoom-animated {
  -webkit-transition: -webkit-transform 0.25s cubic-bezier(0, 0, 0.25, 1);
  -moz-transition: -moz-transform 0.25s cubic-bezier(0, 0, 0.25, 1);
  -o-transition: -o-transform 0.25s cubic-bezier(0, 0, 0.25, 1);
  transition: transform 0.25s cubic-bezier(0, 0, 0.25, 1);
}
.leaflet-zoom-anim .leaflet-tile,
.leaflet-pan-anim .leaflet-tile,
.leaflet-touching .leaflet-zoom-animated {
  -webkit-transition: none;
  -moz-transition: none;
  -o-transition: none;
  transition: none;
}

.leaflet-zoom-anim .leaflet-zoom-hide {
  visibility: hidden;
}

/* cursors */

.leaflet-clickable {
  cursor: pointer;
}
.leaflet-container {
  cursor: -webkit-grab;
  cursor: -moz-grab;
}
.leaflet-popup-pane,
.leaflet-control {
  cursor: auto;
}
.leaflet-dragging .leaflet-container,
.leaflet-dragging .leaflet-clickable {
  cursor: move;
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
}

/* visual tweaks */

.leaflet-container {
  background: #ddd;
  outline: 0;
}
.leaflet-container a {
  color: #0078a8;
}
.leaflet-container a.leaflet-active {
  outline: 2px solid orange;
}
.leaflet-zoom-box {
  border: 2px dotted #38f;
  background: rgba(255, 255, 255, 0.5);
}

/* general typography */
.leaflet-container {
  font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;
}

/* general toolbar styles */

.leaflet-bar {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
  border-radius: 4px;
}
.leaflet-bar a,
.leaflet-bar a:hover {
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  width: 26px;
  height: 26px;
  line-height: 26px;
  display: block;
  text-align: center;
  text-decoration: none;
  color: black;
}
.leaflet-bar a,
.leaflet-control-layers-toggle {
  background-position: 50% 50%;
  background-repeat: no-repeat;
  display: block;
}
.leaflet-bar a:hover {
  background-color: #f4f4f4;
}
.leaflet-bar a:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.leaflet-bar a:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: none;
}
.leaflet-bar a.leaflet-disabled {
  cursor: default;
  background-color: #f4f4f4;
  color: #bbb;
}

.leaflet-touch .leaflet-bar a {
  width: 30px;
  height: 30px;
  line-height: 30px;
}

/* zoom control */

.leaflet-control-zoom-in,
.leaflet-control-zoom-out {
  font: bold 18px "Lucida Console", Monaco, monospace;
  text-indent: 1px;
}
.leaflet-control-zoom-out {
  font-size: 20px;
}

.leaflet-touch .leaflet-control-zoom-in {
  font-size: 22px;
}
.leaflet-touch .leaflet-control-zoom-out {
  font-size: 24px;
}

/* layers control */

.leaflet-control-layers {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
  background: #fff;
  border-radius: 5px;
}

.leaflet-touch .leaflet-control-layers-toggle {
  width: 44px;
  height: 44px;
}
.leaflet-control-layers .leaflet-control-layers-list,
.leaflet-control-layers-expanded .leaflet-control-layers-toggle {
  display: none;
}
.leaflet-control-layers-expanded .leaflet-control-layers-list {
  display: block;
  position: relative;
}
.leaflet-control-layers-expanded {
  padding: 6px 10px 6px 6px;
  color: #333;
  background: #fff;
}
.leaflet-control-layers-selector {
  margin-top: 2px;
  position: relative;
  top: 1px;
}
.leaflet-control-layers label {
  display: block;
}
.leaflet-control-layers-separator {
  height: 0;
  border-top: 1px solid #ddd;
  margin: 5px -10px 5px -6px;
}

/* attribution and scale controls */

.leaflet-container .leaflet-control-attribution {
  background: #fff;
  background: rgba(255, 255, 255, 0.7);
  margin: 0;
}
.leaflet-control-attribution,
.leaflet-control-scale-line {
  padding: 0 5px;
  color: #333;
}
.leaflet-control-attribution a {
  text-decoration: none;
}
.leaflet-control-attribution a:hover {
  text-decoration: underline;
}
.leaflet-container .leaflet-control-attribution,
.leaflet-container .leaflet-control-scale {
  font-size: 11px;
}
.leaflet-left .leaflet-control-scale {
  margin-left: 5px;
}
.leaflet-bottom .leaflet-control-scale {
  margin-bottom: 5px;
}
.leaflet-control-scale-line {
  border: 2px solid #777;
  border-top: none;
  line-height: 1.1;
  padding: 2px 5px 1px;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  -moz-box-sizing: content-box;
  box-sizing: content-box;

  background: #fff;
  background: rgba(255, 255, 255, 0.5);
}
.leaflet-control-scale-line:not(:first-child) {
  border-top: 2px solid #777;
  border-bottom: none;
  margin-top: -2px;
}
.leaflet-control-scale-line:not(:first-child):not(:last-child) {
  border-bottom: 2px solid #777;
}

.leaflet-touch .leaflet-control-attribution,
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
  box-shadow: none;
}
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
}

/* popup */

.leaflet-popup {
  position: absolute;
  text-align: center;
}
.leaflet-popup-content-wrapper {
  padding: 1px;
  text-align: left;
  border-radius: 12px;
}
.leaflet-popup-content {
  margin: 13px 19px;
  line-height: 1.4;
}
.leaflet-popup-content p {
  margin: 18px 0;
}
.leaflet-popup-tip-container {
  margin: 0 auto;
  width: 40px;
  height: 20px;
  position: relative;
  overflow: hidden;
}
.leaflet-popup-tip {
  width: 17px;
  height: 17px;
  padding: 1px;

  margin: -10px auto 0;

  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  background: white;

  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
}
.leaflet-container a.leaflet-popup-close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 4px 0 0;
  text-align: center;
  width: 18px;
  height: 14px;
  font: 16px/14px Tahoma, Verdana, sans-serif;
  color: #c3c3c3;
  text-decoration: none;
  font-weight: bold;
  background: transparent;
}
.leaflet-container a.leaflet-popup-close-button:hover {
  color: #999;
}
.leaflet-popup-scrolled {
  overflow: auto;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}

.leaflet-oldie .leaflet-popup-content-wrapper {
  zoom: 1;
}
.leaflet-oldie .leaflet-popup-tip {
  width: 24px;
  margin: 0 auto;

  -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";
  filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);
}
.leaflet-oldie .leaflet-popup-tip-container {
  margin-top: -1px;
}

.leaflet-oldie .leaflet-control-zoom,
.leaflet-oldie .leaflet-control-layers,
.leaflet-oldie .leaflet-popup-content-wrapper,
.leaflet-oldie .leaflet-popup-tip {
  border: 1px solid #999;
}

/* div icon */

.leaflet-div-icon {
  background: #fff;
  border: 1px solid #666;
}
</style>
