export const zeniteIdentities = {
    pulse: {
        name: "Zenite Pulse",
        primary: "#ff6b00",
        secondary: "#101010",
        accent: "#ffd166",
        surface: "#fff7ed",
        description: "Energia laranja e preto para vendas, shows e eventos noturnos.",
    },
    premium: {
        name: "Zenite Premium",
        primary: "#f97316",
        secondary: "#18181b",
        accent: "#facc15",
        surface: "#fafafa",
        description: "Mais sofisticada, com preto profundo, laranja limpo e toque dourado.",
    },
    arena: {
        name: "Zenite Arena",
        primary: "#ff4d00",
        secondary: "#050505",
        accent: "#ffffff",
        surface: "#f5f5f4",
        description: "Alto contraste para uma marca forte e esportiva.",
    },
} as const;

export type ZeniteIdentity = keyof typeof zeniteIdentities;
