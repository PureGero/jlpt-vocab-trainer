import n2_week1 from './vocab/n2/第一週.csv';
import n2_week6 from './vocab/n2/第六週.csv';

export interface Vocab {
  word: string;
  furigana: string;
  translation: string;
  example: {
    sentence: string;
    translation: string;
  };
}

export type VocabList = Vocab[];
export type Day = VocabList;
export type Week = Record<string, Day>;
export type Level = Record<string, Week>;
export type JLPTs = Record<string, Level>;

const parseData = async (url: string): Promise<Week> => {
  const data = await (await fetch(url)).text();

  const week: Week = {};
  const lines = data.split('\n');

  let currentWeek = '';
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!~line.indexOf(',')) {
      currentWeek = line;
      week[currentWeek] = [];
      i++;
      continue;
    }
    const [word, furigana, translation, exampleSentence, exampleTranslation] = line.split(',');
    week[currentWeek].push({
      word,
      furigana,
      translation,
      example: {
        sentence: exampleSentence,
        translation: exampleTranslation,
      },
    });
    i++;
  }
  return week;
}

const fetchVocab = async (): Promise<JLPTs> => {
  const jlpts: any = {
    'JLPT N2': {
      '第一週': parseData(n2_week1),
      '第六週': parseData(n2_week6),
    },
  };

  // Flatten all the promises into real objects
  for (let jlpt in jlpts) {
    jlpts[jlpt] = await jlpts[jlpt];
    for (let week in jlpts[jlpt]) {
      jlpts[jlpt][week] = await jlpts[jlpt][week];
      for (let day in jlpts[jlpt][week]) {
        jlpts[jlpt][week][day] = await jlpts[jlpt][week][day];
      }
    }
  }

  return jlpts;
}

export default fetchVocab;
