export interface EmojiQuestion {
    id: number;
    emojis: string;
    answer: string;
    description?: string;
}

export const emojiQuiz: EmojiQuestion[] = [
    {
        id: 1,
        emojis: "🦌🔴👃",
        answer: "Sång: Rudolf med röda mulen",
        description: "Ren + Röd + Näsa"
    },
    {
        id: 2,
        emojis: "🏠😱✈️",
        answer: "Film: Ensam Hemma / Home Alone",
        description: "Hus + Skrik + Flygplan/Resa"
    },
    {
        id: 3,
        emojis: "💔🩹📅",
        answer: "Sång: Last Christmas – Wham!",
        description: "Hjärtekross + Plåster/Laga + Kalender"
    },
    {
        id: 4,
        emojis: "🚫💧👹",
        answer: "Film: Gremlins",
        description: "Förbud + Vatten + Monster – de berömda reglerna"
    },
    {
        id: 5,
        emojis: "🦆📺🎄",
        answer: "TV/Tradition: Kalle Anka och hans vänner önskar God Jul",
        description: "Anka + TV + Gran"
    },
    {
        id: 6,
        emojis: "🎁👉👤",
        answer: "Sång: All I Want for Christmas is You – Mariah Carey",
        description: "Paket + Pekar + Du/Person"
    },
    {
        id: 7,
        emojis: "🚂❄️🎫",
        answer: "Film: Polarexpressen / The Polar Express",
        description: "Tåg + Snö + Biljett"
    },
    {
        id: 8,
        emojis: "👀🤱🎅",
        answer: "Sång: Jag såg mamma kyssa tomten",
        description: "Ögon/Såg + Mamma + Tomte"
    },
    {
        id: 9,
        emojis: "🕯️🕯️✨",
        answer: "Sång: Nu tändas tusen juleljus",
        description: "Ljus + Ljus + Gnistra/Skina"
    },
    {
        id: 10,
        emojis: "🌑👣👸",
        answer: "Sång: Luciasången / Natten går tunga fjät",
        description: "Mörker/Natt + Fotspår + Lucia/Krona"
    }
];
