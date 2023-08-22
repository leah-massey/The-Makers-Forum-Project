import { GraphQLServer } from "graphql-yoga";

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
const posts = [
  {
    id: "4",
    title: "Victorian Beach Time",
    body: "From sandcastles to fish and chips, promenades to pleasure piers, many of the things best associated with a trip to the British seaside have their roots in the Victorian summer holiday. However, while we take these seaside attractions for granted now – even looking back on them as old fashioned – many of them were considered revolutionary at the time, some even an affront to common decency. This led to some puritanical restrictions, but not even Victorian morality could hold back the tide of change that was rolling in.",
    published: true,
    author: "1",
  },
  {
    id: "6",
    title: "King Knut",
    body: "As ruler of England, Denmark and Norway, King Cnut the Great consolidated his power to become leader of the North Sea Empire, demonstrating his leadership skills and fortitude during his reign. The fable about King Cnut trying to command the tide of the sea, written 100 years after his death by Henry of Huntingdon, still remains entrenched in English folklore today.",
    published: true,
    author: "1",
  },
  {
    id: "7",
    title: "Jellied Eels",
    body: "Jellied eels are a traditional English dish that originated in the 18th century, primarily in the East End of London. The dish consists of chopped eels boiled in a spiced stock that is allowed to cool and set, forming a jelly. It is usually served cold and tatses pretty disgusting",
    published: false,
    author: "2",
  },
];

//demo comments data:

const comments = [
  { id: "7", text: "this sounds great", author: "3" },
  { id: "10", text: "I wish I could do that", author: "3" },
  { id: "11", text: "nice!", author: "2" },
  { id: "12", text: "can you explain more?", author: "1" },
];

//type definition (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment]!
    me: User!
    post: Post!
    
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!

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

  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id == parent.author;
      });
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
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
