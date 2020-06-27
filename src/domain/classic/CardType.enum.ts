export type CardTypeList = { [k: string]: CardType }

export enum CardType {
    zero = 0,
    one = 1,
    two = 2,
    three = 3,
    four = 4,
    five = 5,
    six = 6,
    seven = 7,
    eight = 8,
    nine = 9,
    skip = 'skip', // next player loses its turn
    reverse = 'reverse', // switch direction of play
    draw2 = 'draw2', // next player draw 4
    wild = 'wild', // pick a color
    wildDraw4 = 'wildDraw4', // pick a color, next player draw 4
}
