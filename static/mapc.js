const Util = {
  hasClass (node, clazz) {
    return node.getAttribute('class').split(' ').includes(clazz)
  },

  addClass (node, clazz) {
    const clazzes = node.getAttribute('class').split(' ')
    if (!clazzes.includes(clazz)) {
      clazzes.push(clazz)
    }
    node.setAttribute('class', clazzes.join(' '))
  },

  removeClass (node, clazz) {
    const clazzes = node.getAttribute('class').split(' ')
    while (clazzes.includes(clazz)) {
      clazzes.splice(clazzes.indexOf(clazz), 1)
    }
    node.setAttribute('class', clazzes.join(' '))
  },

  createPanelHeader (title) {
    const header = document.createElement('div')
    header.setAttribute('class', 'panel-heading')
    header.innerHTML = title
    return header
  }
}

/**
 * This is the base class to implement different handlers which are called
 * when the type or the rotation of the map is changed.
 */
function BaseHandler () {
  this.ui = null
}

BaseHandler.prototype.create = function () {
}

BaseHandler.prototype.onMapChange = function (name, rotation) {
}

MarkerHandler.prototype = new BaseHandler()

/**
 * Is responsible to show the markers from the markers.js.
 */
function MarkerHandler (control, markers) {
  this.control = control
  this.layerGroups = {}
  this.markers = markers
  this.markersByGroup = {}
  this.visible = {}
}

MarkerHandler.prototype.onMapChange = function (name, rotation) {
  for (var group in this.layerGroups) { this.ui.lmap.removeLayer(this.layerGroups[group]) }
  this.layerGroups = {}

  const createDefaultMarker = function (ui, groupInfo, markerInfo) {
    const pos = markerInfo.pos
    // show on top center of block
    const marker = new L.Marker(ui.mcToLatLng(pos[0] + 0.5, pos[1] + 0.5, pos[2]), {
      title: markerInfo.title
    })

    // The icon may be specified on either a marker or group level, with
    // preference for the marker-specific icon.
    const icon = markerInfo.icon ? markerInfo.icon : groupInfo.icon
    const iconSize = markerInfo.iconSize ? markerInfo.iconSize : groupInfo.iconSize

    if (icon) {
      marker.setIcon(new L.Icon({
        // The icon URL itself may be given relative to "static/markers"
        // or as an absolute URL (perhaps to a resource on a CDN).
        iconUrl: icon.match(/^\w+:\/\//) ? icon : 'static/markers/' + icon,
        iconSize: (iconSize || [24, 24])
      }))
    }
    marker.bindPopup(markerInfo.text ? markerInfo.text : markerInfo.title)
    return marker
  }

  const world = this.ui.getCurrentMapConfig().world
  for (let i = 0; i < this.markers.length; i++) {
    const groupInfo = this.markers[i]
    var group = groupInfo.id
    this.markersByGroup[group] = groupInfo

    if (!(world in groupInfo.markers)) {
      // create empty layer group
      this.layerGroups[group] = L.layerGroup()
      continue
    }

    if (!groupInfo.createMarker) { groupInfo.createMarker = createDefaultMarker }

    const markers = groupInfo.markers[world]
    const layerGroup = L.layerGroup()
    for (let j = 0; j < markers.length; j++) {
      const markerInfo = markers[j]
      const marker = groupInfo.createMarker(this.ui, groupInfo, markerInfo)
      if (marker != null) { marker.addTo(layerGroup) }
    }

    this.layerGroups[group] = layerGroup
    if (!(group in this.visible)) { this.visible[group] = true }
    if ('showDefault' in groupInfo && !groupInfo.showDefault) {
      this.control.uncheckGroup(group)
      this.visible[group] = false
    }
  }

  for (var group in this.visible) { this.show(group, this.visible[group]) }

  this.updateMarkerCounts()
}

MarkerHandler.prototype.updateMarkerCounts = function () {
  const world = this.ui.getCurrentMapConfig().world
  const buttons = this.control.buttons
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i]
    const group = button.getAttribute('data-group')
    let count = 0
    if (world in this.markersByGroup[group].markers) { count = this.markersByGroup[group].markers[world].length }

    const span = button.getElementsByTagName('span')[0]
    span.innerHTML = count
  }
}

MarkerHandler.prototype.getMarkerGroups = function () {
  const groups = []
  for (let i = 0; i < this.markers.length; i++) { groups.push([this.markers[i].id, this.markers[i].name]) }
  return groups
}

