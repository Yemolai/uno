import { CardLike, ClassicCard, CardTuple } from "./Card";
import { CardColor, CardColorList } from "./CardColor.enum";
import { CardType, CardTypeList } from "./CardType.enum";

const numericCardsNumbers: CardTypeList = {
    0: CardType.zero,
    1: CardType.one,
    2: CardType.two,
    3: CardType.three,
    4: CardType.four,
    5: CardType.five,
    6: CardType.six,
    7: CardType.seven,
    8: CardType.eight,
    9: CardType.nine
};

const colorEffectsCards: CardTypeList = {
    skip: CardType.skip,
    reverse: CardType.reverse,
    draw2: CardType.draw2
}

const blackEffectCards: CardTypeList = {
    wild: CardType.wild,
    wild4: CardType.wildDraw4
}

const cardsColors: CardColorList = {
    blue: CardColor.blue,
    green: CardColor.green,
    red: CardColor.red,
    yellow: CardColor.yellow
}

/**
 * Generate combinatory result array of CardTuple
 * @param {CardColorList} colors list
 * @param {CardTypeList} types list
 * @returns {CardTuple[]} cards' tuples
 */
const generateCardsTuples = (colors: CardColorList, types: CardTypeList): CardTuple[] => Object
    .values(colors)
    .map((color): CardTuple[] => Object.values(types)
        .map((type: CardType) => [color, type]))
    .flat()

const possibleNumericCards: CardTuple[] = generateCardsTuples(cardsColors, numericCardsNumbers)
const possibleColorEffectsCards: CardTuple[] = generateCardsTuples(cardsColors, colorEffectsCards)
const possibleBlackEffectsCards: CardTuple[] = generateCardsTuples({ black: CardColor.black }, blackEffectCards)

const gen = <T>(n: number, thing: T) => new Array(n).fill(0).map(() => thing)

const classicCards = [
    ...possibleNumericCards,
    ...possibleNumericCards
        .filter(([_c, type]: CardTuple) => type !== CardType.zero),
    ...gen(2, possibleColorEffectsCards).flat(),
    ...gen(4, possibleBlackEffectsCards).flat(),
]

export abstract class Deck {
    private __cards: Map<string, CardLike>
    constructor(cards: CardLike[]) {
        const cardsEntries: Array<[string, CardLike]> = cards
            .map(card => [card.id, card])
        this.__cards = new Map<string, CardLike>(cardsEntries)
    }
    get cards() {
        return [...this.__cards.values()]
    }
    get(id: string) {
        return this.__cards.get(id)
    }
    has(id: string) {
        return this.__cards.has(id)
    }
}

export class ClassicDeck extends Deck {
    constructor() {
        const cards: CardLike[] = classicCards
            .map(([color, type]) => new ClassicCard(color, type))
        super(cards)
    }
}