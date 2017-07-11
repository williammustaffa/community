import { WORLD_SETTINGS } from './index';
import { getRandomInt } from './utils';
import uuid from 'uuid';

class History {
  constructor(props) {
    this.message = props.message || 'No description';
    this.speaker = props.speaker || 'Unknown';
    this.speakerId = props.speakerId || 'Unknown';
    this.time = props.time || 'Unknown';
  }
}

export default class Chat {
  constructor(props) {
    this.id = uuid.v4();
    this.bots = props.bots || [];
    this.speaker = 0;
    this.history = [];
    this.standBy = 0;
    this.duration = getRandomInt(5, 15);
    this.index = 0;
    this.active = true;
  }
  end = () => {
    this.bots.map(bot => {
      bot.chatting = false;
      bot.conversation = null;
      bot.stop();
      bot.walk();
    });
    this.active = false;
  }
  interact = () => {
    if (!this.active) return;
    if (this.standBy <= 0) {
      let historyMessage;
      let conversationEnd = false;
      let currentBot = this.bots[this.speaker];
      if (this.index <= this.duration) {
        if (this.history.length === 0) {
          historyMessage = currentBot.greets(this.bots);
        } else {
          historyMessage = currentBot.speaks(this.bots);
        }
      } else {
        conversationEnd = true;
        historyMessage = currentBot.goodbye(this.bots);
      }
      this.bots.map(bot => {
        bot.chatting = false;
      });
      currentBot.chatting = true;
      // Save message to history
      console.log(`[${new Date()}] ${historyMessage.speaker}: ${historyMessage.message}`)
      this.history.push(new History(historyMessage));
      this.bots.filter(bot => bot.id !== currentBot.id).map(bot => {
        let answer = bot.answer(historyMessage);
        this.history.push(new History(answer));
        console.log(`[${new Date()}] ${answer.speaker}: ${answer.message}`);
      });
      this.speaker ++;
      if (this.speaker >= this.bots.length) {
        this.speaker = 0;
      }
      let seconds = getRandomInt(2, 6) * 1000;
      this.standBy = Math.round(seconds / WORLD_SETTINGS.timeout);
      if (conversationEnd) this.end();
      this.index ++;
    } else {
      this.standBy --;
    }
  }
}