// api/index.js
const API_URL = 'http://127.0.0.1:5000/api';

export async function fetchPosts() {
  const response = await fetch(`${API_URL}/posts/`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.status == 200) {
    let posts = await response.json();
    console.log(posts)
    return posts
  }
}

export async function fetchPost (postId) {
  const response = await fetch(`${API_URL}/posts/${postId}/`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.status == 200) {
    let post = await response.json();
    return post
  }
}

export async function postNewPost(post, jwt) {
  const response = await fetch(`${API_URL}/posts/`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`
    },
    body: JSON.stringify(post)
  })
  if (response.status == 401){
    let error = await response.json()
    throw error
  }
}

export async function likePost(id, jwt) {
  const response = await fetch(`${API_URL}/posts/`,{
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`
    },
    body: JSON.stringify(id)
  })
  if (response.status == 201){
    return id
  }
  if (response.status == 401){
    let error = await response.json()
    throw error
  }
}

export async function postNewComment(comment, jwt) {
  const response = await fetch(`${API_URL}/comments/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`
    },
    body: JSON.stringify(comment)
  })
  if (response.status == 201){
    return comment.post_id
  }
  if (response.status == 401){
    let error = await response.json()
    throw error
  }
}

export async function authenticate (user) {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  if (response.status == 200) {
    let token = await response.json();
    const userToken = token.token
    localStorage.setItem('token', JSON.stringify(userToken));
    localStorage.setItem('user', JSON.stringify(token.user));
  }
  if (response.status == 401){
    let error = await response.json()
    throw error
  }
}

export async function register (user) {
  console.log(user)
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  if (response.status == 401){
    let error = await response.json()
    throw error
  }
  return response
}

export async function deletePost(id, jwt) {
  const response = await fetch(`${API_URL}/posts/${id}/`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`
    },
  })
  if (response.status == 401){
    let error = await response.json()
    throw error
  }
}

export async function deleteComment(id, jwt) {
  const response = await fetch(`${API_URL}/comment/`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`
    },
    body: JSON.stringify(id)
  })
  if (response.status == 201){
    const comment = await response.json()
    return comment.Comment.post_id
  }
  if (response.status == 401){
    let error = await response.json()
    throw error
  }
}

