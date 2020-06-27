import { CardLike, CardMap } from "./Card";

export interface PileLike {
    topCard: CardLike | null
    count: number
    shuffle(): void
    discardOnTop(card: CardLike): void
    buyFromTop(): CardLike
    dump(): CardLike[]
}

export abstract class Pile implements PileLike {
    private __cards: CardMap;

    constructor(cards: CardLike[] = []) {
        this.__cards = new Map(cards.map(card => [card.id, card]))
        this.shuffle()
    }

    public get topCard() : CardLike | null {
        return this.__cards.get([...this.__cards.keys()].find(v => v)) || null
    }

    public get count() : number {
        return this.__cards.size
    }

    public shuffle() {
        const array = [...this.__cards.values()]
        const shuffled = array
            .reduceRight((result, current, idx, arr) => {
                const randomIdx = Math.floor(Math.random() * idx)
                result[randomIdx] = current
                result[idx] = arr[randomIdx]
                return result
            }, <CardLike[]>new Array(array.length).fill(null))
        this.__cards = new Map(shuffled.map(card => [card.id, card]))
    }

    public discardOnTop(card: CardLike) {
        if (this.__cards.has(card.id)) {
            throw new Error('Pile/CardAlreadyPresent')
        }
        this.__cards.set(card.id, card);
    }
    
    public buyFromTop() {
        const [card = null] = [...this.__cards.values()]
        this.__cards.delete(card.id)
        return card
    }

    public dump() {
        const cards = [...this.__cards.values()]
        this.__cards.clear()
        return cards
    }
}

export class ClassicPile extends Pile {}