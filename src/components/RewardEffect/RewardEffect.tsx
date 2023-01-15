import { FC } from 'react'
import { ReactComponent as Reward } from '../../assets/loader.svg'

export const RewardEffect: FC = () => {
  return (
    <div className='rewardSvgWrapper'>
      <Reward width={200} height={400} className={'rewardSvg'} />
      <Reward width={200} height={400} className={'rewardSvg'} />
    </div>
  )
}
