import { FC, useEffect, useMemo, useState } from 'react'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { ArithmeticCardTypeEnum, CardType } from '../../math/arithmetic'

import { ArithmeticCardTypeEnumToClass, DIFFICULTIES, DifficultySettings, GAME_MODES } from '../../math/math'
import { weightedRand } from '../../math/utils'

import { Reroll } from '../../Reroll'
import { ARITHMETIC_VALUES, generateTargetArithmetic, getDeckPoolArithmetic } from './Arithmetic.utils'

interface AddCardProps {
  card: CardType
  index?: number
}

interface ArithmeticProps {
  gameMode: GAME_MODES
  setGameMode: (x: GAME_MODES) => void
}

export const Arithmetic: FC<ArithmeticProps> = ({ gameMode, setGameMode }) => {
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [count, setCount] = useState(generateTargetArithmetic())
  const [tutorialMode, setTutorialMode] = useState<boolean>(false)
  const [left, setLeft] = useState(3)
  const [enemyHp, setEnemyHp] = useState(10)
  const [round, setRound] = useState<number>(1)
  const [chain, setChain] = useState<CardType[]>([])
  const [deck, setDeck] = useState<CardType[]>(getDeckPoolArithmetic())
  const [prediction, setPrediction] = useState(0)

  const equalizerResult: number = useMemo(() => {
    if (chain.length === 0) return 0
    if (chain.length === 1) return Number(chain[0].getCount())
    const strResult = chain.reduce(
      (a, p, i) => a.concat(p.getCount().toString(), i === chain.length - 1 ? '' : p.getName()),
      ''
    )
    const result: number = eval(strResult)
    return result
  }, [chain])

  const isGameEnded = enemyHp <= 0
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const preciseness = ARITHMETIC_VALUES[mode].preciseness

  useEffect(() => {
    if (equalizerResult === count) {
      setPrediction(-5)
    }
    const localPreciseness = preciseness / 100
    if (equalizerResult > count * (1 - localPreciseness) && equalizerResult < count * (1 + localPreciseness)) {
      const res = Math.round((1 - Math.abs((equalizerResult - count) / count)) * 5)
      setPrediction(-res)
    } else {
      setPrediction(5)
    }
  }, [equalizerResult, count, mode, preciseness, setPrediction])

  const handleAddCard = ({ card, index }: AddCardProps) => {
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

  const handleStartNewRound = () => {
    setPrediction(0)
    setCount(generateTargetArithmetic(hardMode))
    setRound(round + 1)
    setChain([])
    setLeft(3)
    setDeck(getDeckPoolArithmetic(hardMode))
  }

  const handleStartNewGame = () => {
    setPrediction(0)
    setCount(generateTargetArithmetic(hardMode))
    setRound(1)
    setChain([])
    setDeck(getDeckPoolArithmetic(hardMode))
    setEnemyHp(10)
    setLeft(3)
  }

  const handleReroll = () => {
    if (left > 0) {
      setLeft(left - 1)
      setDeck(getDeckPoolArithmetic(hardMode))
    }
  }

  const handleEqual = () => {
    setEnemyHp(enemyHp + prediction)
    handleStartNewRound()
  }

  return (
    <>
      <div className='header'>
        <div className='card' onClick={() => setGameMode(GAME_MODES.PLOTTING)}>
          Next gamemode?
        </div>
      </div>
      <div className='root'>
        {tutorialMode && (
          <div className='sidebar'>
            <div>
              1. Select and click card from the bottom of the screen. Bottom of the screen is represents your HAND.
            </div>
            <div>2. Combine your cards to achieve value as close as you can to the target.</div>
            <div>3. In order to win, you need to make correct guesses and lower points to zero.</div>
            <div>
              4. Your value must consist {100 - preciseness}% of target's value. Otherwise points will grow, pushing
              away victory of the game.
            </div>
            <div>5. To confirm your value - click on the card after equals (=) sign.</div>
          </div>
        )}
        <div>
          Tutorial mode?
          <input type='checkbox' checked={tutorialMode} onChange={(e) => setTutorialMode(e.target.checked)} />
          {/* {tutorialMode && <div className='tutorialText'>LABELS WITH THIS FONT ARE FOR TUTORIAL</div>} */}
        </div>
        <div className='hps'>
          {/* <div>
          Your points:
          {hp}
        </div> */}
          {/* <div>
          Round:
          {round}
        </div> */}
          <div>
            Remaining points to beat:
            {enemyHp}
            {prediction !== 0 && chain.length > 0 && (
              <span style={{ color: prediction > 0 ? '#ff0000' : '#00aa00' }}>
                {' '}
                {prediction !== 0 ? `(${prediction > 0 ? '+' : ''}${prediction})` : ''}
              </span>
            )}
          </div>
        </div>
        {isGameEnded === false && (
          <>
            <div className='count'>{count}</div>
            {chain.length > 0 && (
              <div className='chain'>
                {chain.map((x) => (
                  <div key={x.getId()} className='chainElem'>
                    <CardTypeView
                      card={x}
                      showPreview
                      className='card noAddition'
                      handleCardClick={() => handleRemoveCard({ card: x })}
                    />
                  </div>
                ))}
                {chain.length > 0 && (
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
            )}
            {/* {tutorialMode && chain.length > 0 && (<div className='tutorialText'>CLICK ON THE CARD RESULT CARD TO APPLY IT</div>)} */}
            <CardsHand>
              {deck.map((x) => (
                <CardTypeView key={x.getId()} card={x} handleCardClick={() => handleAddCard({ card: x })} />
              ))}
            </CardsHand>
            {/* {tutorialMode && deck.length > 0 && <div className='tutorialText'>CLICK ON THE CARD TO PLAY IT</div>} */}
          </>
        )}
        {isGameEnded === true && (
          <div className='win'>
            <div>🥳🥳🥳</div>
            <div>You won!</div>
            <div>
              Hard mode?
              <input type='checkbox' checked={hardMode} onChange={(e) => setHardMode(e.target.checked)} />
            </div>
            {tutorialMode && <div className='tutorialText'>PRESS THE CARD TO START NEW GAME</div>}
            <div className='card' onClick={handleStartNewGame}>
              Start new game?
            </div>
          </div>
        )}
      </div>
      <Reroll left={left} handleReroll={handleReroll} />
    </>
  )
}
