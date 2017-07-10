import uuid from 'uuid';
import { getRandomInt, getName, choose, distanceToPoint } from './utils';
import { WORLD_SETTINGS } from './index.js';

export default class Bot {
  constructor(props = {}) {
    this.id = uuid.v4();
    this.avatar = `https://api.adorable.io/avatars/32/${this.id}.png`
    this.name = props.name || getName();
    this.opinions = [];
    this.charisma = props.charisma || getRandomInt(-10, 10);
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

  walk = () => {
    this.nextX = getRandomInt(0, WORLD_SETTINGS.width - 40);
    this.nextY = getRandomInt(0, WORLD_SETTINGS.height - 40);
    this.setState({
      isWalking: true,
    });
  }

  step = () => {
    let shouldWalk;
    if (this.state.isWalking && this.energy > 0) {
      this.x += Math.max(Math.min((this.nextX - this.x) / 2, this.maxSpeed), -this.maxSpeed);
      this.y += Math.max(Math.min((this.nextY - this.y) / 2, this.maxSpeed), -this.maxSpeed);
      this.energy -= 1;
      if (distanceToPoint(this.x, this.y, this.nextX, this.nextY) < 2) {
        this.nextX = this.x;
        this.nextY = this.y;
        this.setState({
          isWalking: false,
        });
      }
    } else {
      if (this.state.isWalking) {
        this.nextX = this.x;
        this.nextY = this.y;
        this.setState({
          isWalking: false,
        });
      } else {
        this.energy += this.methabolism / 10;
        if (this.energy > 400) {
          shouldWalk = Math.random() * 100;
          if (shouldWalk <= 10) {
            this.walk();
          }
        }
      }
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