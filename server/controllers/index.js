// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// get the Cat model
const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;


// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
    name: 'unknown',
    bedsOwned: 0,
};
const defaultDogData = {
    name: 'unknown',
    
}

// object for us to keep track of the last Cat we made and dynamically update it sometimes
let lastAdded = new Cat(defaultData);
let lastAddedDog = new Dog(defaultDogData);

// function to handle requests to the main page
const hostIndex = (req, res) => {
    // res.render takes a name of a page to render.
    res.render('index', {
        currentName: lastAdded.name,
        title: 'Home',
        pageName: 'Home Page',
    });
};

const readAllCats = (req, res, callback) => {
    // Call the model's built in find function and provide it a
    // callback to run when the query is complete
    Cat.find(callback).lean();
};

const readAllDogs = (req, res, callback) => {
    Dog.find(callback).lean();
}


// function to find a specific cat on request.
const readCat = (req, res) => {
    const name1 = req.query.name;

    // function to call when we get objects back from the database.
    const callback = (err, doc) => {
        if (err) {
            return res.status(500).json({
                err
            }); // if error, return it
        }

        // return success
        return res.json(doc);
    };

    // Call the static function attached to CatModels.

    Cat.findByName(name1, callback);
};
const readDog = (req, res) => {
    const name1 = req.query.name;

    // function to call when we get objects back from the database.
    const callback = (err, doc) => {
        if (err) {
            return res.status(500).json({
                err
            }); // if error, return it
        }
        else{
            updateDog(req, res, doc);
        }

        // return success
        return res.json(doc);
    };

    // Call the static function attached to DogModels.
    Dog.findByName(name1, callback);
};





// function to handle requests to the page1 page
const hostPage1 = (req, res) => {
    // function to call when we get objects back from the database.
    // With Mongoose's find functions, you will get an err and doc(s) back
    const callback = (err, docs) => {
        if (err) {
            return res.status(500).json({
                err
            }); // if error, return it
        }

        // return success
        return res.render('page1', {
            cats: docs
        });
    };

    readAllCats(req, res, callback);
};

// function to handle requests to the page2 page
const hostPage2 = (req, res) => {
    // res.render takes a name of a page to render.

    res.render('page2');
};



// function to handle requests to the page3 page
const hostPage3 = (req, res) => {
   // function to call when we get objects back from the database.
    // With Mongoose's find functions, you will get an err and doc(s) back
    const callback = (err, docs) => {
        if (err) {
            return res.status(500).json({
                err
            }); // if error, return it
        }

        // return success
        return res.render('page3', {
            dogs: docs
        });
    };

    readAllDogs(req, res, callback);
};
const hostPage4 = (req, res) => {
    // res.render takes a name of a page to render.
    const callback = (err, docs) => {
        if (err) {
            return res.status(500).json({
                err
            }); // if error, return it
        }

        // return success
        return res.render('page4', {
            dogs: docs
        });
    };

    readAllDogs(req, res, callback);
};



// function to handle get request to send the name
const getName = (req, res) => {
    // res.json returns json to the page.
    res.json({
        name: lastAdded.name
    });
};
const getNameDog = (req, res) => {
    // res.json returns json to the page.
    res.json({
        name: lastAddedDog.name
    });
};



// function to handle a request to set the name
const setName = (req, res) => {
    // check if the required fields exist
    if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
        // if not respond with a 400 error
        // (either through json or a web page depending on the client dev)
        return res.status(400).json({
            error: 'firstname,lastname and beds are all required'
        });
    }

    // if required fields are good, then set name
    const name = `${req.body.firstname} ${req.body.lastname}`;

    // dummy JSON to insert into database
    const catData = {
        name,
        bedsOwned: req.body.beds,
    };

    // create a new object of CatModel with the object to save
    const newCat = new Cat(catData);

    // create new save promise for the database
    const savePromise = newCat.save();

    savePromise.then(() => {
        // set the lastAdded cat to our newest cat object.
        // This way we can update it dynamically
        lastAdded = newCat;
        // return success
        res.json({
            name: lastAdded.name,
            beds: lastAdded.bedsOwned
        });
    });

    // if error, return it
    savePromise.catch((err) => res.status(500).json({
        err
    }));

    return res;
};

