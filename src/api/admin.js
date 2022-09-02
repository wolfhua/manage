import axios from '@/libs/request'
import qs from 'qs'

/**
 * 获取用户列表
 * @param {Object} options 参数
 */
const getUserList = (options) => {
  return axios.get('/admin/users?' + qs.stringify(options))
}
// 更新用户
const updateUserById = (data) => axios.post('/admin/update-user', data)
// 删除用户
const deleteUserById = (ids) => axios.post('/admin/delete-user?', { ids })
// 检查用户名是否存在
const checkUsername = (data) => axios.get('/admin/checkname?' + qs.stringify(data))
// 添加用户
const addUser = (data) => axios.post('/admin/add-user', data)
// 批量更新用户
const updateUserBatchById = (data) => axios.post('/admin/update-user-settings', data)

export {
  getUserList,
  updateUserById,
  deleteUserById,
  checkUsername,
  addUser,
  updateUserBatchById
}
