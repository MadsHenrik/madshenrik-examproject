<template>
  <div class="container-fluid w-75 pt-2">
    <div class="">

        <h2 class="">New thread</h2>
        <div class="name">
            <div class="field">
                <label class="label" for="name">Title:</label>
            </div>
            <div class="control">
                <input type="text" class="input is-large w-25" id="name" v-model="name" placeholder="Title of your thread">
            </div>
            <div class="">
              <label class="label" for="contents">Content:</label>
            </div>
            <div>
              <textarea id="contents" name="contents" rows="4" cols="50" v-model="contents" style="width: 100%; height: 400px" placeholder="Type the contents of your thread here."></textarea>
            </div>
            <div class="">
                <button class="btn btn-secondary active w-25" @click="submitPost">Post</button>
            </div>
        </div>

    </div>
  </div>
</template>

<script>
import newPost from '../store/post.js'
import { postNewPost } from '../api/index.js';

export default {
  data() {
    return {
      name:  '',
      contents: '',
      post: new newPost('','') //creates a class of type newPost (store/post.js)
    }
  },
  methods: {
    submitPost() { //when "post" button is clicked this is called to create the post
      //set the values of the newPost class to the inputted headline and content
      this.post.headline = this.name 
      this.post.content = this.contents
      postNewPost(this.post, localStorage.getItem('token')) //call postNewPost from api/index.js with the post class and the token stored in localstorage
        .then(() => this.$router.push('/')) //when creating a new post we get routed to home where the new post is
        .catch((error) => { //if there is an error (caused by not being logged in or if token has expired) logout is ran, the error is logged and saved in store and the user is routed to login
          this.$store.dispatch('logout',)
          console.log('Error creating post', error)
          this.$store.dispatch('errorMessage', error.message)
          this.$router.push('/login/')
        })
    }
  },
}

</script>

<style></style>