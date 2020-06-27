import { CardLike, CardMap } from "./Card";
import { CardColor } from "./CardColor.enum";
import { CardType } from "./CardType.enum";

export abstract class Hand {
    constructor(private __cards: CardMap) {}

    get cards(): CardLike[] {
        return Array.from(this.__cards.values())
    }

    get count(): number {
        return this.__cards.size
    }

    insert(card: CardLike): void {
        if (this.__cards.has(card.id)) {
            throw new Error('Card/AlreadyOnHand')
        }
        this.__cards.set(card.id, card)
    }

    remove(id: string): CardLike {
        if (!this.__cards.has(id)) {
            throw new Error('Card/NotPresent')
        }
        const card = this.__cards.get(id)
        this.__cards.delete(id);
        return card;
    }

    have(cardId: string) {
        return this.cards.some(card => card.id === cardId)
    }

    hasColor(color: CardColor): boolean {
        return this.cards.some(card => card.color === color)
    }

    hasType(type: CardType): boolean {
        return this.cards.some(card => card.type === type)
    }

    cardsWithColor(color: CardColor): string[] {
        return this.cards
            .filter(card => card.color === color)
            .map(({ id }) => id)
    }

    cardsWithType(type: CardType): string[] {
        return this.cards
            .filter(card => card.type === type)
            .map(({ id }) => id)
    }
}

export class ClassicHand extends Hand {
    constructor(cards: CardLike[] = []) {
        const iterableHandMap = cards
            .map((card: CardLike): [string, CardLike] => [card.id, card])
        const handMap: CardMap = new Map(iterableHandMap)
        super(handMap)
    }
}