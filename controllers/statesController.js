const State = require("../model/state");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");


router.get("/states", async (req, res) => {
  const isContig = req.query.contig;
  const funfacts = await State.find();

  const transformedStates = funfacts.map((state) => ({
    stateCode: state.stateCode,
    funfacts:
      state.funfacts && state.funfacts.size !== 0
        ? Array.from(state.funfacts.values())
        : [],
  }));

  fs.readFile(
    path.join(__dirname, "../model/statesData.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ message: "Failed to load state data" });
      }

      let states = JSON.parse(data);

      states.forEach((state) => {
        let match = transformedStates.find(
          (transformedState) => transformedState.stateCode === state.code
        );
        if (match) {
          state.funfacts = match.funfacts;
        }
      });

      const nonContiguousStates = ["AK", "HI"];

      if (isContig === "false") {
        const resultStates = states.filter((state) =>
          nonContiguousStates.includes(state.code)
        );
        res.json(resultStates);
      } else if (isContig === "true") {
        const resultStates = states.filter(
          (state) => !nonContiguousStates.includes(state.code)
        );
        res.json(resultStates);
      } else {
        res.json(states);
      }
    }
  );
});

router.get("/states/:code", async (req, res) => {
  const stateCode = req.params.code.toUpperCase();

  const funfacts = await State.find();

  const transformedStates = funfacts.map((state) => {
    let transformedState = { stateCode: state.stateCode };
    if (state.funfacts && state.funfacts.size > 0) {
      transformedState.funfacts = Array.from(state.funfacts.values());
    }
    return transformedState;
  });

  fs.readFile(
    path.join(__dirname, "../model/statesData.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ message: "Failed to load state data" });
      }
      const states = JSON.parse(data);

      states.forEach((state) => {
        let match = transformedStates.find(
          (transformedState) => transformedState.stateCode === state.code
        );

        if (match && match.funfacts) {
          state.funfacts = match.funfacts;
        }
      });

      const state = states.find(
        (state) => state.code.toUpperCase() === stateCode
      );

      if (state) {
        res.json(state);
      } else {
        res
          .status(404)
          .json({ message: "Invalid state abbreviation parameter" });
      }
    }
  );
});

router.get("/states/:code/funfact", async (req, res) => {
  const stateCode = req.params.code.toUpperCase();

  const funfacts = await State.find();

  const transformedStates = funfacts.map((state) => ({
    stateCode: state.stateCode,
    funfacts:
      state.funfacts && state.funfacts.size !== 0
        ? Array.from(state.funfacts.values())
        : [],
  }));

  fs.readFile(
    path.join(__dirname, "../model/statesData.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ message: "Failed to load state data" });
      }
      const states = JSON.parse(data);

      states.forEach((state) => {
        let match = transformedStates.find(
          (transformedState) => transformedState.stateCode === state.code
        );
        if (match) {
          state.funfacts = match.funfacts;
        }
      });

      const state = states.find(
        (state) => state.code.toUpperCase() === stateCode
      );
      if (!state) {
        return res
          .status(404)
          .json({ message: "Invalid state abbreviation parameter" });
      }

      if (state.funfacts.length > 0) {
        res.json({ funfact: state.funfacts[Math.floor(Math.random() * 3)] });
      } else {
        return res
          .status(404)
          .json({ message: `No Fun Facts found for ${state.state}` });
      }
    }
  );
});

router.get("/states/:code/capital", async (req, res) => {
  const stateCode = req.params.code.toUpperCase();

  fs.readFile(
    path.join(__dirname, "../model/statesData.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ message: "Failed to load state data" });
      }
      const states = JSON.parse(data);
      const state = states.find(
        (state) => state.code.toUpperCase() === stateCode
      );

      if (!state) {
        return res
          .status(404)
          .json({ message: "Invalid state abbreviation parameter" });
      } else {
        const response = {
          state: state.state,
          capital: state.capital_city,
        };
        res.json(response);
      }
    }
  );
});

router.get("/states/:code/nickname", async (req, res) => {
  const stateCode = req.params.code.toUpperCase();

  fs.readFile(
    path.join(__dirname, "../model/statesData.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ message: "Failed to load state data" });
      }
      const states = JSON.parse(data);
      const state = states.find(
        (state) => state.code.toUpperCase() === stateCode
      );

      if (!state) {
        return res
          .status(404)
          .json({ message: "Invalid state abbreviation parameter" });
      } else {
        const response = {
          state: state.state,
          nickname: state.nickname,
        };
        res.json(response);
      }
    }
  );
});

router.get("/states/:code/population", async (req, res) => {
  const stateCode = req.params.code.toUpperCase();

  fs.readFile(
    path.join(__dirname, "../model/statesData.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ message: "Failed to load state data" });
      }
      const states = JSON.parse(data);
      const state = states.find(
        (state) => state.code.toUpperCase() === stateCode
      );

      if (!state) {
        return res
          .status(404)
          .json({ message: "Invalid state abbreviation parameter" });
      } else {
        const pop = state.population.toLocaleString("en-US");
        const response = {
          state: state.state,
          population: pop,
        };
        res.json(response);
      }
    }
  );
});

