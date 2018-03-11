const Home = {
  method: ["GET"],
  path: "/",
  options: {
    auth: false,
    handler: (request, h) => { // Página de inicio
        return h.view("home", {}, { layout: false });
    }
  }
};

export default Home;