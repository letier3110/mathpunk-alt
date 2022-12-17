import { FC, useMemo, useState } from 'react'
import { AdditionView } from '../../components/AdditionView/AdditionView'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { CardType } from '../../math/arithmetic'
import { GAME_MODES } from '../../math/math'
import { Numberator } from '../../math/Numberator'
import { Summator } from '../../math/Summator'

interface AddCardProps {
  card: CardType
  index?: number
}

interface TutorialProps {
  gameMode: GAME_MODES
  setGameMode: (x: GAME_MODES) => void
}

const FIRST_TARGET = 4

const card1 = new Numberator()
card1.setCount(1)

const card2 = new Numberator()
card2.setCount(2)

const card3 = new Numberator()
card3.setCount(3)

const initialDeckStepPlus: CardType[] = [card1, card2, card3]

export const Tutorial: FC<TutorialProps> = ({ gameMode, setGameMode }) => {
  const [chain, setChain] = useState<CardType[]>([])
  const [deck, setDeck] = useState<CardType[]>(initialDeckStepPlus)

  const equalizerResult: number = useMemo(() => {
    if (chain.length === 0) return 0
    if (chain.length === 1) return Number(chain[0].getCount())
    const strResult = chain.reduce(
      (a, p, i) => a.concat(p.getCount().toString(), i === chain.length - 1 ? '' : '+'),
      ''
    )
    const result: number = eval(strResult)
    return result
  }, [chain])

  const handleAddCard = ({ card, index }: AddCardProps) => {
    if(chain.length === 2) return;
    if (!index) {
      const newArr = chain.concat(card)
      setChain(newArr)
      setDeck(deck.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...chain.slice(0, index), card, ...chain.slice(index)]
      setChain(newArr)
      setDeck(deck.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleRemoveCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = deck.concat(card)
      setDeck(newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...deck.slice(0, index), card, ...deck.slice(index)]
      setDeck(newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleEqual = () => {
    // setEnemyHp(enemyHp + prediction)
    // handleStartNewRound()
  }

  return (
    <>
      {/* <div className='header'>
        <div className='card' onClick={() => setGameMode(GAME_MODES.PLOTTING)}>
          Next gamemode?
        </div>
      </div> */}
      <div className='root'>
        <div className='hps'>
          <div>Play cards to reach result:</div>
          <div>{FIRST_TARGET}</div>
        </div>
        <div className='chainElem'>
          {chain.length > 0 && chain[0] ? (
            <CardTypeView
              card={chain[0]}
              noAddition
              className='card noAddition'
              handleCardClick={() => handleRemoveCard({ card: chain[0], index: 0 })}
            />
          ) : (
            <CardTypeView card={new Numberator()} noAddition className='cardPlace noAddition' />
          )}
          <div className=''>
            <AdditionView showPreview card={new Summator()} />
          </div>
          {chain.length > 1 && chain[1] ? (
            <CardTypeView
              card={chain[1]}
              noAddition
              className='card noAddition'
              handleCardClick={() => handleRemoveCard({ card: chain[1], index: 1 })}
            />
          ) : (
            <CardTypeView card={new Numberator()} noAddition className='cardPlace noAddition' />
          )}
          {chain.length === 2 && (
            <div className='chainResultElem'>
              <div className={['cardAddition', 'equalizer'].join(' ')}>
                <div className='additionText'>=</div>
              </div>
              <div onClick={handleEqual} className='card'>
                <div className='mainText'>
                  {equalizerResult.toString().indexOf('.') >= 0 ? equalizerResult.toFixed(2) : equalizerResult}
                </div>
              </div>
            </div>
          )}
        </div>
        <CardsHand>
          {deck.map((x) => (
            <CardTypeView
              card={x}
              handleCardClick={() => handleAddCard({ card: x })}
              noAddition
              className='card noAddition'
            />
          ))}
        </CardsHand>
      </div>
    </>
  )
}
