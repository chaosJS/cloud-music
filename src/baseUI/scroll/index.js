import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useMemo,
  useImperativeHandle
} from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from 'styled-components'
import Loading from '../loading/index'
import LoadingV2 from '../loading-v2/index'
import { debounce } from '../../api/utils'
const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`
const PullUpLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`

const PullDownLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`
// forwardRef 引用传递  来获取传递给它的 ref，然后转发到它渲染的 DOM
const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState()

  // 获取DOM元素的节点  获取子组件的实例
  const scrollContaninerRef = useRef()

  const { direction, click, refresh, bounceTop, bounceBottom } = props

  const { pullUp, pullDown, onScroll, pullUpLoading, pullDownLoading } = props

  // 相当于vue的computed
  const pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300)
  }, [pullUp])
  const pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300)
  }, [pullDown])
  // useEffect  看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合
  useEffect(() => {
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    })
    // 此时 bScroll = scroll
    setBScroll(scroll)
    //  如果你的 effect 返回一个函数，React 将会在执行清除操作时调用它：
    return () => {
      setBScroll(null)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!bScroll || !onScroll) return
    bScroll.on('scroll', (scroll) => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll])

  useEffect(() => {
    if (!bScroll || !pullUp) return
    const handlePullUp = () => {
      //判断是否滑动到了底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce()
      }
    }
    bScroll.on('scrollEnd', handlePullUp)
    return () => {
      bScroll.off('scrollEnd', handlePullUp)
    }
  }, [pullUp, pullUpDebounce, bScroll])

  useEffect(() => {
    if (!bScroll || !pullDown) return
    const handlePullDown = (pos) => {
      //判断用户的下拉动作
      if (pos.y > 50) {
        pullDownDebounce()
      }
    }
    bScroll.on('touchEnd', handlePullDown)
    return () => {
      bScroll.off('touchEnd', handlePullDown)
    }
  }, [pullDown, bScroll, pullDownDebounce])

  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })
  // useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。 应当与 forwardRef 一起使用
  // 这样其父组件可以用scrollContaninerRef.current.refesh 或者scrollContaninerRef.current.getBScroll
  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll
      }
    }
  }))
  const PullUpdisplayStyle = pullUpLoading
    ? { display: '' }
    : { display: 'none' }
  const PullDowndisplayStyle = pullDownLoading
    ? { display: '' }
    : { display: 'none' }

  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={PullUpdisplayStyle}>
        <Loading></Loading>
      </PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={PullDowndisplayStyle}>
        <LoadingV2></LoadingV2>
      </PullDownLoading>
    </ScrollContainer>
  )
})

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
}

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool, //是否支持向上吸顶
  bounceBottom: PropTypes.bool //是否支持向上吸顶
}

export default Scroll
