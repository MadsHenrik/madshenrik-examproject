//this class is used to group headline and content together so they can be sent as one variable when creating new posts
export default class newPost {
    constructor(headline, content) {
      this.headline = headline;
      this.content = content;
    }
  }