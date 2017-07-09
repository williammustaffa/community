import uuid from 'uuid';
import { getRandomInt, getName, choose } from './utils';
import { WORLD_SETTINGS } from './index.js';

export default class Bot {
  constructor(props = {}) {
    this.id = uuid.v4();
    this.avatar = `https://api.adorable.io/avatars/32/${this.id}.png`
    this.name = props.name || getName();
    this.opinions = [];
    this.charisma = props.charisma || getRandomInt(-10, 10);
    this.energy = 100;
    this.age = 0;
    this.sex = choose('Male', 'Female');
    this.x = props.x || getRandomInt(0, WORLD_SETTINGS.width - 40);
    this.y = props.y || getRandomInt(0, WORLD_SETTINGS.height - 40);
  }
}