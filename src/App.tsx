import styled from 'styled-components';
import Game, { GameVocab } from './Game';
import fetchVocab from './vocab';
import { useEffect, useState } from 'react';
import GamemodeContext, { GamemodeContextType } from './GamemodeContext';
import GamemodeSelector from './GamemodeSelector';

const Version = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  color: #aaa;
  font-size: 0.7em;
  margin: 0.5em;
`;

interface AppProps {
  
}

function App(props: AppProps) {
  const [vocabList, setVocabList] = useState<GameVocab[]>([]);
  const [gamemode, setGamemode] = useState<GamemodeContextType>({
    furiganaMode: null,
  });

  const initVocab = async () => {
    const vocab = await fetchVocab();
    setVocabList(Object.values(vocab).map(level => {
      return Object.values(level).map(week => {
        return Object.values(week).map(day => {
          return day.map(vocab => {
            return {
              vocab,
              day,
              week,
              level,
            };
          });
        }).flat();
      }).flat();
    }).flat());
  }

  useEffect(() => {
    initVocab();
  }, []);

  return (
    <div>
      <GamemodeContext.Provider value={gamemode}>
        {
          vocabList.length === 0 ? (
            <div>Loading...</div>
          ) :
          gamemode.furiganaMode == null ? (
            <GamemodeSelector vocabList={vocabList} setVocabList={setVocabList} setGamemode={setGamemode} />
          ) : (
            <Game vocab={vocabList} />
          )
        }
      </GamemodeContext.Provider>
      <Version>Version: {process.env.REACT_APP_GIT_SHA}</Version>
    </div>
  );
}

export default App;