MarkerHandler.prototype.show = function (group, visible) {
  const layer = this.layerGroups[group]
  if (visible && !this.ui.lmap.hasLayer(layer)) { layer.addTo(this.ui.lmap) }
  if (!visible && this.ui.lmap.hasLayer(layer)) { this.ui.lmap.removeLayer(layer) }
  this.visible[group] = visible
}

MapSelectHandler.prototype = new BaseHandler()

function MapSelectHandler (control) {
  this.control = control
}

MapSelectHandler.prototype.onMapChange = function (map, rotation) {
  this.update()
}

MapSelectHandler.prototype.update = function () {
  const currentMap = this.ui.getCurrentMap()
  const mapConfig = this.ui.getCurrentMapConfig()

  this.control.button.innerHTML = mapConfig.name + " <span class='caret'></span>"

  const maps = this.control.dropdown.childNodes
  for (let i = 0; i < maps.length; i++) {
    const current = maps[i].getAttribute('data-map') == currentMap
    maps[i].setAttribute('class', current ? 'active' : '')
  }
}

PosHashHandler.prototype = new BaseHandler()

/**
 * Is responsible for the url position hash.
 */
function PosHashHandler () {
}

PosHashHandler.prototype.create = function () {
  // check if the url has already a position hash
  // if yes, set the map to this hash
  const hash = this.parseHash()
  this.gotoHash(hash)
  this.updateHash()

  // and register event handlers to update the url position hash

  const handler = (function (self) {
    return function () {
      self.updateHash()
    }
  })(this)

  this.ui.lmap.on('dragend', handler)
  this.ui.lmap.on('zoomend', handler)
}

PosHashHandler.prototype.onMapChange = function (name, rotation) {
  this.updateHash()
}

PosHashHandler.prototype.parseHash = function () {
  if (!location.hash) { return null }

  const url = location.hash.substr(1)
  const split = url.split('/')

  if (split.length != 6) { return null }
  for (let i = 1; i < 6; i++) { split[i] = parseInt(split[i]) }
  return split
}

PosHashHandler.prototype.updateHash = function () {
  const type = this.ui.getCurrentMap()
  const rotation = this.ui.getCurrentRotation()
  const xzy = this.ui.latLngToMC(this.ui.lmap.getCenter(), this.ui.getCurrentMapConfig().worldSeaLevel)
  for (let i = 0; i < 3; i++) { xzy[i] = Math.round(xzy[i]) }
  const zoom = this.ui.lmap.getZoom()
  // window.location.replace("#" + type + "/" + rotation + "/" + zoom + "/" + xzy[0] + "/" + xzy[1] + "/" + xzy[2]);
}

PosHashHandler.prototype.gotoHash = function (hash) {
  if (!hash) { return }

  if (!(hash[0] in this.ui.getMapConfigs()) ||
    !this.ui.getMapConfig(hash[0]).rotations.includes(hash[1])) { return null }

  this.ui.setMapAndRotation(hash[0], hash[1])

  const latlng = this.ui.mcToLatLng(hash[3], hash[4], hash[5])
  this.ui.lmap.setView(latlng, hash[2], { animate: false })
}
RotationSelectHandler.prototype = new BaseHandler()

/**
 * Updates the control widget with the map rotation selection.
 */
function RotationSelectHandler (control) {
  this.control = control
}

RotationSelectHandler.prototype.create = function () {
}

RotationSelectHandler.prototype.onMapChange = function (name, rotation) {
  this.update()
}

RotationSelectHandler.prototype.update = function (text) {
  const config = this.ui.getCurrentMapConfig()
  const currentRotation = this.ui.getCurrentRotation()

  for (let i = 0; i < 4; i++) {
    // hide buttons where rotations don't exist, set active/not active for others
    const button = this.control.buttons[i]
    if (!config.rotations.includes(i)) {
      button.style.display = 'none'
    } else {
      button.style.display = 'inline'
      if (i == currentRotation) {
        button.setAttribute('class', 'ui button active')
      } else {
        button.setAttribute('class', 'ui button')
      }
    }
  }
}

/**
 * This base class is used to implement different map control widgets.
 *
 * These controls can also have their own handler. Just return
 * in getHandler() your handler.
 */
function BaseControl (type) {
  this.TYPE = type

  this.ui = null
}

BaseControl.prototype.TYPE = 'BaseControl'

BaseControl.prototype.create = function (wrapper) {
}

BaseControl.prototype.getHandler = function () {
  return null
}

BaseControl.prototype.getName = function () {
  return 'base'
}

