import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

//scalar types: Int, String, Boolean,

//demo user data:
const users = [
  {
    id: "1",
    name: "Leah",
    email: "leah@example.com",
    age: 34,
  },
  {
    id: "2",
    name: "John",
    email: "john@example.com",
  },
  {
    id: "3",
    name: "Sarah",
    email: "sarah@example.com",
  },
];

//demo post data:
let posts = [
  {
    id: "4",
    title: "Victorian Beach Time",
    body: "From sandcastles to fish and chips, promenades to pleasure piers, many of the things best associated with a trip to the British seaside have their roots in the Victorian summer holiday. However, while we take these seaside attractions for granted now – even looking back on them as old fashioned – many of them were considered revolutionary at the time, some even an affront to common decency. This led to some puritanical restrictions, but not even Victorian morality could hold back the tide of change that was rolling in.",
    published: true,
    author: "1",
    comments: ["7", "12"],
  },
  {
    id: "6",
    title: "King Knut",
    body: "As ruler of England, Denmark and Norway, King Cnut the Great consolidated his power to become leader of the North Sea Empire, demonstrating his leadership skills and fortitude during his reign. The fable about King Cnut trying to command the tide of the sea, written 100 years after his death by Henry of Huntingdon, still remains entrenched in English folklore today.",
    published: true,
    author: "1",
    comments: ["11"],
  },
  {
    id: "7",
    title: "Jellied Eels",
    body: "Jellied eels are a traditional English dish that originated in the 18th century, primarily in the East End of London. The dish consists of chopped eels boiled in a spiced stock that is allowed to cool and set, forming a jelly. It is usually served cold and tatses pretty disgusting",
    published: false,
    author: "2",
    comments: ["10"],
  },
];

//demo comments data:

let comments = [
  { id: "7", text: "this sounds great", author: "3", post: "4" },
  { id: "10", text: "I wish I could do that", author: "3", post: "7" },
  { id: "11", text: "nice!", author: "2", post: "6" },
  { id: "12", text: "can you explain more?", author: "1", post: "4" },
];

//type definition (schema)
let typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

//resolvers

const resolvers = {
  Query: {
    comments(parent, args, ctx, info) {
      return comments;
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        if (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        ) {
          return post;
        }
      });
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
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
  },

  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => {
        return user.email === args.data.email;
      });

      if (emailTaken) {
        throw new Error("Email already registered");
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => {
            return comment.post !== post.id;
          });
        }
        return !match;
      });

      comments = comments.filter((comment) => {
        return comment.author !== args.id;
      });

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => {
        return user.id === args.data.author;
      });

      if (!userExists) {
        throw new Error("user does not exist");
      }

      const newPost = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(newPost);

      return newPost;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      const postExistsAndPublished = posts.some(
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

      comments.push(newComment);

      return newComment;
    },
  },

  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id == parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id == parent.post;
      });
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },

  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("the server is up!");
});
