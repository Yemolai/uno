import { v4 as uuid } from "uuid";
import { CardType } from "./CardType.enum";
import { CardColor } from "./CardColor.enum";

export type CardTuple = [CardColor, CardType]

export type CardMap = Map<string, CardLike>

export abstract class CardLike {
    private __id: string;
    constructor(
        private __color: CardColor,
        private __type: CardType
    ) {
        this.__id = uuid();
    }
    get id() {
        return this.__id
    }
    get type() {
        return this.__type
    }
    get color() {
        return this.__color
    }
}

export class ClassicCard extends CardLike {}