import mongoose from 'mongoose';

const { NX_MONGO_URL } = process.env;

export const initMongoService = () => {
  mongoose.Promise = Promise;
  mongoose.connect(NX_MONGO_URL);
  mongoose.connection.on('error', (error: Error) => console.error(error));
  mongoose.Schema.Types.String.checkRequired(v => v != null);
};
