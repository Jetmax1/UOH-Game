/**
 * SocialFeedSystem: Fictional Campus Social Feed ("UOH Social") & University News
 */
export class SocialFeedSystem {
  constructor() {
    this.feedPosts = [
      { id: 'p1', author: 'Rahul Varma', handle: '@rahul_v', avatar: '📸', content: 'Sunset over Peacock Lake is unreal today! Indian peacocks roaming near the water. 🦚🌅', time: '10m ago', likes: 24, club: 'Photo & Nature' },
      { id: 'p2', author: 'Priya Sharma', handle: '@priya_s', avatar: '💻', content: 'SCIS Turing Coding Society hackathon registration is LIVE! Join us at SCIS #45. 🚀', time: '25m ago', likes: 42, club: 'Turing Coding' },
      { id: 'p3', author: 'Dr. Ananya Sen', handle: '@quizmaster_uoh', avatar: '📚', content: 'Weekly Campus Quiz Blitz is kicking off tonight at Student Centre! Test your UoH trivia. ⚡', time: '1h ago', likes: 58, club: 'Literary & Quiz' },
      { id: 'p4', author: 'Vikram Singh', handle: '@vikram_athletics', avatar: '🏃', content: 'Track & field sprints around Gachibowli Stadium synth track. Great stamina workout! 🏆', time: '2h ago', likes: 19, club: 'Athletics & Sports' },
      { id: 'p5', author: 'Prof. Manjula', handle: '@sls_dean', avatar: '🔬', content: 'ASPIRE BioNEST seed grants available for biotechnology student research projects! 🧬', time: '3h ago', likes: 37, club: 'Life Sciences' },
      { id: 'p6', author: 'Campus News', handle: '@uoh_official', avatar: '🏛️', content: 'Sukoon Canteen & Zakir Food Court serving fresh Irani Chai & samosas all evening. 🍵', time: '4h ago', likes: 89, club: 'Official' }
    ];

    this.onPostLiked = null;
  }

  getPosts() {
    return this.feedPosts;
  }

  likePost(postId) {
    const p = this.feedPosts.find(post => post.id === postId);
    if (p) {
      p.likes += 1;
      if (this.onPostLiked) this.onPostLiked(p);
      return p.likes;
    }
    return 0;
  }

  addPost(author, handle, avatar, content, club = 'Student') {
    const newPost = {
      id: `post_${Date.now()}`,
      author,
      handle,
      avatar,
      content,
      time: 'Just now',
      likes: 1,
      club
    };
    this.feedPosts.unshift(newPost);
    return newPost;
  }
}
