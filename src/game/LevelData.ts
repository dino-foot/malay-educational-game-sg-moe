export interface LevelData {
    id: number;
    imageKey: string;
    correctWord: string;
    meaningWord: string;
    audioKey?: string;
}

export interface TrainLevelData {
    id: number;
    imageKey: string;
    trainWord: string;
    hintWord: string; // appea on HUD
    hintSentence: string; // appear on HUD
    audioKey?: string;
}

export interface KayakLevelData {
    id: number;
    imageKey?: string;
    audioKey?: string;
    correctWord: string;
    exampleSentence: string;
    newSentence: string;
}
