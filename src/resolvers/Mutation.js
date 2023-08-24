import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => {
      return user.email === args.data.email;
    });

    if (emailTaken) {
      throw new Error("Email already registered");
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => {
          return comment.post !== post.id;
        });
      }
      return !match;
    });

    db.comments = db.comments.filter((comment) => {
      return comment.author !== args.id;
    });

    return deletedUsers[0];
  },

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;

    const user = db.users.find((user) => {
      return user.id === id;
    });

    if (!user) {
      throw new Error("user does not exist");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => {
        return user.email === data.email;
      });

      if (emailTaken) {
        throw new Error("this email is already in use");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== undefined) {
      user.age = data.age;
    }
    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => {
      return user.id === args.data.author;
    });

    if (!userExists) {
      throw new Error("user does not exist");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error("post not found");
    }

    const [post] = db.posts.splice(postIndex, 1);

    db.posts = db.posts.filter((post) => {
      return post.id !== args.id;
    });

    db.comments = db.comments.filter((comment) => {
      return comment.post !== args.id;
    });

    //alert subscribers if published post is deleted
    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post;
  },

  updatePost(parent, args, { db }, info) {
    const { id, data } = args;

    const post = db.posts.find((post) => {
      return post.id === id;
    });

    if (!post) {
      throw new Error("This post does not exist");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    const postExistsAndPublished = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExists) {
      throw new Error("user does not exist");
    }

    if (!postExistsAndPublished) {
      throw new Error("post does not exist or isn't published");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, { comment });

    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex((comment) => {
      return comment.id === args.id;
    });

    if (commentIndex === -1) {
      throw new Error("comment does not exist");
    }

    const deletedComment = db.comments.splice(commentIndex, 1);

    db.comments = db.comments.filter((comment) => {
      return comment.id !== args.id;
    });

    return deletedComment[0];
  },

  updateComment(parent, args, { db }, info) {
    const { id, data } = args;

    const comment = db.comments.find((comment) => {
      return comment.id === id;
    });

    if (!comment) {
      throw new Error("This comment does not exist");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    return comment;
  },
};

export { Mutation as default };
