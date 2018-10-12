exports.snakeToCamel = s => s.replace(/(\_\w)/g, m => m[1].toUpperCase())

exports.gqlQuery = str => `query { ${str} }`

exports.gqlMutation = str => `mutation { ${str} }`
