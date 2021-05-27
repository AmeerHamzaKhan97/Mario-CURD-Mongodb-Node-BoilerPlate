const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const marioModel = require("./models/marioChar");

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// your code goes here

app.get("/mario", async (req, res) => {
  res.send(await marioModel.find());
});

app.get("/mario/:id", async (req, res) => {
  const id = req.params.id;
  try {
    res.send(await marioModel.findById(id));
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

const isNullOrUndefined = (val) => val === null || val === undefined;

app.post("/mario", async (req, res) => {
  const newMario = req.body;
  if (isNullOrUndefined(newMario.name) || isNullOrUndefined(newMario.weight)) {
    res.status(400).send({ message: "either name or weight is missing" });
  } else {
    const newMariodata = new marioModel(newMario);
    await newMariodata.save();
    res.status(201).send(newMariodata);
  }
});

app.patch("/mario/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const updatebody = await marioModel.findById(id);
    if (isNullOrUndefined(body.name) && isNullOrUndefined(body.weight)) {
      res.status(400).send({ message: "both name and weight id missing" });
    } else {
      if (!isNullOrUndefined(body.name)) {
        updatebody.name = body.name;
      }
      if (!isNullOrUndefined(body.weight)) {
        updatebody.weight = body.weight;
      }
      await updatebody.save();
      res.send(updatebody);
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

app.delete("/mario/:id", async(req,res)=>{
    const id = req.params.id;
    try{
   //  if(id != _id){
     //       res.status(404).send({message:"id not found"})
      //   }else{
             await marioModel.findById(id);
             await marioModel.deleteOne({ _id: id });
             res.status(200).send({ message: "item delelted" });
         }
      
 //   }
    catch(e){
        res.status(400).send({message:e.message})
    }
});



module.exports = app;
