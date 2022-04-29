/*
  Name: Fetch-Module (Fetch.js)
  Description: Contains all the logic to fetch items and blocks from the MC-Wiki.
  todo: Currently not working.
*/
import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'

module.exports = function Fetch () {
  const server = this
  this.blockList = []
  this.itemList = []
  server.fetch = {
    getAllBlocks () {
      const webpage = 'https://minecraft.gamepedia.com/Java_Edition_data_values'
      console.log('[C/Fetch]: getAllBlocks')
      console.log('[C/Fetch]: downloading webpage: ' + webpage)
      axios.get(webpage)
        .then((response) => {
          if (response.status === 200) {
            console.log('[C/Fetch]: downloaded webpage')
            const html = response.data
            const $ = cheerio.load(html)
            $('.wikitable').first().find('tr').each(function (i, elem) {
              $(this).find('td').each(function (j, elem) {
                if (j > 0) {
                  server.blockList[i] = {
                    name: server.blockList[i].name,
                    item: $(this).text().trim()
                  }
                } else {
                  server.blockList[i] = {
                    name: $(this).text().trim()
                  }
                }
              })
            })
            const json = JSON.stringify(server.blockList)
            fs.writeFile('/Users/janis/block_images/all_blocks.json', json, 'utf8', () => {
              console.log('[C/Fetch]: all_blocks.json written')
            })
            // this.getAllBlockImages()
          }
        }, error => console.log(error))
    },
    getAllItems () {
      console.log('[C/Fetch]: getAllItems')
      fs.readFile('/Users/janis/block_images/items.html', (err, html) => {
        if (err) { return }
        const $ = cheerio.load(html)
        $('.stikitable').first().find('tr').each(function (i, elem) {
          $(this).find('td').each(function (j, elem) {
            if (j > 0) {
              server.itemList[i] = {
                name: server.itemList[i].name,
                img: server.itemList[i].img,
                item: $(this).text().trim()
              }
            } else {
              server.itemList[i] = {
                name: $(this).text().trim()
              }
            }
          })
        })
        const json = JSON.stringify(server.itemList)
        fs.writeFile('/Users/janis/block_images/all_items.json', json, 'utf8', () => {
          console.log('[C/Fetch]: all_items.json written')
        })
        this.getAllItemImages()
      })
    },
    getAllBlockImages () {
      server.blockList.forEach((block) => {
        if (block.img) {
          // eslint-disable-next-line no-useless-escape
          const stripped = block.img.match(/thumb\/([a-z\/0-9].+[\w]+).png\//)
          console.log('https://gamepedia.cursecdn.com/minecraft_gamepedia/' + stripped[1] + '.png')
          axios({
            method: 'get',
            url: 'https://gamepedia.cursecdn.com/minecraft_gamepedia/' + stripped[1] + '.png',
            responseType: 'stream'
          }).then(function (response) {
            response.data.pipe(fs.createWriteStream('/Users/janis/block_images/' + block.item + '.png'))
          }).catch(() => {
            console.log('could not get ' + block.name)
          })
        }
      })
    },
    getAllItemImages () {
      server.itemList.forEach((block) => {
        if (block.name) {
          this.getOneItemImage(block.name, block.item)
        }
      })
    },
    async getOneItemImage (name, item) {
      const _name = name.replace(/ /g, '_')
      await axios.get(`https://minecraft.gamepedia.com/File:${_name}.png`)
        .then((response) => {
          const html = response.data
          const stripped = html.match(/thumb\/([a-z0-9]+)\/([a-z0-9]+)\//)
          const imageUrl = `https://gamepedia.cursecdn.com/minecraft_gamepedia/${stripped[1]}/${stripped[2]}/${_name}.png`
          console.log(imageUrl)
          axios({
            method: 'get',
            url: imageUrl,
            responseType: 'stream'
          }).then(function (response) {
            response.data.pipe(fs.createWriteStream('/Users/janis/item_images/' + item + '.png'))
          }).catch(() => {
            console.log('could not get ' + _name + '.png')
          })
        })
        .catch(() => {
          console.log(name + ' not possible to fetch... trying: ')
          axios.get(`https://minecraft.gamepedia.com/File:${item}.png`)
            .then((response) => {
              const html = response.data
              const stripped = html.match(/thumb\/([a-z0-9]+)\/([a-z0-9]+)\//)
              const imageUrl = `https://gamepedia.cursecdn.com/minecraft_gamepedia/${stripped[1]}/${stripped[2]}/${item}.png`
              console.log(imageUrl)
              axios({
                method: 'get',
                url: imageUrl,
                responseType: 'stream'
              }).then(function (response) {
                response.data.pipe(fs.createWriteStream('/Users/janis/item_images/' + item + '.png'))
              }).catch(() => {
                console.log('could not get ' + _name + '.png')
              })
            })
            .catch(() => {
              console.log(name + ' not possible to fetch... trying: ')
            })
        })
    }
  }
}
