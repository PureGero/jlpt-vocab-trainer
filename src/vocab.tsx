import n2_week1 from './vocab/n2/第一週.csv';
import n2_week2 from './vocab/n2/第二週.csv';
import n2_week3 from './vocab/n2/第三週.csv';
import n2_week4 from './vocab/n2/第四週.csv';
import n2_week6 from './vocab/n2/第六週.csv';
import n2_week7 from './vocab/n2/第七週.csv';

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
      '第二週': parseData(n2_week2),
      '第三週': parseData(n2_week3),
      '第四週': parseData(n2_week4),
      '第六週': parseData(n2_week6),
      '第七週': parseData(n2_week7),
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
