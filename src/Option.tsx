import { Vocab } from './vocab';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #d4ecff;
  border: 1px solid black;
  border-radius: 10px;
  flex: 1 0 21%;
  font-size: 1.8em;
  padding: 60px;
  margin: 20px;
  text-align: center;

  &:hover {
    background-color: #e4f7ff;
    cursor: pointer;
  }
`;

const Answer = styled.div`
  font-size: 0.8em;
`;

interface OptionProps {
  vocab: Vocab;
  theAnswer: boolean;
  setCorrect: (correct: boolean) => void;
  correct: boolean | null;
}

function Option(props: OptionProps) {
  let color = '';
  if (props.correct != null && props.theAnswer) {
    color = '#74e800';
  } else if (props.correct === false) {
    color = '#ff6969';
  }

  return (
    <Container onClick={() => props.correct == null ? props.setCorrect(props.theAnswer) : null} style={ {backgroundColor: color} }>
      <Answer>&nbsp;</Answer>
      { props.vocab.translation }
      { props.correct != null && !props.theAnswer ? <Answer>{ props.vocab.word }</Answer> : <Answer>&nbsp;</Answer> }
    </Container>
  );
}

export default Option;

