const axios = require('axios');
const fs = require('fs');
const { get } = require('request-promise');

module.exports = {
  config: {
    name: 'imagine',
    aliases: [],
    version: '1.0',
    author: 'kshitiz',
    countDown: 10,
    role: 0,
    shortDescription: 'Generate an image.',
    longDescription: 'Generate an image.',
    category: '𝗙𝗨𝗡',
    guide: '{pn}[prompt | 1] upto 45',
  },

  onStart: async function ({ api, args, message, event }) {
    let path = __dirname + '/cache/image.png';
    const tzt = args.join(' ').split('|').map(item => item.trim());
    let txt = tzt[0];
    let txt2 = tzt[1];

    let tid = event.threadID;
    let mid = event.messageID;

    if (!args[0] || !txt || !txt2) {
      return api.sendMessage('Please provide a prompt and a model. ex: prompt | 1', tid, mid);
    }

    try {
      api.sendMessage('⏳ Generating...', tid, mid);

      let enctxt = encodeURIComponent(txt);
      let url = `https://arjhil-prodia-api.arjhilbard.repl.co/generate?prompt=${enctxt}&model=${txt2}`;

      let result = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(path, result.data);
      api.sendMessage({ attachment: fs.createReadStream(path) }, tid, () => fs.unlinkSync(path), mid);
    } catch (e) {
      return api.sendMessage(e.message, tid, mid);
    }
  },
};
