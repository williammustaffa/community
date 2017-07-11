import Bot from './Bot';
import { distanceToPoint } from './utils';

const INITIAL_POPULATION = 5;
export const WORLD_SETTINGS = {
  width: 640,
  height: 480,
  timeout: 60,
  lobbys: [],
};

export default class Server {
  constructor() {
    this.population = [];
    for (let i=0; i<INITIAL_POPULATION; i++) {
      this.population.push(new Bot());
    }
    this.init = this.init.bind(this);
  }

  step = (io) => {

    this.population.map(bot => {
      bot.step(this.population.filter(_bot => _bot.id !== bot.id ));
    });

    io.emit('DataUpdate', {
      population: this.population,
      world: WORLD_SETTINGS,
    });
    setTimeout(() => this.step(io), WORLD_SETTINGS.timeout);
  }

  init(io) {
    io.on('connection', (socket) => {
      socket.emit('DataPackage', {
        population: this.population,
        world: WORLD_SETTINGS,
      });
    });
    this.step(io);
  }
}