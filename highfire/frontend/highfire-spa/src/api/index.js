// api/index.js
const API_URL = 'http://127.0.0.1:5000/api';

const posts = [{
    id: 1,
    name: 'Sample thread 1',
    created_at: new Date(2018, 1, 1),
    content: 'This is the contents of the thread'
  }, {
    id: 2,
    name: 'Sample thread 2',
    created_at: new Date(2018, 1, 3),
    content: 'This is the contents of the thread2'
  }]

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
  console.log(post)
  const response = await fetch(`${API_URL}/posts/`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`
    },
    body: JSON.stringify(post)
  })
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
  this.$store.dispatch('loadPost', { id: parseInt(id) })
}

export async function postNewComment(comment, jwt) {
  console.log(jwt)
  const response = await fetch(`${API_URL}/comments/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${jwt}`
    },
    body: JSON.stringify(comment)
  })
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
  console.log("supp")
  return response
}

export async function deletePost(id) {
  const response = await fetch(`${API_URL}/posts/${id}/`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteComment(id) {
  const response = await fetch(`${API_URL}/comment/`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(id)
  })
}

