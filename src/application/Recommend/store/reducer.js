import * as actionTypes from './constants'
import { fromJS } from 'immutable' //  fromJS 把 JS 数据结构转化成 immutable 数据结构

const defaultState = fromJS({
  enterLoading: true,
  bannerList: [],
  recommendList: []
})

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_BANNER:
      return state.set('bannerList', action.data)
    case actionTypes.CHANGE_RECOMMEND_LIST:
      return state.set('recommendList', action.data)
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    default:
      return state
  }
}
