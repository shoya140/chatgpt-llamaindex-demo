import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

const gptModelState = atom({
  key: 'gptModelState',
  default: 'gpt-3.5-turbo',
  effects_UNSTABLE: [persistAtom],
})

const systemPormptState = atom({
  key: 'systemPromptState',
  default: 'You are a helpful assistant.',
  effects_UNSTABLE: [persistAtom],
})

export { gptModelState, systemPormptState }
