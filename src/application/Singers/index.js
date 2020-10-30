import React, { memo, useState, useEffect, useCallback } from 'react'
import Horizen from '../../baseUI/horizen-item'
import { mainTypes, areaTypes, alphaTypes } from '../../api/config'
import Scroll from '../../baseUI/scroll'
import Loading from '../../baseUI/loading'
import { NavContainer, ListContainer, List, ListItem } from './style'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { useSelector, useDispatch } from 'react-redux'
import * as actionTypes from './store/actionCreators'
const Singers = memo(() => {
  const dispatch = useDispatch()
  // 类型
  const [category, setCategory] = useState('')
  // 地区
  const [area, setArea] = useState('')
  // 首字母
  const [alpha, setAlpha] = useState('')

  const handleUpdateCatetory = (val) => {
    setCategory(val)
    tabChangeCb()
    dispatch(actionTypes.getSingerList(val, area, alpha))
  }
  const handleUpdateArea = (val) => {
    setArea(val)
    tabChangeCb()
    dispatch(actionTypes.getSingerList(category, val, alpha))
  }
  const handleUpdateAlpha = (val) => {
    setAlpha(val)
    tabChangeCb()
    dispatch(actionTypes.getSingerList(category, area, val))
  }
  const tabChangeCb = () => {
    dispatch(actionTypes.changePageCount(0))
    dispatch(actionTypes.changeEnterLoading(true))
  }
  const {
    singerList,
    pullDownLoading,
    pullUpLoading,
    pageCount,
    enterLoading
  } = useSelector((state) => {
    return {
      singerList: state.getIn(['singers', 'singerList']).toJS() || [],
      pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
      pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
      pageCount: state.getIn(['singers', 'pageCount']),
      enterLoading: state.getIn(['singers', 'enterLoading'])
    }
  })
  useEffect(() => {
    // 缓存singerlist
    if (!singerList.size) {
      dispatch(actionTypes.getHotSingerList())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePullDown = useCallback(() => {
    dispatch(actionTypes.changePullDownLoading(true))
    dispatch(actionTypes.changePageCount(0))
    if (category === '' && area === '' && alpha === '') {
      dispatch(actionTypes.getHotSingerList())
    } else {
      dispatch(actionTypes.getSingerList(category, area, alpha))
    }
  }, [alpha, area, category, dispatch])

  const handlePullUp = useCallback(() => {
    dispatch(actionTypes.changePullUpLoading(true))
    dispatch(actionTypes.changePageCount(pageCount + 1))
    if (category === '' && area === '' && alpha === '') {
      dispatch(actionTypes.refreshMoreHotSingerList())
    } else {
      dispatch(actionTypes.refreshMoreSingerList(category, area, alpha))
    }
  }, [alpha, area, category, dispatch, pageCount])
  const renderSingerList = () => {
    return (
      <List>
        {singerList.map((item, index) => {
          return (
            <ListItem key={item.accountId + '' + index}>
              <div className='img_wrapper'>
                {/* // 包裹 img 标签 */}
                <LazyLoad
                  placeholder={
                    <img
                      width='100%'
                      height='100%'
                      src={require('./singer.png')}
                      alt='music'
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width='100%'
                    height='100%'
                    alt='music'
                  />
                </LazyLoad>
              </div>
              <span className='name'>{item.name}</span>
            </ListItem>
          )
        })}
      </List>
    )
  }

  return (
    <div>
      <NavContainer>
        <Horizen
          list={mainTypes}
          title={'类型:'}
          handleClick={handleUpdateCatetory}
          curVal={category}
        ></Horizen>
        <Horizen
          list={areaTypes}
          title={'地区:'}
          handleClick={handleUpdateArea}
          curVal={area}
        ></Horizen>
        <Horizen
          list={alphaTypes}
          title={'首字母:'}
          handleClick={handleUpdateAlpha}
          curVal={alpha}
        ></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll
          onScroll={forceCheck}
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
        >
          {renderSingerList()}
        </Scroll>
        <Loading show={enterLoading}></Loading>
      </ListContainer>
    </div>
  )
})

export default Singers
