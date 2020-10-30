import React, { memo, useRef, useEffect } from 'react'
import Scroll from '../scroll/index'
import { PropTypes } from 'prop-types'
import { List, ListItem } from './style'
const Horizen = memo((props) => {
  const Category = useRef(null)
  const { list, curVal, title } = props
  const { handleClick } = props
  // 加入初始化内容宽度的逻辑
  useEffect(() => {
    let categoryDOM = Category.current
    let tagElems = categoryDOM.querySelectorAll('span')
    let totalWidth = 10
    Array.from(tagElems).forEach((ele) => {
      totalWidth += ele.offsetWidth
    })
    categoryDOM.style.width = `${totalWidth}px`
  }, [])
  return (
    <Scroll direction={'horizental'}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {list.map((item) => {
            return (
              <ListItem
                key={item.key}
                className={`${curVal === item.key ? 'selected' : ''}`}
                onClick={() => handleClick(item.key)}
              >
                {item.name}
              </ListItem>
            )
          })}
        </List>
      </div>
    </Scroll>
  )
})
Horizen.defaultProps = {
  // 接受的列表数据
  list: [],
  // 当前的 item 值
  curVal: '',
  // 列表左边的标题
  title: '',
  // 点击不同的 item 执行的方法
  handleClick: null
}
Horizen.propTypes = {
  list: PropTypes.array,
  curVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
}
export default Horizen
