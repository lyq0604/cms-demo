import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const user = {
  // 全局状态
  state: {
    token: null,
    name: null,
    roles: null,
    permissions: null,
    menus: null,
    avatar: null
  },
  // 对state数据的修改
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },
  // store与后台的交互
  actions: {
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { name, avatar, roles, permissions, menus } = data
          commit('SET_NAME', name)
          commit('SET_ROLES', roles)
          commit('SET_PERMISSIONS', permissions)
          commit('SET_MENUS', menus),
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resetRouter()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