BaseControl.prototype.usePanelWrapper = function () {
  return true
}

MapSelectControl.prototype = new BaseControl('MapSelectControl')

/**
 * This control widget allows the user to select a map.
 */
function MapSelectControl () {
  this.handler = new MapSelectHandler(this)
  this.button = null
  this.dropdown = null
}

MapSelectControl.prototype.create = function (wrapper) {
  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.setAttribute('class', 'ui dropdown button')
  button.setAttribute('data-toggle', 'dropdown')
  button.setAttribute('aria-haspopup', 'true')
  button.setAttribute('aria-expanded', 'false')

  const ul = document.createElement('ul')
  ul.setAttribute('id', 'map-ul')
  ul.setAttribute('class', 'ui dropdown menu')

  this.button = button
  this.dropdown = ul

  for (const i in this.ui.getMapConfigsOrder()) {
    const type = this.ui.getMapConfigsOrder()[i]
    const li = document.createElement('li')
    const a = document.createElement('a')

    a.innerHTML = this.ui.getMapConfig(type).name
    a.setAttribute('data-map', type)
    li.setAttribute('data-map', type)

    a.addEventListener('click', (function (ui) {
      return function () {
        ui.setMap(this.getAttribute('data-map'))
      }
    }(this.ui)))

    li.appendChild(a)
    ul.appendChild(li)
  }

  L.DomEvent.disableClickPropagation(wrapper)
  wrapper.appendChild(this.button)
  wrapper.appendChild(this.dropdown)
}

MapSelectControl.prototype.getHandler = function () {
  return this.handler
}

MapSelectControl.prototype.getName = function () {
  return 'map-select'
}

MapSelectControl.prototype.usePanelWrapper = function () {
  return false
}

MarkerControl.prototype = new BaseControl('MarkerControl')

function MarkerControl (markers) {
  this.handler = new MarkerHandler(this, markers)
  this.buttons = []
}

MarkerControl.prototype.create = function (wrapper) {
  const groups = this.handler.getMarkerGroups()

  const checkedClass = 'list-group-item-info'
  const listGroup = document.createElement('div')
  listGroup.setAttribute('class', 'list-group hidden')

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i][0]
    const groupLabel = groups[i][1]

    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('class', 'list-group-item  ' + checkedClass)
    button.setAttribute('data-group', group)
    button.innerHTML = "<span class='badge'>17</span> <span class='right-padding'>" + groupLabel + '</span>'
    button.addEventListener('click', (function (handler) {
      return function () {
        const checked = Util.hasClass(this, checkedClass)
        const group = this.getAttribute('data-group')
        handler.show(group, !checked)

        if (checked) {
          Util.removeClass(this, checkedClass)
        } else {
          Util.addClass(this, checkedClass)
        }
      }
    }(this.handler)))

    listGroup.appendChild(button)
    this.buttons.push(button)
  }

  const buttonShowAll = document.createElement('button')
  buttonShowAll.setAttribute('type', 'buttonShowAll')
  buttonShowAll.setAttribute('class', 'list-group-item')
  buttonShowAll.innerHTML = 'Show all'
  buttonShowAll.addEventListener('click', (function (handler) {
    return function () {
      for (let i = 0; i < listGroup.childNodes.length - 2; i++) {
        const button = listGroup.childNodes[i]
        const group = button.getAttribute('data-group')
        handler.show(group, true)
        Util.addClass(button, checkedClass)
      }
    }
  }(this.handler)))

  const buttonHideAll = document.createElement('button')
  buttonHideAll.setAttribute('type', 'buttonHideAll')
  buttonHideAll.setAttribute('class', 'list-group-item')
  buttonHideAll.innerHTML = 'Hide all'
  buttonHideAll.addEventListener('click', (function (handler) {
    return function () {
      for (let i = 0; i < listGroup.childNodes.length - 2; i++) {
        const button = listGroup.childNodes[i]
        const group = button.getAttribute('data-group')
        handler.show(group, false)
        Util.removeClass(button, checkedClass)
      }
    }
  }(this.handler)))

  listGroup.appendChild(buttonShowAll)
  listGroup.appendChild(buttonHideAll)

  wrapper.appendChild(Util.createPanelHeader('Markers'))
  wrapper.appendChild(listGroup)
}

// hmm this is a not-so-nice hack
MarkerControl.prototype.uncheckGroup = function (group) {
  for (let i = 0; i < this.buttons.length; i++) {
    const button = this.buttons[i]
    if (button.getAttribute('data-group') == group) {
      Util.removeClass(button, 'list-group-item-info')
    }
  }
}

