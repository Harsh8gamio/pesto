module.exports.schema = {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name"],
        properties: {
          name: {
            bsonType: "string",
            maxLength: 300,
            minLength: 3,
            description: "Must be a string and is required"
          },
          qty: {
            bsonType: "number",
            description: "qty is required"
          },
          rating: {
            bsonType: "number",
            description: "rating is required"
          }
        }
      },
    }
  };