import { expect } from "chai"
import { ClassicCard } from "./Card"
import { CardType as Type } from "./CardType.enum"
import { CardColor as Color } from "./CardColor.enum"

describe('Classic Card test', () => {
    it('should create a Card', () => {
        const card = new ClassicCard(Color.blue, Type.one)
        expect(card.color).to.eq(Color.blue);
        expect(card.type).to.eq(Type.one);
    });
    it('should create cards with unique uuids', () => {
        const card1 = new ClassicCard(Color.red, Type.skip)
        const card2 = new ClassicCard(Color.red, Type.skip)
        expect(card1.id).not.be.eq(card2.id);
        expect(card1.color).to.be.eq(card2.color);
        expect(card1.type).to.be.eq(card2.type);
    })
})