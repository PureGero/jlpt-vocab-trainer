import { createContext } from "react";

export interface GamemodeContextType {
    furiganaMode: boolean | null;
}

const GamemodeContext = createContext<GamemodeContextType>({
    furiganaMode: null,
});

export default GamemodeContext;