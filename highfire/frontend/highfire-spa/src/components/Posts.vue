<template>
    <div class="container-fluid w-75 pt-2">
        <div class="card">
            <div class="card-body">
                <h2 class="card-title font-weight-bold">{{ post.post['headline'] }}</h2>
                <p class="card-subtitle text-muted">{{ post.post['created_at'] }}</p>
                <p class='card-text'>{{ post.post['content'] }}</p>
                <p class='card-text'>Created by: {{ post.post['user_name'] }}</p>
                <div class="">
                  <!--v-if like and v-if not like decides which of the buttons are shown depending on if the user already likes the post or not-->
                  <button v-if="!like" @click="likePost">Like post</button>
                  <button v-if="like" @click="likePost">Unlike post</button>
                  <!--Check if the current logged in user is the one that created the post, and allow them to delete it if they are-->
                  <button v-if="post.post['user_name']==user.username" class="btn-danger" @click="deletePost">Delete post</button>
                </div>
                <p class="card-text">Likes: {{ post.post['likes'] }}</p>
            </div>
        </div>
        <div>
          <div class="">
            <label class="label" for="contents">Add comment:</label>
          </div>
          <div>
            <textarea id="contents" name="contents" rows="3" cols="50" v-model="commentText" style="width: 100%;" placeholder="Type your comment here"></textarea>
          </div>
            <div class="">
              <button class="btn btn-secondary w-25" @click="submitComment">Post comment</button>
            </div>
        </div>
        <p>Comments:</p>
        <!--Displaying all comments using v-for-->
        <div v-for="comment in comments" v-bind:key="comment.id">
          <div class="card">
            <div class="card-body">
              <p class="card-text">{{ comment.user_name }}</p>
              <p class="card-text">{{ comment.text }}</p>
              <p class="card-subtitle text-muted">{{ comment.created_at }}</p>
              <!--Check if the current logged in user is the one that created the comment, and allow them to delete it if they are-->
              <button v-if="comment.user_name==user.username" class="btn-danger" @click="deleteComment(comment.id)">Delete comment</button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import { mapState} from "vuex"
export default {
  data() {
    return {
      commentText: '', //v-model
    }
  },
  beforeMount() {
    this.$store.dispatch('loadPost', { id: parseInt(this.$route.params.id) }) //load the post when loading the page
  },
  computed: mapState({
    post: state => state.currentPost,
    user(){ //checks if there is a user in localstorage and sets user if there is one (used to check if comment or post is created by currently logged in user)
      if (localStorage.getItem('user')){
        return JSON.parse(localStorage.getItem('user'))
      } else {
        return ''
      }
    },
    comments(){ //filters out deleted comments
      return this.post.post['comments'].filter(comment => comment.deleted == false)
    },
    like(){ //computed if the user has liked this post using the liked() method
        return this.liked()
    }
  }),
  
  
  methods: {
    likePost() { //dispatching to addLike function is store/index.js
      this.$store.dispatch('addLike', this.$route.params.id)
        .catch((error) => { //if an error is given, logout user(in case the token is there but is expired), set errorMsg and route to login so the user can see the error and log in
          this.$store.dispatch('logout',)
          console.log('Error creating post', error)
          this.$store.dispatch('errorMessage', error.message)
          this.$router.push('/login/')
        })
      this.like = this.liked()
    },
    submitComment() { //dispatch addComment with the text and this posts id
      this.$store.dispatch('addComment', {text: this.commentText, post_id: this.$route.params.id})
        .catch((error) => { //if an error is given, logout user(in case the token is there but is expired), set errorMsg and route to login so the user can see the error and log in
          this.$store.dispatch('logout',)
          console.log('Error creating post', error)
          this.$store.dispatch('errorMessage', error.message)
          this.$router.push('/login/')
        })
    },
    deletePost(){ //dispatch removePost with this posts id to remove it
      this.$store.dispatch('removePost', this.$route.params.id)
        .then(() => this.$router.push('/'))
        .catch((error) => { //if an error is given, logout user(in case the token is there but is expired), set errorMsg and route to login so the user can see the error and log in
          this.$store.dispatch('logout',)
          console.log('Error creating post', error)
          this.$store.dispatch('errorMessage', error.message)
          this.$router.push('/login/')
        })
    },
    deleteComment(id){ //dispatch removeComment with this comments id to remove it
      this.$store.dispatch('removeComment', id)
        .catch((error) => { //if an error is given, logout user(in case the token is there but is expired), set errorMsg and route to login so the user can see the error and log in
          this.$store.dispatch('logout',)
          console.log('Error creating post', error)
          this.$store.dispatch('errorMessage', error.message)
          this.$router.push('/login/')
        })
    },
    liked(){ //get the likeRel array, loop through it and if the currently logged in username is found and has the liked value equal to 1(true) return true showing the user has liked the post
      const array = this.post.post.likeRel
      for(let i = 0; i < array.length; i++){
        if (array[i].username  == this.user.username && array[i].liked==1){
          return  true
        }
      }
      return false //if the user has not liked the post false is returned
    }
  }
}
</script>

<style>

</style>