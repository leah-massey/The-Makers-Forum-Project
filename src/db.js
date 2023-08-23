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
const comments = [
  { id: "7", text: "this sounds great", author: "3", post: "4" },
  { id: "10", text: "I wish I could do that", author: "3", post: "7" },
  { id: "11", text: "nice!", author: "2", post: "6" },
  { id: "12", text: "can you explain more?", author: "1", post: "4" },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
