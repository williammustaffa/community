export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function choose(...props) {
  return props[getRandomInt(0, props.length - 1)];
}

export function getName() {
  const endSyllables = ['r', 's', 'h', 'z'];
  const syllables = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'x', 'y', 'z', 'w'];
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const nOfSy = getRandomInt(2, 4);
  let name = '';
  let startWithVowel = Boolean(Math.round(Math.random()));
  let endsWithSyllables = Boolean(Math.round(Math.random()));
  let sy, vo, es;
  for (let i=0; i<nOfSy; i++) {
    sy = syllables[getRandomInt(0, syllables.length - 1)];
    vo = vowels[getRandomInt(0, vowels.length - 1)];
    es = endSyllables[getRandomInt(0, endSyllables.length - 1)];
    if (i === 0 && startWithVowel) {
      name = `${name}${vo}`;
    } else {
      name = `${name}${sy}${vo}`;
    }
    if (endsWithSyllables) {
      name = `${name}${es}`;
    }
  }
  return name;
}