// api/index.js
const API_URL = 'http://127.0.0.1:5000/api';

export async function fetchPosts() {
  const response = await fetch(`${API_URL}/posts/`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.status == 200) { //if the fetch goes through
    return await response.json(); //return the response (posts)
  }
}

export async function fetchPost (postId) {
  const response = await fetch(`${API_URL}/posts/${postId}/`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.status == 200) { //if the fetch goes through
    return await response.json(); //return the reponse (post)
  }
}

export async function postNewPost(post, jwt) { //POSTing post via JSON.stringify
  const response = await fetch(`${API_URL}/posts/`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}` //jwt is given to check if the user is logged in and token is not expired (server side)
    },
    body: JSON.stringify(post)
  })
  if (response.status == 401){ //if there is an error (not logged in or token expired)
    let error = await response.json()
    throw error //throw error to execute catch in NewPost.vue
  }
}

export async function likePost(id, jwt) { //this PUT function is to add/update a like in the Likes table and in Post.likes (or remove if the user already likes the post)
  const response = await fetch(`${API_URL}/posts/`,{
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`//jwt is given to check if the user is logged in and token is not expired (server side)
    },
    body: JSON.stringify(id) //sending in the posts id
  })
  if (response.status == 201){ 
    return id
  }
  if (response.status == 401){ //if there is an error the error is thrown so .catch runs
    let error = await response.json()
    throw error
  }
}

export async function postNewComment(comment, jwt) { //this POST is used to add a new comment to the Comments table. This comment has a relationship to a specific post, and will be shown under the post
  const response = await fetch(`${API_URL}/comments/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`//jwt is given to check if the user is logged in and token is not expired (server side)
    },
    body: JSON.stringify(comment)
  })
  if (response.status == 201){
    return comment.post_id
  }
  if (response.status == 401){ //if there is an error the error is thrown so .catch runs
    let error = await response.json()
    throw error
  }
}

export async function authenticate (user) { //this POST is used to create a token for the users loginsession
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  if (response.status == 200) { //if the fetch goes through correctly token.user and the token is added to localStorage
    let token = await response.json();
    const userToken = token.token
    localStorage.setItem('token', JSON.stringify(userToken));
    localStorage.setItem('user', JSON.stringify(token.user));
  }
  if (response.status == 401){//if there is an error the error is thrown so .catch runs
    let error = await response.json()
    throw error
  }
}

export async function register (user) { //this post is used to add a new user to the Users table
  console.log(user)
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  if (response.status == 401){//if there is an error the error is thrown so .catch runs
    let error = await response.json()
    throw error
  }
  return response
}

export async function deletePost(id, jwt) { //this PUT is used to set the posts deleted column to 1(true), making it so the post does not show up anymore
  const response = await fetch(`${API_URL}/posts/${id}/`, { //the post is not removed from the database, instead deleted is used to keep track of deleted posts
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`//jwt is given to check if the user is logged in and token is not expired (server side)
    },
  })
  if (response.status == 401){//if there is an error the error is thrown so .catch runs
    let error = await response.json()
    throw error
  }
}

export async function deleteComment(id, jwt) {//this PUT is used to set the comments deleted column to 1(true), making it so the post does not show up anymore
  const response = await fetch(`${API_URL}/comment/`, {//the comment is not removed from the database, instead deleted is used to keep track of deleted comments
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`//jwt is given to check if the user is logged in and token is not expired (server side)
    },
    body: JSON.stringify(id)
  })
  if (response.status == 201){
    const comment = await response.json()
    return comment.Comment.post_id
  }
  if (response.status == 401){//if there is an error the error is thrown so .catch runs
    let error = await response.json()
    throw error
  }
}