MarkerControl.prototype.getHandler = function () {
  return this.handler
}

MarkerControl.prototype.getName = function () {
  return 'marker'
}

MarkerControl.prototype.usePanelWrapper = function () {
  return true
}

MousePosControl.prototype = new BaseControl('MousePosControl')

/**
 * This control widget shows the current position of the mouse in Minecraft.
 */
function MousePosControl () {
}

MousePosControl.prototype.create = function (wrapper) {
  const text = document.createElement('span')
  text.setAttribute('id', 'mouse-move-div')

  const updatePos = (function (ui) {
    return function (event) {
      const xzy = ui.latLngToMC(event.latlng, 64)
      document.getElementById('mouse-move-div').innerHTML = '<div class="ui buttons" role="group">' +
        '<button type="button" class="ui button">' + 'X: ' + Math.round(xzy[0]) + '</button>' +
        '<button type="button" class="ui button">' + 'Z: ' + Math.round(xzy[1]) + '</button>' +
        '<button type="button" class="ui button">' + 'Y: ' + Math.round(xzy[2]) + '</button>' +
        '</div>'
    }
  }(this.ui))

  this.ui.lmap.on('mousemove', updatePos)
  this.ui.lmap.on('mousedown', updatePos)

  wrapper.appendChild(text)
}

MousePosControl.prototype.getName = function () {
  return 'mouse-pos'
}
RotationSelectControl.prototype = new BaseControl('RotationSelectControl')

/**
 * This control widget allows the user to rotate the map.
 */
function RotationSelectControl () {
  this.handler = new RotationSelectHandler(this)

  this.buttons = []
}

RotationSelectControl.prototype.create = function (wrapper) {
  const buttonGroup = document.createElement('div')
  buttonGroup.setAttribute('class', 'ui buttons')
  buttonGroup.setAttribute('role', 'group')

  const names = ['tl', 'tr', 'br', 'bl']
  for (let i = 0; i < 4; i++) {
    const button = document.createElement('button')
    button.setAttribute('class', 'ui button')
    button.setAttribute('data-rotation', i)
    button.addEventListener('click', (function (ui) {
      return function (event) {
        ui.setMapRotation(this.getAttribute('data-rotation'))
      }
    })(this.ui))

    img = document.createElement('img')
    img.setAttribute('id', 'rotation-' + names[i])
    img.setAttribute('src', 'static/img/' + names[i] + '.png')
    button.appendChild(img)

    buttonGroup.appendChild(button)
    this.buttons.push(button)
  }

  wrapper.appendChild(buttonGroup)
}

RotationSelectControl.prototype.getHandler = function () {
  return this.handler
}

RotationSelectControl.prototype.getName = function () {
  return 'rotation-select'
}

RotationSelectControl.prototype.usePanelWrapper = function () {
  return false
}
/**
 * A tile layer class which uses the quadtree data structure of rendered tiles.
 */
const MCTileLayer = L.TileLayer.extend({
  initialize (url, options) {
    this._url = url
    this._imageFormat = options.imageFormat

    L.setOptions(this, options)
  },

  getTileUrl (tile) {
    let url = this._url
    if (tile.x < 0 || tile.x >= Math.pow(2, tile.z) || tile.y < 0 || tile.y >= Math.pow(2, tile.z)) {
      url += '/blank'
    } else if (tile.z == 0) {
      url += '/base'
    } else {
      for (let z = tile.z - 1; z >= 0; --z) {
        const x = Math.floor(tile.x / Math.pow(2, z)) % 2
        const y = Math.floor(tile.y / Math.pow(2, z)) % 2
        url += '/' + (x + 2 * y + 1)
      }
    }
    url = url + '.' + this._imageFormat
    return url
  }
})

// Make the build height a variable
const topBlock = 320

/**
 * Creates a tile layer of a map with a specific rotation
 */
function createMCTileLayer (mapName, mapConfig, mapRotation) {
  return new MCTileLayer('https://map.lity.cc/' + mapName + '/' + ['tl', 'tr', 'br', 'bl'][mapRotation], {
    maxZoom: mapConfig.maxZoom,
    tileSize: L.point(mapConfig.tileSize[0], mapConfig.tileSize[1]),
    noWrap: true,
    continuousWorld: true,
    imageFormat: mapConfig.imageFormat
  })
};

/**
 * Functions to convert Minecraft x, z, y (isometric render view) <-> Leaflet latitute/longitude.
 */
