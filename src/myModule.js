const message = "hello there how are you? A message from Module.js ";

const name = "leah";

const location = "london";

const getGreeting = (name) => {
  return `Welcome to the course, ${name}`;
};

export { message, name, getGreeting, location as default };
