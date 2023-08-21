import { GraphQLServer } from "graphql-yoga";

//scalar types: Int, String, Boolean,

//type definition (schema)
const typeDefs = `
  type Query {
    add(a: Float!, b: Float!): Float!
    greeting(name: String, position: String): String!
    grades: [Int!]!
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
    add(parent, args, ctx, info) {
      return args.a + args.b;
    },
    grades(parent, args, ctx, info) {
      return [90, 85, 40];
    },
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `hello there ${args.name}, you are my favourite ${args.position}`;
      }
      return "hello there!";
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
