import { getRandomInt } from './utils';
export default class Interests {
  constructor() {
    const topicsList = [
      'football',
      'tenis',
      'basketball',
      'soccer',
      'sports',
      'chess',
      'computers',
      'video-games',
      'multiplayer-games',
      'television',
      'facebook',
      'twitter',
      'instagram',
      'snapchat',
      'tv shows',
      'drama movies',
      'horror movies',
      'commedy movies',
      'movies',
      'documentaries',
      'drama books',
      'horror books',
      'commedy books',
      'jogging',
      'parties',
      'school',
      'college',
      'jobs',
      'future',
      'stars',
      'universe',
      'existence',
      'the pain of existence',
      'singularity',
      'music',
      'indie music',
      'funk music',
      'rock',
      'heavy metal',
      'classic movie',
    ];
    this.topics = topicsList.map(topic => ({
      topic,
      interest: getRandomInt(-5, 5),
    }));
    this.greetings = [
      '%speaker% salutes %subject%',
      '%speaker% says \'Hi!\' to %subject%',
      '%speaker% says \'Hello!\' to %subject%',
      '%speaker% greets %subject%',
    ];
    this.goodbyes = [
      '%speaker% says \'Goodbye!\' to %subject%',
      '%speaker% says \'See ya!\' to %subject%',
    ];
  }
}