import Bot from './Bot';

const INITIAL_POPULATION = 5;
export const WORLD_SETTINGS = {
  width: 640,
  height: 480,
};

export default class Server {
  constructor() {
    this.population = [];
    for (let i=0; i<INITIAL_POPULATION; i++) {
      this.population.push(new Bot());
    }
    this.init = this.init.bind(this);
  }
  init(io) {
    io.on('connection', (socket) => {
      socket.emit('DataPackage', {
        population: this.population,
        world: WORLD_SETTINGS,
      });
    });
  }
}