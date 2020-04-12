export default (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      id: "1393-1232-32",
      createdAt: "April 11, 2020 18:26 CDT",
      doc:
        'Martin: Hi, how is it going fellas? \n Abraham: It"s a great day to hack! \n Ivo: Indeed, it is. \n JC: We should get into a hackathon, then. ',
    })
  );
};
