const mAirCraft = {
    method: ["GET"],
    path: "/m_aircraft",
    options: {
      handler: (request, h) => { 
        let credentials = request.auth.credentials;
        
        return h.view('m_aircraft', { credentials: credentials});
      }
    }
  };
  
  export default mAirCraft;