import { useEffect, useState } from 'react';
import { RoundInfo } from './Game';
import styled from 'styled-components';
import Options from './Options';

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 70px auto 0;
  max-width: 800px;

  @media (max-width: 800px) {
    padding: 15px;
  }
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

  @media (max-width: 800px) {
    font-size: 3em;
  }
`;

const Furigana = styled.div`
  color: white;
  font-size: 2em;
  text-align: center;
  padding: 0px 0px 10px;

  @media (max-width: 800px) {
    font-size: 1.4em;
  }
`;

const ExampleSentence = styled.div`
  color: white;
  font-size: 2em;
  text-align: center;
  padding: 15px 0 0;

  @media (max-width: 800px) {
    font-size: 1.6em;
  }
`;

const ExampleSentenceTranslation = styled.div`
  color: white;
  font-size: 1.5em;
  text-align: center;
  padding: 0;

  @media (max-width: 800px) {
    font-size: 1.2em;
  }
`;

const NextButtonContainer = styled.div`
  display: flex;
  margin: 20px 0;
  justify-content: center;
`;

const NextButton = styled.button`
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
        {correct != null ? <NextButtonContainer><NextButton onClick={props.nextRound}>Next &gt;</NextButton></NextButtonContainer> : null}
      </Center>
    </Background>
  );
}

export default Round;