router.get("/states/:code/admission", async (req, res) => {
  const stateCode = req.params.code.toUpperCase();

  fs.readFile(
    path.join(__dirname, "../model/statesData.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ message: "Failed to load state data" });
      }
      const states = JSON.parse(data);
      const state = states.find(
        (state) => state.code.toUpperCase() === stateCode
      );

      if (!state) {
        return res
          .status(404)
          .json({ message: "Invalid state abbreviation parameter" });
      } else {
        const response = {
          state: state.state,
          admitted: state.admission_date,
        };
        res.json(response);
      }
    }
  );
});

router.post("/states/:state/funfact", async (req, res) => {
  const stateCode = req.params.state.toUpperCase();

  if (!req.body.funfacts) {
    return res.status(400).json({ message: "State fun facts value required" });
  }

  if (!Array.isArray(req.body.funfacts)) {
    return res
      .status(400)
      .json({ message: "State fun facts value must be an array" });
  }

  try {
    let state = await State.findOne({ stateCode: stateCode });
    if (!state) {
      state = new State({ stateCode: stateCode, funfacts: new Map() });
    }

    let startIndex = state.funfacts.size;

    req.body.funfacts.forEach((fact, index) => {
      state.funfacts.set(String(startIndex + index), fact);
    });

    const updatedState = await state.save();

    const funfactsArray = Array.from(updatedState.funfacts.values());

    const response = {
      _id: updatedState._id,
      stateCode: updatedState.stateCode,
      funfacts: funfactsArray,
      __v: updatedState.__v,
    };

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update MongoDB", details: err });
  }
});

//--------------------------------------------------------------------------------

router.patch("/states/:state/funfact", async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const { index, funfact } = req.body;

  if (!index || index < 1) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }
  if (typeof funfact !== "string") {
    return res.status(400).json({ message: "State fun fact value required" });
  }

  fs.readFile(
    path.join(__dirname, "../model/statesData.json"),
    "utf8",
    async (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ message: "Failed to load state data" });
      }

      const states = JSON.parse(data);
      const state = states.find(
        (state) => state.code.toUpperCase() === stateCode
      );
      if (!state) {
        return res
          .status(404)
          .json({ message: "State not found in JSON file" });
      }

      try {
        const stateFromDB = await State.findOne({ stateCode: stateCode });
        if (!stateFromDB) {
          return res
            .status(404)
            .json({ message: "State not found in database" });
        }

        if (!stateFromDB.funfacts) {
          return res
            .status(404)
            .json({ message: `No Fun Facts found for ${state.state}` });
        }

        const funfactsArray = Array.from(stateFromDB.funfacts.values());
        if (index > funfactsArray.length) {
          return res.status(404).json({
            message: `No Fun Fact found at that index for ${state.state}`,
          });
        }

        stateFromDB.funfacts.set(String(index - 1), funfact);
        const updatedState = await stateFromDB.save();

        const updatedFunfactsArray = Array.from(updatedState.funfacts.values());

        const response = {
          _id: updatedState._id,
          stateCode: updatedState.stateCode,
          funfacts: updatedFunfactsArray,
          __v: updatedState.__v,
        };

        res.status(200).json(response);
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Failed to update the funfact", details: err });
      }
    }
  );
});

router.delete("/states/:state/funfact", async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const { index } = req.body;

  if (!index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }
  if (index < 1) {
    return res.status(400).json({
      message: "Index must be a 1-based integer, not zero or negative.",
    });
  }

  try {
    const funfacts = await State.find();

    fs.readFile(
      path.join(__dirname, "../model/statesData.json"),
      "utf8",
      async (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return res.status(500).json({ message: "Failed to load state data" });
        }
        const states = JSON.parse(data);

        const transformedStates = funfacts.map((state) => ({
          stateCode: state.stateCode,
          funfacts:
            state.funfacts && state.funfacts.size !== 0
              ? Array.from(state.funfacts.values())
              : [],
        }));

        states.forEach((state) => {
          let match = transformedStates.find(
            (transformedState) => transformedState.stateCode === state.code
          );
          if (match) {
            state.funfacts = match.funfacts;
          }
        });

        const state = states.find(
          (state) => state.code.toUpperCase() === stateCode
        );

        const stateFromDB = await State.findOne({ stateCode: stateCode });

        if (
          !stateFromDB ||
          !stateFromDB.funfacts ||
          stateFromDB.funfacts.size === 0
        ) {
          return res
            .status(404)
            .json({ message: `No Fun Facts found for ${state.state}` });
        }

        const funfactsArray = Array.from(stateFromDB.funfacts.values());

        if (index < 1 || index > funfactsArray.length) {
          return res.status(404).json({
            message: `No Fun Fact found at that index for ${state.state}`,
          });
        }

        funfactsArray.splice(index - 1, 1); 

        stateFromDB.funfacts.clear();

        funfactsArray.forEach((fact, idx) => {
          stateFromDB.funfacts.set(String(idx), fact);
        });

        const updatedState = await stateFromDB.save();

        const funfact = Array.from(stateFromDB.funfacts.values());

        res.status(200).json({
          _id: updatedState._id,
          stateCode: updatedState.stateCode,
          funfacts: Array.from(updatedState.funfacts.values()),
        });
      }
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to remove the funfact", details: err });
  }
});

module.exports = router;
