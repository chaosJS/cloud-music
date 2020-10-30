import React, { memo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRankList } from './store'

import Loading from '../../baseUI/loading'
import { List, ListItem, SongList, Container } from './style'
import Scroll from '../../baseUI/scroll/index'
import { EnterLoading } from './../Singers/style'
import { filterIndex, filterIdx } from '../../api/utils'
import { renderRoutes } from 'react-router-config'
const Rank = memo((props) => {
  const dispatch = useDispatch()
  const { rankList, loading } = useSelector((state) => {
    return {
      rankList: state.getIn(['rank', 'rankList']).toJS() || [],
      loading: state.getIn(['rank', 'loading'])
    }
  })
  useEffect(() => {
    dispatch(getRankList())
  }, [dispatch])
  console.log(rankList, 'log')

  const globalStartIndex = filterIndex(rankList)
  const officialList = rankList.slice(0, globalStartIndex)
  const globalList = rankList.slice(globalStartIndex)

  const enterDetail = (name) => {
    const idx = filterIdx(name)
    if (idx === null) {
      alert('暂无相关数据')
      return
    }
  }
  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          )
        })}
      </SongList>
    ) : null
  }
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {list.map((item, index) => {
          return (
            <ListItem
              key={item.id}
              tracks={item.tracks}
              onClick={() => enterDetail(item.name)}
            >
              <div className='img_wrapper'>
                <img src={item.coverImgUrl} alt='' />
                <div className='decorate'></div>
                <span className='update_frequecy'>{item.updateFrequency}</span>
              </div>
              {renderSongList(item.tracks)}
            </ListItem>
          )
        })}
      </List>
    )
  }
  let displayStyle = loading ? { display: 'none' } : { display: '' }
  return (
    <Container>
      <Scroll>
        <div>
          <h1 className='offical' style={displayStyle}>
            官方榜
          </h1>
          {renderRankList(officialList)}
          <h1 className='global' style={displayStyle}>
            全球榜
          </h1>
          {renderRankList(globalList, true)}
          {loading ? (
            <EnterLoading>
              <Loading></Loading>
            </EnterLoading>
          ) : null}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  )
})

export default Rank
