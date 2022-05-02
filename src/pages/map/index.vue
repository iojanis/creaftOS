<template>
  <div
    class="ui terminal inverted fluid padded"
    style="padding-top: 7em!important;"
  >
    <!--    <div class="overlay">-->
    <!--      <div class="center">-->
    <!--        <div style="min-width: 300px;">-->
    <!--          <h3 class="ui white header">-->
    <!--            <span style="background: rgba(204,204,204,0.09); padding-left: 0.3em; padding-right: 0.2em"> MAP IS UNAVAILABLE.</span>-->
    <!--          </h3>-->
    <!--          <p>THE MAP IS UNDER DEVELOPMENT.</p>-->
    <!--          <p>PLEASE USE TEAMS FOR PROPERTY MANAGEMENT.</p>-->
    <!--          <p>THANK YOU FOR UNDERSTANDING.</p>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
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
const CONFIG = {
  "maps": {
    "map_world": {
      "imageFormat": "png",
      "lastRendered": [
        1648140376,
        0,
        0,
        0
      ],
      "maxZoom": 10,
      "name": "EnderNET World",
      "renderView": "topdown",
      "rotations": [
        0
      ],
      "textureSize": 12,
      "tileSetGroup": "world_isometric_t1",
      "tileSize": [
        384,
        384
      ],
      "world": "world",
      "worldName": "world",
      "worldSeaLevel": 62
    }
  },
  "mapsOrder": [
    "map_world"
  ],
  "tileSetGroups": {
    "world_isometric_t1": {
      "maxZoom": 10,
      "tileOffsets": [
        [
          0,
          0
        ],
        [
          0,
          0
        ],
        [
          0,
          0
        ],
        [
          0,
          0
        ]
      ],
      "tileWidth": 1
    }
  }
}

