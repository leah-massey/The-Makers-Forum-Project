import { GraphQLServer } from "graphql-yoga";

//Scalar typer

//type definition (schema)
const typeDefs = `
  type Query {
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
