import { Player } from "./Player"
import { Deck, ClassicDeck } from "./Deck"
import { ClassicPile, PileLike } from "./Pile";
import { ClassicCard } from "./Card";
import { CardColor } from "./CardColor.enum";

export const GAME_PLAYERS_MIN = 2;
export const GAME_PLAYERS_MAX = 4;

export type Chair = { left?: Chair, player: Player, right?: Chair }

export enum Direction { left, right }

export class Table {
    private __chairs: Chair[]
    private __ltr: boolean
    private __turn: Chair
    constructor(players: Player[], startingPlayer: number = -1) {
        this.__ltr = false
        if (players.length < 2) {
            throw new Error('Table/PlayersInvalidCount')
        }
        this.__chairs = players.reduce((chairs, player, idx, players) => {
            const chair: Chair = { player }
            if (idx > 0) {
                chair.left = chairs[idx - 1]
                chairs[idx - 1].right = chair
            } else if ((idx + 1) === players.length) {
                chair.right = chairs[0]
                chairs[0].left = chair
            }
            return chairs;
        }, <Chair[]>[])
        const invalidStartingPlayer = this.__chairs.length >= startingPlayer
            || startingPlayer < 0
        const startingPlayerIdx = invalidStartingPlayer
            ? Math.floor(Math.random() * players.length)
            : startingPlayer
        this.__turn = this.__chairs[startingPlayerIdx]
    }
    get chairs() {
        return this.__chairs
    }
    get turn() {
        return this.__turn
    }
    get currentPlayer() {
        return this.turn.player
    }
    get direction() {
        return this.__ltr ? Direction.left : Direction.right
    }
    reverse() {
        this.__ltr = !this.__ltr
    }
    nextPlayer() {
        this.__turn = this.__ltr
            ? this.__turn.right
            : this.__turn.left
        return this.currentPlayer
    }
}

export abstract class Game {
    protected __players: Player[]
    protected __decks: Deck[]
    protected __buyPile: PileLike;
    protected __discardPile: PileLike;
    protected __table: Table;

    constructor(players: Player[]) {
        if (players.length < GAME_PLAYERS_MIN || players.length > GAME_PLAYERS_MAX) {
            throw new Error('Game/IncompatiblePlayerNumber')
        }
        this.__players = players
        this.__table = new Table(players)
    }

    get players() {
        return this.__players
    }

    get latestCardOnDiscardPile() {
        return this.__discardPile.topCard
    }

    get direction() {
        return this.__table.direction
    }
    
}

export type ClassicGameOptions = {
    jumpIn: boolean,
    buyUntilCanPlay: boolean,
    tradeWithSeven: boolean,
    spinWithZero: boolean,
    forcePlay: boolean,
}

export class ClassicGame extends Game {
    protected static startingCardsNumber = 7
    constructor(players: Player[], protected options: ClassicGameOptions) {
        super(players)
        this.__decks = [new ClassicDeck()]
        const deckCards = this.__decks
            .map(deck => deck.cards)
            .flat()
        this.__buyPile = new ClassicPile(deckCards)
        this.__discardPile = new ClassicPile()
        const { startingCardsNumber } = ClassicGame
        let chair = this.__table.turn.right
        while(players.some(player => player.hand.count < startingCardsNumber)) {
            chair.player.hand.insert(this.__buyPile.buyFromTop())
        }
    }
    protected getPlayer(playerId: string) {
        return this.__players.find(player => player.id === playerId)
    }
    protected getCard(cardId: string) {
        const deck = this.__decks.find(deck => deck.has(cardId))
        if (!deck) {
            throw new Error('Game/InvalidCard')
        }
        return deck.get(cardId)
    }
    canJumpIn(playerId: string, cardId: string) {
        if (this.options.jumpIn !== true) return false;
        const player = this.getPlayer(playerId)
        if (!player.hand.have(cardId)) {
            throw new Error('Game/InvalidMove')
        }
        const card = this.getCard(cardId)
        const topCard = this.__discardPile.topCard
        const isntCurrentPlayer = this.__table.currentPlayer.id !== player.id
        const isSameCard = topCard.color === card.color
            && topCard.type === card.type
        return isntCurrentPlayer && isSameCard
    }
    isThisPlayerTurn(playerId: string) {
        return this.__table.currentPlayer.id === playerId
    }
    canPlayCard(cardId: string): boolean {
        const card = this.getCard(cardId)
        const discardPileTopCard = this.__discardPile.topCard
        const isBlack = card.color === CardColor.black
        const compatibleColor = card.color === discardPileTopCard.color
        const compatibleType = card.type === discardPileTopCard.type
        return isBlack || compatibleColor || compatibleType
    }
    turnPlay(player: Player, card: ClassicCard) {

    }
    jumpInPlay(player: Player, card: ClassicCard) {

    }
    executePlay(playerId: string, cardId: string) {
        const player = this.getPlayer(playerId)
        if (!player.hand.have(cardId)) {
            throw new Error('Game/InvalidMove')
        }
        const card = this.getCard(cardId)
        if (this.isThisPlayerTurn(playerId) && this.canPlayCard(cardId)) {
            this.turnPlay(player, card)
        } else if (this.canJumpIn(playerId, cardId)) {
            this.jumpInPlay(player, card)
        }
    }
}