const IsometricRenderView = {
  mcToLatLng (x, z, y, lmap, mapConfig, tileOffset, tileWidth) {
    // all pixel units here are pixels on the highest zoom level
    // size of the map in pixels
    const mapSize = mapConfig.tileSize[0] * Math.pow(2, mapConfig.maxZoom)
    // size of a quarter block = texture size / 2
    const quarterBlockSize = mapConfig.textureSize / 2
    // each block has a row/column depending on x/z/y
    // each row is a half block high, each column a quarter block wide
    // row = x+z, column = z - x + (topBlock-y)*2
    // so we can get the correct pixel coordinates of the mc coordinates, and then lat/lng:
    // 1. calculate row/column, multiply with row/column size (now pixel coordinates)
    // 2. map range [-mapSize/2, mapSize/2] to [0, mapSize/2] (like unproject wants it)
    // 3. apply little offset that is needed in this view
    // 4. apply tile offset
    // 5. pixel coordinates -> leaflet lat/lng with unproject
    const point = L.point(2 * (x + z), z - x + (topBlock - y) * 2).multiplyBy(quarterBlockSize)
      .add(L.point(mapSize / 2, mapSize / 2))
      .add(L.point(-mapConfig.textureSize * 16, 0))
      .add(L.point(-tileOffset[0], -tileOffset[1]).multiplyBy(mapConfig.tileSize[0]))
    return lmap.unproject(point, mapConfig.maxZoom)
  },

  latLngToMC (latLng, y, lmap, mapConfig, tileOffset, tileWidth) {
    const mapSize = mapConfig.tileSize[0] * Math.pow(2, mapConfig.maxZoom)
    const quarterBlockSize = mapConfig.textureSize / 2
    // do the inverse translation from above
    const point = lmap.project(latLng, mapConfig.maxZoom)
      .add(L.point(tileOffset[0], tileOffset[1]).multiplyBy(mapConfig.tileSize[0]))
      .add(L.point(mapConfig.textureSize * 16, 0))
      .add(L.point(-mapSize / 2, -mapSize / 2))
    // remove block sizes from it
    point.x /= 2 * quarterBlockSize
    point.y /= quarterBlockSize
    // solve the row = ... col = ... equation system and you get this:
    const x = 0.5 * (point.x - point.y - 2 * y) + topBlock
    const z = 0.5 * (point.x + point.y + 2 * y) - topBlock
    return [x, z, y]
  }
}

/**
 * Functions to convert Minecraft x, z, y (topdown render view) <-> Leaflet latitute/longitude.
 */
const TopdownRenderView = {
  mcToLatLng (x, z, y, lmap, mapConfig, tileOffset, tileWidth) {
    // like the isometric render view, except we don't have to deal with the row/col hassle
    const mapSize = mapConfig.tileSize[0] * Math.pow(2, mapConfig.maxZoom)
    const blockWidth = mapConfig.tileSize[0] / (16.0 * tileWidth)
    const point = L.point(x, z).multiplyBy(blockWidth)
      .add(L.point(mapSize / 2, mapSize / 2))
      .add(L.point(-tileOffset[0], -tileOffset[1]).multiplyBy(mapConfig.tileSize[0]))
    return lmap.unproject(point, mapConfig.maxZoom)
  },

  latLngToMC (latLng, y, lmap, mapConfig, tileOffset, tileWidth) {
    const mapSize = mapConfig.tileSize[0] * Math.pow(2, mapConfig.maxZoom)
    const blockWidth = mapConfig.tileSize[0] / (16.0 * tileWidth)
    // inverse transformation from above again
    const mc = lmap.project(latLng, mapConfig.maxZoom)
      .add(L.point(tileOffset[0], tileOffset[1]).multiplyBy(mapConfig.tileSize[0]))
      .add(L.point(-mapSize / 2, -mapSize / 2))
      .divideBy(blockWidth)
    return [mc.x, mc.y, y]
  }
}

/**
 * Functions to convert Minecraft x, z, y (side render view) <-> Leaflet latitute/longitude.
 */
