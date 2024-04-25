//Read JSON file and parse state codes into array. 
let stateCodes = [];
fs.readFile('statesData.json', (err, data) => {
  if (err) throw err;
  const states = JSON.parse(data);
  stateCodes = states.map(state => state.code);
});

//test if state code is valid
const validateStateCode = (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();
    
    if (stateCodes.includes(stateCode)) {
      req.code = stateCode;
      next();
    } else {
      res.status(404).send('State code is not valid.');
    }
  };

  module.exports = validateStateCode;