import { GraphQLServer } from "graphql-yoga";

//Scalar typer

//type definition (schema)
const typeDefs = `
  type Query {
   me: User!
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
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("the server is up!");
});
