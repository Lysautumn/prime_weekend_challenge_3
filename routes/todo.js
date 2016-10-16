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

    client.query('SELECT * FROM tasks ORDER BY complete, LOWER(task);', function(err, result) {
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

//adding tasks
router.post('/', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('INSERT INTO tasks (task, complete) VALUES ($1, $2) RETURNING *;', [req.body.task, 'false'], function(err, result) {
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

router.put('/:id', function(req, res) {
  var id = req.params.id;
  var complete = req.body.complete;

  pool.connect(function(err, client, done) {
    try {
      if(err) {
        console.log('Error querying to the DB', err);
        res.sendStatus(500);
        return;
      }
      if (complete == 'true') {
        complete = false;
      } else {
        complete = true;
      }

      client.query('UPDATE tasks SET complete=$1 WHERE id=$2;', [complete, id], function(err, result) {
        if(err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    } finally {
      done();
    }
  });
});

router.delete('/:id', function(req, res) {

  var id = req.params.id;

  pool.connect(function(err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }//end of if

      client.query('DELETE FROM tasks WHERE id = $1;', [id], function(err) {
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
