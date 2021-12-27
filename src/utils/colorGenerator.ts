const DEGREES: number = 360;

export const randomHslColor = (): string => {
    return "hsl(" + Math.random() * 360 + ", 100%, 75%)";
};

export const randomGradient = (amountOfColors: number = 2): string => {
    const colors: string[] = [];

    for (let i = 0; i < amountOfColors; i++) {
        colors.push(randomHslColor());
    }

    const angle = Math.floor(Math.random() * DEGREES);

    return `${angle}deg, ${colors.join(", ")}`;
};
