<template>
  <div class="container-fluid w-75 pt-2">
    <div class="columns">
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
      post: new newPost('','')
    }
  },
  methods: {
    submitPost() {
      this.post.headline = this.name
      this.post.content = this.contents
      postNewPost(this.post, localStorage.getItem('token'))
        .then(() => this.$router.push('/'))
        .catch((error) => {
          console.log('Error creating post', error)
          this.$router.push('/')
        })
    }
  },
}

</script>

<style></style>