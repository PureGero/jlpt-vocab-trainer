import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Day, Level, Vocab, Week } from './vocab';
import Round from './Round';
import styled from 'styled-components';
import GamemodeContext, { GamemodeContextType } from './GamemodeContext';

const WordsLeft = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  color: white;
  font-size: 1.2em;
  padding: 10px;

  @media (max-width: 800px) {
    font-size: 1em;
  }
`;

export interface GameVocab {
  vocab: Vocab;
  day: Day;
  week: Week;
  level: Level;
  tries?: 0;
}

export interface RoundInfo {
  vocab?: GameVocab;
  options: Vocab[];
}

const createVocabListFromLevel = (level: Level): Vocab[] => {
  const vocabList: Vocab[] = [];
  for (const week in level) {
    vocabList.push(...createVocabListFromWeek(level[week]));
  }
  return vocabList;
};

const createVocabListFromWeek = (week: Week): Vocab[] => {
  const vocabList: Vocab[] = [];
  for (const day in week) {
    vocabList.push(...createVocabListFromDay(week[day]));
  }
  return vocabList;
};

const createVocabListFromDay = (day: Day): Vocab[] => {
  return day
};

const selectVocab = (vocabList: Vocab[], exclude: Vocab[], gamemode: GamemodeContextType): Vocab => {
  const vocab = vocabList[Math.floor(Math.random() * vocabList.length)];
  if (exclude.find((v) => v.word === vocab.word 
      || (gamemode.furiganaMode === false && v.translation === vocab.translation)
      || (gamemode.furiganaMode === true && v.furigana === vocab.furigana)) != null) {
    return selectVocab(vocabList, exclude, gamemode);
  }
  return vocab;
}

interface GameProps {
  vocab: GameVocab[];
}

function Game(props: GameProps) {
  const [round, setRound] = useState<RoundInfo | null>(null);
  const [incorrect, setIncorrect] = useState<number>(0);

  const gamemode = useContext(GamemodeContext);

  const vocabRemaining: GameVocab[] = useMemo(() => {
    const list: GameVocab[] = [];

    props.vocab.forEach((vocab) => {
      list.push(vocab);
    });

    list.sort(() => Math.random() - 0.5);
    return list;
  }, [props.vocab]);

  const nextRound = useCallback(() => {
    const vocab = vocabRemaining.shift();

    let options: Vocab[] = [];

    if (vocab != null) {
      options.push(vocab?.vocab);
      options.push(selectVocab(createVocabListFromDay(vocab?.day), options, gamemode));
      options.push(selectVocab(createVocabListFromWeek(vocab?.week), options, gamemode));
      options.push(selectVocab(createVocabListFromLevel(vocab?.level), options, gamemode));
    }

    setRound({
      vocab,
      options,
    });

    window.localStorage.setItem('completed', ((parseInt(window.localStorage.getItem('completed') || '0') || 0) + 1).toString());
  }, [vocabRemaining, gamemode]);

  const onIncorrect = () => {
    vocabRemaining.splice(2, 0, round?.vocab!);
    vocabRemaining.splice(10, 0, round?.vocab!);
    setIncorrect(incorrect + 1);
    window.localStorage.setItem('incorrect', ((parseInt(window.localStorage.getItem('incorrect') || '0') || 0) + 1).toString());
  }

  useEffect(() => {
    nextRound();
  }, [vocabRemaining, nextRound]);

  return (
    <div>
      <WordsLeft>Incorrect: {incorrect}<br/>Remaining: {vocabRemaining.length}</WordsLeft>
      {
        round == null || round.vocab == null ? <h1>Complete!</h1> : <Round roundInfo={round} onIncorrect={onIncorrect} nextRound={nextRound}/>
      }
    </div>
  );
}

export default Game;
