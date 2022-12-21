import { FC, useEffect, useRef, useState } from 'react'

interface MainMenuLoaderProps {
  //
}

const TUTORIAL_NAME = 'Start Tutorial?'
const ARITHMETIC_NAME = 'Start Arithmetic?'
const PLOTTING_NAME = 'Start Plotting?'
const DUEL_NAME = 'Start Duel?'

const INITIAL_PROGRESS = 15
const PROGRESS_DELTA = 5
const FINAL_PROGRESS = 175

export const MainMenuLoader: FC<MainMenuLoaderProps> = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const secondaryColor = '#fa5'
  const strokeWidth = 4

  const circleStyle = {}

  const [progress, setProgress] = useState(INITIAL_PROGRESS)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setProgress((p) => (p > FINAL_PROGRESS ? INITIAL_PROGRESS : p + PROGRESS_DELTA))
    }, 100)
    return () => {
      if (timerRef && timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [progress])

  return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox={`0 0 300 300`}
          stroke='#5af'
          width={300}
          height={300}
          strokeWidth={1}
        >
          <circle cx='100' cy='100' fill='none' r='28' stroke={secondaryColor} strokeWidth={strokeWidth} />
          <circle
            cx='100'
            cy='100'
            fill='none'
            r='28'
            stroke='currentColor'
            strokeDasharray={`${progress}, 170`}
            strokeDashoffset='1'
            strokeLinecap='round'
            strokeWidth={strokeWidth}
            style={circleStyle}
            transform='rotate(-90 100 100)'
          />
        </svg>
  )
}
