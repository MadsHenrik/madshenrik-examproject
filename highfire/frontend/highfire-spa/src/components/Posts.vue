<template>
    <div class="container-fluid w-75 pt-2">
        <div class="card">
            <div class="card-body">
                <h2 class="card-title font-weight-bold">{{ post.post['headline'] }}</h2>
                <p class="card-subtitle text-muted">{{ post.post['created_at'] }}</p>
                <p class='card-text'>{{ post.post['content'] }}</p>
                <p class='card-text'>Created by: {{ post.post['user_name'] }}</p>
                <div class="">
                  <button @click="likePost">Like post</button>
                  <button v-if="post.post['user_name']==user.username" class="btn-danger" @click="deletePost">Delete post</button>
                </div>
                <p class="card-text">{{ post.post['likes'] }}</p>
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
              <button class="btn btn-secondary active w-25" @click="submitComment">Post comment</button>
            </div>
        </div>
        <p>Comments:</p>
        <div v-for="comment in comments" v-bind:key="comment.id">
          <div class="card">
            <div class="card-body">
              <p class="card-text">{{ comment.user_name }}</p>
              <p class="card-text">{{ comment.text }}</p>
              <p class="card-subtitle text-muted">{{ comment.created_at }}</p>
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
      commentText: ''
    }
  },
  beforeMount() {
    this.$store.dispatch('loadPost', { id: parseInt(this.$route.params.id) })
  },
  computed: mapState({
    post: state => state.currentPost,
    user(){
      if (localStorage.getItem('user')){
        return JSON.parse(localStorage.getItem('user'))
      } else {
        return ''
      }
    },
    comments(){
      return this.post.post['comments'].filter(comment => comment.deleted == false)
    }
  }),
  
  methods: {
    likePost() {
      this.$store.dispatch('addLike', this.$route.params.id)
    },
    submitComment() {
      this.$store.dispatch('addComment', {text: this.commentText, post_id: this.$route.params.id})
        // .then(() => this.$router.push(`/post/${this.$route.params.id}`))
        // .catch((error) => {
        //   console.log('Error creating comment', error)
        //   this.$router.push('/')
        //})
    },
    deletePost(){
      this.$store.dispatch('removePost', this.$route.params.id)
        .then(() => this.$router.push('/'))
    },
    deleteComment(e){
      this.$store.dispatch('removeComment', e)
        .then(() => this.$router.push(`/`))
    }
  }
}
</script>

<style>

</style>