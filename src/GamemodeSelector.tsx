import { useContext } from 'react';
import { GameVocab } from './Game';
import styled from 'styled-components';
import GamemodeContext, { GamemodeContextType } from './GamemodeContext';
import { Vocab } from './vocab';

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 70px auto 0;
  max-width: 800px;

  @media (max-width: 800px) {
    padding: 15px;
    margin: 0 auto 0;
  }
`;

const Background = styled.div`
  background-color: black;
  width: 100%;
  height: 100%;
`;

const Title = styled.div`
  color: white;
  font-size: 4em;
  text-align: center;
  padding: 0px;

  @media (max-width: 800px) {
    font-size: 3em;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 20px 0;
  justify-content: center;
`;

const Button = styled.button`
  background-color: #d4ecff;
  border: 1px solid black;
  border-radius: 10px;
  color: inherit;
  font-size: 1.5em;
  padding: 10px 20px;
  max-width: 400px;
  width: 100%;

  &:hover {
    background-color: #e4f7ff;
    cursor: pointer;
  }
  
  @media (max-width: 400px) {
    margin: 0 20px;
  }
`;

interface GamemodeSelectorProps {
  vocabList: GameVocab[];
  setVocabList: (vocabList: GameVocab[]) => void;
  setGamemode: (gamemode: GamemodeContextType) => void;
}

function GamemodeSelector(props: GamemodeSelectorProps) {
  const gamemode = useContext(GamemodeContext);

  const hasKanji = (word: string) => {
    for (let i = 0; i < word.length; i++) {
      if (word.charCodeAt(i) >= 0x4e00 && word.charCodeAt(i) <= 0x9faf) {
        return true;
      }
    }
    return false;
  };

  const removeVocabWithoutKanji = () => {
    // Bye bye any word without kanji
    props.setVocabList(props.vocabList.filter(vocab => hasKanji(vocab.vocab.word)));
    props.vocabList.forEach(vocab => {
      const list : Vocab[] = vocab.day;
      for (let i = 0; i < list.length; i++) {
        if (!hasKanji(list[i].word)) {
          list.splice(i, 1);
          i--;
        }
      }
    });
  }

  const setFurigana = (furiganaMode: boolean) => () => {
    if (furiganaMode) {
      removeVocabWithoutKanji();
    }

    props.setGamemode({
      furiganaMode,
    });
  };

  return (
    <Background>
      <Center>
        <Title>日本語総まとめ 語彙 N2</Title>
        {
          gamemode.furiganaMode == null ? (
            <div>
              <ButtonContainer><Button onClick={setFurigana(false)}>Test on English Translation</Button></ButtonContainer>
              <ButtonContainer><Button onClick={setFurigana(true)}>Test on Kanji Reading</Button></ButtonContainer>
            </div>
          ) : (
            <div>Why are you still here?</div>
          )
        }
      </Center>
    </Background>
  );
}

export default GamemodeSelector;
