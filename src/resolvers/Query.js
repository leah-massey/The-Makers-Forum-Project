const Query = {
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      if (
        db.post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        db.post.body.toLowerCase().includes(args.query.toLowerCase())
      ) {
        return db.post;
      }
    });
  },
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  me() {
    return {
      id: "123",
      name: "Jenny",
      email: "jenny.me.com",
      age: null,
    };
  },
  post() {
    return {
      id: "456",
      title: "my biking adventure",
      body: "The day I bought my bike, I ended up having quite an adventure...",
      published: false,
    };
  },
};

export { Query as default };
