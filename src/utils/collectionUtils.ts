export const reorder = <T>(
    collection: T[],
    oldIndex: number,
    newIndex: number
): T[] => {
    const orderedCollection = Array.from(collection);
    const [removed] = orderedCollection.splice(oldIndex, 1);

    orderedCollection.splice(newIndex, 0, removed);

    return orderedCollection;
};

export const groupBy = <T>(
    collection: any[],
    key: keyof T
): {
    [key: string]: T[];
} =>
    collection.reduce((group, item) => {
        const keyValue = item[key];

        group[keyValue] = group[keyValue] ?? [];
        group[keyValue].push(item);

        return group;
    }, {});
