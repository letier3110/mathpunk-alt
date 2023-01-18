import { FC, useEffect, useRef, useState } from 'react'

interface MainMenuLoaderProps {
  //
}

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
    <svg viewBox="0 0 160 160" width="160" height="160">
    {/* <circle cx="80" cy="80" r="50" /> */}
    <g transform=" matrix(0.866, -0.5, 0.25, 0.433, 80, 80)">
      <path d="M 0,70 A 65,70 0 0,0 65,0 5,5 0 0,1 75,0 75,70 0 0,1 0,70Z" fill="#FCE700">
        <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="1s" repeatCount="indefinite" />
      </path>
    </g>
    <g transform=" matrix(0.866, 0.5, 0.25, 0.433, 80, 80)">
      <path d="M 0,70 A 65,70 0 0,0 65,0 5,5 0 0,1 75,0 75,70 0 0,1 0,70Z" fill="#FF6D28">
        <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="2s" repeatCount="indefinite" />
      </path>
    </g>
    <g transform=" matrix(-0.866, 0, 0.25, -0.433, 80, 80)">
      <path d="M 0,70 A 65,70 0 0,0 65,0 5,5 0 0,1 75,0 75,70 0 0,1 0,70Z" fill="#FF9E9E">
        <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="2s" repeatCount="indefinite" />
      </path>
    </g>
    {/* <path d="M 50,0 A 50,50 0 0,0 -50,0Z" transform="matrix(0.866, -0.5, 0.5, 0.866, 80, 80)" /> */}
  </svg>
  
  )
}
