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
// 添加菜单
const addMenu = (data) => axios.post('/admin/add-menu', data)
// 删除菜单
const deleteMenu = (data) => axios.post('/admin/delete-menu', data)
// 修改菜单
const updateMenu = (data) => axios.post('/admin/update-menu', data)
// 查询菜单
const getMenu = () => axios.get('/admin/get-menu')
// 添加角色
const addRole = (data) => axios.post('/admin/add-role', data)
// 删除角色
const deleteRole = (data) => axios.post('/admin/delete-role', data)
// 修改角色
const updateRole = (data) => axios.post('/admin/update-role', data)
// 查询角色
const getRoles = () => axios.get('/admin/get-roles')
// 查询角色名称列表
const getRoleNames = () => axios.get('/admin/get-roles-names')

export {
  getUserList,
  updateUserById,
  deleteUserById,
  checkUsername,
  addUser,
  updateUserBatchById,
  addMenu,
  deleteMenu,
  updateMenu,
  getMenu,
  addRole,
  deleteRole,
  updateRole,
  getRoles,
  getRoleNames
}
