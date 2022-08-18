var express = require('express'); //importing express
const router = express.Router(); //creating a router object
const Teacher = require('../models/teacher'); //Reference to the teacher model.

//function to check if the user is logged in or not
function isAuth(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }

//middleware to render the view in teachers/index
router.get('/', (req, res, next) => {
    // res.render('teachers/index', {title: 'Teachers List'});
    //listing the data from the teachers table
    Teacher.find((err, teachers) =>{
        if(err){
            console.log(err);
        }
        else{
            res.render('teachers/index', {
                title: 'Teachers List',
                dataset: teachers, //passing the data in the view
                user: req.user
            }
            );
        }
    });
});

//GET handeler for rendering teachers/add view
//Only shows if authenticated
router.get('/add', isAuth, (req, res, next) => {
    res.render('teachers/add', {title: 'Add new Teacher', user: req.user}); 
    
});


//POST handeler for saving the user entered value from teachers/add view
//Only shows if authenticated
router.post('/add', isAuth,(req, res, next) =>{
    Teacher.create(
        {
            name: req.body.name,
            faculty: req.body.faculty,
            contact: req.body.contact,
            rating: req.body.rating
        },
        (err, newTeacher) =>{
            if(err){
                console.log(err);
            }
            else{
                res.redirect('/teachers')
            }
        }
    );
});

//GET handel after the delte button is pressed
//Only shows if authenticated
router.get('/delete/:_id', isAuth, (req, res, next)=>{
   // console.log('functioncaller');
    Teacher.remove({
        _id: req.params._id
    },
    (err) => {
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/teachers');
        }
    })
});

//GET handeler for the teachers/edit_id
//Only shows if authenticated
router.get('/edit/:_id', isAuth, (req, res, next) =>{
    Teacher.findById(req.params._id, (err, teacher)=>{
        if(err){console.log(err);}
        else{res.render('teachers/edit', {title:'Edit the Teacher Info', teacher: teacher, user: req.user});}
    });
})

//POST handeler for the teachers/edit
//Only shows if authenticated
router.post('/edit/:_id',isAuth, (req, res, next) =>{
    //alert('callled');
    Teacher.findOneAndUpdate(
    {
        _id: req.params._id
    },
    {
        name: req.body.name,
        faculty: req.body.faculty,
        contact: req.body.contact,
        rating: req.body.rating
    },
    (err, updatedTeacher) =>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect(`/teachers`);
        }
    }
    );
});

//export the router module
module.exports = router;


