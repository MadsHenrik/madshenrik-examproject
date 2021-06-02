<template>
    <div class="container-fluid w-75 pt-2 ">
      <label for="sort">Sort by:</label>
      <select id="sort" name="sort" v-model="sortBy" @change="onChange(sortBy)">
          <option value="likes" :selected="sortBy=='likes'">Likes</option>
          <option value="recent" :selected="sortBy=='recent'">Recent</option>
          <option value="comments" :selected="sortBy=='comments'">Comments</option>
      </select>
      <div class="card" v-for="post in posts.posts" v-bind:key="post.id">
        <router-link :to="`post/${post.id}`" class="text-dark text-decoration-none">
          <div class="card-body">
            <p class="card-title font-weight-bold">{{ post.headline}}</p>
            <p class='card-subtitle text-muted'>{{ post.created_at }}</p>
            <p class="card-text" v-if="post.content.length < 180">{{ post.content }}</p>
            <p class="card-text" v-else>{{ post.content.slice(0,170) }}...<a style="color: rgb(255, 166, 0);">view more</a></p>
          </div>
        </router-link>
      </div>
    </div>
</template>
<!--Mangler å legge inn sort by og kommentarcount og likecount så ser dinna ok ut-->
<script>
  import { mapState } from 'vuex'
  export default {
    data: function(){
      return {
      sortBy: '',
      sok: ''
      }
    },
    methods: {
      sortedPostsLikes(){
        this.$store.state.posts.posts.sort((a,b) => (a.likes > b.likes) ? -1 : ((b.likes > a.likes) ? 1 : 0))
      },
      sortCreated(){
        this.$store.state.posts.posts.sort((a,b) => (a.created_at > b.created_at) ? -1 : ((b.created_at > a.created_at) ? 1 : 0))
      },
      sortedPostsComment(){
        this.$store.state.posts.posts.sort((a,b) => (a.comments.length > b.comments.length) ? -1 : ((b.comments.length > a.comments.length) ? 1 : 0))
      },
      onChange(vSort) {
        console.log(vSort)
        if (vSort == 'recent'){
          this.sortCreated()
        } else if (vSort == 'likes'){
          this.sortedPostsLikes()
        } else if(vSort == 'comments'){
          this.sortedPostsComment()
        }
        localStorage.setItem('sortPref', vSort)
      }
    },
    computed: {
      posts(){
        return this.$store.state.posts
      },
      sorts() {
        return this.onChange(this.sortBy)
      },
      sokPosts() {
        return this.posts.posts.filter(post => post.headline.toLowerCase().includes(this.sok.toLowerCase()))
      }
    },
    beforeMount() {
      this.$store.dispatch('loadPosts')
      this.sortBy = localStorage.getItem('sortPref')
      this.sok = this.$route.params.sok
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
