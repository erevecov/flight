const mUsers = {
    method: ["GET"],
    path: "/m_users",
    options: {
      handler: (request, h) => { 
        let credentials = request.auth.credentials;
        
        return h.view('m_users', { credentials: credentials});
      }
    }
  };
  
  export default mUsers;