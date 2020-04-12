const newConversations = [
  "\nMartin: Hi, how is it going fellas?",
  '\nAbraham: It"s a great day to hack!',
  "\nIvo: Indeed, it is. \n",
  "\nJC: We should get into a hackathon, then.",
  "\nAbraham: LETS GOOOO",
  "\nIvo: AWESOME!!",
  "\n JC: FEELL THE POWER",
  "\n Martin: I'm going to sleep :S",
];

const initial = {
  id: "12355-hello-there",
  createdAt: "April 11, 2020 18:26 CDT",
  doc: "",
};

let i = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function faker() {
  initial.doc += initial.doc + newConversations[i];
  i += 1;
  if (i > newConversations.length) {
    i = 0;
  }
  return sleep(1000).then(() => ({ ...initial }));
}

const fetcher = (url) => fetch(url).then((r) => r.json());

export default fetcher;
