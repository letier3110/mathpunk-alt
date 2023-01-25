import './App.css'
import { Inventory } from './pages/Inventory/Inventory'
import { GhostPreviewProvider } from './hooks/GhostPreview.constate'
import { RerollsProvider } from './hooks/Rerolls.constate'
import { IntroContainer } from './pages/Intro/IntroContainer'
import { DuelContainer } from './pages/Duel/DuelContainer'
import { MainMenuContainer } from './pages/MainMenu/MainMenuContainer'
import { TutorialContainer } from './pages/Tutorial/TutorialContainer'
import { ArithmeticContainer } from './pages/Arithmetic/ArithmeticContainer'
import { PlottingContainer } from './pages/Plotting/PlottingContainer'
import { DrinksContainer } from './pages/Drinks/DrinksContainer'

function App() {
  return (
    <>
      <div className='boardGhost'></div>
      <IntroContainer />
      <TutorialContainer />
      <MainMenuContainer />
      <DuelContainer />
      <ArithmeticContainer />
      <PlottingContainer />
      <DrinksContainer />
      <GhostPreviewProvider>
        <RerollsProvider>
          <Inventory />
        </RerollsProvider>
      </GhostPreviewProvider>
    </>
  )
}

export default App
