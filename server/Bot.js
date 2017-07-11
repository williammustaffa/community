import uuid from 'uuid';
import { getRandomInt, getName, choose, distanceToPoint, prepareMessage } from './utils';
import { WORLD_SETTINGS } from './index.js';
import Chat from './Chat';
import Interests from './Interests';

export default class Bot {
  constructor(props = {}) {
    const botInterests = new Interests();
    this.id = uuid.v4();
    this.avatar = `https://api.adorable.io/avatars/32/${this.id}.png`
    this.name = props.name || getName();
    this.greetings = botInterests.greetings;
    this.topics = botInterests.topics;
    this.goodbyes = botInterests.goodbyes;
    this.energy = 500;
    this.age = 0;
    this.sex = choose('Male', 'Female');
    this.x = props.x || getRandomInt(0, WORLD_SETTINGS.width - 40);
    this.y = props.y || getRandomInt(0, WORLD_SETTINGS.height - 40);
    this.nextX = this.x;
    this.nextY = this.y;
    this.people = [];
    this.methabolism = Math.max(Math.round(Math.random() * 10), 1);
    this.maxSpeed = getRandomInt(4, 8) + this.methabolism;
    this.conversation = null;
    this.chatting = false;
    this.charisma = props.charisma || getRandomInt(-10, 10);
    this.state = {
      busy: false,
      isTalking: false,
      isWalking: false,
    }
  }

  setReputation = (id, reputation) => {
    let personFound = false;
    this.people.map(person => {
      if (person.id === id) {
        person.reputation += reputation;
        personFound = true;
      }
      return person;
    });
    if (!personFound) {
      this.people.push({
        id,
        reputation,
      });
    }
  }

  stop = () => {
    this.nextX = this.x;
    this.nextY = this.y;
    this.setState({
      isWalking: false,
      isTalking: false,
      busy: false,
    });
  }

  walk = () => {
    this.nextX = getRandomInt(0, WORLD_SETTINGS.width - 40);
    this.nextY = getRandomInt(0, WORLD_SETTINGS.height - 40);
    this.setState({
      isWalking: true,
      busy: true,
    });
  }

  step = (otherBots) => {
    let shouldWalk;

    if (this.state.isWalking && this.energy > 0) {
      this.x += Math.max(Math.min((this.nextX - this.x) / 2, this.maxSpeed), -this.maxSpeed);
      this.y += Math.max(Math.min((this.nextY - this.y) / 2, this.maxSpeed), -this.maxSpeed);
      this.energy -= 1;
      if (distanceToPoint(this.x, this.y, this.nextX, this.nextY) < 2) {
        this.stop();
      }
    } else {
      if (this.state.isWalking) {
        this.stop();
      } else {
        this.energy += this.methabolism / 10;
        if (this.energy > 400 && !this.state.busy) {
          shouldWalk = Math.random() * 100;
          if (shouldWalk <= 10) {
            this.walk();
          }
        }
      }
      let nearestBot = false;
      otherBots.map(bot => {
        if (!nearestBot) {
          nearestBot = bot;
        } else {
          let distanceFromNearest = distanceToPoint(this.x, this.y, nearestBot.x, nearestBot.y);
          let distanceFromCurrent = distanceToPoint(this.x, this.y, bot.x, bot.y);
          if (distanceFromCurrent < distanceFromNearest) {
            nearestBot = bot;
          }
        }
      });
      let shouldStartConversation =  !this.state.busy && !nearestBot.state.busy && this.charisma > 0;
      if (distanceToPoint(this.x, this.y, nearestBot.x, nearestBot.y) < 50 && shouldStartConversation) {
        let chatInstance = new Chat({
          bots: [this, nearestBot],
        });
        this.setState({
          isTalking: true,
          busy: true,
        });
        nearestBot.setState({
          isTalking: true,
          busy: true,
        });
        let chatIndex = WORLD_SETTINGS.lobbys.push(chatInstance) - 1;
        this.conversation = chatIndex;
        nearestBot.conversation = chatIndex;
      }
      if (this.conversation !== null) {
        WORLD_SETTINGS.lobbys[this.conversation].interact();
      }
    }
  }

  answer = (messageDetails) => {
    let message, topicReaction;
    let pronoum = (this.sex == 'Male')? 'his' : 'her';
    let reactions = [
      `hates with all ${pronoum} heart`,
      'hates',
      'dislikes',
      'doesn\'t like',
      'doesn\'t know anything about',
      'barelly knows about',
      'have heard of',
      'likes',
      'is interested in',
      `love with all ${pronoum} heart`,
    ];
    let topicInterest = this.topics.filter(topic => topic.topic === messageDetails.topic);
    if (topicInterest.length) {
      topicReaction = reactions[topicInterest[0].interest + 5];
    } else {
      topicReaction = 'didn\'t understand';
    }
    message = `${this.name} ${topicReaction} ${messageDetails.topic}`;
    return {
      message,
      speaker: this.name,
      speakerId: this.id,
      time: new Date(),
    }
  }

  greets = (lobbyBots) => {
    let greeting = this.greetings[getRandomInt(0, this.greetings.length - 1)];
    let subject; 
    if (lobbyBots.length > 2) {
      subject = 'everyone';
    } else {
      subject = lobbyBots.filter(bot => bot.id !== this.id)[0].name;
    }
    let message = prepareMessage(greeting, {
      speaker: this.name,
      subject,
    });
    return {
      message,
      topic: 'greeting',
      speaker: this.name,
      speakerId: this.id,
      time: new Date(),
    }
  }

  speaks = (lobbyBots) => {
    let topic = this.topics[getRandomInt(0, this.topics.length - 1)].topic;
    let subject; 
    if (lobbyBots.length > 2) {
      subject = 'everyone';
    } else {
      subject = lobbyBots.filter(bot => bot.id !== this.id)[0].name;
    }
    let message = prepareMessage(`%speaker% is talking about %topic%`, {
      speaker: this.name,
      topic,
      subject,
    });
    return {
      message,
      topic,
      speaker: this.name,
      speakerId: this.id,
      time: new Date(),
    }
  }

  goodbye = (lobbyBots) => {
    let goodbye = this.goodbyes[getRandomInt(0, this.goodbyes.length - 1)];
    let subject; 
    if (lobbyBots.length > 2) {
      subject = 'everyone';
    } else {
      subject = lobbyBots.filter(bot => bot.id !== this.id)[0].name;
    };
    let message = prepareMessage(goodbye, {
      speaker: this.name,
      topic: 'goodbye',
      subject,
    });
    return {
      message,
      speaker: this.name,
      speakerId: this.id,
      time: new Date(),
    }
  }

  setState = (newState, callback) => {
    this.state = {
      ...this.state,
      ...newState,
    };

    if (typeof calback === 'function') calback();
  }
}