import { axiosInstance } from './config'

export const getBannerRequest = () => {
  return axiosInstance.get('/banner')
}

export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized')
}

//hot singer list
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`)
}

export const getSingerListRequest = (category, area, alpha, count) => {
  return axiosInstance.get(
    `/artist/list?type=${category}&area=${area}&initial=${alpha.toLowerCase()}&offset=${count}`
  )
}
// 排行榜
export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`)
}
