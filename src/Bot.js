import EventEmitter from 'events';
import bodyParser from 'body-parser';
import { Router } from 'express';
import Elements from './Elements.js';
import Buttons from './Buttons.js';
import QuickReplies from './QuickReplies.js';
import _ from 'lodash';
import axios from 'axios';
import fetch from './libs/fetch';
import Debug from 'debug';

export { Elements, Buttons, QuickReplies };

const userCache = {};

const debug = Debug('Bot');

export async function wait(time) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}

class Bot extends EventEmitter {
  static Buttons = Buttons;
  static Elements = Elements;

  static wait = wait;

  constructor(verification, debug) {
    super();
    this._debug = debug;
    this._verification = verification;
    this._marketing = false;
  }

  get marketing() {
    return this._marketing;
  }

  set marketing(newMarketing) {
    this._marketing = newMarketing;
  }

  async deleteFields(_fields) {
    try {
      const response = await axios.delete('https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + this._token, {
        headers: { 'Content-Type': 'application/json' },
        params: {
          fields: _fields
        },
      });
      return response.result;
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.error)
        return error.response.data.error.message;
      else if (error.response.status && error.response.statusText)
        return error.response.status + ' - ' + error.response.statusText;
      else return "unknown error";
    }
  }

  async getFields(_fields) {
    try {
      const response = await axios.get('https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + this._token, {
        headers: { 'Content-Type': 'application/json' },
        params: {
          fields: JSON.stringify(_fields),
        },
      });
      if (response.data) return response.data;
      else if (response.result) return response.result;
      else return response;
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.error)
        return error.response.data.error.message;
      else if (error.response && error.response.status && error.response.statusText)
        return error.response.status + ' - ' + error.response.statusText;
      else return "unknown error";
    }
  }

  async send(to, message) {
    try {
      await fetch('https://graph.facebook.com/v2.6/me/messages', {
        method: 'post',
        json: true,
        query: { access_token: this._token },
        body: { recipient: { id: to }, message }
      });
    } catch (e) {
      if (e.text) {
        let text = e.text;
        try {
          const err = JSON.parse(e.text).error;
          text = `${err.type || 'Unknown'}: ${err.message || 'No message'}`;
        } catch (ee) {
          // ignore
        }

        throw Error(text);
      } else {
        throw e;
      }
    }
  }

  async senderAction(to, senderAction) {
    try {
      await fetch('https://graph.facebook.com/v2.6/me/messages', {
        method: 'post',
        json: true,
        query: { access_token: this._token },
        body: { recipient: { id: to }, sender_action: senderAction }
      });
    } catch (e) {
      if (e.text) {
        let text = e.text;
        try {
          const err = JSON.parse(e.text).error;
          text = `${err.type || 'Unknown'}: ${err.message || 'No message'}`;
        } catch (ee) {
          // ignore
        }

        throw Error(text);
      } else {
        throw e;
      }
    }
  }

  async setTyping(to, isTyping) {
    const senderAction = isTyping ? 'typing_on' : 'typing_off';
    this.senderAction(to, senderAction);
  }

  async startTyping(to) {
    try {
      this.setTyping(to, true);
    } catch (error) {
      console.error('startTyping error: ', error.message);
    }

  }

  async stopTyping(to) {
    this.setTyping(to, false);
  }

  async fetchUser(id, fields = 'first_name,last_name,profile_pic', cache = false) {
    const key = id + fields;
    let props;

    if (cache && userCache[key]) {
      props = userCache[key];
      props.fromCache = true;
    } else {
      const { body } = await fetch(`https://graph.facebook.com/v2.6/${id}`, {
        query: { access_token: this._token, fields }, json: true
      });

      props = body;
      props.fromCache = false;

      if (cache) {
        userCache[key] = props;
      }
    }

    return props;
  }

  async handleMessage(input) {
    const body = JSON.parse(JSON.stringify(input));

    // Get messaging if existis, otherwise gets standby
    // const message = body.entry[0].messaging
    //   ? body.entry[0].messaging[0]
    //   : body.entry[0].standby ? body.entry[0].standby[0] : null;

    const message = body.entry[0].messaging
      ? body.entry[0].messaging[0]
      : null;

    if (message) {
      message.raw = input;
      if (message.message) {
        Object.assign(message, message.message);
        delete message.message;
      }

      message.sender.fetch = async (fields, cache) => {
        const props = await this.fetchUser(message.sender.id, fields, cache);
        Object.assign(message.sender, props);
        return message.sender;
      };

      // POSTBACK
      if (message.postback) {
        message.isButton = true;

        let postbackPayload = {};

        try {
          postbackPayload = JSON.parse(message.postback.payload);
          if (postbackPayload.hasOwnProperty('data')) {
            message.postback = postbackPayload;
            message.data = postbackPayload.data;
            message.event = postbackPayload.event;
            this.emit('postback', message.event, message, message.data);

            if (postbackPayload.hasOwnProperty('event')) {
              this.emit(message.event, message, message.data);
            }
          }
        } catch (e) {
          // console.error('ERROR parsing postback.payload', postbackPayload, e);
          this.emit(message.postback.payload, message);
        }
        return;
      }

      // READ
      if (message.read) {
        this.emit('read', message, message.read);
        return;
      }

      // DELIVERY
      if (message.delivery) {
        Object.assign(message, message.delivery);
        message.delivery = message.delivery.mids;

        delete message.delivery.mids;

        this.emit('delivery', message, message.delivery);
        return;
      }

      // OPTIN
      if (message.optin) {
        message.param = message.optin.ref || true;
        message.optin = message.param;
        this.emit('optin', message, message.optin);
        return;
      }

      // QUICK_REPLY
      if (message.quick_reply && !message.is_echo) {
        let postback = {};

        try {
          postback = JSON.parse(message.quick_reply.payload) || {};
        } catch (e) {
          // ignore
        }

        message.isQuickReply = true;

        if (postback.hasOwnProperty('data')) {
          message.postback = postback;
          message.data = postback.data;
          message.event = postback.event;

          this.emit('postback', message.event, message, message.data);

          if (postback.hasOwnProperty('event')) {
            this.emit(message.event, message, message.data);
          }
        } else {
          this.emit('quick-reply', message, message.quick_reply);
        }

        return;
      }

      const attachments = _.groupBy(message.attachments, 'type');

      if (attachments.image) {
        message.images = attachments.image.map(a => a.payload.url);
      }

      if (attachments.video) {
        message.videos = attachments.video.map(a => a.payload.url);
      }

      if (attachments.audio) {
        message.audio = attachments.audio.map(a => a.payload.url)[0];
      }

      if (attachments.location) {
        const location = attachments.location[0];
        message.location = { ...location, ...location.payload.coordinates };
        delete message.location.payload;
      }

      message.object = body.object;

      delete message.attachments;

      this.emit('message', message);
    } else {
      const msgStandBy = body.entry[0].standby ? body.entry[0].standby[0] : null;
      if (msgStandBy) {
        console.info(`\x1b[46m Standby\x1b[0m, text:\x1b[32m${msgStandBy.message && msgStandBy.message.text}\x1b[0m`);
      }
    }
  }

  router() {
    const router = new Router();

    router.use(bodyParser.json());

    router.get('/', (req, res) => {
      if (req.query['hub.verify_token'] === this._verification) {
        res.send(req.query['hub.challenge']);
      } else {
        res.send('Error, wrong validation token');
      }
    });

    router.post('/', (req, res) => {
      this._token = req.token;
      this._marketing = req.marketing;

      if (req.body) {
        this.handleMessage(req.body);
      }
      res.send().status(200);
    });

    return router;
  }

  static async send_message_tag(token, to, message) {
    try {
      await fetch('https://graph.facebook.com/v2.6/me/messages', {
        method: 'post',
        json: true,
        query: { access_token: token },
        body: {
          recipient: { id: to },
          message,
          messaging_type: 'MESSAGE_TAG',
          tag: 'SHIPPING_UPDATE'
        }
      });
    } catch (e) {
      if (e.text) {
        let text = e.text;
        try {
          const err = JSON.parse(e.text).error;
          text = `${err.type || 'Unknown'}: ${err.message || 'No message'}`;
        } catch (ee) {
          // ignore
        }

        throw Error(text);
      } else {
        throw e;
      }
    }
  }


}

export { Bot };

export default Bot;
