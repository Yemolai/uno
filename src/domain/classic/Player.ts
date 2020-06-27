import { v4 as uuid } from "uuid"
import { Hand, ClassicHand } from "./Hand";

export abstract class Player {
    private __points: number;
    constructor(
        private __id: string = uuid(),
        private __name: string,
        private __profilePic: string,
        public hand: Hand = new ClassicHand()
    ) {
        this.__points = 0
    }
    get id() {
        return this.__id
    }
    get name() {
        return this.__name
    }
    get profilePic() {
        return this.__profilePic
    }
    get points() {
        return this.__points
    }
    addPoints(points: number) {
        this.__points += points
    }
}