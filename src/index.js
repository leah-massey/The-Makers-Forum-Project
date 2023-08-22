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

//type definition (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!

  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`;

//resolvers

const resolvers = {
  Query: {
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
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("the server is up!");
});
