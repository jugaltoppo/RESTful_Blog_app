var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/restful_blog_app");

//app config
var app=express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "Hello this is a blog post"
// });

//RESTful routes

//index route
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,allBlog){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blog: allBlog});
        }
    });
    
});

//new route
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//create route
app.post("/blogs",function(req,res){
    // console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // console.log("*******");
    // console.log(req.body);
    Blog.create(req.body.blog,function(err,blog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});

//show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("show",{blog: foundBlog});
        }
    });
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,editBlog){
        if(err){
            console.log(err);
        }else{
            res.render("edit",{editBlog: editBlog});
        }
    })
});

//update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//delete route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    })
})

app.listen(3000,function(){
    console.log("Listening to port 3000");
});