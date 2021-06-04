import Vue from 'vue'
import Vuex from 'vuex'

//imports of AJAX functions
import { fetchPosts, fetchPost, postNewPost, authenticate, register, likePost, postNewComment,deletePost,deleteComment, getLikes} from '@/api'

Vue.use(Vuex)

//state is used across many components to get data
let state = {
  posts: [],
  currentPost: {},
  user: {},
  jwt: '',
  isLoggedIn: '',
  errorMsg: '',
}

const actions = {
  // asynchronous operations
  //loadPosts calls fetchPosts from api/index.js and commits setPosts mutation with the response from fetchPosts
  async loadPosts(context) {
    const response = await fetchPosts();
    context.commit('setPosts', {posts: response})
  },
  //loadPost calls fetchPost with desired postId from api/index.js and commits setPost mutation with the response from fetchPost
  async loadPost(context, { id }) {
    const response = await fetchPost(id);
    context.commit('setPost', {post: response})
  },
  //login takes in a username and password (inside the user variable), commits mutation userdata, runs authenticate, then dispatches loginChecker. 
  //If there is a error, log the error, and dispatch errorMessage(which sets errorMsg in state)
  login (context, user) {
    context.commit('setUserData', { user })
    return authenticate(user)
      .then(() => context.dispatch('loginChecker'))
      .catch(error => {
        console.log('Error Authenticating: ', error)
        context.dispatch('errorMessage', error.message)
      })
  },
  //Register takes user which contains username and password, commits mutation and runs register from api/index.js
  //if there is a error, log the error, and dispatch errorMessage(which sets errorMsg in state)
  register (context, user) {
    context.commit('setUserData', { user })
    return register(user)
      .catch(error => {
        console.log('Error registering: ', error.error)
        context.dispatch('errorMessage', error.error)
      })
  },
  //logout checks if there is a user and token in local storage, and deletes them if they are there. Then commits logOut mutation to set isLoggedIn to false
  //after you are logged out we remove the previous errorMsg (so errors from previous login attempts are not shown the next time the user wants to log in)
  logout(context){
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      if (localStorage.getItem('token')){
        localStorage.removeItem('token');
      }
    }
    context.commit('logOut')
    context.dispatch('errorMessage', '')
  },
  //this function checks if there is a user in localstorage (used in login to make sure the user was actually logged in) before committing log in to change isLoggedIn to true
  loginChecker(context){
    if(localStorage.getItem('user')){
      context.commit('logIn')
    }
  },
  //addLike runs likePost form api/index.js and dispatches loadpost so the like is updated on the site
  addLike(context, id){
    return likePost(id, localStorage.getItem('token'))
      .then(response => context.dispatch('loadPost', { id: response }))
  },
  //addComment runs postNewComment with the users token variable to check if they are a valid user(logged in and not using an expired token).
  //It then dispatches loadPost so the comments on the page are updated
  addComment(context, comment) {
    return postNewComment(comment, localStorage.getItem('token'))
      .then(response => context.dispatch('loadPost', { id: response }))
  },
  //removePost runs deletePost form api/index.js with the token from loalstorage.
  //This does not need to load the page again as the user is routed to home when the post is delted
  removePost(context, id){
    return deletePost(id, localStorage.getItem('token'))
  },
  //removeComment runs deleteComment and loads the post again so the page is updated (does not show the old comment anymore)
  removeComment(context, id){
    return deleteComment(id, localStorage.getItem('token'))
      .then(response => context.dispatch('loadPost', { id: response }))
  },
  //this function is used to set errorMsg in state by calling a mutation (setError)
  errorMessage(context, error){
    context.commit('setError', error )
  }
}

//mutations update state
const mutations = {
  // isolated data mutations
  setPosts(state, payload ) {
    state.posts = payload.posts
  },
  setPost(state, payload) {
    state.currentPost = payload.post
  },
  setUserData (state, payload) {
    console.log('setUserData payload = ', payload)
    state.userData = payload.userData
  },
  logOut(state){
    state.isLoggedIn = false
  },
  logIn(state){
    state.isLoggedIn = true
  },
  setError(state, error){
    state.errorMsg = error
  }
}

const getters = {
  // This getter is used to check if there is a user in localstorage (used in logout.vue)
  isAutenticated () {
    if (localStorage.getItem('user')) {
      return true
    }
    return false
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})

export default store