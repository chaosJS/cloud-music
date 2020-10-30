import { memo, useRef, useEffect } from 'react'
import Slider from '../../components/slider/'
import RecommendList from '../../components/list'

import { Content } from './style'
import Scroll from '../../baseUI/scroll/index'
// 链接redux
// import { connect } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import * as actionTypes from './store/actionCreators'

import { forceCheck } from 'react-lazyload'
// loading
import Loading from '../../baseUI/loading/index'
const Recommend = memo((props) => {
  // useSelector相当于mapStateToProps
  const bannerList = useSelector((state) => {
    return state.getIn(['recommend', 'bannerList'])
  })
  const recommendList = useSelector((state) =>
    state.getIn(['recommend', 'recommendList'])
  )
  const enterLoading = useSelector((state) =>
    state.getIn(['recommend', 'enterLoading'])
  )
  // data
  // const { bannerList, recommendList } = props
  //  immutable 的toJS 方法
  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []
  // dispatch
  // const { getBannerDataDispatch, getRecommendListDataDispatch } = props
  // useEffect(() => {
  //   getBannerDataDispatch()
  //   getRecommendListDataDispatch()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  const dispatch = useDispatch()
  useEffect(() => {
    // 缓存redux中的数据
    if (!bannerList.size) {
      dispatch(actionTypes.getBannerList())
    }
    if (!recommendList.size) {
      dispatch(actionTypes.getRecommendList())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const xxxScrollRef = useRef()
  useEffect(() => {
    // 组件使用useImperativeHandle 的意义
    console.log(xxxScrollRef.current)
  })
  // const xxx = () => {
  //   console.log(xxxScrollRef.current)
  // }
  return (
    <Content>
      <Scroll className='list' ref={xxxScrollRef} onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          {/* <button onClick={xxx}>123</button> */}
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      {enterLoading && <Loading></Loading>}
    </Content>
  )
})
// const stateToProps = (state) => {
//   return {
//     // 不要在这里将数据 toJS
//     // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
//     bannerList: state.getIn(['recommend', 'bannerList']),
//     recommendList: state.getIn(['recommend', 'recommendList'])
//   }
// }
// const dispatchToProps = (dispatch) => {
//   return {
//     getBannerDataDispatch() {
//       dispatch(actionTypes.getBannerList())
//     },
//     getRecommendListDataDispatch() {
//       dispatch(actionTypes.getRecommendList())
//     }
//   }
// }
// connect
// export default connect(stateToProps, dispatchToProps)(Recommend)
export default Recommend
