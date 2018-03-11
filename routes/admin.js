const Home = {
    method: ["GET"],
    path: "/admin",
    options: {
      handler: (request, h) => { 
        let credentials = request.auth.credentials;
        
        return h.view('admin', { credentials: credentials});
      }
    }
  };
  
  export default Home;