<template>
    <div class="container-fluid w-75 pt-2 ">
      <div>
        <label for="sort">Sort by:</label>
        <select id="sort" name="sort" v-model="sortBy" @change="onChange">
          <option v-for="option in sort" :value="option.value" :key="option.value" :selected="sortBy==option.value">{{ option.name }}</option>
        </select>
        <form class="form-inline">
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
<script>
  export default {
    data: function(){
      return {
      sortBy: '',
      sok: '', //this is used to filter the posts based on what is typed in to the searchbar
      sort: [ //saving names and values for all the things we can sort by. Easy to expand (but would need new sorting functions for the new values)
	      {name: 'Likes', value: 'likes'},
        {name: 'Recent', value: 'recent'},
        {name: 'Comments', value: 'comments'},
        ]
      }
    },
    methods: { //sort function sort based on different criteria
      sortedPostsLikes(){
        this.$store.state.posts.posts.sort((a,b) => (a.likes > b.likes) ? -1 : ((b.likes > a.likes) ? 1 : 0))
      },
      sortCreated(){
        this.$store.state.posts.posts.sort((a,b) => (a.created_at > b.created_at) ? -1 : ((b.created_at > a.created_at) ? 1 : 0))
      },
      sortedPostsComment(){
        this.$store.state.posts.posts.sort((a,b) => (a.comments.filter(c => !c.deleted).length > b.comments.filter(c => !c.deleted).length) ? -1 : ((b.comments.filter(c => !c.deleted).length > a.comments.filter(c => !c.deleted).length) ? 1 : 0))
      },
      onChange() { //this function changes the sortPref that is in local storage to the value of the selectbox
        localStorage.setItem('sortPref', this.sortBy)
      }
    },
    computed: {
      posts(){
        return this.$store.state.posts //gets a list of posts from state
      },
      sorts() { //sorts the list of posts based on the value of the selectbox
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
      sokPosts() { //filter out posts whos headline does not contain the search value
        if (this.sok.length > 0){
          return this.sorts.filter(post => post.headline.toLowerCase().includes(this.sok.toLowerCase()))
        } else  {
          return this.sorts
        }
      }
    },
    beforeMount() { //when the page is mounted posts need to be loaded and the sortBy variable is set to sortPref saved in localstorages
      this.$store.dispatch('loadPosts')
      this.sortBy = localStorage.getItem('sortPref')
    }
  }
</script>

<style >

</style>
