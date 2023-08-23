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
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some((user) => {
      return user.id === args.data.author;
    });

    if (!userExists) {
      throw new Error("user does not exist");
    }

    const newPost = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(newPost);

    return newPost;
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error("post not found");
    }

    const deletedPosts = db.posts.splice(postIndex, 1);

    db.posts = db.posts.filter((post) => {
      return post.id !== args.id;
    });

    db.comments = db.comments.filter((comment) => {
      return comment.post !== args.id;
    });

    return deletedPosts[0];
  },
  createComment(parent, args, { db }, info) {
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

    const newComment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(newComment);

    return newComment;
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
};

export { Mutation as default };