export default {
  auth: false,
  data() {
    return {
      gx: 0,
      gz: 0,
      gy: 0
    }
  },
  async mounted() {

    var Mapcrafter = new MapcrafterUI(CONFIG);
    Mapcrafter.addControl(new MousePosControl(), "topright", 1);
    // Mapcrafter.addControl(new RotationSelectControl(), "bottomright", 1);
    // Mapcrafter.addControl(new MapSelectControl(), "topright", 1);

    // this.gx =

    const zones = await this.$axios.$get('/zones')

    let joined_x = this.$auth.loggedIn ? this.$auth.user.joined_x : 0
    let joined_z = this.$auth.loggedIn ? this.$auth.user.joined_z : 0
    let joined_y = this.$auth.loggedIn ? this.$auth.user.joined_y : 150

    Mapcrafter.init();

    const latlng = Mapcrafter.mcToLatLng(joined_x, joined_z, joined_y)
    Mapcrafter.lmap.setView(latlng, 5, { animate: true })

    // zoom to joined_x, joined_z, joined_y
    // Mapcrafter.lmap.zoom(joined_x, joined_z, joined_y)

    const MAPCRAFTER_MARKERS = [
      // just one example marker group
      {
        // id of the marker group, without spaces/other special chars
        'id': 'signs',
        // name of the marker group, displayed in the webinterface
        'name': 'Signs',
        // icon of the markers belonging to that group (optional)
        'icon': 'compass.png',
        // size of that icon
        'iconSize': [32, 32],
        // whether this marker group is shown by default (optional)
        'showDefault': true,
        // markers of this marker group...
        'markers': {
          // ...in the world "world"
          'world': [
            // example marker, pretty format:
            // // more markers:
            // {"pos" : [100, 100, 64], "title" : "Test1"},
            // {"pos" : [100, 200, 64], "title" : "Test2"},
            { 'pos': [Math.round(joined_x), Math.round(joined_z), Math.round(joined_y)], 'title': 'LAST JOIN POSITION', 'icon': 'compass.png' }
          ]
        }
      },
      // you can also add more complicated markers using the Leaflet API
      // just specify a function which creates the Leaflet API marker objects
      {
        'id': 'test',
        'name': 'Test',
        'createMarker': function (ui, groupInfo, markerInfo) {
          const latlngs = []
          // use the ui.mcToLatLng-function to convert Minecraft coords to LatLngs
          latlngs.push(ui.mcToLatLng(markerInfo.p1x, markerInfo.p1z, 64))
          latlngs.push(ui.mcToLatLng(markerInfo.p2x, markerInfo.p2z, 64))
          latlngs.push(ui.mcToLatLng(markerInfo.p3x, markerInfo.p3z, 64))
          latlngs.push(ui.mcToLatLng(markerInfo.p4x, markerInfo.p4z, 64))
          latlngs.push(ui.mcToLatLng(markerInfo.p1x, markerInfo.p1z, 64))

          return L.polyline(latlngs, { 'color': markerInfo.color })
        },
        'markers': {
          'world': [
          ]
        }
      }
    ]

    const markers = []

    console.log(zones)



    zones.forEach((zone) => {
      const zoneObj2 = {
        'pos': [parseInt(zone.pcx), parseInt(zone.pcz), parseInt(zone.pcy)],
        'title': zone.name + ': ' + zone.username + ' owns this property for team: ' + zone.team,
        'icon': 'ender_pearl.png'
      }
      MAPCRAFTER_MARKERS[0].markers.world.push(zoneObj2)

      const zoneObj = {
        p1x: zone.p1x,
        p1z: zone.p1z,
        p2x: zone.p2x,
        p2z: zone.p2z,
        p3x: zone.p3x,
        p3z: zone.p3z,
        p4x: zone.p4x,
        p4z: zone.p4z,
        'color': 'white'
      }

      console.dir(zoneObj)

      MAPCRAFTER_MARKERS[1].markers.world.push(zoneObj)
    })




    const cx = Math.round(joined_x) // center positions
    const cy = Math.round(joined_y)
    const cz = Math.round(joined_z)
    const ox = Math.round(cx - 127) // origin positions
    const oy = 0
    const oz = Math.round(cz - 127)
    const nx = Math.round(cx + 129) // next positions
    const ny = 0
    const nz = Math.round(cz - 127)
    const mx = Math.round(cx - 127) // more positions
    const my = 0
    const mz = Math.round(cz + 129)
    const dx = Math.round(cx + 129) // destination positions
    const dy = 256
    const dz = Math.round(cz + 129)

    console.dir(MAPCRAFTER_MARKERS[1].markers.world)

    const zoneObj3 = {
      p1x: nx,
      p1z: nz,
      p2x: ox,
      p2z: oz,
      p3x: mx,
      p3z: mz,
      p4x: dx,
      p4z: dz,
      'color': 'rgba(255,255,255,0.20)'
    }

    MAPCRAFTER_MARKERS[1].markers.world.push(zoneObj3)

    console.dir(MAPCRAFTER_MARKERS[1].markers.world)

    if (typeof MAPCRAFTER_MARKERS !== 'undefined') {
      // eslint-disable-next-line no-var
      for (var i = 0; i < MAPCRAFTER_MARKERS.length; i++) { markers.push(MAPCRAFTER_MARKERS[i]) }
    }
    if (typeof MAPCRAFTER_MARKERS_GENERATED !== 'undefined') {
      // eslint-disable-next-line no-var
      for (var i = 0; i < MAPCRAFTER_MARKERS_GENERATED.length; i++) { markers.push(MAPCRAFTER_MARKERS_GENERATED[i]) }
    }
    // only create marker control if marker groups exist
    if (markers.length > 0) { Mapcrafter.addControl(new MarkerControl(markers), 'bottomright', 2) }

  }
}





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
  background: transparent!important;
  z-index: 99;
  position: absolute !important;
  width: 100%;
  height: 100%;
  top: 0;
}

/*.control-wrapper {*/
/*  margin-top: 300px!important;*/
/*}*/

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

</style>
