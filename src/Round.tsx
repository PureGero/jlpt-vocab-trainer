import { useEffect, useState } from 'react';
import { RoundInfo } from './Game';
import styled from 'styled-components';
import Options from './Options';

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 70px auto 0;
  width: 800px;
`;

const Background = styled.div`
  background-color: black;
  width: 100%;
  height: 100%;
`;

const Word = styled.div`
  color: white;
  font-size: 4em;
  text-align: center;
  padding: 0px;
`;

const Furigana = styled.div`
  color: white;
  font-size: 2em;
  text-align: center;
  padding: 0px 0px 10px;
`;

const ExampleSentence = styled.div`
  color: white;
  font-size: 2em;
  text-align: center;
  padding: 15px 0 0;
`;

const ExampleSentenceTranslation = styled.div`
  color: white;
  font-size: 1.5em;
  text-align: center;
  padding: 0;
`;

const NextButton = styled.button`
  background-color: #d4ecff;
  border: 1px solid black;
  border-radius: 10px;
  font-size: 1.5em;
  margin: 20px auto;
  padding: 10px 20px;
  width: 400px;

  &:hover {
    background-color: #e4f7ff;
    cursor: pointer;
  }
`;

interface RoundProps {
  roundInfo: RoundInfo;
  nextRound: () => void;
  onIncorrect: () => void;
}

function Round(props: RoundProps) {
  const [correct, setCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setCorrect(null);
  }, [props.roundInfo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (correct != null) {
          props.nextRound();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [props, correct]);

  if (props.roundInfo.vocab == null) {
    return <div>1341</div>;
  }

  return (
    <Background>
      <Center>
        <Word>{props.roundInfo.vocab?.vocab.word}</Word>
        <Furigana>{correct != null ? props.roundInfo.vocab?.vocab.furigana : '\u00A0'}</Furigana>

        <Options options={props.roundInfo.options} correctOption={props.roundInfo.vocab?.vocab} setCorrect={correct => {
          if (!correct) {
            props.onIncorrect();
          }

          setCorrect(correct);
        }} correct={correct} />

        <ExampleSentence>{correct != null ? props.roundInfo.vocab?.vocab.example.sentence : '\u00A0'}</ExampleSentence>
        <ExampleSentenceTranslation>{correct != null ? props.roundInfo.vocab?.vocab.example.translation : '\u00A0'}</ExampleSentenceTranslation>
        {correct != null ? <NextButton onClick={props.nextRound}>Next &gt;</NextButton> : null}
      </Center>
    </Background>
  );
}

export default Round;
