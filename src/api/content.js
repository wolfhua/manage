import axios from '@/libs/request'
import qs from 'qs'
/**
 * 获取文章列表
 * @param {Object} options 参数
 */
const getList = (options) => {
  return axios.get('/public/list?' + qs.stringify(options))
}

export {
  getList
}