const SideRenderView = {
  mcToLatLng (x, z, y, lmap, mapConfig, tileOffset, tileWidth) {
    const mapWidth = mapConfig.tileSize[0] * Math.pow(2, mapConfig.maxZoom)
    const mapHeight = mapConfig.tileSize[1] * Math.pow(2, mapConfig.maxZoom)
    const blockWidth = mapConfig.tileSize[0] / (16.0 * tileWidth)
    const blockHeight = mapConfig.tileSize[1] / (8.0 * tileWidth)

    // (z-1) because in the tile renderer we also subtract blockHeight/2 from y
    // leaflet x = x * blockWidth
    // leaflet y = (z - 1) * blockHeight / 2 + (topBlock - y) * blockHeight / 2
    const point = L.point(x, z - 1).scaleBy(L.point(blockWidth, blockHeight / 2))
      .add(L.point(mapWidth / 2, mapHeight / 2))
      .add(L.point(0, (topBlock - y) * blockHeight / 2))
      .add(L.point(-tileOffset[0] * mapConfig.tileSize[0], -tileOffset[1] * mapConfig.tileSize[1]))
    return lmap.unproject(point, mapConfig.maxZoom)
  },

  latLngToMC (latLng, y, lmap, mapConfig, tileOffset, tileWidth) {
    const mapWidth = mapConfig.tileSize[0] * Math.pow(2, mapConfig.maxZoom)
    const mapHeight = mapConfig.tileSize[1] * Math.pow(2, mapConfig.maxZoom)
    const blockWidth = mapConfig.tileSize[0] / (16.0 * tileWidth)
    const blockHeight = mapConfig.tileSize[1] / (8.0 * tileWidth)

    // x = leaflet x / blockWidth
    // (z - 1) = (leaflet y - (topBlock - y) * blockHeight / 2) / (blockHeight / 2)
    const point = lmap.project(latLng, mapConfig.maxZoom)
      .add(L.point(tileOffset[0] * mapConfig.tileSize[0], tileOffset[1] * mapConfig.tileSize[1]))
      .add(L.point(-mapWidth / 2, -mapHeight / 2))
    const x = point.x / blockWidth
    const z = (point.y - (topBlock - y) * blockHeight / 2) / (blockHeight / 2)
    return [x, z + 1, y]
  }
}

/**
 * This is the main class which manages the whole map ui.
 */
function MapcrafterUI (config) {
  this.config = config

  // current map (map name as string)
  this.currentMap = null
  // and current rotation
  this.currentRotation = null

  // leaflet map object
  this.lmap = null
  // leaflet layers of different maps/rotations, access them with layers[map][rotation]
  this.layers = {}

  // array of handlers to be called when map/rotation is changed
  this.handlers = []
  // cache controls/handlers when map is not yet properly initialized
  this.controlsNotCreated = []
  this.handlersNotCreated = []
  this.created = false

  this.addHandler(new PosHashHandler())
}

/**
 * Call this when the document is ready and completely loaded. Creates the leaflet map
 * object, initializes the available maps, sets the view to the first available map and
 * also initializes control widgets and handlers that were added to the ui earlier.
 */
MapcrafterUI.prototype.init = function () {
  // create the leaflet map object
  this.lmap = L.map('mcmap', {
    crs: L.CRS.Simple
  }).setView([0, 0], 0, { animate: false })
  // this.lmap.attributionControl.addAttribution("Map rendered with <a href='http://mapcrafter.org'>Mapcrafter</a>")

  // initialize the maps
  let firstMap = null
  for (var i in this.config.mapsOrder) {
    const map = this.config.mapsOrder[i]
    const mapConfig = this.config.maps[map]
    this.layers[map] = {}
    for (const i2 in mapConfig.rotations) {
      const rotation = mapConfig.rotations[i2]
      this.layers[map][rotation] = createMCTileLayer(map, mapConfig, rotation)
      if (firstMap === null) { firstMap = map }
    }
  }

  this.setMap(firstMap)
  this.created = true

  // initialize controls and handlers that aren't initialized yet
  for (var i = 0; i < this.controlsNotCreated.length; i++) {
    const control = this.controlsNotCreated[i]
    this.addControl(control[0], control[1], control[2])
  }

  for (var i = 0; i < this.handlersNotCreated.length; i++) { this.addHandler(this.handlersNotCreated[i]) }

  this.controlsNotCreated = []
  this.handlersNotCreated = []
}

/**
 * Returns the current map (as map name) that is showed.
 */
MapcrafterUI.prototype.getCurrentMap = function () {
  return this.currentMap
}

/**
 * Returns the current rotation of the map.
 */
MapcrafterUI.prototype.getCurrentRotation = function () {
  return this.currentRotation
}

/**
 * Returns the configuration object of a specific tile set group.
 */
MapcrafterUI.prototype.getTileSetGroupConfig = function (group) {
  return group in this.config.tileSetGroups ? this.config.tileSetGroups[group] : null
}

/**
 * Returns the associative array with the map configuration objects.
 */
