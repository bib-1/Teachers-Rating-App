var express = require('express'); //importing express
const router = express.Router(); //creating a router object
const Teacher = require('../models/teacher'); //Reference to the teacher model.

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
                dataset: teachers //passing the data in the view
            }
            );
        }
    });
});

//GET handeler for rendering teachers/add view
router.get('/add', (req, res, next) => {
    res.render('teachers/add', {title: 'Add new Teacher'}); 
    
});


//POST handeler for saving the user entered value from teachers/add view
router.post('/add', (req, res, next) =>{
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




//export the router module
module.exports = router;


