import axios from '@/libs/request'
import qs from 'qs'
/**
 * 获取文章列表
 * @param {Object} options 参数
 */
const getList = (options) => {
  return axios.get('/public/list-admin?' + qs.stringify(options))
}
// 根据帖子id删除
const deletePostByid = (id) => {
  return axios.get('/content/delete?tid=' + id)
}
// 根绝帖子id编辑
const updatePostByid = (data) => {
  return axios.post('/content/update-id', data)
}

// 内容管理 -> 标签管理
const getTags = (options) => {
  return axios.get('/admin/getTags?' + qs.stringify(options))
}

const addTag = (data) => {
  return axios.post('/admin/addTag', data)
}

const removeTag = (id) => {
  return axios.get('/admin/removeTag?ptid=' + id)
}

const updateTag = (data) => {
  return axios.post('/admin/editTag?', data)
}

export {
  getList,
  deletePostByid,
  updatePostByid,
  getTags,
  addTag,
  removeTag,
  updateTag
}
