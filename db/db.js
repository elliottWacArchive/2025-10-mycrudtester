require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const usersValidator = require("./schema-validators/users-schemavalidation.json");

let client;
let mongoDb;

const dbName = process.env.DB_NAME;
const auth = process.env.DB_USERNAME || process.env.DB_PASSWORD ? (`${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@`) : "";
const connectionUrl = `mongodb://${auth}${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

try {
	client = new MongoClient(connectionUrl,
		{
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			}
		});
		// { useNewUrlParser: true, useUnifiedTopology: true });
} catch (err) {
	console.error(`Error exception:\n${err.stack}`);
	process.exit(1);
}

/**
 * @function _createCollection
 * @description Function to create a collection in the database.
 * @param {string} collectionName - The name of the collection.
 * @param {object} schemaValidator - The schema validation for the collection.
 */
function _createCollection(db, collectionName, schemaValidator = null) {
	if (schemaValidator) {
		db.createCollection(collectionName, schemaValidator, function (error, res) {
			if (error)
				throw error;

			console.log(`Collection ${collectionName} created, schema validator in effect.`);
		});
		return;
	}

	db.createCollection(collectionName, function (error, res) {
		if (error)
			throw error;

		console.log(`Collection ${collectionName} created!`);
	});
}

/**
 * @async
 * @function connect
 * @description Function to connect to the database.
 */
async function connect() {
	try {
		await client.connect();
		mongoDb = client.db(dbName);
		console.log(`Connected to database ${dbName}`);

		const collections = await mongoDb.listCollections({}, { nameOnly: true }).toArray();
		const collectionsIsPresent = { users: false };

		for (let i = 0; i < collections.length; i++) {
			if (collections[i].name === "Users")
				collectionsIsPresent.users = true;
		}

		if (!collectionsIsPresent.users)
			_createCollection(mongoDb, "Users", usersValidator);
	} catch (err) {
		console.error(`Error exception:\n${err.stack}`);
		process.exit(1);
	}
}

/**
 * @async
 * @function connectToDatabase
 * @description Function to connect to the database and get the database as an object.
 * @returns { object } The database object.
*/
async function connectToDatabase() {
	if (mongoDb)
		return mongoDb;

	const clt = new MongoClient(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });
	await clt.connect();
	const db = clt.db(dbName);

	mongoDb = db;
	return db;
}

/**
 * Function to close the connection to the database.
 * @function close
 */
function close() {
	mongoDb.close((err) => {
		if (err)
			throw err;

		console.log(`Connection to database closed.`);
	});
}

/**
 * @function get
 * @description Function to get the database as an object.
 * @returns { object } The database object.
 */
function get() {
	return mongoDb;
}

/**
 * @async
 * @function isConnected
 * @description Function to get the database as an object.
 * @returns { bool } True if the database is connected, false otherwise.
 */
async function isConnected() {
	try {
		const db = await connectToDatabase();
		const collections = await db.listCollections({}, { nameOnly: true, maxTimeMS: 1000 }).toArray();
		if (collections !== undefined)
			return true;
		return false;
	} catch (exception) {
		return false;
	}
}

/**
 * @async
 * @function addInstance
 * @description Function to add a new model instance in the database.
 * @param { string } collectionName - The collection name
 * @param { object } obj - Object containing field values for the new model instance
 * @returns { object } json - The output of the update operation.
 * @returns { bool } json.success - True if the operation was successful, false otherwise.
 * @returns { string } jsonError.message - The error message if the operation failed.
 */
async function addInstance(collectionName, obj) {
	try {
		const db = await connectToDatabase();
		const resInsertDB = await db.collection(collectionName).insertOne(obj);

		if (!resInsertDB.acknowledged || !resInsertDB.insertedId)
			return ({ success: false, message: "Error when inserting into collection" });

		return ({ success: true, insertedId: resInsertDB.insertedId });
	} catch (exception) {
		console.error(`Error exception:\n${exception.stack}`);
		return ({ success: false, message: exception.message });
	}
}

/**
 * @async
 * @function updateField
 * @description Function to update a model instance field in the database.
 * @param { object } modelInstance - The model instance
 * @param { string } collectionName - The collection name
 * @param { string } fieldName - The name of the fieldto be updated
 * @param { object } newValue - The new value for the field in the model instance
 * @returns { object } json - The output of the update operation.
 * @returns { bool } json.success - True if the operation was successful, false otherwise.
 * @returns { string } jsonError.message - The error message if the operation failed.
 * @returns { int } jsonSuccess.matchedCount - The number of documents that matched the model instance.
 * @returns { int } jsonSuccess.modifiedCount - The number of documents that were modified.
 */
async function updateField(modelInstance, collectionName, fieldName, newValue) {
	try {
		let updatePair = {};
		updatePair[fieldName] = newValue;

		const db = await connectToDatabase();
		const dbOutput = await db.collection(collectionName).updateOne(
			modelInstance,
			{ $set: updatePair }
		);

		return ({ success: true, matchedCount: dbOutput.matchedCount, modifiedCount: dbOutput.modifiedCount });
	} catch (exception) {
		console.error(`Error exception:\n${exception.stack}`);
		return ({ success: false, message: exception.message });
	}
}

/**
 * @async
 * @function updateManyFields
 * @description Function to update many fields of a model instance in the database.
 * @param { object } modelInstance - The model instance
 * @param { string } collectionName - The collection name
 * @param { object } obj - Object with field names and their new values
 * @returns { object } json - The output of the update operation.
 * @returns { bool } json.success - True if the operation was successful, false otherwise.
 * @returns { string } jsonError.message - The error message if the operation failed.
 * @returns { int } jsonSuccess.matchedCount - The number of documents that matched the model instance.
 * @returns { int } jsonSuccess.modifiedCount - The number of documents that were modified.
 */
async function updateManyFields(modelInstance, collectionName, obj) {
	try {
		const db = await connectToDatabase();
		const dbOutput = await db.collection(collectionName).updateOne(
			modelInstance,
			{ $set: obj }
		);

		return ({ success: true, matchedCount: dbOutput.matchedCount, modifiedCount: dbOutput.modifiedCount });
	} catch (exception) {
		console.error(`Error exception:\n${exception.stack}`);
		return ({ success: false, message: exception.message });
	}
}

/**
 * @async
 * @function findMany
 * @description Function to find many model instances in the database.
 * @param { string } collectionName - The collection name.
 * @param { object } query - The query to be applied to the database.
 * @returns { object } json - The returned object.
 * @returns { bool } json.success - True if the operation was successful, false otherwise.
 * @returns { object[] } jsonSuccess.result - The list of model instances found.
 * @returns { string } jsonError.message - The error message if the operation was unsuccessful.
 */
async function findMany(collectionName, query) {
	try {
		const db = await connectToDatabase();
		const dbOutput = await db.collection(collectionName).find(query).maxTimeMS(1000 * 60 * 5).toArray();
		if (!dbOutput || dbOutput.length == 0)
			return ({ success: false, message: "No results found" });

		return ({ success: true, result: dbOutput });
	} catch (exception) {
		console.error(`Error exception:\n${exception.stack}`);
		return ({ success: false, message: exception.message });
	}
}

/**
 * @async
 * @function findOne
 * @description Function to find one model instance in the database.
 * @param { string } collectionName - The collection name.
 * @param { object } query - The query to be applied to the database.
 * @returns { object } json - The returned object.
 * @returns { bool } json.success - True if the operation was successful, false otherwise.
 * @returns { object } jsonSuccess.result - The list of model instances found.
 * @returns { string } jsonError.message - The error message if the operation was unsuccessful.
 */
async function findOne(collectionName, query) {
	try {
		const db = await connectToDatabase();
		const dbOutput = await db.collection(collectionName).findOne(query);
		if (!dbOutput)
			return ({ success: false, message: "No results found" });

		return ({ success: true, result: dbOutput });
	} catch (exception) {
		console.error(`Error exception:\n${exception.stack}`);
		return ({ success: false, message: exception.message });
	}
}


module.exports = {
	connect,
	close,
	addInstance,
	updateField,
	get,
	isConnected,
	updateManyFields,
	findMany,
	findOne
};