MapcrafterUI.prototype.getMapConfigs = function () {
  return this.config.maps
}

/**
 * Returns the array with the order of maps.
 */
MapcrafterUI.prototype.getMapConfigsOrder = function () {
  return this.config.mapsOrder
}

/**
 * Returns the configuration object of a specific map.
 */
MapcrafterUI.prototype.getMapConfig = function (map) {
  return map in this.config.maps ? this.config.maps[map] : null
}

/**
 * Returns the configuration object of the current map.
 */
MapcrafterUI.prototype.getCurrentMapConfig = function () {
  return this.getMapConfig(this.currentMap)
}

/**
 * Sets the current map and rotation.
 */
MapcrafterUI.prototype.setMapAndRotation = function (map, rotation) {
  const oldMapConfig = this.getCurrentMapConfig()
  const mapConfig = this.getMapConfig(map)

  // try to get the old map layer and view of the map (center in Minecraft coordinates, zoom)
  let oldMapLayer = null
  let oldView = null
  let oldZoom = 0
  if (this.currentMap != null && this.currentRotation != null) {
    oldMapLayer = this.layers[this.currentMap][this.currentRotation]
    oldView = this.latLngToMC(this.lmap.getCenter(), oldMapConfig.worldSeaLevel)
    oldZoom = this.lmap.getZoom()
    // reset zoom, that seems to be important for leaflet
    this.lmap.setZoom(0)
  }

  // set the new map and rotation
  this.currentMap = map
  this.currentRotation = parseInt(rotation)

  // remove the old map layer and set the new map layer
  if (oldMapLayer != null) { this.lmap.removeLayer(oldMapLayer) }
  this.lmap.addLayer(this.layers[this.currentMap][this.currentRotation])
  this.lmap.invalidateSize()

  // check whether we are switching to a completely different map
  if (oldMapLayer == null || oldMapConfig.world != mapConfig.world) {
    // completely different map, reset view

    // reset zoom level, 0 or user-defined default zoom level
    let zoom = 3
    if ('defaultZoom' in mapConfig) { zoom = mapConfig.defaultZoom }

    // set view to the map center or a user-defined default center
    if ('defaultView' in mapConfig) {
      const x = mapConfig.defaultView[0]
      const z = mapConfig.defaultView[1]
      const y = mapConfig.defaultView[2]
      this.lmap.setView(this.mcToLatLng(x, z, y), zoom, { animate: false })
    } else {
      const cx = mapConfig.tileSize[0] / 2
      const cy = mapConfig.tileSize[1] / 2
      this.lmap.setView(this.lmap.unproject([cx, cy]), zoom, { animate: false })
    }
  } else {
    // same world, we can set the view to the view of the old map
    // but make sure that we set a valid zoom level
    const newZoom = Math.round(oldZoom / oldMapConfig.maxZoom * mapConfig.maxZoom)
    this.lmap.setZoom(newZoom, { animate: false })
    this.lmap.setView(this.mcToLatLng(oldView[0], oldView[1], oldView[2]), newZoom, { animate: false })
  }

  // call handlers
  for (let i = 0; i < this.handlers.length; i++) { this.handlers[i].onMapChange(this.currentMap, this.currentRotation) }
}

/**
 * Sets the current map. Tries to keep the current rotation if available, otherwise
 * uses the first available rotation of the new map.
 */
MapcrafterUI.prototype.setMap = function (map) {
  const oldMapConfig = this.getCurrentMapConfig()
  const mapConfig = this.getMapConfig(map)

  // check whether this the same world and the new map has the current rotation as well
  // we can use the current rotation then, use the default/first available rotation else
  const sameWorld = oldMapConfig == null ? false : oldMapConfig.world == mapConfig.world
  if (sameWorld && mapConfig.rotations.includes(this.currentRotation)) {
    this.setMapAndRotation(map, this.currentRotation)
  } else {
    let rotation = -1
    if ('defaultRotation' in mapConfig) { rotation = mapConfig.defaultRotation }
    // use first available rotation if given default rotation is not available
    if (!mapConfig.rotations.includes(rotation)) { rotation = mapConfig.rotations[0] }
    this.setMapAndRotation(map, rotation)
  }
}

/**
 * Sets the rotation of the current map.
 */
MapcrafterUI.prototype.setMapRotation = function (rotation) {
  this.setMapAndRotation(this.currentMap, rotation)
}

