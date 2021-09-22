//jshint esversion:6

const express= require("express");
const bodyParser= require("body-parser");
const app=express();
const mongoose= require("mongoose");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://admin-shaila:Test123@cluster0.jmpg6.mongodb.net/todolistDB");

const itemsSchema={
  name: String
};

const Item= mongoose.model("Item", itemsSchema);

const item1= new Item({
  name:"welcome"
});

const item2= new Item({
  name: "hi"
});

const item3= new Item({
  name: "byee"
});

const defaultItems=[item1, item2, item3];

app.get("/", function(req, res){

Item.find({},function(err, foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("successfully saved to DB");
        }
      });
res.redirect("/");
    }else{
      res.render("list",{listTitle:"Today", newListItems:foundItems});
    }
});
});


app.post("/",function(req,res){
let itemName =req.body.newItem;
const item= new Item({
  name:itemName
});

item.save();
res.redirect("/");

});

app.post("/delete",function(req,res){
  const checkboxId= req.body.checkbox;
  Item.findByIdAndRemove(checkboxId,function(err){
    console.log("item deleted");
    res.redirect("/");
  });
});

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work List", newListItems:workItems});
});

app.get("/about", function(req,res){
  res.render("about");
});

let port= process.env.PORT;
if(port==null || port ==""){
  port=3000; //this number is your preference port, change accordingly
}

app.listen(port ,function(){
  console.log("server started");
});
