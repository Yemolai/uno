import { ClassicHand } from "./Hand"
import { expect } from "chai";
import { CardColor } from "./CardColor.enum";
import { CardType } from "./CardType.enum";

describe('Classic Hand', () => {
    it('should generate emmpty hand', () => {
        const hand = new ClassicHand();
        expect(hand.count).to.eq(0);
        expect(hand.hasColor(CardColor.black)).to.eq(false)
        expect(hand.hasColor(CardColor.blue)).to.eq(false)
        expect(hand.hasType(CardType.seven)).to.eq(false)
        expect(hand.hasType(CardType.skip)).to.eq(false)
    })
})