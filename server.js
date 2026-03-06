const express = require("express")
const fs = require("fs");

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    const data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

    res.json(data);
});

app.get("/users", (req, res) =>{
    const data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"))
    res.json({
        success:true,
        data
    })    
});

app.get("/users/:id", (req,res) =>{
    const userId = req.params.id;
    const data = JSON.parse(fs.readFileSync("./data/users.json"))

    const user = data.find((el) => el.id == userId);

    if(!user){
        res.status(404).json({
            message:`Berilgan id: ${userId} topilmadi`
        })
        return;
    }
    res.json({
        success:true,
        data:user
    })
})

app.post("/users", (req,res) =>{
    const {name, username, phone, password} = req.body;

    if(!name || !username ||!phone || !password?.toString()){
        res.status(400).json({
            message:"to'liq malumot kiriting"
        });
        return;
    }

    const data = JSON.parse(fs.readFileSync("./data/users.json"))

    const lastUsers = data.sort((a,b) => a.id - b.id).at(-1)

    const newUsers = {
    id: (lastUsers?.id || 0) + 1,
    name,
    username,
    phone,
    password,
    };

    data.push(newUsers)

    fs.writeFileSync("./data/users.json",JSON.stringify(data, null, 2))

    res.status(201).json({
        success:true,
        data:newUsers
    })
})

app.put("/users/:id",(req,res) =>{
    const userId = req.params.id;
    const {name, username,phone,password} = req.body;

    if(!name || !username || !phone || !password?.toString()){
        res.status(404).json({
            message:`Berilgan id:${userId} topilmadi`
        })
        return;
    }
    const data= JSON.parse(fs.readFileSync("./data/users.json"))

    const userIndex = data.findIndex((el)=>el.id == userId)

    if(userIndex === -1){
        res.status(404).send({
            message:`Berilgan id: ${userId} topilmadi`
        })
        return;
    }
    const updateUser = {
        id:Number(userId),
        name,
        username,
        phone,
        password,
    }

    data.splice(userIndex,1,updateUser);

    fs.writeFileSync("./data/users.json", JSON.stringify(data,null,2))

    res.status(200).send()
})

app.delete("/users/:id", (req, res) => {
  const usersId = req.params.id;
  const data = JSON.parse(fs.readFileSync("./data/users.json"));

  const usersIndex = data.findIndex((el) => el.id == usersId);

  if (usersIndex === -1) {
    res.status(404).send({
      message: `Berilgan ID: ${usersId} topilmadi`,
    });
    return;
  }

  data.splice(usersIndex, 1);

  fs.writeFileSync("./data/users.json", JSON.stringify(data, null, 2));

  res.status(204).send();
});

app.listen(3000,() =>{
    console.log("server is running 3000")
})