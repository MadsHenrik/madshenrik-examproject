<template>
    <div class="container-fluid w-75 pt-2 ">
      <div>
        <label for="sort">Sort by:</label>
        <select id="sort" name="sort" v-model="sortBy" @change="onChange">
          <option v-for="option in sort" :value="option.value" :key="option.value" :selected="sortBy==option.value">{{ option.name }}</option>
        </select>
        <form class="form-inline my-2 my-lg-0">
          <input v-model="sok" class="form-control mr-sm-2 mb-2" type="search" placeholder="Search" aria-label="Search">
        </form>
      </div>
      <div class="card" v-for="post in sokPosts" v-bind:key="post.id">
        <router-link :to="`post/${post.id}`" class="text-dark text-decoration-none">
          <div class="card-body">
            <p class="card-title font-weight-bold">{{ post.headline}}</p>
            <p class='card-subtitle text-muted'>{{ post.created_at }}</p>
            <p class="card-text" v-if="post.content.length < 180">{{ post.content }}</p>
            <p class="card-text" v-else>{{ post.content.slice(0,170) }}...<a style="color: rgb(255, 166, 0);">view more</a></p>
            <div>
              <p class="card-text">Likes:{{ post.likes }}</p>
              <p class="card-text">Comments:{{ post.comments.filter(c => !c.deleted).length }}</p>
            </div>
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
      sok: '',
      sort: [
	      {name: 'Likes', value: 'likes'},
        {name: 'Recent', value: 'recent'},
        {name: 'Comments', value: 'comments'},
        ]
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
        this.$store.state.posts.posts.sort((a,b) => (a.comments.filter(c => !c.deleted).length > b.comments.filter(c => !c.deleted).length) ? -1 : ((b.comments.filter(c => !c.deleted).length > a.comments.filter(c => !c.deleted).length) ? 1 : 0))
      },
      onChange() {
        localStorage.setItem('sortPref', this.sortBy)
      }
    },
    computed: {
      posts(){
        return this.$store.state.posts
      },
      sorts() {
        if (this.posts.posts){
          if (this.sortBy == 'recent'){
            return this.posts.posts.sort((a,b) => (a.created_at > b.created_at) ? -1 : ((b.created_at > a.created_at) ? 1 : 0))
          } else if (this.sortBy == 'likes'){
            return this.posts.posts.sort((a,b) => (a.likes > b.likes) ? -1 : ((b.likes > a.likes) ? 1 : 0))
          } else if(this.sortBy == 'comments'){
            return this.posts.posts.sort((a,b) => (a.comments.filter(c => !c.deleted).length > b.comments.filter(c => !c.deleted).length) ? -1 : ((b.comments.filter(c => !c.deleted).length > a.comments.filter(c => !c.deleted).length) ? 1 : 0))
          }
        }
      },
      sokPosts() {
        if (this.sok.length > 0){
          return this.sorts.filter(post => post.headline.toLowerCase().includes(this.sok.toLowerCase()))
        } else  {
          return this.sorts
        }
      }
    },
    beforeMount() {
      this.$store.dispatch('loadPosts')
      this.sortBy = localStorage.getItem('sortPref')
    },
    watch: {
    }
  }
</script>

<style >

</style>