const setNameDog = (req, res) => {
    // check if the required fields exist
    if (!req.body.name || !req.body.breed || !req.body.age || !req.body.createdDate) {
        // if not respond with a 400 error
        // (either through json or a web page depending on the client dev)
        return res.status(400).json({
            error: 'name, breed and age are all required'
        });
    }

    // if required fields are good, then set name
    const name = `${req.body.name}`;

    // dummy JSON to insert into database
    const dogData = {
        name,
        breed: req.body.breed,
        age: req.body.age,
        createdDate: req.body.createdDate,
    };

    // create a new object of CatModel with the object to save
    const newDog = new Dog(dogData);

    // create new save promise for the database
    const savePromise = newDog.save();

    savePromise.then(() => {
        // set the lastAdded cat to our newest cat object.
        // This way we can update it dynamically
        lastAddedDog = newDog;
        // return success
        res.json({
            name: lastAddedDog.name,
            breed: lastAddedDog.breed,
            age: lastAddedDog.age,
            createdDate: lastAddedDog.createdDate,
        });
    });

    // if error, return it
    savePromise.catch((err) => res.status(500).json({
        err
    }));

    return res;
};




// function to handle requests search for a name and return the object
const searchName = (req, res) => {
    // check if there is a query parameter for name
    if (!req.query.name) {
        return res.status(400).json({
            error: 'Name is required to perform a search'
        });
    }

    // Call our Cat's static findByName function.

    return Cat.findByName(req.query.name, (err, doc) => {
        // errs, handle them
        if (err) {
            return res.status(500).json({
                err
            }); // if error, return it
        }

        // if no matches, let them know
        // (does not necessarily have to be an error since technically it worked correctly)
        if (!doc) {
            return res.json({
                error: 'No cats found'
            });
        }

        // if a match, send the match back
        return res.json({
            name: doc.name,
            beds: doc.bedsOwned
        });
    });
};
const searchNameDog = (req, res) => {
    // check if there is a query parameter for name
    if (!req.query.name) {
        return res.status(400).json({
            error: 'Name is required to perform a search'
        });
    }

    // Call our Dog's static findByName function.

    return Dog.findByName(req.query.name, (err, doc) => {
        // errs, handle them
        if (err) {
            return res.status(500).json({
                err
            }); // if error, return it
        }

        // if no matches, let them know
        // (does not necessarily have to be an error since technically it worked correctly)
        if (!doc) {
            return res.json({
                error: 'No dogs found'
            });
        }else{
            updateDog(req, res, doc);
        }

        // if a match, send the match back
        return res.json({
            name: doc.name,
            breed: doc.breed,
            age: doc.age,
            createdDate: doc.createdDate,
        });
    });
};



// function to handle a request to update the last added object
const updateLast = (req, res) => {
    // Your model is JSON, so just change a value in it
    lastAdded.bedsOwned++;

    // once you change all the object properties you want,
    // then just call the Model object's save function
    // create a new save promise for the database
    const savePromise = lastAdded.save();

    // send back the name as a success for now
    savePromise.then(() => res.json({
        name: lastAdded.name,
        beds: lastAdded.bedsOwned
    }));

    // if save error, just return an error for now
    savePromise.catch((err) => res.status(500).json({
        err
    }));
};
// function to handle a request to update the last added object
const updateDog = (req, res, doc) => {
    // Your model is JSON, so just change a value in it
    doc.age++;

    // once you change all the object properties you want,
    // then just call the Model object's save function
    // create a new save promise for the database
    const savePromise = doc.save();

    // send back the name as a success for now
    savePromise.then(() => {
        let i =1;
    });

    // if save error, just return an error for now
    savePromise.catch((err) => res.status(500).json({
        err
    }));
};


// function to handle a request to any non-real resources (404)
const notFound = (req, res) => {
    // res.render takes a name of a page to render.
    res.status(404).render('notFound', {
        page: req.url,
    });
};

// export the relevant public controller functions
module.exports = {
    index: hostIndex,
    page1: hostPage1,
    page2: hostPage2,
    page3: hostPage3,
    page4: hostPage4,
    readCat,
    getName,
    setName,
    updateLast,
    searchName,
    notFound,
    getNameDog,
    searchNameDog,
    setNameDog,
};
