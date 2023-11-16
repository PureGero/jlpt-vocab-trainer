import { Vocab } from './vocab';
import Option from './Option';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const createSeed = (word: string): number => {
  let seed = 0;
  for (let i = 0; i < word.length; i++) {
    seed += word.charCodeAt(i);
  }
  return seed;
};

const seededRandomize = (options: Vocab[]): Vocab[] => {
  const randomized: Vocab[] = [...options];
  
  for (let i = 0; i < randomized.length; i++) {
    let seed = createSeed(randomized[i].word + randomized[0].word);
    let swapIndex = seed % randomized.length;
    let temp = randomized[i];
    randomized[i] = randomized[swapIndex];
    randomized[swapIndex] = temp;
  }

  return randomized;
};

interface OptionsProps {
  options: Vocab[];
  correctOption: Vocab;
  setCorrect: (correct: boolean) => void;
  correct: boolean | null;
}

function Options(props: OptionsProps) {
  const options = seededRandomize(props.options);

  return (
    <Container>
      {
        options.map((option, i) => {
          return (
            <Option key={i} vocab={option} theAnswer={option === props.correctOption} setCorrect={props.setCorrect} correct={props.correct} />
          );
        })
      }
    </Container>
  );
}

export default Options;

