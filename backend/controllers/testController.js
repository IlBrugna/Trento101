export const home = (req,res)=>{
    const message = "this is the home route";
    res.send(message);
}

export const inner = (req,res)=>{
    const message = "this is the inner route";
    res.send(message);
}