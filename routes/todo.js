var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho',
};

var pool = new pg.Pool(config);

router.get('/', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('SELECT * FROM pets ORDER BY owner_id', function(err, result) {
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

//pets
router.get('/', function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    //TO DO: How to convert owner name in pets form to owner_id for pets database
    //TO DO: Order by owner's id
    client.query('SELECT * FROM pets LEFT JOIN owners ON owners.id = pets.owner_id;', function(err, result) {
      done();
      if(err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }
      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

//adding owner info
router.post('/', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('INSERT INTO pets (name, breed, color) VALUES ($1, $2, $3) RETURNING *;', [req.body.petName, req.body.breed, req.body.color], function(err, result) {
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB', result.rows);
      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('INSERT INTO pets (name, breed, color) VALUES ($1, $2, $3) RETURNING *;', [req.body.petName, req.body.breed, req.body.color], function(err, result) {
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB', result.rows);
      res.send(result.rows);
    });
  });
});

router.delete('/:id', function(req, res) {

  var id = req.parms.id;

  pool.connect(function(err, client, done) {
    try {
      if (err) {
        console.log("Error connecting to DB", err);
        res.sendStatus(500);
        return;
      }//end of if

      client.query('DELETE FROM pets WHERE id = $1;', [id], function(err){
        if(err) {
          console.log('Error query the DB', err);
          res.sendStatus(500);
          return;

        }//end of if statement

        res.sendStatus(204);
      });//end of callback function

    } finally {//end of try

      done();
    } //end of finally

  });//end of pool connect

}); //end of router delete

module.exports = router;
