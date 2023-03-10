const router = require('express').Router()
const dal = require('../dal/mongodb')

router.get('/', (req, res) => {
  res.send('Account Endpoint')
})

router.post('/login', (req, res) => {
  if (dal.hasDbError) res.send('Error in DB.\n' + dal.error);

  let user
  let username = req.body.username
  let password = req.body.password
  let regex = new RegExp(username)

  dal.db.collection('users').find({
    "username": regex
  }).toArray((err, results) => {
    if (err) return res.status(400).json(err)
    let temp = results.find(u => u.username == username && u.password == password)
    user = temp ? temp : {}
    delete user.password
    return res.json(user)
  })
})

router.put('/:id/updateAccountInfo', (req, res) => {
  if (dal.hasDbError) res.send('Error in DB.\n' + dal.error);

  try {
    let newSet = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age
    }
    let newValues = {
      $set: newSet
    }
    let regex = new RegExp(req.params.id)

    dal.db.collection('users').findOneAndUpdate({
      '_id': regex
    }, newValues, {
      returnOriginal: false
    }, (err, result) => {
      if (err) {
        return res.json({
          ok: false,
          error: err
        })
      }

      return res.json({
        ok: true,
        result: result.value
      })
    })
  } catch (e) {
    return res.json({
      ok: false,
      error: e
    })
  }
})

router.put('/:id/changePassword', (req, res) => {
  if (dal.hasDbError) res.send('Error in DB.\n' + dal.error);

  try {
    let id = req.params.id;
    let username = req.body.username;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    console.log({
      id,
      username,
      oldPassword,
      newPassword
    })

    dal.db.collection('users').findOne({
      _id: id
    }).toArray((err, results) => {
      if (err) return res.json(err)
      console.log(results);
      let temp = results.find(u => u.username == username && u.password == oldPassword)
      let user = temp && temp._id ? temp : {}

      if (!user._id) {
        res.status(400).send({
          ok: false,
          error: new Error('El password anterior es incorrecto')
        });
      }

      dal.db.collection('users').findOneAndUpdate({
        _id: id
      }, {
        $set: {
          password: newPassword
        }
      }, (err, result) => {
        if (err) return res.status(400).json({
          ok: false,
          error: err
        })

        return res.json({
          ok: true,
          result: result.value
        })
      })
    })
  } catch (e) {
    return res.status(400).json({
      ok: false,
      a: 'Excepcion no controlada',
      error: e
    })
  }
})

router.post('/register', (req, res) => {
  if (dal.hasDbError) res.send('Error in DB.\n' + dal.error);

  try {
    if (!(req.body.username && req.body.password))
      return res.json(new Error('Error de transmisi??n de datos'))

    dal.db.collection('users').insertOne(req.body, (err, result) => {
      if (err) return res.json({
        ok: false,
        error: err
      })

      return res.json({
        ok: true,
        result: result.value
      })
    })
  } catch (e) {
    return res.json({
      ok: false,
      error: e
    })
  }
})

router.get('/getRecoveryToken', (req, res) => {
  res.status(500).send({
    message: 'Work in progress'
  })
})

router.post('/recover', (req, res) => {
  res.status(500).send({
    message: 'Work in progress'
  })
})

module.exports = router