/**
 * Adds a control widget to the leaflet ui.
 *
 * control should be an instance of a subclass of BaseControl.
 * position is the position of the control widget (have a look at the leaflet reference).
 * index is a number which determines how to order the control widgets at the same position.
 */
MapcrafterUI.prototype.addControl = function (control, position, index) {
  // if map is not created yet, add this widget later
  if (!this.created) {
    this.controlsNotCreated.push([control, position, index])
    return
  }

  const self = this
  const ControlType = L.Control.extend({
    onAdd (map) {
      const wrapper = document.createElement('div')
      if (control.usePanelWrapper()) {
        wrapper.setAttribute('class', 'control-wrapper control-wrapper-panel panel panel-default')
        wrapper.setAttribute('id', 'control-wrapper-' + control.getName())
      } else {
        wrapper.setAttribute('class', 'control-wrapper control-wrapper-invisible')
        wrapper.setAttribute('id', 'control-wrapper-' + control.getName())
      }

      // just a dirty hack to prevent the map getting all mouse click events
      wrapper.onmouseover = function () {
        map.dragging.disable()
      }
      wrapper.onmouseout = function () {
        map.dragging.enable()
      }

      control.ui = self
      control.create(wrapper)
      wrapper.index = index

      return wrapper
    }
  })

  this.lmap.addControl(new ControlType({
    position
  }))

  // also add the handler of the control widget if it has one
  if (control.getHandler()) { this.addHandler(control.getHandler()) }
}

/**
 * Adds a handler to the map ui which is called every time the map or rotation has changed.
 *
 * handler should be an object of a subclass of BaseHandler.
 */
MapcrafterUI.prototype.addHandler = function (handler) {
  // if map is not created yet, add this handler later
  if (!this.created) {
    this.handlersNotCreated.push(handler)
    return
  }

  handler.ui = this
  handler.create()
  handler.onMapChange(this.currentMap, this.currentRotation)
  this.handlers.push(handler)
}

/**
 * Converts Minecraft coordinates to Leaflet latitute/longitute.
 */
MapcrafterUI.prototype.mcToLatLng = function (x, z, y) {
  const mapConfig = this.getCurrentMapConfig()
  const tileSetGroup = this.getTileSetGroupConfig(mapConfig.tileSetGroup)
  const tileOffset = tileSetGroup.tileOffsets[this.currentRotation]
  const tileWidth = tileSetGroup.tileWidth

  // rotate the position to the map rotation
  for (let i = 0; i < this.currentRotation; i++) {
    const nx = -z + 512 // 512 blocks = one region
    const nz = x
    x = nx
    z = nz
  }

  // do the conversion depending on the current render view
  if (mapConfig.renderView == 'isometric') {
    return IsometricRenderView.mcToLatLng(x, z, y, this.lmap, mapConfig, tileOffset, tileWidth)
  } else if (mapConfig.renderView == 'topdown') {
    return TopdownRenderView.mcToLatLng(x, z, y, this.lmap, mapConfig, tileOffset, tileWidth)
  } else if (mapConfig.renderView == 'side') {
    return SideRenderView.mcToLatLng(x, z, y, this.lmap, mapConfig, tileOffset, tileWidth)
  }
}

/**
 * Converts a Leaflet latitute/longitute to Minecraft coordinates. You have to specify
 * an y-coordinate since the map is a projection from 3d to 2d.
 */
MapcrafterUI.prototype.latLngToMC = function (latLng, y) {
  const mapConfig = this.getCurrentMapConfig()
  const tileSetGroup = this.getTileSetGroupConfig(mapConfig.tileSetGroup)
  const tileOffset = tileSetGroup.tileOffsets[this.currentRotation]
  const tileWidth = tileSetGroup.tileWidth

  // do the conversion depending on the current render view
  let mc
  if (mapConfig.renderView == 'isometric') {
    mc = IsometricRenderView.latLngToMC(latLng, y, this.lmap, mapConfig, tileOffset, tileWidth)
  } else if (mapConfig.renderView == 'topdown') {
    mc = TopdownRenderView.latLngToMC(latLng, y, this.lmap, mapConfig, tileOffset, tileWidth)
  } else if (mapConfig.renderView == 'side') {
    mc = SideRenderView.latLngToMC(latLng, y, this.lmap, mapConfig, tileOffset, tileWidth)
  }
  let x = mc[0]; let z = mc[1]

  // rotate the position in the other direction back from map rotation
  for (let i = 0; i < this.currentRotation; i++) {
    const nx = z // 512 blocks = one region
    const nz = -x + 512
    x = nx
    z = nz
  }

  return [x, z, y]
}
