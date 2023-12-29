const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const program = require(process.argv[2])
let vars = {
  "PRNT-OUT-DT": "..."
}

for (let i = 0; i < program.sequence.length; i++) {
  i = executeWd(program.sequence, i)
}

function executeWd(sequence, currentWord) {
  let wd = sequence[currentWord]

  switch (wd["wd-name"]) {
    // SETVAR --- set variable
    case "SETVAR": {
      vars[wd["arg1"]] = wd["arg2"]
      break
    }

    // CPVAR --- copy values
    case "CPVAR": {
      vars[wd["arg1"]] = vars[wd["arg2"]]
      break
    }
    
    // PRNT --- print PRNT-OUT-DT or arg1
    case "PRNT": {
      if (wd["arg1"]) {
        process.stdout.write(vars[wd["arg1"]])
      } else {
        process.stdout.write(vars["PRNT-OUT-DT"].toString())
      }
      break
    }

    // INP --- input
    // case "INP": {
    //   await new Promise((resolve, reject) => {
    //     rl.question('> ', (answer) => {
    //       vars[wd["arg1"]] = answer;
    //       resolve();
    //       rl.close();
    //     });
    //   });
    //   break;
    // }

    // ADD --- add
    case "ADD": {
      vars[wd["arg3"]] = vars[wd["arg1"]] + vars[wd["arg2"]]
      break
    }

    // SUB --- subtract
    case "SUB": {
      vars[wd["arg3"]] = vars[wd["arg1"]] - vars[wd["arg2"]]
      break
    }

    // MUL --- multiply
    case "MUL": {
      vars[wd["arg3"]] = vars[wd["arg1"]] * vars[wd["arg2"]]
      break
    }

    // DIV --- divide
    case "DIV": {
      vars[wd["arg3"]] = vars[wd["arg1"]] / vars[wd["arg2"]]
      break
    }

    // ASSERT --- if statement
    case "ASSERT": {
      if (wd["arg3"] === "ls") {
        if (vars[wd["arg1"]] < vars[d["arg2"]]) {
          for (let i = 0; i < wd["arg4"].length; i++) {
            i = executeWd(wd["arg4"], i)
          }
        }
      } else if (wd["arg3"] === "ls-eq") {
        if (vars[wd["arg1"]] <= vars[wd["arg2"]]) {
          for (let i = 0; i < wd["arg4"].length; i++) {
            i = executeWd(wd["arg4"], i)
          }
        }
      } else if (wd["arg3"] === "eq") {
        if (vars[wd["arg1"]] ===vars[ wd["arg2"]]) {
          for (let i = 0; i < wd["arg4"].length; i++) {
            i = executeWd(wd["arg4"], i)
          }
        }
      } else if (wd["arg3"] === "gr") {
        if (vars[wd["arg1"]] > vars[wd["arg2"]]) {
          for (let i = 0; i < wd["arg4"].length; i++) {
            i = executeWd(wd["arg4"], i)
          }
        }
      } else if (wd["arg3"] === "gr-eq") {
        if (vars[wd["arg1"]] >= vars[wd["arg2"]]) {
          for (let i = 0; i < wd["arg4"].length; i++) {
            i = executeWd(wd["arg4"], i)
          }
        }
      } else {
        console.log("==X= unknown operator =X==")
        process.exit(1)
      }
      break
    }

    // JUMP --- jump to arg1
    case "JUMP": {
      let jumpIndex = wd["arg1"]
      if (jumpIndex < 0 || jumpIndex >= sequence.length) {
        console.log("==X= jump index out of bounds =X==")
        process.exit(1)
      } else {
        currentWord = jumpIndex - 1 // Subtract 1 because the for-loop will increment it
      }
      break
    }

    // LOOP --- loop from arg1 to arg2 by arg3 and run arg4
    case "LOOP": {
      let start = wd["arg1"]
      let iterations = wd["arg2"]
      let count = wd["arg3"]
      let code = wd["arg4"]
      for (let i = start; i < iterations; i += count) {
        vars["ITERATION-N"] = i
        for (let j = 0; j < code.length; j++) {
          j = executeWd(code, j)
        }
      }
    }

    // EXIT --- exit with code arg1
    case "EXIT": {
      process.exit(wd["arg1"])
    }
  }

  return currentWord
}