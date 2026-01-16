import { LevelData } from "./LevelData";

// todo dont use image use hint sentence for id 1 and 10

export const BUS_LEVELS_DATA: LevelData[] = [
    {
        id: 1,
        correctWord: "BERSIAR-SIAR",
        hintSentence: "Berjalan-jalan.",
        imageKey: null, //! dont use image for this question use sentenece
    },
    {
        id: 2,
        correctWord: "HINGGAP",
        hintSentence: "Terbang lalu berhenti di suatu tempat.",
        imageKey: "hinggap"
    },
    {
        id: 3,
        correctWord: "KENDERAAN",
        hintSentence: "Sesuatu yang digunakan oleh orang ramai untuk bergerak dari satu tempat ke tempat lain.",
        imageKey: "kenderaan"
    },
    {
        id: 4,
        correctWord: "MENGHALAU",
        hintSentence: "Bergerak ke sesuatu tempat.",
        imageKey: "menghalau"
    },
    {
        id: 5,
        correctWord: "MENYESAL",
        hintSentence: "Rasa bersalah kerana melakukan sesuatu yang tidak baik.",
        imageKey: "menyesal"
    },
    {
        id: 6,
        correctWord: "MENYEWA",
        hintSentence: "Menggunakan sesuatu dengan membayar wang.",
        imageKey: "menyewa"
    },
    {
        id: 7,
        correctWord: "PANDUAN",
        hintSentence: "Arahan atau petunjuk yang membantu seseorang untuk mengetahui sesuatu.",
        imageKey: "panduan"
    },
    {
        id: 8,
        correctWord: "TERBELIAK",
        hintSentence: "Membuka mata dengan besar.",
        imageKey: "terbeliak"
    },
    {
        id: 9,
        correctWord: "TERPINGA-PINGA",
        hintSentence: "Hairan kerana tidak tahu perkara yang sedang berlaku.",
        imageKey: "terpinga-pinga"
    },
    {
        id: 10,
        correctWord: "TERUJA",
        hintSentence: "Sangat gembira atau bersemangat tentang sesuatu.",
        imageKey: null // "teruja"
    }
];
